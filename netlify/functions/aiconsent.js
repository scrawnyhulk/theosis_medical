/* v7.6.67: server-side check of the user's stored "AI features" consent. The page sends the record it saved when the
   person ticked the box: { ai: true, version, ts }. Refused unless ai === true, the version is a current consent version
   and the timestamp is a real time (not in the future, not older than 3 years). AI_CONSENT_VERSIONS (comma list) overrides. */
const VERSIONS = () => String(process.env.AI_CONSENT_VERSIONS || "2026-10-22c").split(",").map((s) => s.trim()).filter(Boolean);
function aiConsentOk(c) {
  if (!c || typeof c !== "object" || c.ai !== true) return false;
  if (!VERSIONS().includes(String(c.version || ""))) return false;
  const t = Date.parse(c.ts); if (!Number.isFinite(t)) return false; const now = Date.now();
  return t <= now + 5 * 60e3 && t > now - 3 * 365 * 864e5;
}
const MSG = "AI features are off because they weren't turned on in your consents. Nothing was sent. Turn them on in Settings, under Privacy and consents.";
module.exports = { aiConsentOk, MSG, VERSIONS };
