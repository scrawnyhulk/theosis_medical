/**
 * Beta guard (shared by ai.js, preview.js, labs.js, stage-prompt.js, food/food.js; v7.6.47 merged into the main build). Added for the public beta.
 *  - Kill switch: BETA_KILL_SWITCH=1 turns every AI call off instantly (page falls back to manual entry).
 *  - Global daily caps: BETA_DAILY_CALLS (default 1500) and BETA_DAILY_BUDGET_USD (default 5) using the rough per-call cost
 *    estimates below (override with BETA_COST_<KIND>). When either is hit, AI pauses until the next UTC day.
 *  - Per-visitor daily caps and a per-minute burst cap, keyed by a salted hash of the IP (raw IP never stored or logged).
 *  - Storage: in memory per warm function instance (best effort). If @netlify/blobs is installed, counters are shared across
 *    instances via Blobs (still best effort, not atomic). The real hard stop is the Google Cloud budget / quota (see BETA-CHECKLIST.md).
 * Messages are plain and kind; none reveal limits that help an abuser beyond "today".
 */
const crypto = require("crypto");
const env = () => process.env;
const DAY = () => new Date().toISOString().slice(0, 10);
// rough USD per call. These are ESTIMATES for the circuit breaker, not billing. Check current Gemini pricing and tune.
const COST = { chat: 0.002, label: 0.01, plan: 0.01, stage: 0.05, preview: 0.05, labs: 0.02, food: 0, prompt: 0, parse: 0.001 };
// v7.6.47: food search (USDA / Open Food Facts, no AI cost) and stage-prompt (text only, no model call) are rate-limited per visitor
// but do not count toward the global AI call / $ caps, and have their own, larger burst allowance (typing a search makes many calls).
const NO_GLOBAL = new Set(["food", "prompt"]);
const BURST = { food: 60, prompt: 30 };
const cost = (k) => { const o = parseFloat(env()["BETA_COST_" + k.toUpperCase()]); return Number.isFinite(o) && o >= 0 ? o : k in COST ? COST[k] : 0.05; };
const PER_USER = { chat: 30, label: 20, plan: 5, stage: 12, preview: 4, labs: 5, food: 400, prompt: 60, parse: 60 };   // per visitor per day
const userCap = (k) => { const o = parseInt(env()["BETA_LIMIT_" + k.toUpperCase()], 10); return Number.isFinite(o) && o >= 0 ? o : PER_USER[k] || 5; };
const caps = () => ({ calls: parseInt(env().BETA_DAILY_CALLS, 10) || 1500, usd: parseFloat(env().BETA_DAILY_BUDGET_USD) || 5, burst: parseInt(env().BETA_BURST_PER_MIN, 10) || 10 });

const mem = { day: DAY(), calls: 0, usd: 0, users: new Map(), burst: new Map() };
function roll() { if (mem.day !== DAY()) { mem.day = DAY(); mem.calls = 0; mem.usd = 0; mem.users.clear(); } }

let blobs = null; try { const nb = "@netlify/blobs"; blobs = require(nb); } catch (e) { blobs = null; }
async function durable() { try { return blobs && blobs.getStore ? blobs.getStore("beta-guard") : null; } catch (e) { return null; } }

function visitor(event) {
  const h = (event && event.headers) || {}, ip = h["x-nf-client-connection-ip"] || (h["x-forwarded-for"] || "").split(",")[0].trim() || h["client-ip"] || "unknown";
  return crypto.createHash("sha256").update(ip + "|" + (env().BETA_SALT || env().GEMINI_API_KEY || "salt")).digest("hex").slice(0, 16);
}
const MSG = {
  paused: "The AI features are paused for now while the beta is being checked. Everything else in the simulator still works. Please try again later.",
  busy: "The beta has reached its AI limit for today. The rest of the simulator still works. Please try again tomorrow.",
  user: "You've reached today's limit for this AI feature in the beta. Try again tomorrow. Everything else still works.",
  burst: "That's a lot of requests at once. Please wait a minute and try again.",
};
const refuse = (status, code, why, extra) => ({ ok: false, status, code, why, message: MSG[why], ...(extra || {}) });

/** Call BEFORE the Gemini request. kind: chat|label|plan|stage|preview|labs|food|prompt|parse (v7.6.57 free-text food parse). Returns {ok:true, release()} or {ok:false,status,code,message}. */
async function check(event, kind, opts) {
  if (env().BETA_KILL_SWITCH === "1" && !NO_GLOBAL.has(kind)) return refuse(503, "paused", "paused");
  roll(); const C = caps(), id = visitor(event), c = cost(kind), now = Date.now();
  const st = await durable(); let d = null;
  if (st) { try { d = JSON.parse((await st.get("day-" + mem.day)) || "null"); } catch (e) { d = null; } if (d) { mem.calls = Math.max(mem.calls, d.calls || 0); mem.usd = Math.max(mem.usd, d.usd || 0); } }
  const glob = !NO_GLOBAL.has(kind), bk = glob ? id : id + ":" + kind, burstCap = glob ? C.burst : (parseInt(env()["BETA_BURST_" + kind.toUpperCase()], 10) || BURST[kind] || C.burst);
  if (glob && (mem.calls >= C.calls || mem.usd + c > C.usd)) return refuse(503, "paused", "busy");
  const b = (mem.burst.get(bk) || []).filter((t) => now - t < 60000); if (b.length >= burstCap) return refuse(429, "limit", "burst", { limit: "burst" });
  const u = mem.users.get(id) || {}; if ((u[kind] || 0) >= userCap(kind) && !(opts && opts.free)) return refuse(429, "limit", "user", { limit: "user" });
  b.push(now); mem.burst.set(bk, b); if (mem.burst.size > 5000) mem.burst.clear();
  u[kind] = (u[kind] || 0) + 1; mem.users.set(id, u); if (glob) { mem.calls++; mem.usd += c; }
  if (st && glob) { try { await st.set("day-" + mem.day, JSON.stringify({ calls: mem.calls, usd: Math.round(mem.usd * 1000) / 1000 })); } catch (e) { /* best effort */ } }
  let released = false;
  return { ok: true, release() { if (released) return; released = true; const uu = mem.users.get(id); if (uu && uu[kind]) uu[kind]--; if (glob) { mem.calls = Math.max(0, mem.calls - 1); mem.usd = Math.max(0, mem.usd - c); } } };
}
const reply = (r, origin) => ({ statusCode: r.status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...(origin ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}) }, body: JSON.stringify({ error: r.message, code: r.code, limit: r.limit, paused: r.code === "paused" || undefined }) });
module.exports = { check, reply, _mem: mem, _caps: caps, _cost: cost, MSG };
