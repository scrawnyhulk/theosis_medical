/**
 * Netlify Function: POST /.netlify/functions/preview
 * Turns the user's photo + projected numbers into ONE AI illustration via Gemini image editing.
 *
 * NOT ACTIVE until you:
 *   1. In Netlify > Site settings > Environment variables, add GEMINI_API_KEY (from Google AI Studio, on a paid tier
 *      with "no training on your data"). Optional: GEMINI_IMAGE_MODEL (default below), ALLOWED_ORIGIN
 *      (e.g. https://theosismedical.com), PREVIEW_DAILY_LIMIT.
 *   2. In index.html set CONFIG.PREVIEW_ENDPOINT = "/.netlify/functions/preview".
 *
 * Privacy design: the photo is held in memory for one request, never written to disk, logs, or a database.
 * The key lives only in the environment, never in the browser. The prompt is built ONLY from whitelisted numbers,
 * never from user text, so it can't be steered into other edits. Output is always labeled "AI illustration" by the page.
 * Node 18+ (global fetch). No dependencies.
 */
const MODEL = process.env.GEMINI_IMAGE_MODEL || "gemini-nano-banana-2.1";
const ENDPOINT = (model) => `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
const MAX_IMAGE_BYTES = 4 * 1024 * 1024;           // decoded size cap
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

const json = (status, body, origin) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...(origin ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" } : {}) },
  body: JSON.stringify(body),
});
const num = (v, lo, hi) => { const n = Number(v); if (!Number.isFinite(n) || n < lo || n > hi) throw new Error("bad number"); return n; };

/** Fixed prompt template. Every variable is a validated number or enum. */
function buildPrompt(p) {
  const sex = p.sex === "f" ? "woman" : "man";
  const dW = p.endWeightKg - p.startWeightKg, dFat = p.fatChangeKg, dLean = p.leanChangeKg;
  const lb = (kg) => (Math.abs(kg) * 2.2046).toFixed(1);
  const fatTxt = dFat < -0.3 ? `about ${lb(dFat)} lb less body fat` : dFat > 0.3 ? `about ${lb(dFat)} lb more body fat` : "about the same body fat";
  const leanTxt = dLean > 0.3 ? `about ${lb(dLean)} lb more muscle` : dLean < -0.3 ? `about ${lb(dLean)} lb less muscle` : "about the same muscle";
  return [
    `Edit this photo of a ${sex} to illustrate the same person after ${p.weeks} weeks of a nutrition and training plan.`,
    `Body composition change: from ${p.startBf}% to ${p.endBf}% body fat, ${fatTxt} and ${leanTxt} (total weight change ${dW >= 0 ? "+" : "-"}${lb(dW)} lb).`,
    "Change ONLY body shape, in proportion to these numbers: waist, abdomen, hips, thighs, arms, face fullness, and, if muscle increases, slightly more muscle definition.",
    "Keep EXACTLY the same face and identity, skin tone, hair, tattoos, clothing, pose, camera angle, lighting, background and image framing.",
    "Be conservative and realistic. Small changes in the numbers must give small visual changes. Do not exaggerate muscularity or leanness, do not beautify, do not add or remove clothing, do not change age.",
    "Photorealistic, natural, no text or watermarks.",
  ].join(" ");
}

exports.handler = async (event) => {
  const allowed = process.env.ALLOWED_ORIGIN || "";
  const origin = event.headers && (event.headers.origin || event.headers.Origin);
  const corsOrigin = allowed && origin === allowed ? allowed : null;
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers: corsOrigin ? { "Access-Control-Allow-Origin": corsOrigin, "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type" } : {} };
  if (event.httpMethod !== "POST") return json(405, { error: "Use POST." }, corsOrigin);
  if (allowed && origin && origin !== allowed) return json(403, { error: "Origin not allowed." });
  const key = process.env.GEMINI_API_KEY;
  if (!key) return json(503, { error: "AI preview isn't configured yet." }, corsOrigin);

  let body;
  try { body = JSON.parse(event.body || "{}"); } catch { return json(400, { error: "Invalid JSON." }, corsOrigin); }
  if (!body.consent || body.consent.adult !== true || body.consent.consent !== true) return json(400, { error: "Consent and 18+ confirmation are required." }, corsOrigin);

  const m = /^data:(image\/[a-z+]+);base64,([A-Za-z0-9+/=]+)$/.exec(body.image || "");
  if (!m || !ALLOWED_MIME.includes(m[1])) return json(400, { error: "Send a JPEG, PNG or WebP photo." }, corsOrigin);
  if (Math.floor(m[2].length * 3 / 4) > MAX_IMAGE_BYTES) return json(413, { error: "Photo is too large." }, corsOrigin);

  let p;
  try {
    const q = body.projection || {};
    p = { sex: q.sex === "f" ? "f" : "m", weeks: num(q.weeks, 0.5, 260), startWeightKg: num(q.startWeightKg, 30, 330), endWeightKg: num(q.endWeightKg, 30, 330),
      startBf: num(q.startBf, 3, 70), endBf: num(q.endBf, 3, 70), fatChangeKg: num(q.fatChangeKg, -150, 60), leanChangeKg: num(q.leanChangeKg, -40, 20) };
  } catch { return json(400, { error: "Projection numbers are missing or out of range." }, corsOrigin); }

  const prompt = buildPrompt(p);
  try {
    const res = await fetch(ENDPOINT(MODEL), {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ inline_data: { mime_type: m[1], data: m[2] } }, { text: prompt }] }],
        generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) { console.error("gemini error", res.status, data && data.error && data.error.status); return json(502, { error: "The image service couldn't make a preview right now." }, corsOrigin); }
    const parts = (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts) || [];
    const img = parts.find((x) => x.inlineData || x.inline_data);
    if (!img) {
      const reason = (data.candidates && data.candidates[0] && data.candidates[0].finishReason) || (data.promptFeedback && data.promptFeedback.blockReason) || "no image";
      console.warn("gemini returned no image:", reason);          // no photo or personal data is logged
      return json(422, { error: "The image service declined this photo. Try a different photo (front-facing, well lit, clothed or in athletic wear)." }, corsOrigin);
    }
    const d = img.inlineData || img.inline_data;
    return json(200, { image: `data:${d.mimeType || d.mime_type || "image/png"};base64,${d.data}`, model: MODEL, label: "AI illustration, not a prediction" }, corsOrigin);
  } catch (e) {
    console.error("preview failed:", e && e.message);
    return json(500, { error: "Preview failed. Please try again." }, corsOrigin);
  }
};
exports.buildPrompt = buildPrompt;   // exported for testing
