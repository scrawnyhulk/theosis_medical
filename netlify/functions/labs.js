/**
 * Netlify Function: POST /.netlify/functions/labs  (v7.2, OPTIONAL, OFF until configured)
 * Reads key values from a lab report (photo or PDF) with an AI model and returns them for the user to CONFIRM.
 *
 * NOT ACTIVE until you:
 *   1. Netlify > Site settings > Environment variables: add LABS_API_KEY (a Google AI Studio key on a paid tier with
 *      "no training on your data"; GEMINI_API_KEY is used if LABS_API_KEY is absent). Optional: LABS_MODEL, ALLOWED_ORIGIN.
 *   2. In index.html set CONFIG.LABS_ENDPOINT = "/.netlify/functions/labs".
 *   Netlify Drop (drag-and-drop) does not deploy functions: the page then shows manual entry only.
 *
 * Privacy: the file is held in memory for one request, never written to disk, logs or a database, and never echoed back.
 * The key lives only in the environment. The prompt is fixed; output is parsed as JSON, whitelisted, unit-converted and
 * range-checked. The user must confirm every value in the page before it is used. No dependencies; Node 18+ (global fetch).
 */
const MODEL = process.env.LABS_MODEL || "gemini-3.8-flash";
const ENDPOINT = (m) => `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(m)}:generateContent`;
const MAX_BYTES = 8 * 1024 * 1024, MIME = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const RANGE = { a1c: [3, 20], fg: [30, 600], ins: [0.5, 300], tg: [10, 3000], hdl: [5, 200], ldl: [10, 500], tc: [50, 600], alt: [3, 1000], ast: [3, 1000] };
const json = (status, body, origin) => ({ statusCode: status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...(origin ? { "Access-Control-Allow-Origin": origin, Vary: "Origin" } : {}) }, body: JSON.stringify(body) });
const PROMPT = `You read a single clinical laboratory report. Return ONLY JSON of the form
{"values":{"a1c":{"value":number,"unit":string},"fg":{...},"ins":{...},"tg":{...},"hdl":{...},"ldl":{...},"tc":{...},"alt":{...},"ast":{...}}}
Keys: a1c = hemoglobin A1c; fg = FASTING glucose only; ins = FASTING insulin; tg = triglycerides; hdl = HDL cholesterol; ldl = LDL cholesterol
(calculated or direct); tc = total cholesterol; alt = ALT (SGPT); ast = AST (SGOT). Copy the number and unit exactly as printed.
Omit any test that is not clearly present. Do not guess, do not include names, dates of birth or any identifiers.`;
/** convert to the app's units (A1c %, mg/dL, µIU/mL, U/L) */
function convert(k, v, unit) {
  const u = String(unit || "").toLowerCase().replace(/\s/g, ""); let x = Number(v); if (!Number.isFinite(x)) return null;
  if (k === "a1c" && /mmol\/mol/.test(u)) x = x / 10.929 + 2.15;
  else if (k === "fg" && /mmol/.test(u)) x = x * 18.016;
  else if (["tc", "ldl", "hdl"].includes(k) && /mmol/.test(u)) x = x * 38.67;
  else if (k === "tg" && /mmol/.test(u)) x = x * 88.57;
  else if (k === "ins" && /pmol/.test(u)) x = x / 6.0;
  const r = RANGE[k]; if (!r || x < r[0] || x > r[1]) return null;
  return k === "a1c" ? Math.round(x * 10) / 10 : Math.round(x);
}
exports.handler = async (event) => {
  const allowed = process.env.ALLOWED_ORIGIN || "", origin = event.headers && (event.headers.origin || event.headers.Origin);
  const cors = allowed && origin === allowed ? allowed : null;
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: cors ? { "Access-Control-Allow-Origin": cors, "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type" } : {} };
  if (event.httpMethod !== "POST") return json(405, { error: "Use POST." }, cors);
  const key = process.env.LABS_API_KEY || process.env.GEMINI_API_KEY;
  if (!key) return json(503, { error: "Lab reading isn't set up on this site yet. Please type your values." }, cors);
  if (allowed && origin && origin !== allowed) return json(403, { error: "Not allowed." }, null);
  let body; try { body = JSON.parse(event.body || "{}"); } catch (e) { return json(400, { error: "Bad request." }, cors); }
  if (!body.consent || body.consent.labAi !== true) return json(400, { error: "Consent for AI lab reading is required." }, cors);
  const m = /^data:([a-z/+.-]+);base64,([A-Za-z0-9+/=]+)$/.exec(body.file || ""); if (!m || !MIME.includes(m[1])) return json(400, { error: "Please upload a JPEG, PNG, WebP or PDF." }, cors);
  if (m[2].length * 0.75 > MAX_BYTES) return json(413, { error: "That file is too large (8 MB max)." }, cors);
  try {
    const res = await fetch(ENDPOINT(MODEL), { method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: PROMPT }, { inline_data: { mime_type: m[1], data: m[2] } }] }], generationConfig: { temperature: 0, responseMimeType: "application/json", maxOutputTokens: 2048 } }) });
    if (!res.ok) return json(502, { error: "The lab reader is busy. Please type your values." }, cors);
    const out = await res.json(), text = (((out.candidates || [])[0] || {}).content || { parts: [] }).parts.map((p) => p.text || "").join("");
    let parsed; try { parsed = JSON.parse(text); } catch (e) { return json(502, { error: "Couldn't read the report. Please type your values." }, cors); }
    const values = {}; for (const k of Object.keys(RANGE)) { const e = parsed && parsed.values && parsed.values[k]; if (e && e.value != null) { const x = convert(k, e.value, e.unit); if (x != null) values[k] = x; } }
    return json(200, { values, units_note: "Converted to US units (A1c %, mg/dL, U/L). Check every value against your report." }, cors);
  } catch (e) { return json(502, { error: "The lab reader isn't available right now. Please type your values." }, cors); }
};
exports._convert = convert;
