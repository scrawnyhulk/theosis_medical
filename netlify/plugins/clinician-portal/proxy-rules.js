/**
 * Build-time rules for the /clinicianportal door.
 *
 * The private clinician origin is read from the Netlify env var
 * CLINICIAN_PORTAL_ORIGIN (Builds scope). It is never hardcoded here.
 * Visitors stay on theosismedical.com/clinicianportal; Netlify proxies that
 * path to the private app, which already has its own login.
 */

const PORTAL_FROMS = ["/clinicianportal", "/clinicianportal/", "/clinicianportal/*"];

const PUBLIC_SITE_HOSTS = new Set(["theosismedical.com", "www.theosismedical.com"]);

/**
 * @param {unknown} raw
 * @returns
 * {{ ok: true, reason: "unset" }
 * | { ok: true, reason: "ready", origin: string }
 * | { ok: false, error: string }}
 */
export function parseClinicianPortalOrigin(raw) {
  if (raw == null) return { ok: true, reason: "unset" };

  let value = String(raw).trim();
  if (
    value.length >= 2 &&
    ((value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'")))
  ) {
    value = value.slice(1, -1).trim();
  }
  if (value === "") return { ok: true, reason: "unset" };
  if (/\s/.test(value)) {
    return {
      ok: false,
      error: "CLINICIAN_PORTAL_ORIGIN must be a single https origin with no spaces or newlines.",
    };
  }

  let url;
  try {
    url = new URL(value);
  } catch {
    return {
      ok: false,
      error: "CLINICIAN_PORTAL_ORIGIN must be an absolute https origin with no path.",
    };
  }

  if (url.protocol !== "https:" || url.origin === "null") {
    return { ok: false, error: "CLINICIAN_PORTAL_ORIGIN must use https." };
  }
  if (url.username || url.password) {
    return {
      ok: false,
      error: "CLINICIAN_PORTAL_ORIGIN must not include a username or password.",
    };
  }
  if (url.search || url.hash) {
    return {
      ok: false,
      error: "CLINICIAN_PORTAL_ORIGIN must not include a query string or hash.",
    };
  }
  if (url.pathname !== "/" && url.pathname !== "") {
    return {
      ok: false,
      error:
        "CLINICIAN_PORTAL_ORIGIN must be the origin only. Do not include a path; " +
        "the proxy always requests /clinicianportal on that host.",
    };
  }

  const host = url.hostname.toLowerCase();
  if (!host || PUBLIC_SITE_HOSTS.has(host)) {
    return {
      ok: false,
      error: "CLINICIAN_PORTAL_ORIGIN must be the private clinician host, not theosismedical.com.",
    };
  }

  return { ok: true, reason: "ready", origin: url.origin };
}

/**
 * @param {string} origin Absolute https origin, no trailing path.
 */
export function clinicianPortalProxyRules(origin) {
  // /clinicianportal and /clinicianportal/ are the same rule to Netlify, and
  // the first one wins. The live door 302s both of those URLs to
  // /clinicianportal/ because the first rule proxied to the slash-less origin
  // path, the origin answered with Location: /clinicianportal/, and that
  // relative Location was passed through unchanged. Point both at the
  // trailing-slash origin path so the request that was bouncing is fetched
  // directly. The splat rule is unchanged, so /clinicianportal/api/* and
  // /clinicianportal/.netlify/functions/* still keep the base path.
  const slashed = `${origin}/clinicianportal/`;
  return [
    {
      from: "/clinicianportal",
      to: slashed,
      status: 200,
      force: true,
    },
    {
      from: "/clinicianportal/",
      to: slashed,
      status: 200,
      force: true,
    },
    {
      from: "/clinicianportal/*",
      to: `${origin}/clinicianportal/:splat`,
      status: 200,
      force: true,
    },
  ];
}

/**
 * Insert the portal proxy immediately before the first `/*` rule so the
 * catch-all 404 cannot swallow /clinicianportal. Mutates `redirects`.
 *
 * @param {Array<{ from?: string }>} redirects
 * @param {unknown} rawOrigin
 */
export function installClinicianPortalProxy(redirects, rawOrigin) {
  const parsed = parseClinicianPortalOrigin(rawOrigin);
  if (!parsed.ok || parsed.reason === "unset") return parsed;

  const present = PORTAL_FROMS.every((from) => redirects.some((rule) => rule.from === from));
  if (present) return { ok: true, reason: "already", rules: [] };

  const partial = redirects.some((rule) => rule.from && PORTAL_FROMS.includes(rule.from));
  if (partial) {
    return {
      ok: false,
      error:
        "Refusing to add /clinicianportal proxy rules because some of those paths " +
        "are already redirected. Remove the existing /clinicianportal rules first.",
    };
  }

  const catchAll = redirects.findIndex((rule) => rule.from === "/*");
  const at = catchAll === -1 ? redirects.length : catchAll;
  const rules = clinicianPortalProxyRules(parsed.origin);
  redirects.splice(at, 0, ...rules);
  return { ok: true, reason: "ready", rules };
}
