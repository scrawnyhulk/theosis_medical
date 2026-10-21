/* Runs outside the app bundle: app globals come through window.__BP (see ui/56-lazy.js). */
with (window.__BP) {
// ---------- v7.6.55: one big 3D PFT figure with a Today-to-plan-end slider (desktop: top of the Live summary; phone: Projection step).
// Drives the real personal fat threshold model (pft-inside, 3D view) through PFTEmbed. Falls back to the 2D figure when the
// model can't load (file://, no WebGL, blocked frame). Mapping plan fat -> model fuel level is our own illustrative choice
// (proportional to fat mass from the app's PFT stage), not a measurement.
const F3D = { api: null, host: null, where: null, on: false, failed: false, i: 0, ct: false };
const f3dWide = () => !!(window.matchMedia && window.matchMedia("(min-width:64rem)").matches);
function f3dStart() { const s = typeof pftInsideStage === "function" ? pftInsideStage() : null; return { load: s && s.fuel != null ? s.fuel : 55, cap: s ? +s.cap : 1 }; }
function f3dRows() { return R && !R.blocked && R.main && R.main.rows ? R.main.rows : null; }
function f3dShell() {
  return `<p class="eyebrow card-eyebrow">See how this works in a body like yours</p>
  <label class="f3d-sl" for="f3d-range"><span>Today</span><b id="f3d-wk">Slide to see later weeks</b><span id="f3d-end">Plan end</span></label>
  <input type="range" id="f3d-range" min="0" max="1" value="0" aria-label="Move from today to the end of the plan">
  <div id="f3d-pfe"></div>
  <div class="f3d-ro"><span>Weight</span><b id="f3d-w">–</b></div><div class="f3d-ro"><span>Body fat</span><b id="f3d-f">–</b></div>
  <div class="f3d-btns"><button type="button" class="btn btn-ghost" id="f3d-ct" aria-expanded="false">See it like a CT scan</button><button type="button" class="btn btn-ghost" id="f3d-full">Open the full model</button></div>
  <div id="f3d-ctbox" hidden><p class="f3d-lbl">Illustration, not your scan.</p><img id="f3d-ctimg" alt="CT-style slice from the body model (illustration, not your scan)"><ul id="f3d-ctl" class="pfe-list"></ul>
    <p class="hint">A CT scan is an X-ray picture that shows a slice through the middle of the body, like a slice of bread. Fat looks darker than muscle and organs. This slice comes from the model, not from you.</p></div>
  <p class="hint">Illustration, not your scan. The model follows the fat the plan projects; how that maps onto the model is our own illustrative choice, not a measurement. This is for learning. Talk with your healthcare provider.</p>`;
}
let f3dLib = null;   // assets/pft-embed.js is loaded on demand (keeps index.html small)
function f3dLoadLib() { if (typeof PFTEmbed === "function") return Promise.resolve(); if (f3dLib) return f3dLib;
  f3dLib = new Promise((res, rej) => { const s = document.createElement("script"); s.src = "assets/pft-embed.js?v=7655"; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); return f3dLib; }
function f3dMountNow() {
  if (window.__NO_PFT_FIG || F3D.failed) return;   // __NO_PFT_FIG: legacy test suites that check the older 2D/3D mannequin figure
  if (typeof PFTEmbed !== "function") { f3dLoadLib().then(() => f3dMountNow(), () => { F3D.failed = true; }); return; }
  const wide = f3dWide(), where = wide ? "#sum-pft" : "#f3d-phone", host = $(where); if (!host || F3D.failed) return;
  if (F3D.api && F3D.where === where) return f3dApply();
  if (F3D.host) { try { F3D.api && F3D.api.destroy(); } catch (e) { /* ignore */ } F3D.host.innerHTML = ""; F3D.host.hidden = true; }
  if (typeof PFTEmbed !== "function" || !f3dRows()) return;
  F3D.where = where; F3D.host = host; host.hidden = false; host.innerHTML = f3dShell(); F3D.on = false; document.body.classList.remove("f3d-on");
  const st = f3dStart();
  F3D.api = PFTEmbed($("#f3d-pfe"), { load: st.load, capacity: st.cap, onReady: () => { F3D.on = true; document.body.classList.add("f3d-on"); f3dApply(); },
    onFail: () => { F3D.failed = true; F3D.on = false; document.body.classList.remove("f3d-on"); host.innerHTML = `<p class="hint f3d-fb">The 3D model can't load here, so the simple figure is shown instead.</p>`; host.hidden = !wide ? false : true; },
    onUpdate: () => { if (F3D.ct) f3dCt(); } });
  f3dApply();
}
function f3dApply() {
  const rows = f3dRows(), r = $("#f3d-range"); if (!rows || !r) return;
  r.max = String(rows.length - 1); if (F3D.i > rows.length - 1) F3D.i = rows.length - 1; r.value = String(F3D.i);
  const x = rows[F3D.i], st = f3dStart(), load = Math.max(0, Math.min(100, st.load * x.fatKg / rows[0].fatKg)), end = rows[rows.length - 1];
  $("#f3d-wk").textContent = F3D.i === 0 ? "Slide to see later weeks" : `Showing week ${fWk(x.day)}`; $("#f3d-end").textContent = `Week ${fWk(end.day)}`;
  $("#f3d-w").textContent = `${fW(rows[0].weightKg)} → ${fW(x.weightKg)}`; $("#f3d-f").textContent = `${fP(rows[0].bf)} → ${fP(x.bf)}`;
  if (F3D.api && F3D.api.ready()) F3D.api.set({ start: st.load, end: load, s: F3D.i ? 100 : 0, capacity: st.cap });
}
function f3dCt() { const b = $("#f3d-ctbox"); if (!b || !F3D.api) return; const u = F3D.api.ct(); if (u) $("#f3d-ctimg").src = u;
  $("#f3d-ctl").innerHTML = F3D.api.ctList().map((x) => `<li style="border-left:3px solid ${x[0]}"><b>${esc(x[1])}</b><br><span>${esc(x[2])}${x[3] || ""}</span></li>`).join(""); }
document.addEventListener("input", (e) => { if (e.target.id === "f3d-range") { F3D.i = +e.target.value; f3dApply(); } });
document.addEventListener("click", (e) => {
  if (e.target.closest("#f3d-full")) { if (F3D.api && F3D.api.ready()) F3D.api.openFull(); else window.open("pft-inside/index.html?view=3d", "_blank", "noopener"); return; }
  if (e.target.closest("#f3d-ct")) { F3D.ct = !F3D.ct; const b = $("#f3d-ctbox"); b.hidden = !F3D.ct; e.target.closest("#f3d-ct").setAttribute("aria-expanded", String(F3D.ct)); if (F3D.ct) f3dCt(); }
});
window.addEventListener("resize", () => { if (F3D.api && F3D.where !== (f3dWide() ? "#sum-pft" : "#f3d-phone")) f3dMountNow(); });
window.BodyPlanFig3D = { state: F3D, mount: f3dMountNow };

window.f3dMountNow = f3dMountNow;
}
