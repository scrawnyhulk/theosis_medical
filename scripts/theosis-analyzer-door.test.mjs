import assert from "node:assert/strict";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import {
  CANONICAL_PREFIX,
  ORIGIN,
  config,
  doorRedirectPath,
  rewriteLocation,
  theosisAnalyzerDoor,
  upstreamUrl,
} from "../netlify/edge-functions/theosis-analyzer-door.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

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

test("toml does not status-200 proxy the analyzer, which skips its edge gate", () => {
  const toml = readFileSync(join(ROOT, "netlify.toml"), "utf8");
  const rules = parseRedirects(toml);
  const froms = rules.map((rule) => rule.from);

  assert.equal(froms.at(-1), "/*");
  assert.equal(froms.includes("/theosisanalyzER"), false);
  assert.equal(froms.includes("/theosisanalyzER/"), false);
  assert.equal(froms.includes("/theosisanalyzER/*"), false);
  assert.equal(froms.includes("/api"), false);
  assert.equal(froms.includes("/api/*"), false);
  assert.equal(
    rules.some((rule) => rule.status === 200 && String(rule.to).includes(ORIGIN)),
    false,
  );
  assert.match(toml, /Cache-Control = "no-store"/);
  assert.match(toml, /Netlify-CDN-Cache-Control = "no-store"/);

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

test("canonical paths fetch the private host with the prefix stripped", () => {
  assert.equal(upstreamUrl("/theosisanalyzER/", ""), `${ORIGIN}/`);
  assert.equal(upstreamUrl("/theosisanalyzER/login.html", ""), `${ORIGIN}/login.html`);
  assert.equal(upstreamUrl("/theosisanalyzER/index.html", "?x=1"), `${ORIGIN}/index.html?x=1`);
  assert.equal(upstreamUrl("/theosisanalyzER/api/session", ""), `${ORIGIN}/api/session`);
  assert.equal(
    upstreamUrl("/theosisanalyzER/.netlify/functions/auth", ""),
    `${ORIGIN}/.netlify/functions/auth`,
  );
  assert.notEqual(
    upstreamUrl("/theosisanalyzER/api/session", ""),
    `${ORIGIN}/theosisanalyzER/api/session`,
  );

  const bare = new URL("login.html", "https://theosismedical.com/theosisanalyzER");
  const slashed = new URL("login.html", "https://theosismedical.com/theosisanalyzER/");
  assert.equal(bare.pathname, "/login.html");
  assert.equal(slashed.pathname, "/theosisanalyzER/login.html");
  assert.equal(rewriteLocation("login.html", "https://theosismedical.com"), "login.html");
  assert.equal(rewriteLocation("../login.html", "https://theosismedical.com"), "../login.html");
  assert.equal(
    rewriteLocation(`${ORIGIN}/login.html`, "https://theosismedical.com"),
    "https://theosismedical.com/theosisanalyzER/login.html",
  );
  assert.equal(
    rewriteLocation("https://example.test/login.html", "https://theosismedical.com"),
    "https://example.test/login.html",
  );
});

test("anonymous door fetch returns the gate redirect and does not cache it", async () => {
  const calls = [];
  const original = globalThis.fetch;
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    return new Response(null, {
      status: 302,
      headers: {
        Location: "login.html",
        "Cache-Control": "public, max-age=3600",
        "Set-Cookie": "sid=1; Path=/",
      },
    });
  };
  try {
    const response = await theosisAnalyzerDoor(
      new Request("https://theosismedical.com/theosisanalyzER/", {
        headers: { cookie: "sid=1" },
      }),
      {
        next() {
          throw new Error("canonical analyzer paths must not fall through to the rewrite");
        },
      },
    );
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, `${ORIGIN}/`);
    assert.equal(calls[0].init.redirect, "manual");
    assert.equal(calls[0].init.headers.get("cookie"), "sid=1");
    assert.equal(response.status, 302);
    assert.equal(response.headers.get("location"), "login.html");
    assert.equal(response.headers.get("set-cookie"), "sid=1; Path=/");
    assert.equal(response.headers.get("cache-control"), "no-store");
    assert.equal(response.headers.get("netlify-cdn-cache-control"), "no-store");

    globalThis.fetch = async (url) => {
      assert.equal(url, `${ORIGIN}/login.html`);
      return new Response("<!doctype html><title>Sign in</title>", {
        status: 200,
        headers: { "content-type": "text/html; charset=UTF-8" },
      });
    };
    const login = await theosisAnalyzerDoor(
      new Request("https://theosismedical.com/theosisanalyzER/login.html"),
      { next() { throw new Error("login must be fetched, not rewritten"); } },
    );
    assert.equal(login.status, 200);
    assert.equal(login.headers.get("cache-control"), "no-store");
    assert.match(await login.text(), /Sign in/);
  } finally {
    globalThis.fetch = original;
  }
});

test("bare path 301s before any fetch", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () => {
    throw new Error("bare path must 301 before the fetch");
  };
  try {
    const redirected = await theosisAnalyzerDoor(
      new Request("https://theosismedical.com/theosisanalyzer?next=login.html"),
      { next() { throw new Error("bare path must 301 before next"); } },
    );
    assert.equal(redirected.status, 301);
    assert.equal(
      redirected.headers.get("Location"),
      "https://theosismedical.com/theosisanalyzER/?next=login.html",
    );
  } finally {
    globalThis.fetch = original;
  }
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
