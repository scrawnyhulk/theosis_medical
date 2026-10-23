/* Theosis Metabolic Simulator service worker. Scope: /simulator/ only.
   HTML: network first, offline falls back to the last copy of that page (or the last page loaded).
   Versioned assets (?v=): cache first. Other /simulator/ files: network first, cache as backup.
   Never cached: non-GET, other sites, /.netlify/ (functions: AI, photo preview, labs, food), /api/. */
const VER = "7698";
const PAGES = "theosis-sim-pages-v1";
const ASSETS = "theosis-sim-assets-v" + VER;
const OURS = [PAGES, ASSETS];
const SCOPE = new URL(self.registration.scope).pathname; // "/simulator/" on the site
const LAST = SCOPE + "__last-page__";

self.addEventListener("install", (e) => { self.skipWaiting(); });
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys()
    .then((ks) => Promise.all(ks.filter((k) => k.indexOf("theosis-sim-") === 0 && OURS.indexOf(k) < 0).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function skip(req, url) {
  if (req.method !== "GET") return true;
  if (url.origin !== self.location.origin) return true;
  if (!url.pathname.startsWith(SCOPE)) return true;
  if (url.pathname.startsWith("/.netlify/") || url.pathname.indexOf("/api/") >= 0 || url.pathname.endsWith("/sw.js")) return true;
  if (req.headers.has("range")) return true;
  return false;
}
const okToStore = (res) => res && res.ok && res.type === "basic" && !/no-store/i.test(res.headers.get("cache-control") || "");

async function page(req) {
  const c = await caches.open(PAGES);
  try {
    const res = await fetch(req);
    if (okToStore(res)) { const u = new URL(req.url); u.hash = ""; c.put(u.origin + u.pathname, res.clone()); c.put(LAST, res.clone()); }
    return res;
  } catch (err) {
    const u = new URL(req.url);
    return (await c.match(u.origin + u.pathname)) || (await c.match(LAST)) ||
      new Response("<!doctype html><meta name=viewport content='width=device-width'><body style='background:#080d14;color:#e7edf5;font:18px system-ui;padding:24px'>You're offline. Open the simulator again once you're connected.</body>", { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
}
async function versioned(req) {
  const c = await caches.open(ASSETS);
  const hit = await c.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  if (okToStore(res)) c.put(req, res.clone());
  return res;
}
async function other(req) {
  const c = await caches.open(ASSETS);
  try { const res = await fetch(req); if (okToStore(res)) c.put(req, res.clone()); return res; }
  catch (err) { const hit = await c.match(req); if (hit) return hit; throw err; }
}
// First visit: the page loaded before this worker was in control, so the page asks us to keep what it already fetched.
self.addEventListener("message", (e) => {
  const d = e.data || {};
  if (d.type !== "sim-warm" || !Array.isArray(d.urls)) return;
  e.waitUntil((async () => {
    for (const s of d.urls.slice(0, 120)) {
      let url; try { url = new URL(s, self.location.origin); } catch (err) { continue; }
      const req = new Request(url.href, { credentials: "same-origin" });
      if (skip(req, url)) continue;
      try {
        if (url.href.split("#")[0] === String(d.page || "").split("#")[0]) {
          const res = await fetch(req); if (!okToStore(res)) continue;
          const c = await caches.open(PAGES); url.hash = ""; await c.put(url.origin + url.pathname, res.clone()); await c.put(LAST, res);
        } else if (url.searchParams.has("v")) {
          const c = await caches.open(ASSETS); if (await c.match(req)) continue;
          const res = await fetch(req); if (okToStore(res)) await c.put(req, res);
        }
      } catch (err) {}
    }
  })());
});

self.addEventListener("fetch", (e) => {
  const req = e.request, url = new URL(req.url);
  if (skip(req, url)) return;
  if (req.mode === "navigate" || (req.headers.get("accept") || "").includes("text/html")) e.respondWith(page(req));
  else if (url.searchParams.has("v")) e.respondWith(versioned(req));
  else e.respondWith(other(req));
});
