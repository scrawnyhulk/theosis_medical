import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";
import { onPreBuild } from "../netlify/plugins/clinician-portal/index.js";
import {
  installClinicianPortalProxy,
  parseClinicianPortalOrigin,
} from "../netlify/plugins/clinician-portal/proxy-rules.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ORIGIN = "https://private-origin.invalid";

function publishedRedirects() {
  const toml = readFileSync(join(ROOT, "netlify.toml"), "utf8");
  return [...toml.matchAll(/^\s*from = "([^"]+)"/gm)].map((match) => ({
    from: match[1],
    to: "/404.html",
    status: 404,
  }));
}

test("netlify.toml keeps the no-op publish and does not embed a portal origin", () => {
  const toml = readFileSync(join(ROOT, "netlify.toml"), "utf8");
  assert.match(toml, /command = "true"/);
  assert.match(toml, /publish = "\.vercel\/output\/static"/);
  assert.match(toml, /package = "\/netlify\/plugins\/clinician-portal"/);
  assert.doesNotMatch(toml, /Basic-Auth/);
  assert.doesNotMatch(toml, /CLINICIAN_PORTAL_ORIGIN\s*=/);
  const httpsUrls = [...toml.matchAll(/https:\/\/[^"\s]+/g)].map((match) => match[0]);
  assert.ok(httpsUrls.length > 0);
  for (const url of httpsUrls) {
    assert.match(
      url,
      /^https:\/\/theosis-emergency-diagnostics\.netlify\.app(?:\/(?::splat)?)?$/,
      url,
    );
  }

  const froms = publishedRedirects().map((rule) => rule.from);
  assert.equal(froms.at(-1), "/*");
  for (const removed of ["/hacks", "/hacks/*", "/simulator", "/simulator/*"]) {
    assert.ok(froms.includes(removed), removed);
  }
  assert.equal(froms.includes("/clinicianportal"), false);
  assert.equal(froms.includes("/clinicianportal/*"), false);
});

test("public site files do not advertise /clinicianportal", () => {
  const roots = [join(ROOT, "src"), join(ROOT, ".vercel/output/static")];
  const hits = [];
  for (const root of roots) {
    for (const relative of readdirSync(root, { recursive: true })) {
      const path = join(root, relative);
      if (!statSync(path).isFile()) continue;
      const text = readFileSync(path);
      if (text.includes(Buffer.from("clinicianportal"))) hits.push(path);
    }
  }
  assert.deepEqual(hits, []);
});

test("plugin source does not contain an origin URL", () => {
  const dir = join(ROOT, "netlify/plugins/clinician-portal");
  for (const name of readdirSync(dir)) {
    const text = readFileSync(join(dir, name), "utf8");
    assert.equal(text.includes("https://"), false, name);
    assert.equal(text.includes("CLINICIAN_PASSWORD"), false, name);
  }
});

test("unset origin leaves the catch-all in place", () => {
  for (const raw of [undefined, null, "", "   ", '""', "''"]) {
    const redirects = publishedRedirects();
    const before = JSON.stringify(redirects);
    const result = installClinicianPortalProxy(redirects, raw);
    assert.equal(result.ok, true);
    assert.equal(result.reason, "unset");
    assert.equal(JSON.stringify(redirects), before);
  }
});

test("proxy rules are inserted immediately before the catch-all", () => {
  const redirects = publishedRedirects();
  const result = installClinicianPortalProxy(redirects, `${ORIGIN}/`);
  assert.equal(result.ok, true);
  assert.equal(result.reason, "ready");

  const froms = redirects.map((rule) => rule.from);
  const portal = froms.indexOf("/clinicianportal");
  const slash = froms.indexOf("/clinicianportal/");
  const splat = froms.indexOf("/clinicianportal/*");
  const catchAll = froms.indexOf("/*");
  assert.deepEqual(froms.slice(portal, portal + 3), [
    "/clinicianportal",
    "/clinicianportal/",
    "/clinicianportal/*",
  ]);
  assert.equal(slash, portal + 1);
  assert.equal(splat, portal + 2);
  assert.equal(catchAll, portal + 3);
  assert.ok(froms.indexOf("/hacks") < portal);
  assert.ok(froms.indexOf("/assets/*") < portal);

  assert.deepEqual(redirects[portal], {
    from: "/clinicianportal",
    to: `${ORIGIN}/clinicianportal/`,
    status: 200,
    force: true,
  });
  assert.equal(redirects[slash].to, `${ORIGIN}/clinicianportal/`);
  assert.equal(redirects[portal].to, redirects[slash].to);
  assert.equal(redirects[splat].to, `${ORIGIN}/clinicianportal/:splat`);
  assert.equal(redirects[splat].status, 200);
  assert.equal(redirects[splat].force, true);
  assert.equal(redirects[catchAll].status, 404);
});

test("a second install does not duplicate rules", () => {
  const redirects = publishedRedirects();
  installClinicianPortalProxy(redirects, ORIGIN);
  const once = redirects.length;
  const again = installClinicianPortalProxy(redirects, ORIGIN);
  assert.equal(again.reason, "already");
  assert.equal(redirects.length, once);
});

test("invalid origins fail closed and do not echo secrets", () => {
  const secret = "not-a-real-password";
  const cases = [
    "http://private-origin.invalid",
    `https://clinician:${secret}@private-origin.invalid`,
    `${ORIGIN}/clinicianportal`,
    `${ORIGIN}?x=1`,
    `${ORIGIN}#fragment`,
    "https://theosismedical.com",
    "https://www.theosismedical.com/",
    "not a url",
    "https://private-origin.invalid/extra",
  ];

  for (const raw of cases) {
    const redirects = publishedRedirects();
    const before = redirects.length;
    const result = installClinicianPortalProxy(redirects, raw);
    assert.equal(result.ok, false, raw);
    assert.equal(redirects.length, before, raw);
    assert.equal(JSON.stringify(result).includes(secret), false);
    assert.equal(JSON.stringify(result).includes("private-origin.invalid"), false);
  }
});

test("port and surrounding quotes are preserved without a path", () => {
  const parsed = parseClinicianPortalOrigin(' "https://private-origin.invalid:8443" ');
  assert.equal(parsed.ok, true);
  assert.equal(parsed.origin, "https://private-origin.invalid:8443");
});

test("plugin handler installs nothing until the env var is set", () => {
  const previous = process.env.CLINICIAN_PORTAL_ORIGIN;
  delete process.env.CLINICIAN_PORTAL_ORIGIN;
  try {
    const redirects = [{ from: "/*", to: "/404.html", status: 404 }];
    onPreBuild({
      netlifyConfig: { redirects },
      utils: {
        build: {
          failBuild() {
            throw new Error("unset origin must not fail the build");
          },
        },
      },
    });
    assert.equal(redirects.length, 1);

    process.env.CLINICIAN_PORTAL_ORIGIN = "http://private-origin.invalid";
    let failed = "";
    const bad = [{ from: "/*", to: "/404.html", status: 404 }];
    onPreBuild({
      netlifyConfig: { redirects: bad },
      utils: {
        build: {
          failBuild(message) {
            failed = message;
          },
        },
      },
    });
    assert.match(failed, /https/);
    assert.equal(bad.length, 1);
    assert.equal(failed.includes("private-origin.invalid"), false);

    process.env.CLINICIAN_PORTAL_ORIGIN = ORIGIN;
    const ready = [
      { from: "/hacks", to: "/404.html", status: 404 },
      { from: "/*", to: "/404.html", status: 404 },
    ];
    onPreBuild({ netlifyConfig: { redirects: ready }, utils: { build: {} } });
    assert.equal(ready[0].from, "/hacks");
    assert.equal(ready[1].from, "/clinicianportal");
    assert.equal(ready.at(-1).from, "/*");
  } finally {
    if (previous === undefined) delete process.env.CLINICIAN_PORTAL_ORIGIN;
    else process.env.CLINICIAN_PORTAL_ORIGIN = previous;
  }
});
