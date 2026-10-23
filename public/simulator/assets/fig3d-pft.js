/* Runs outside the app bundle: app globals come through window.__BP (see ui/56-lazy.js). */
with (window.__BP) {
// ---------- v7.6.55: one big 3D PFT figure with a Today-to-plan-end slider (desktop: top of the Live summary; phone: Projection step).
// Drives the real personal fat threshold model (pft-inside, 3D view) through PFTEmbed. Falls back to the 2D figure when the
// model can't load (file://, no WebGL, blocked frame). Mapping plan fat -> model fuel level is our own illustrative choice
// (proportional to fat mass from the app's PFT stage), not a measurement.
const F3D = { api: null, host: null, where: null, on: false, failed: false, i: 0, ct: false };
const f3dWide = () => !!(window.matchMedia && window.matchMedia("(min-width:64rem)").matches);
// v7.6.70b: narrow screens show the figure in the expanded bottom bar on steps 1-4 and in the Projection step on step 5
const f3dWhere = () => f3dWide() ? "#sum-pft" : ((window.__BP && window.__BP.S && window.__BP.S.step === 5) ? "#f3d-phone" : "#f3d-mbar");
const f3dFallback = (host) => { if (!host) return; host.hidden = false; host.innerHTML = `<figure class="f3d-fbfig"><img src="assets/f3d-ct-fallback.webp" alt="Example cross-section through the middle of the model" width="720" height="560"><figcaption>Example cross-section. The 3D model can't load on this device.</figcaption></figure>`; };
function f3dStart() { const s = typeof pftInsideStage === "function" ? pftInsideStage() : null; return { load: s && s.load != null ? s.load : s && s.fuel != null ? s.fuel : 55, cap: s ? +s.cap : 1 }; }
/* v7.6.78: only an A1c the person entered; blank = null (no A1c shown, no effect) */
function f3dUserA1c() { const v = S && S.profile && S.profile.health ? +S.profile.health.a1c : NaN; return S.profile.health.a1c != null && S.profile.health.a1c !== "" && v >= 3 && v <= 20 ? v : null; }
function f3dRows() { return R && !R.blocked && R.main && R.main.rows ? R.main.rows : null; }
const SKINS = ["#f2d3bd", "#e1b48f", "#c49170", "#946446", "#5f3d2b"]; window.PFT_SKINS = SKINS;
function f3dSkinI() { const i = S.fig && S.fig.skin; return i >= 0 && i < SKINS.length ? +i : 2; }
function f3dView(v) { if (v === true) v = "ct"; else if (v === false || !v) v = "3d"; F3D.ct = v === "ct"; const wasMus = !!F3D.mus; F3D.mus = v === "muscle";
  const b = $("#f3d-ctbox"), h = F3D.host; if (!b || !h) return; b.hidden = !F3D.ct; h.classList.toggle("f3d-ctv", F3D.ct); h.classList.toggle("f3d-musv", F3D.mus);
  const x = $("#f3d-ct"), y = $("#f3d-3d"), m = $("#f3d-mus"); if (x) { x.setAttribute("aria-pressed", String(F3D.ct)); x.setAttribute("aria-expanded", String(F3D.ct)); } if (y) y.setAttribute("aria-pressed", String(v === "3d")); if (m) m.setAttribute("aria-pressed", String(F3D.mus));
  const mb = $("#f3d-musbox"); if (mb) mb.hidden = !F3D.mus;
  if (F3D.api && F3D.api.muscle && (F3D.mus || wasMus)) F3D.api.muscle(F3D.mus); if (F3D.mus) f3dMuscle(); if (F3D.ct) f3dCt(); }
/* v7.6.78: per-area muscle growth on the figure. Uses the app's own model: the plan's lean-mass change (rows[i].leanKg - rows[0].leanKg,
   which already follows lifting days, type, effort, protein, age and training status) split across areas by muscleRegions() (where the
   lifting rows train, Janssen 2000 muscle distribution + spillover). Only gained lean mass is drawn as growth (a loss is not shown as
   shrinking). Size on screen: group muscle ~ its share (MUSCLE_NAT) of skeletal muscle (~half of lean mass, an estimate); a relative gain r
   thickens a muscle by about r/2 of its ~4 cm depth; drawn MUS_EXAG times larger, capped. Illustration, not a measurement. */
const MUS_EXAG = 8, MUS_DEPTH = 0.04, MUS_CAP = 0.024;
const MUS_LABEL = { chest: "Chest", back: "Back", shoulders: "Shoulders", biceps: "Front of upper arms (biceps)", triceps: "Back of upper arms (triceps)", forearms: "Forearms", quads: "Front of thighs (quads)", hamstrings: "Back of thighs (hamstrings)", glutes: "Buttocks (glutes)", calves: "Calves", core: "Belly muscles (core)" };
function f3dMusCalc(i) {
  const rows = f3dRows(); if (!rows) return null; const x = rows[Math.min(i, rows.length - 1)], a = rows[0];
  const mv = typeof effMove === "function" ? effMove() : (S.move || {}); const sex = S.profile && S.profile.sex === "f" ? "f" : "m";
  const mr = typeof muscleRegions === "function" ? muscleRegions(mv, sex) : null; const dL = x.leanKg - a.leanKg;
  const out = { lift: !!mr, dL, kg: {}, grow: {} }; if (!mr || dL <= 0) return out;
  const sm = 0.5 * a.leanKg;
  for (const g in mr.share) { const kg = dL * mr.share[g], base = Math.max(0.2, (mr.nat[g] || 0.05) * sm), r = kg / base;
    out.kg[g] = kg; out.grow[g] = Math.min(MUS_CAP, MUS_EXAG * (r / 2) * MUS_DEPTH); }
  return out;
}
function f3dMuscle() {
  if (!F3D.mus) return; const c = f3dMusCalc(F3D.i), n = $("#f3d-mnote"), l = $("#f3d-mlist"); if (!c) return;
  if (F3D.api && F3D.api.grow) F3D.api.grow(c.grow);
  if (n) n.innerHTML = !c.lift ? "<b>Muscle view.</b> You haven't picked strength training, so the muscles stay the same. Add lifting on the Move step to see them grow."
    : F3D.i === 0 ? "<b>Muscle view.</b> Move the slider to see where your lifting builds muscle."
    : c.dL <= 0 ? "<b>Muscle view.</b> In this plan your muscle mostly holds steady while fat comes off, so the muscles don't look bigger."
    : `<b>Muscle view.</b> The areas you train grow the most. About ${fW(c.dL)} of muscle and other lean tissue gained by this point.`;
  if (l) { const all = Object.keys(c.kg).sort((p, q) => c.kg[q] - c.kg[p]), ks = all.filter((k) => c.kg[k] >= 0.025), rest = all.filter((k) => c.kg[k] < 0.025), mx = ks.length ? Math.max(1e-6, c.kg[ks[0]]) : 1;
    const amt = (kg) => { const lb = S.units === "metric" ? null : kg * 2.2046226; return lb == null ? `+${kg < 1 ? Math.round(kg * 1000) + " g" : kg.toFixed(1) + " kg"}` : `+${lb.toFixed(1)} lb`; };
    l.innerHTML = (ks.length ? ks.map((k) => `<li><span>${esc(MUS_LABEL[k] || k)}</span><i style="--w:${Math.round(100 * c.kg[k] / mx)}%"></i><b>${amt(c.kg[k])}</b></li>`).join("") : "<li><span>No muscle gain at this point</span></li>")
      + (ks.length && rest.length ? `<li class="f3d-mrest"><span>Little or no change: ${esc(rest.map((k) => (MUS_LABEL[k] || k).replace(/ \(.*\)$/, "").toLowerCase()).join(", "))}</span></li>` : ""); }
}
function f3dShell() {
  return `<p class="eyebrow card-eyebrow">See how this works in a body like yours</p>
  <div class="seg sm f3d-sw" role="group" aria-label="Figure view"><button type="button" id="f3d-3d" data-f3dv="3d" aria-pressed="true">3D</button><button type="button" id="f3d-ct" data-f3dv="ct" aria-pressed="false" aria-expanded="false">Cross-section</button><button type="button" id="f3d-mus" data-f3dv="muscle" aria-pressed="false">Muscle</button></div>
  <label class="f3d-sl" for="f3d-range"><span>Today</span><b id="f3d-wk"></b><span id="f3d-end">Goal</span></label>
  <input type="range" id="f3d-range" min="0" max="1" value="0" aria-label="Move from today to the end of your goal">
  <div class="f3d-skins" role="group" aria-label="Skin tone">${SKINS.map((t, i) => `<button type="button" data-f3dskin="${i}" style="--t:${t}" aria-pressed="${f3dSkinI() === i}" aria-label="Skin tone ${i + 1}"></button>`).join("")}</div>
  <div id="f3d-pfe"></div>
  <div id="f3d-musbox" class="f3d-musbox" hidden><p class="f3d-mnote" id="f3d-mnote"></p><p class="f3d-exag"><b>Muscle growth is shown larger than real life so you can see it.</b></p>
    <div class="adv-only"><p class="f3d-lbl">Muscle gained by this point, by area (estimate)</p><ul id="f3d-mlist" class="f3d-mlist"></ul>
    <p class="hint">Split by where you train, using the plan's own lean-mass estimate (the Move step's lifting choices). The figure shows each area about ${MUS_EXAG} times larger than the real change.</p></div></div>
  <div class="f3d-ro"><span>Weight</span><b id="f3d-w">–</b></div><div class="f3d-ro"><span>Body fat</span><b id="f3d-f">–</b></div>
  <div class="f3d-btns"><button type="button" class="btn btn-ghost" id="f3d-full">Open the full model</button></div>
  <div id="f3d-ctbox" hidden><p class="f3d-lbl">Illustration only.</p><img id="f3d-ctimg" alt="Cross-section slice from the model (illustration)"><ul id="f3d-ctl" class="pfe-list"></ul>
    <p class="hint">A cross-section shows a slice through the middle, like a slice of bread. Fat looks darker than muscle and organs. This slice comes from the model, not from you.</p></div>
  <p class="hint">Illustration only. The model follows the fat the plan projects; how that maps onto the model is our own illustrative choice, not a measurement. This is for learning. Talk with your healthcare provider.</p>`;
}
let f3dLib = null;   // assets/pft-embed.js is loaded on demand (keeps index.html small)
function f3dLoadLib() { if (typeof PFTEmbed === "function") return Promise.resolve(); if (f3dLib) return f3dLib;
  f3dLib = new Promise((res, rej) => { const s = document.createElement("script"); s.src = "assets/pft-embed.js?v=7679"; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); return f3dLib; }
function f3dMountNow() {
  if (window.__NO_PFT_FIG) return;   // __NO_PFT_FIG: legacy test suites that check the older 2D/3D mannequin figure
  if (F3D.failed) { const fh = $(f3dWhere()); if (fh && !fh.querySelector(".f3d-fbfig")) { if (F3D.host && F3D.host !== fh) { F3D.host.innerHTML = ""; F3D.host.hidden = true; } F3D.host = fh; F3D.where = f3dWhere(); f3dFallback(fh); } return; }
  if (F3D.gl === undefined) { try { const c = document.createElement("canvas"); F3D.gl = !!(c.getContext("webgl2") || c.getContext("webgl")); } catch (e) { F3D.gl = false; } }
  if (!F3D.gl) { F3D.failed = true; F3D.why = "no-webgl"; return f3dMountNow(); }
  if (typeof PFTEmbed !== "function") { f3dLoadLib().then(() => f3dMountNow(), () => { F3D.failed = true; f3dMountNow(); }); return; }
  const wide = f3dWide(), where = f3dWhere(), host = $(where); if (!host) return;
  if (F3D.api && F3D.where === where) return f3dApply();
  if (F3D.host) { try { F3D.api && F3D.api.destroy(); } catch (e) { /* ignore */ } F3D.host.innerHTML = ""; F3D.host.hidden = true; }
  if (typeof PFTEmbed !== "function" || !f3dRows()) return;
  F3D.where = where; F3D.host = host; host.hidden = false; host.innerHTML = f3dShell(); F3D.on = false; document.body.classList.remove("f3d-on");
  const st = f3dStart();
  F3D.api = PFTEmbed($("#f3d-pfe"), { load: st.load, capacity: st.cap, skinColor: SKINS[f3dSkinI()], ctSkin: pftCtSkin, onReady: () => { F3D.on = true; document.body.classList.add("f3d-on"); if (F3D.mus) f3dView("muscle"); f3dApply(); },
    onFail: (why) => { F3D.failed = true; F3D.on = false; F3D.api = null; F3D.why = why; document.body.classList.remove("f3d-on"); try { console.warn("PFT 3D figure unavailable:", why); } catch (e) { /* ignore */ } f3dFallback(host); },
    onUpdate: () => { if (F3D.ct) f3dCt(); } });
  f3dApply();
}
function f3dApply() {
  const rows = f3dRows(), r = $("#f3d-range"); if (!rows || !r) return;
  r.max = String(rows.length - 1); if (F3D.i > rows.length - 1) F3D.i = rows.length - 1; r.value = String(F3D.i);
  const x = rows[F3D.i], st = f3dStart(), load = Math.max(0, Math.min(100, st.load * x.fatKg / rows[0].fatKg)), end = rows[rows.length - 1];
  const goal = R.isTarget ? "Goal" : "End", last = F3D.i === rows.length - 1;
  $("#f3d-wk").textContent = F3D.i === 0 || last ? "" : `Week ${fWk(x.day)} · ${fDate(x.day)}`; $("#f3d-end").textContent = `${goal}: ${fDate(end.day)}`;
  r.setAttribute("aria-valuetext", F3D.i === 0 ? "Today" : last ? `${goal}: ${fDate(end.day)}` : `Week ${fWk(x.day)}, ${fDate(x.day)}`);
  $("#f3d-w").textContent = `${fW(rows[0].weightKg)} → ${fW(x.weightKg)}`; $("#f3d-f").textContent = `${fP(rows[0].bf)} → ${fP(x.bf)}`;
  if (F3D.api && F3D.api.ready()) F3D.api.set({ start: st.load, end: load, s: F3D.i ? 100 : 0, capacity: st.cap, a1c: f3dUserA1c(), outer: window.BodyPlanApp && BodyPlanApp.figOuter ? BodyPlanApp.figOuter(x) : null });
  if (F3D.mus) f3dMuscle();
}
function f3dCt() { const b = $("#f3d-ctbox"); if (!b || !F3D.api) return; const u = F3D.api.ct(); if (u) $("#f3d-ctimg").src = u;
  $("#f3d-ctl").innerHTML = F3D.api.ctList().map((x) => `<li style="border-left:3px solid ${x[0]}"><b>${esc(x[1])}</b><br><span>${esc(x[2])}${x[3] || ""}</span></li>`).join(""); }
document.addEventListener("input", (e) => { if (e.target.id === "f3d-range") { F3D.i = +e.target.value; f3dApply(); } });
document.addEventListener("click", (e) => {
  if (e.target.closest("#f3d-full")) { if (F3D.api && F3D.api.ready()) F3D.api.openFull(); else window.open("pft-inside/index.html?view=3d", "_blank", "noopener"); return; }
  const v = e.target.closest("[data-f3dv]"); if (v) { f3dView(v.dataset.f3dv); return; }
  const k = e.target.closest("[data-f3dskin]"); if (k) { const i = +k.dataset.f3dskin; S.fig.skin = i; save(); document.querySelectorAll("[data-f3dskin]").forEach((b) => b.setAttribute("aria-pressed", String(+b.dataset.f3dskin === i))); if (F3D.api && F3D.api.setSkin) F3D.api.setSkin(SKINS[i]); if (F3D.ct) setTimeout(f3dCt, 60); }
});
window.addEventListener("resize", () => { if ((F3D.api || F3D.failed) && F3D.where !== f3dWhere()) f3dMountNow(); });
window.BodyPlanFig3D = { state: F3D, mount: f3dMountNow, view: (v) => f3dView(v), muscleCalc: (i) => f3dMusCalc(i == null ? F3D.i : i) };

window.f3dMountNow = f3dMountNow;
}
