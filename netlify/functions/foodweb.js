/**
 * Netlify Function: POST /.netlify/functions/foodweb  {brand, food, flavor}  (v7.6.58)
 * When USDA FoodData Central has no product for a brand the person typed, ask Gemini with Google Search grounding for that exact
 * product's Nutrition Facts. Only the brand / food / flavor words are sent (never the person's full sentence). Numbers are accepted
 * ONLY when the answer is grounded in web sources; the source URLs come from the grounding metadata, never from the model's text.
 * Nothing is logged except an error code. Key: GEMINI_API_KEY (env only). AI_MOCK=1 = canned answer, no network.
 */
const BETA = require("./guard.js");
const env = () => process.env;
const MODEL = () => env().GEMINI_SEARCH_MODEL || "gemini-3.1-flash-lite";   // grounded in ~3 s in testing; 3.8-flash took 10-14 s
const TIMEOUT = () => +env().FOODWEB_TIMEOUT_MS || 24000;   // grounded search is slow; needs a function timeout above 10 s
const hdr = (o) => ({ "Content-Type": "application/json", "Cache-Control": "no-store", ...(o ? { "Access-Control-Allow-Origin": o, Vary: "Origin" } : {}) });
const out = (s, b, o) => ({ statusCode: s, headers: hdr(o), body: JSON.stringify(b) });
const str = (v, n) => String(v == null ? "" : v).replace(/[\u0000-\u001f\u007f<>`{}"\\]/g, " ").replace(/\s+/g, " ").trim().slice(0, n);
// v7.6.58d: plain-text answer with labeled lines. A "reply only with JSON" prompt (or responseMimeType JSON) made the model skip
// Google Search entirely (no groundingMetadata); the same request as plain text searches and returns sources.
const PROMPT = (q) => [
  `${q.brand} ${q.food}${q.flavor ? " " + q.flavor + " flavor" : ""} nutrition facts`,
  "",
  "Search the web for the Nutrition Facts label of this exact branded US product. Copy numbers as printed per ONE serving; do not estimate.",
  "End your answer with these lines exactly (use NONE when unknown; FOUND: no if you could not find this exact brand's label):",
  "FOUND: yes|no", "PRODUCT:", "BRAND:", "SERVING:", "SERVING_GRAMS:", "PIECES_PER_SERVING:", "PIECE_WORD:", "SERVINGS_PER_CONTAINER:", "CALORIES:", "PROTEIN_G:", "CARBS_G:", "FAT_G:",
].join("\n");
function parseLines(t) {
  const get = (k) => { const m = new RegExp("^\\W*" + k + "\\W*:\\s*(.+)$", "im").exec(t); const v = m ? m[1].replace(/[*_`]/g, "").trim() : ""; return /^none$/i.test(v) ? "" : v; };
  const num = (k) => { const m = /-?\d+(?:\.\d+)?/.exec(get(k)); return m ? +m[0] : null; };
  if (!get("CALORIES") && !get("FOUND")) return null;
  return { found: /^y/i.test(get("FOUND")), product: get("PRODUCT"), brand: get("BRAND"), serving: get("SERVING"), servingGrams: num("SERVING_GRAMS"), piecesPerServing: num("PIECES_PER_SERVING"), pieceWord: get("PIECE_WORD"),
    servingsPerContainer: num("SERVINGS_PER_CONTAINER"), kcal: num("CALORIES"), protein: num("PROTEIN_G"), carbs: num("CARBS_G"), fat: num("FAT_G") };
}
const n = (v, lo, hi) => { const x = Number(v); return Number.isFinite(x) && x >= lo && x <= hi ? Math.round(x * 10) / 10 : null; };
function parseJson(t) { t = String(t || "").replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, ""); try { return JSON.parse(t); } catch (e) { const m = /\{[\s\S]*\}/.exec(t); if (m) try { return JSON.parse(m[0]); } catch (e2) { /* no */ } } return null; }
function sourcesOf(cand) {
  const ch = (cand && cand.groundingMetadata && cand.groundingMetadata.groundingChunks) || [], seen = new Set(), s = [];
  for (const c of ch) { const u = c && c.web && c.web.uri; if (!u || !/^https:\/\//.test(u) || seen.has(u)) continue; seen.add(u); s.push({ url: u.slice(0, 600), title: str(c.web.title, 80) || "web source" }); }
  return s.slice(0, 3);
}
/** Turn a grounded model reply into a result, or null. No sources -> null (never made up). */
function why(cand) { if (!cand) return "no_answer"; if (!sourcesOf(cand).length) { const g = cand.groundingMetadata; return "no_sources" + (g ? `:chunks=${(g.groundingChunks || []).length},queries=${(g.webSearchQueries || []).length},keys=${Object.keys(g).join("|").slice(0, 80)}` : ":no_grounding"); } const tx = ((cand.content && cand.content.parts) || []).map((p) => p.text || "").join(""), j = (/^\s*(```|\{)/.test(tx) ? parseJson(tx) : null) || parseLines(tx); return !j ? "bad_json" : j.found !== true ? "not_found" : "rejected"; }
function accept(cand) {
  if (!cand) return null; const sources = sourcesOf(cand); if (!sources.length) return null;
  const tx = ((cand.content && cand.content.parts) || []).map((p) => p.text || "").join(""), j = (/^\s*(```|\{)/.test(tx) ? parseJson(tx) : null) || parseLines(tx);
  if (!j || j.found !== true) return null;
  const r = { product: str(j.product, 100), brand: str(j.brand, 60), serving: str(j.serving, 60), servingGrams: n(j.servingGrams, 1, 1500), piecesPerServing: n(j.piecesPerServing, 0.1, 100), pieceWord: str(j.pieceWord, 20),
    servingsPerContainer: n(j.servingsPerContainer, 0.5, 200), kcal: n(j.kcal, 0, 3000), protein: n(j.protein, 0, 300), carbs: n(j.carbs, 0, 500), fat: n(j.fat, 0, 300), sources };
  if (r.kcal == null || !r.product) return null;
  for (const k of ["protein", "carbs", "fat"]) if (r[k] == null) r[k] = null;
  if (r.servingGrams && r.kcal / r.servingGrams > 9.5) return null;   // more than 9.5 kcal per gram is not a real label
  return r;
}
async function gemini(q) {
  const ctl = new AbortController(), timer = setTimeout(() => ctl.abort(), TIMEOUT());
  try {
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(MODEL())}:generateContent`, { method: "POST", signal: ctl.signal,
      headers: { "Content-Type": "application/json", "x-goog-api-key": env().GEMINI_API_KEY },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: PROMPT(q) }] }], tools: [{ google_search: {} }], generationConfig: { temperature: 0, maxOutputTokens: 1500, ...(env().FOODWEB_THINKING ? { thinkingConfig: { thinkingLevel: env().FOODWEB_THINKING } } : {}) } }) });
    if (!r.ok) throw Object.assign(new Error("upstream"), { code: r.status === 429 ? "rate" : "upstream", status: r.status });
    const d = await r.json(); return (d && d.candidates && d.candidates[0]) || null;
  } catch (e) { if (typeof e.code === "string") throw e; throw Object.assign(new Error("net"), { code: ctl.signal.aborted ? "timeout" : "network" }); }
  finally { clearTimeout(timer); }
}
const MOCK = { content: { parts: [{ text: '{"found":true,"product":"Mock Chicken Patties","brand":"Mock","serving":"1 patty (85g)","servingGrams":85,"piecesPerServing":1,"pieceWord":"patty","kcal":190,"protein":20,"carbs":4,"fat":10}' }] }, groundingMetadata: { groundingChunks: [{ web: { uri: "https://example.com/label", title: "example.com" } }] } };
exports.handler = async (event) => {
  const allowed = env().ALLOWED_ORIGIN || "", h = event.headers || {}, origin = h.origin || h.Origin, co = allowed ? (origin === allowed ? allowed : null) : null;
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: co ? { "Access-Control-Allow-Origin": co, "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type" } : {} };
  if (allowed && origin && origin !== allowed) return out(403, { error: "Origin not allowed.", code: "origin" });
  const mock = env().AI_MOCK === "1";
  if (event.httpMethod !== "POST") return out(405, { error: "Use POST.", code: "method" }, co);
  if (!mock && !env().GEMINI_API_KEY) return out(503, { error: "Web lookup isn't set up here.", code: "not_configured" }, co);
  if (String(event.body || "").length > 1000) return out(413, { error: "Too long.", code: "too_big" }, co);
  let q; try { const b = JSON.parse(event.body || "{}"); q = { brand: str(b.brand, 60), food: str(b.food, 80), flavor: str(b.flavor, 40) }; } catch (e) { return out(400, { error: "Invalid request.", code: "bad_json" }, co); }
  if (q.brand.length < 2 || q.food.length < 2) return out(400, { error: "A brand and a food are needed.", code: "empty" }, co);
  if (mock) return out(200, { result: accept(MOCK), mock: true }, co);
  const slot = await BETA.check(event, "web"); if (!slot.ok) return BETA.reply(slot, co);
  try { const c = await gemini(q), res = accept(c); return out(200, res ? { result: res } : { result: null, why: why(c) }, co); }
  catch (e) { slot.release(); console.error("foodweb failed:", (e && e.code) || "failed", e && e.status ? e.status : ""); return out(502, { error: "The web lookup didn't work this time.", code: (e && e.code) || "failed" }, co); }
};
module.exports._t = { accept, sourcesOf, PROMPT, parseLines };
