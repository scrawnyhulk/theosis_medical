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
const MAX_IMAGE_BYTES = 3.5 * 1024 * 1024;       // decoded size cap (Netlify rejects request bodies over 6 MB, and base64 adds a third)
const ALLOWED_MIME = ["image/jpeg", "image/png", "image/webp"];

const json = (status, body, origin) => ({
  statusCode: status,
  headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...(origin ? { "Access-Control-Allow-Origin": origin, "Vary": "Origin" } : {}) },
  body: JSON.stringify(body),
});
const num = (v, lo, hi) => { const n = Number(v); if (!Number.isFinite(n) || n < lo || n > hi) throw new Error("bad number"); return n; };

/** v7.6.19: one shared template (stage-prompt.js), same as ai.js "stage". Every variable is a validated number or enum. */
const SP = require("./stage-prompt.js");
const buildPrompt = (p) => SP.build(p);

const BETA = require("./guard.js");   // v7.6.47 beta guard
exports.handler = async (event) => {
  // BIPA: AI photo projection off unless PHOTO_AI_ENABLED is explicitly "1" (or "true"). Checked before the body (photo) is read.
  if (!["1", "true"].includes(String(process.env.PHOTO_AI_ENABLED || ""))) return { statusCode: 403, headers: { "content-type": "application/json" }, body: JSON.stringify({ error: "Photo features are coming soon.", code: "coming_soon" }) };
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
  { const c = body.consent || {}; if (!require("./aiconsent.js").aiConsentOk(c) || c.photoAi !== true || c.biometric !== true) return json(403, { error: "AI illustrations need the AI features and face and body photo consents. Nothing was sent.", code: "consent" }, corsOrigin); }   // v7.6.67
  if (body.consent.adult !== true) return json(400, { error: "Consent and 18+ confirmation are required." }, corsOrigin);   // v7.6.67: consent record checked above

  const m = /^data:(image\/[a-z+]+);base64,([A-Za-z0-9+/=]+)$/.exec(body.image || "");
  if (!m || !ALLOWED_MIME.includes(m[1])) return json(400, { error: "Send a JPEG, PNG or WebP photo." }, corsOrigin);
  if (Math.floor(m[2].length * 3 / 4) > MAX_IMAGE_BYTES) return json(413, { error: "Photo is too large." }, corsOrigin);

  let p;
  try {
    const q = body.projection || {};
    p = SP.sanitize(q, { minWeek: 0.5, maxWeek: 260, maxFatGain: 60, maxLeanGain: 20 });
  } catch { return json(400, { error: "Projection numbers are missing or out of range." }, corsOrigin); }

  const gt = SP.gate(p); if (gt) return json(422, { error: gt.message, code: gt.code }, corsOrigin);
  const AIM = require("./ai.js");
  const slot = await BETA.check(event, "preview"); if (!slot.ok) return BETA.reply(slot, corsOrigin);   // after validation so bad requests cost nothing
  try {
    // v7.6.22b: same engine as "See yourself at each stage": standard prompt, soft retry, fallback model, 25 s per call, and every failure explained by one shared function
    const out = await AIM.runStage(p, { mime: m[1], data: m[2] }, false);
    if (out.status !== 200) {
      slot.release();
      console.warn("preview: no image", JSON.stringify({ reason: out.reason, kind: out.kind, model_text_len: out.text ? String(out.text).length : undefined }));
      const dbg = AIM.isPreview(event) && out.reason ? " [preview debug: Gemini reason " + out.reason + (out.text ? ' · model said: "' + String(out.text).slice(0, 160) + '"' : "") + "]" : "";
      return json(out.status, { error: out.message + dbg, code: out.code, reason: out.reason, kind: out.kind }, corsOrigin);
    }
    const d = out.part.inlineData || out.part.inline_data, mime = d.mimeType || d.mime_type || "image/png";
    if (!/^image\/(png|jpeg|webp)$/.test(mime)) return json(502, { error: "The image service returned something unexpected. Please try again.", code: "unreadable" }, corsOrigin);
    return json(200, { image: `data:${mime};base64,${d.data}`, model: AIM.MODELS().image, label: "AI images are illustrations, not predictions" }, corsOrigin);
  } catch (e) {
    slot.release();
    console.error("preview failed:", (e && typeof e.code === "string" && e.code) || "failed", e && e.status ? e.status : "");   // v7.6.76 BIPA: code/status only, never upstream text (could echo prompt or describe the photo)
    const x = AIM.explainError("preview", e && (e.code || e.status) ? e : Object.assign(new Error((e && e.message) || "unknown"), { code: "failed" }), event);
    return json(x.status, { error: x.message, code: x.code, upstreamStatus: (e && e.status) || undefined }, corsOrigin);
  }
};
exports.buildPrompt = buildPrompt;   // exported for testing
