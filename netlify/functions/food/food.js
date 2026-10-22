/**
 * Netlify Function: GET /.netlify/functions/food?q=<text>[&kind=generic|branded|all]  or  ?barcode=<8-14 digits>
 * USDA FoodData Central search, normalized for the Body Composition Simulator's food log.
 *
 * Key: set FDC_API_KEY in Netlify > Site settings > Environment variables (free from https://fdc.nal.usda.gov/api-key-signup).
 * Without it the function falls back to USDA's shared DEMO_KEY (30 requests/hour, 50/day per IP) and says so in the
 * response ("demoKey": true), so the page can show a note. The key never leaves the server.
 * Responses are cacheable for a day at Netlify's CDN, which keeps API calls low. Node 18+ (global fetch). No dependencies
 * beyond ./foodcore.js (shared with the page; esbuild bundles it).
 */
const core = require("./foodcore.js");
const TIMEOUT_MS = 8000;

const headers = (origin, extra = {}) => ({ "Content-Type": "application/json", ...(origin ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" } : {}), ...extra });
const reply = (status, body, origin, cache) => ({ statusCode: status, headers: headers(origin, { "Cache-Control": cache || "no-store" }), body: JSON.stringify(body) });

const BETA = require("../guard.js");   // v7.6.47 beta guard: per-visitor + burst limits only (no AI cost, not in the global AI caps)
exports.handler = async (event) => {
  const allowed = process.env.ALLOWED_ORIGIN || "";
  const origin = event.headers && (event.headers.origin || event.headers.Origin);
  const corsOrigin = allowed ? (origin === allowed ? allowed : null) : "*";     // same-origin calls need no CORS; "*" only when unrestricted
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: { ...(corsOrigin ? { "Access-Control-Allow-Origin": corsOrigin } : {}), "Access-Control-Allow-Methods": "GET", "Access-Control-Allow-Headers": "Content-Type" } };
  if (event.httpMethod !== "GET") return reply(405, { error: "Use GET." }, corsOrigin);
  if (allowed && origin && origin !== allowed) return reply(403, { error: "Origin not allowed." });

  const qs = event.queryStringParameters || {};
  const barcode = String(qs.barcode || "").replace(/\s+/g, "");
  const q = core.clean(qs.q || "", 80);
  const kind = ["generic", "branded", "all"].includes(qs.kind) ? qs.kind : "generic";
  if (barcode && !core.isBarcode(barcode)) return reply(400, { error: "A barcode is 8 to 14 digits." }, corsOrigin);
  if (!barcode && q.length < 2) return reply(400, { error: "Type at least 2 characters." }, corsOrigin);

  const key = process.env.FDC_API_KEY || "DEMO_KEY";
  const demoKey = !process.env.FDC_API_KEY;
  const url = core.fdcSearchUrl(barcode || q, key, { branded: !!barcode || kind === "branded", all: kind === "all", n: barcode ? 5 : 10 });
  const ctl = new AbortController(); const timer = setTimeout(() => ctl.abort(), TIMEOUT_MS);
  let res;
  const slot = await BETA.check(event, "food"); if (!slot.ok) return BETA.reply(slot, corsOrigin);
  try { res = await fetch(url, { signal: ctl.signal, headers: { Accept: "application/json" } }); }
  catch (e) { return reply(502, { error: ctl.signal.aborted ? "USDA FoodData Central took too long to answer." : "Couldn't reach USDA FoodData Central.", demoKey }, corsOrigin); }
  finally { clearTimeout(timer); }
  if (res.status === 429) return reply(429, { error: demoKey ? "USDA's shared demo key is over its hourly limit. Add FDC_API_KEY on Netlify for full access." : "USDA rate limit reached. Try again shortly.", demoKey, retryAfter: Number(res.headers && res.headers.get && res.headers.get("retry-after")) || null }, corsOrigin);
  if (res.status === 403) return reply(502, { error: "USDA rejected the API key. Check FDC_API_KEY.", demoKey }, corsOrigin);
  if (!res.ok) return reply(502, { error: `USDA FoodData Central error (${res.status}).`, demoKey }, corsOrigin);
  let data;
  try { data = await res.json(); } catch (e) { return reply(502, { error: "USDA returned an unreadable answer.", demoKey }, corsOrigin); }
  let items = (data.foods || []).map(core.normFDC).filter(Boolean);
  if (barcode) items = items.filter((f) => f.code && f.code.replace(/^0+/, "") === barcode.replace(/^0+/, ""));
  return reply(200, { source: "usda", demoKey, note: demoKey ? "Using USDA's shared DEMO_KEY (limited to about 30 searches an hour). Add FDC_API_KEY on Netlify for full access." : undefined,
    query: barcode || q, kind: barcode ? "barcode" : kind, items }, corsOrigin, "public, max-age=86400");
};
