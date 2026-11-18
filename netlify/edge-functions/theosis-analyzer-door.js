/**
 * Case, slash, and /ed normalization, then a gate-aware fetch of the analyzer.
 *
 * A status-200 rewrite to the private Netlify site does not run that site's
 * edge gate (path /*). A cache miss still returned the app HTML and the CDN
 * stored it (cache-status: stored). Fetching the *.netlify.app host directly
 * runs the gate. Anonymous visitors get its relative Location (login.html),
 * which stays under /theosisanalyzER/. Responses are marked no-store so the
 * public CDN cannot keep gated HTML.
 *
 * This function does not contain the private app. Cookie and Location are
 * forwarded; relative Locations are not rewritten.
 */

export const CANONICAL_PREFIX = "/theosisanalyzER";
export const ORIGIN = "https://theosis-emergency-diagnostics.netlify.app";

const DOOR = /^\/(?:theosisanalyzer|ed)(\/.*)?$/i;
const FORWARDED_REQUEST_HEADERS = ["accept", "authorization", "content-type", "cookie"];

/**
 * @param {string} pathname
 * @returns {string | null} Path to 301 to, or null when this request should be fetched.
 */
export function doorRedirectPath(pathname) {
  const match = DOOR.exec(pathname);
  if (!match) return null;

  const rest = match[1] ?? "";
  if (rest === "" || rest === "/") {
    const canonical = `${CANONICAL_PREFIX}/`;
    return pathname === canonical ? null : canonical;
  }

  const canonical = `${CANONICAL_PREFIX}${rest}`;
  return pathname === canonical ? null : canonical;
}

/**
 * @param {string} pathname Canonical /theosisanalyzER path.
 * @param {string} search Including the leading ? when present.
 */
export function upstreamUrl(pathname, search = "") {
  const rest = pathname.slice(CANONICAL_PREFIX.length);
  const path = rest === "" ? "/" : rest;
  return `${ORIGIN}${path}${search}`;
}

/**
 * Keep relative Locations (login.html, ../login.html). An absolute Location
 * that points at the private host is moved onto this door so the browser
 * does not leave theosismedical.com.
 *
 * @param {string | null} location
 * @param {string} publicOrigin
 */
export function rewriteLocation(location, publicOrigin) {
  if (!location || !/^[a-z][a-z0-9+.-]*:/i.test(location)) return location;
  let target;
  try {
    target = new URL(location);
  } catch {
    return location;
  }
  if (target.origin !== ORIGIN) return location;
  const path = target.pathname === "/" ? "/" : target.pathname;
  const next = new URL(`${CANONICAL_PREFIX}${path}`, publicOrigin);
  next.search = target.search;
  next.hash = target.hash;
  return next.toString();
}

/**
 * @param {Headers} headers
 */
function applyNoStore(headers) {
  headers.set("cache-control", "private, no-store, max-age=0");
  headers.set("cdn-cache-control", "no-store");
  headers.set("netlify-cdn-cache-control", "no-store");
  headers.set("Netlify-CDN-Cache-Control", "no-store");
}

export async function theosisAnalyzerDoor(request, context) {
  const url = new URL(request.url);
  const target = doorRedirectPath(url.pathname);
  if (target != null) {
    url.pathname = target;
    return Response.redirect(url, 301);
  }

  if (!url.pathname.startsWith(`${CANONICAL_PREFIX}/`) && url.pathname !== CANONICAL_PREFIX) {
    return context.next();
  }

  const headers = new Headers();
  for (const name of FORWARDED_REQUEST_HEADERS) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }

  const init = {
    method: request.method,
    headers,
    redirect: "manual",
  };
  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const upstream = await fetch(upstreamUrl(url.pathname, url.search), init);
  const out = new Headers();
  const drop = new Set([
    "set-cookie",
    "content-encoding",
    "content-length",
    "etag",
    "age",
    "cache-status",
    "last-modified",
  ]);
  upstream.headers.forEach((value, key) => {
    if (drop.has(key)) return;
    out.set(key, value);
  });
  const setCookies = upstream.headers.getSetCookie?.() ?? [];
  for (const cookie of setCookies) out.append("set-cookie", cookie);
  const location = upstream.headers.get("location");
  if (location) out.set("location", rewriteLocation(location, url.origin));
  applyNoStore(out);

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: out,
  });
}

export default theosisAnalyzerDoor;

export const config = {
  pattern: "/(?:[tT][hH][eE][oO][sS][iI][sS][aA][nN][aA][lL][yY][zZ][eE][rR]|[eE][dD])(?:/.*)?",
  onError: "fail",
};
