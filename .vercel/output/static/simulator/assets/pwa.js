/* Simulator app: service worker + a small "Add to home screen" button when the browser offers install. */
(function () {
  var BASE = (document.currentScript && document.currentScript.src || "/simulator/assets/pwa.js").replace(/assets\/pwa\.js.*$/, "");
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () { navigator.serviceWorker.register(BASE + "sw.js", { scope: BASE }).then(function () {
      if (navigator.serviceWorker.controller) return;
      navigator.serviceWorker.ready.then(function (r) {
        var urls = [location.href].concat(performance.getEntriesByType("resource").map(function (e) { return e.name; }));
        if (r.active) r.active.postMessage({ type: "sim-warm", page: location.href, urls: urls });
      });
    }).catch(function () {}); });
  }
  var standalone = (window.matchMedia && matchMedia("(display-mode: standalone)").matches) || navigator.standalone;
  if (standalone) { document.documentElement.classList.add("is-app"); return; }
  var KEY = "theosis-sim-install-hide", ev = null, box = null;
  try { if (localStorage.getItem(KEY)) return; } catch (e) {}
  function hide(forever) { if (box) box.remove(); box = null; if (forever) try { localStorage.setItem(KEY, "1"); } catch (e) {} }
  function show() {
    if (box || !ev) return;
    if (document.querySelector("dialog[open]")) { setTimeout(show, 1000); return; } // wait until the consent / info dialogs are closed
    var st = document.createElement("style");
    st.textContent = "#sim-install{position:fixed;left:12px;bottom:calc(12px + env(safe-area-inset-bottom));z-index:60;display:flex;align-items:center;gap:2px;background:#13233d;border:1px solid #2a7ae0;border-radius:999px;box-shadow:0 4px 16px rgba(0,0,0,.45);font:600 15px/1 Barlow,system-ui,sans-serif;color:#fff}" +
      "#sim-install button{background:none;border:0;color:inherit;font:inherit;cursor:pointer;min-height:44px}" +
      "#sim-install .go{display:flex;align-items:center;gap:8px;padding:0 6px 0 14px}#sim-install .x{width:40px;font-size:20px;color:#9fb3cc}";
    document.head.appendChild(st);
    box = document.createElement("div"); box.id = "sim-install";
    box.innerHTML = '<button class="go" type="button"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11M7 10l5 5 5-5M5 20h14"/></svg>Add to home screen</button><button class="x" type="button" aria-label="No thanks">\u00d7</button>';
    box.querySelector(".go").onclick = function () { var p = ev; ev = null; hide(false); p.prompt(); p.userChoice.then(function (r) { if (r && r.outcome === "dismissed") try { localStorage.setItem(KEY, "1"); } catch (e) {} }); };
    box.querySelector(".x").onclick = function () { hide(true); };
    document.body.appendChild(box);
    // sit just above whatever bar is fixed to the bottom of the screen (phone tabs, summary), else 12px up
    (function lift() {
      if (!box) return;
      var top = innerHeight;
      document.querySelectorAll("body *").forEach(function (el) {
        if (el === box || box.contains(el) || el.offsetParent === null && getComputedStyle(el).position !== "fixed") return;
        var cs = getComputedStyle(el); if (cs.position !== "fixed" || cs.visibility === "hidden" || cs.display === "none") return;
        var r = el.getBoundingClientRect(); if (r.height > 0 && r.height < innerHeight * 0.4 && r.bottom >= innerHeight - 2 && r.top < top && r.width > innerWidth * 0.5) top = r.top;
      });
      box.style.bottom = (innerHeight - top + 12) + "px";
      setTimeout(lift, 1000);
    })();
  }
  window.addEventListener("beforeinstallprompt", function (e) { e.preventDefault(); ev = e; if (document.body) show(); else document.addEventListener("DOMContentLoaded", show); });
  window.addEventListener("appinstalled", function () { ev = null; hide(true); });
})();
