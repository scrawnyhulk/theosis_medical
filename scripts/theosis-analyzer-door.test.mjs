import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  CANONICAL_PREFIX,
  config,
  doorRedirectPath,
} from "../netlify/edge-functions/theosis-analyzer-door.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://theosis-emergency-diagnostics.netlify.app";

function parseRedirects(toml) {
  return toml
    .split("[[redirects]]")
    .slice(1)
    .map((block) => {
      const from = block.match(/from = "([^"]+)"/)?.[1];
      const to = block.match(/to = "([^"]+)"/)?.[1];
      const status = Number(block.match(/status = (\d+)/)?.[1]);
      const force = /force = true/.test(block);
      return { from, to, status, force };
    });
}

function compiledPattern(pattern) {
  let enclosed = pattern;
  if (!enclosed.startsWith("^")) enclosed = `^${enclosed}`;
  if (!enclosed.endsWith("$")) enclosed = `${enclosed}$`;
  return new RegExp(enclosed);
}

/** Apply the edge 301, then one toml rule, the way Netlify orders them. */
function follow(pathname, rules) {
  const seen = [pathname];
  let current = pathname;
  for (let hop = 0; hop < 4; hop++) {
    const redirect = doorRedirectPath(current);
    if (redirect != null) {
      assert.equal(seen.includes(redirect), false, `loop ${seen.join(" -> ")} -> ${redirect}`);
      seen.push(redirect);
      current = redirect;
      continue;
    }
    const rule = rules.find((candidate) => matches(candidate.from, current));
    if (!rule || rule.status !== 301) return { path: current, rule, seen };
    const next = expand(rule.to, current, rule.from);
    assert.equal(seen.includes(next), false, `loop ${seen.join(" -> ")} -> ${next}`);
    seen.push(next);
    current = next;
  }
  assert.fail(`too many hops from ${pathname}: ${seen.join(" -> ")}`);
}

function matches(from, pathname) {
  if (from.endsWith("/*")) {
    const prefix = from.slice(0, -1);
    return pathname.startsWith(prefix) && pathname.length > prefix.length;
  }
  return pathname === from;
}

function expand(to, pathname, from) {
  if (!from.endsWith("/*")) return to;
  const splat = pathname.slice(from.length - 1);
  return to.replace(":splat", splat);
}

function proxyTarget(pathname) {
  if (pathname === `${CANONICAL_PREFIX}/`) return `${ORIGIN}/`;
  const prefix = `${CANONICAL_PREFIX}/`;
  if (pathname.startsWith(prefix)) return `${ORIGIN}/${pathname.slice(prefix.length)}`;
  return null;
}

test("toml proxies only the slashed analyzer prefix and the /ed alias", () => {
  const toml = readFileSync(join(ROOT, "netlify.toml"), "utf8");
  const rules = parseRedirects(toml);
  const froms = rules.map((rule) => rule.from);

  assert.deepEqual(froms.slice(-3), ["/theosisanalyzER/", "/theosisanalyzER/*", "/*"]);
  assert.equal(froms.includes("/theosisanalyzER"), false);
  assert.equal(froms.includes("/api"), false);
  assert.equal(froms.includes("/api/*"), false);
  assert.equal(froms.filter((from) => from === "/*").length, 1);

  const slash = rules.find((rule) => rule.from === "/theosisanalyzER/");
  const splat = rules.find((rule) => rule.from === "/theosisanalyzER/*");
  assert.deepEqual(slash, {
    from: "/theosisanalyzER/",
    to: `${ORIGIN}/`,
    status: 200,
    force: true,
  });
  assert.deepEqual(splat, {
    from: "/theosisanalyzER/*",
    to: `${ORIGIN}/:splat`,
    status: 200,
    force: true,
  });

  for (const from of ["/ed", "/ed/"]) {
    const rule = rules.find((candidate) => candidate.from === from);
    assert.equal(rule.to, "/theosisanalyzER/");
    assert.equal(rule.status, 301);
    assert.equal(rule.force, true);
  }
  const edSplat = rules.find((rule) => rule.from === "/ed/*");
  assert.equal(edSplat.to, "/theosisanalyzER/:splat");
  assert.equal(edSplat.status, 301);

  const slashAdding = rules.filter(
    (rule) => rule.status === 301 && rule.from.replace(/\/$/, "") === rule.to.replace(/\/$/, ""),
  );
  assert.deepEqual(slashAdding, []);
});

test("bare and alias paths 301 once to the slashed canonical door", () => {
  const cases = [
    ["/theosisanalyzER", "/theosisanalyzER/"],
    ["/theosisanalyzer", "/theosisanalyzER/"],
    ["/THEOSISANALYZER", "/theosisanalyzER/"],
    ["/theosisanalyzER/", null],
    ["/TheosisAnalyzer/", "/theosisanalyzER/"],
    ["/ed", "/theosisanalyzER/"],
    ["/ed/", "/theosisanalyzER/"],
    ["/ED", "/theosisanalyzER/"],
    ["/theosisanalyzER/login.html", null],
    ["/theosisanalyzer/login.html", "/theosisanalyzER/login.html"],
    ["/theosisanalyzER/api/session", null],
    ["/TheosisAnalyzer/api/session", "/theosisanalyzER/api/session"],
    ["/ed/api/session", "/theosisanalyzER/api/session"],
    ["/ed/login.html", "/theosisanalyzER/login.html"],
    ["/education", null],
    ["/editor", null],
    ["/edextra", null],
    ["/theosisanalyzERx", null],
    ["/", null],
    ["/minutes/cough", null],
    ["/api/session", null],
  ];

  for (const [pathname, expected] of cases) {
    assert.equal(doorRedirectPath(pathname), expected, pathname);
    if (expected != null) assert.equal(doorRedirectPath(expected), null, pathname);
  }
});

test("following the door never loops and lands on a prefix-stripped proxy", () => {
  const rules = parseRedirects(readFileSync(join(ROOT, "netlify.toml"), "utf8"));
  const samples = [
    "/theosisanalyzER",
    "/theosisanalyzER/",
    "/theosisanalyzer",
    "/theosisanalyzER/login.html",
    "/theosisanalyzer/assets/app.js",
    "/theosisanalyzER/api/session",
    "/theosisanalyzER/api/",
    "/theosisanalyzER/.netlify/functions/auth",
    "/ed",
    "/ed/",
    "/ED/api/session",
  ];

  for (const pathname of samples) {
    const landed = follow(pathname, rules);
    assert.equal(landed.path.startsWith(`${CANONICAL_PREFIX}/`), true, pathname);
    assert.equal(landed.rule.status, 200, pathname);
    assert.equal(landed.rule.force, true, pathname);
    const target = proxyTarget(landed.path);
    if (landed.path === "/theosisanalyzER/") {
      assert.equal(landed.rule.to, `${ORIGIN}/`);
      assert.equal(target, `${ORIGIN}/`);
    } else {
      assert.equal(landed.rule.from, "/theosisanalyzER/*");
      const splat = landed.path.slice(`${CANONICAL_PREFIX}/`.length);
      assert.equal(target, `${ORIGIN}/${splat}`);
      assert.equal(landed.rule.to.replace(":splat", splat), target);
    }
  }

  assert.equal(proxyTarget("/theosisanalyzER/api/session"), `${ORIGIN}/api/session`);
  assert.equal(
    proxyTarget("/theosisanalyzER/.netlify/functions/auth"),
    `${ORIGIN}/.netlify/functions/auth`,
  );
  assert.equal(proxyTarget("/api/session"), null);
});

test("relative URLs resolve under the door only after the slash redirect", () => {
  const bare = new URL("login.html", "https://theosismedical.com/theosisanalyzER");
  const slashed = new URL("login.html", "https://theosismedical.com/theosisanalyzER/");
  const api = new URL("api/session", "https://theosismedical.com/theosisanalyzER/");
  assert.equal(bare.pathname, "/login.html");
  assert.equal(slashed.pathname, "/theosisanalyzER/login.html");
  assert.equal(api.pathname, "/theosisanalyzER/api/session");
  assert.equal(proxyTarget(slashed.pathname), `${ORIGIN}/login.html`);
  assert.equal(proxyTarget(api.pathname), `${ORIGIN}/api/session`);
});

test("canonical requests return the proxy response untouched", async () => {
  const door = await import("../netlify/edge-functions/theosis-analyzer-door.js");
  const upstream = new Response(null, {
    status: 302,
    headers: {
      Location: "login.html",
      "Set-Cookie": "sid=1; Path=/",
    },
  });
  const response = await door.default(new Request("https://theosismedical.com/theosisanalyzER/"), {
    next() {
      return upstream;
    },
  });
  assert.equal(response, upstream);
  assert.equal(response.headers.get("Location"), "login.html");
  assert.equal(response.headers.get("Set-Cookie"), "sid=1; Path=/");

  const redirected = await door.default(
    new Request("https://theosismedical.com/theosisanalyzer?next=login.html"),
    {
      next() {
        throw new Error("bare path must 301 before the proxy");
      },
    },
  );
  assert.equal(redirected.status, 301);
  assert.equal(
    redirected.headers.get("Location"),
    "https://theosismedical.com/theosisanalyzER/?next=login.html",
  );
});

test("edge pattern matches the door and not public pages", () => {
  const pattern = compiledPattern(config.pattern);
  for (const path of [
    "/theosisanalyzER",
    "/theosisanalyzER/",
    "/theosisanalyzer/login.html",
    "/ED/api/x",
    "/THEOSISANALYZER",
  ]) {
    assert.equal(pattern.test(path), true, path);
  }
  for (const path of [
    "/",
    "/privacy",
    "/minutes/cough",
    "/provider",
    "/education",
    "/editor",
    "/assets/app.js",
    "/api/session",
  ]) {
    assert.equal(pattern.test(path), false, path);
  }
});

test("public pages do not link to the analyzer door", () => {
  const roots = [join(ROOT, "src"), join(ROOT, ".vercel/output/static")];
  const needles = ["theosisanalyzer", "theosis-emergency-diagnostics"];
  const textExt = new Set([
    ".html",
    ".js",
    ".css",
    ".svg",
    ".json",
    ".txt",
    ".xml",
    ".webmanifest",
  ]);
  const hits = [];
  for (const root of roots) {
    for (const relative of readdirSync(root, { recursive: true })) {
      const path = join(root, relative);
      if (!statSync(path).isFile()) continue;
      if (!textExt.has(extname(path))) continue;
      const text = readFileSync(path).toString("utf8");
      if (needles.some((needle) => text.toLowerCase().includes(needle))) hits.push(path);
    }
  }
  assert.deepEqual(hits, []);
});
