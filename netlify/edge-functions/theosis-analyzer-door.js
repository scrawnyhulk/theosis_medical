/**
 * Slash, case, and /ed normalization for the Theosis Analyzer door.
 *
 * Runs before Netlify's redirect rules. Those rules cannot 301
 * /theosisanalyzER to /theosisanalyzER/: Netlify treats the two paths as the
 * same rule, and that 301 loops.
 *
 * The private app uses relative asset, API, and Location URLs. Relative
 * login.html only stays on the door when the browser is already at
 * /theosisanalyzER/. This function sends the bare path there, then
 * context.next() so the status-200 proxy can run. It does not fetch the
 * private host and does not read or rewrite Cookie or Location.
 */

export const CANONICAL_PREFIX = "/theosisanalyzER";

const DOOR = /^\/(?:theosisanalyzer|ed)(\/.*)?$/i;

/**
 * @param {string} pathname
 * @returns {string | null} Path to 301 to, or null when this request should be proxied unchanged.
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

export default async function theosisAnalyzerDoor(request, context) {
  const url = new URL(request.url);
  const target = doorRedirectPath(url.pathname);
  if (target == null) return context.next();
  url.pathname = target;
  return Response.redirect(url, 301);
}

export const config = {
  // Whole-path match (Netlify anchors pattern). Character classes are the
  // case-insensitive form: the edge runtime compiles this with JS RegExp,
  // which has no inline (?i) flag.
  pattern: "/(?:[tT][hH][eE][oO][sS][iI][sS][aA][nN][aA][lL][yY][zZ][eE][rR]|[eE][dD])(?:/.*)?",
  onError: "bypass",
};
