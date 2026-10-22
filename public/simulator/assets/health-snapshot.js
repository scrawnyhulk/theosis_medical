/* Runs outside the app bundle: app globals come through window.__BP (see ui/56-lazy.js). */
with (window.__BP) {
// ---------- v7.6.55: Health snapshot learning score (Projection step). Ported from mockups/health-snapshot.html with the same
// weights (A1c 25, waist-to-height 25, eating vs burn 15, protein 10, activity 15, threshold check 10) and bands (>=75, >=45).
// Cutoffs come from guidelines (ADA, NICE, National Academies, HHS); combining them into one score is our own design.
const HS_C = ["#e07070", "#d4a056", "#3d9a6a"];
function hsInput(plan) {
  const p = S.profile, h = p.health || {}, dm = E.diabetesStatus(h).value, r0 = R.main.rows[0], tw = E.weeklyTraining(effMove()), st = typeof pftInsideStage === "function" ? pftInsideStage() : null;
  const a1c = Number.isFinite(+h.a1c) && +h.a1c > 0 ? +h.a1c : null;
  const kcal = plan ? r0.intake : S.food.actualOn && Number.isFinite(+S.food.actualKcal) ? +S.food.actualKcal : null;
  const prot = plan ? (R.protein && R.protein.g) || null : S.food.actualOn && Number.isFinite(+S.food.actualProteinG) && +S.food.actualProteinG > 0 ? +S.food.actualProteinG : null;
  return { htIn: p.heightCm / 2.54, waIn: p.waistCm ? p.waistCm / 2.54 : null, wtLb: p.weightKg * 2.2046226, a1c, dx: ["t1", "t2", "other"].includes(dm), kcal, burn: r0.tdee, prot, cardio: Math.round(tw.cardioMin || 0), lifts: tw.liftSessions || 0,
    check: st && st.key ? { under: "under", near: "near", above: "past" }[st.key] : null };
}
function hsFactors(p) {
  const F = [], LB = 2.2046226, refKg = Math.min(p.wtLb / LB, 25 * Math.pow(p.htIn * 0.0254, 2));
  if (p.a1c != null || p.dx) { const a = p.a1c, d = p.dx;   /* v7.6.56: status is only what the person selects; the A1c never sets it */ let s, lv, t;
    if (d && a != null && a < 7) { s = 10; lv = 1; t = `A1c ${a}% · diabetes selected`; } else if (d) { s = 0; lv = 0; t = a != null ? `A1c ${a}% · diabetes selected` : "Diabetes selected"; } else if (a >= 5.7) { s = 13; lv = 1; t = `A1c ${a}% · see the reference ranges`; } else { s = 25; lv = 2; t = `A1c ${a}% · see the reference ranges`; }
    F.push({ k: "a1c", nm: "Blood sugar (A1c)", max: 25, s, lv, t,
      mean: (a != null ? `Your A1c: ${a}%. For reference, the American Diabetes Association lists below 5.7% as normal, 5.7–6.4% as prediabetes, and 6.5% or higher as diabetes. Diagnosis requires a confirmed test and a healthcare provider.` + " " : "") + "A1c reflects average blood sugar over about the past 3 months." + (d ? " Many adults with diabetes aim for under 7%, with their healthcare provider." : ""), a1cRef: a != null && window.BodyEngine && BodyEngine.a1cRefHtml ? BodyEngine.a1cRefHtml(a) : "",
      why: "Research suggests that when extra fat builds up in the liver, the liver may make more sugar than needed. Fat that spills into the pancreas can make it harder to release insulin. Together these can push blood sugar up over time.",
      help: "Studies show that losing weight often lowers liver fat first, and blood sugar can improve along with it. In one large study (DiRECT), many people with type 2 diabetes went into remission after losing about 22–33 lb. Moving more can also help muscles use sugar.", cm: ["ada-soc2026-s2"].concat(d && a != null && a < 7 ? ["ada-soc2026-s6"] : []), cw: ["taylor2008"], ch: ["lim2011", "direct2018"] }); }
  if (p.waIn) { const r = p.waIn / p.htIn, s = r < 0.5 ? 25 : r < 0.6 ? 12 : 0, lv = r < 0.5 ? 2 : r < 0.6 ? 1 : 0;
    F.push({ k: "whtr", nm: "Waist compared with height", max: 25, s, lv, t: `Waist ÷ height = ${r.toFixed(2)}`,
      mean: lv === 2 ? "A waist under half of height is a healthy sign." : lv === 1 ? "A waist a bit over half of height may mean some extra fat is stored around the middle." : "A waist well over half of height often means more fat is stored around the organs.",
      why: "Fat around the organs (belly fat) tends to be more active than fat under the skin. Research links more of it with higher blood sugar and blood fat problems. When the safer stores under the skin are full, extra fat tends to spill inside.",
      help: "With modest weight loss, belly fat around the organs tends to shrink by a bigger share than fat under the skin. Small changes in eating and activity can add up.", cm: ["nice-ng246"], cw: ["chaston2008", "taylor2015"], ch: ["chaston2008"], note: "How these points add up is our own design." }); }
  if (p.kcal && p.burn) { const d = (p.kcal - p.burn) / p.burn, extra = p.waIn ? p.waIn / p.htIn >= 0.5 : false; let s, lv;
    if (d > 0.10) { s = 0; lv = 0; } else if (extra ? d <= 0 : Math.abs(d) <= 0.10) { s = 15; lv = 2; } else { s = 8; lv = 1; }
    F.push({ k: "eat", nm: "Eating compared with what is burned", max: 15, s, lv, t: `About ${fK(p.kcal)} kcal eaten vs about ${fK(p.burn)} burned a day (${d > 0 ? "+" : ""}${Math.round(d * 100)}%)`,
      mean: d > 0.1 ? "Eating more than is burned, day after day, tends to add fat over time." : d < -0.05 ? "Eating a bit less than is burned tends to let stored fat come down over time." : "Eating about what is burned tends to keep weight steady.",
      why: "Extra energy that isn't burned is stored, mostly as fat. Once the safer stores are full, more of it may end up in the liver and around the organs.",
      help: "A modest, steady deficit is often easier to keep up than a big one. The plan suggests a daily target that tends to slow down as weight comes off.", cm: ["hall2011m"], cw: [], ch: [], note: "The ±10% bands are our own design choice, not a guideline." }); }
  if (p.prot) { const g = p.prot / refKg, s = Math.round(Math.min(1, g / 0.8) * 10), lv = g >= 0.8 ? 2 : g >= 0.6 ? 1 : 0;
    F.push({ k: "prot", nm: "Protein", max: 10, s, lv, t: `About ${Math.round(p.prot)} g a day (${g.toFixed(2)} g per kg)`,
      mean: g >= 0.8 ? "This is at least the basic daily amount most adults need." : "This may be less than the basic daily amount most adults need.",
      why: "Protein helps keep and repair muscle. Muscle is one of the main places the body can use sugar.",
      help: "Eating at least the basic amount, together with lifting, may help keep muscle while losing weight.", cm: ["iom-dri-protein"], cw: [], ch: [], note: "We use weight capped at a BMI of 25 for the per-kg amount." }); }
  { const a = p.cardio || 0, l = p.lifts || 0, s = (a >= 150 ? 10 : a > 0 ? 5 : 0) + (l >= 2 ? 5 : l >= 1 ? 2 : 0), lv = s >= 13 ? 2 : s >= 5 ? 1 : 0;
    F.push({ k: "act", nm: "Activity and lifting", max: 15, s, lv, t: `${a} min of activity a week · lifting ${+l.toFixed(1)} day${l === 1 ? "" : "s"} a week`,
      mean: lv === 2 ? "This meets the national activity guidelines." : lv === 1 ? "Some activity is better than none, and this is partway there." : "Little or no activity right now. Any amount can help.",
      why: "Working muscles can take up sugar from the blood, even without much insulin. Regular activity can help insulin work better.",
      help: "Guidelines suggest at least 150 minutes a week of moderate activity, like brisk walking, and muscle-strengthening on 2 or more days. Small steps count: the biggest gains often come from moving from none to some.", cm: [], cw: [], ch: ["pag2018"], note: "The point split (10 for activity, 5 for lifting) is our own design." }); }
  if (p.check) { const m = { under: [10, 2, "Likely under the limit"], near: [5, 1, "Near the limit"], past: [0, 0, "Likely past the limit"] }[p.check];
    F.push({ k: "pft", nm: "Personal fat threshold (our estimate)", max: 10, s: m[0], lv: m[1], t: m[2] + " (our estimate)",
      mean: "This is the app's personal fat threshold estimate, built from the numbers entered.",
      why: "Everyone seems to have a personal limit for storing fat safely under the skin. Past it, fat tends to collect in the liver and pancreas.",
      help: "Research suggests getting back under that limit, often by losing some weight, can let the liver and pancreas recover.", cm: [], cw: ["taylor2015"], ch: [], note: "The estimate itself is our own." }); }
  return F;
}
const hsScore = (F) => { const max = F.reduce((a, f) => a + f.max, 0); return max ? Math.round(100 * F.reduce((a, f) => a + f.s, 0) / max) : null; };
const hsBand = (s) => (s >= 75 ? [2, "Looking strong", "These answers line up with many healthy signs."] : s >= 45 ? [1, "Some room to improve", "A few changes could make a real difference."] : [0, "Lots of room to improve", "The good news: many of these can change, and small steps often help."]);
let hsOpen = "";
const hsCite = (ids) => { const T = window.TheosisSources; return ids && ids.length && T ? ids.map((id) => T.fn(id)).join(`<sup class="fn-sep" aria-hidden="true">,</sup>`) : ""; };
function renderSnapshotNow() {
  const box = $("#hs-card"); if (!box) return; if (!R || R.blocked) { box.innerHTML = ""; box.hidden = true; return; } box.hidden = false;
  const F = hsFactors(hsInput(false)), sc = hsScore(F); if (sc == null) { box.innerHTML = ""; return; }
  const B = hsBand(sc), PL = hsScore(hsFactors(hsInput(true))), miss = 6 - F.length;
  box.innerHTML = `<p class="eyebrow card-eyebrow">Health snapshot</p>
  <div class="hs-score"><div class="hs-ring" style="--p:${sc};--c:${rampColor(sc / 100)}" role="img" aria-label="Learning score ${sc} out of 100: ${B[1]}"><b>${sc}</b></div><div><div class="hs-band" style="color:${rampColor(sc / 100)}">${B[1]}</div><p class="hint">${B[2]}</p></div></div>
  <p class="hs-doc"><b>A learning score, not a diagnosis.</b> Talk with your healthcare provider.</p>
  <p class="hint">Cutoffs come from health guidelines; how we combine them is our own estimate.${miss ? " Some answers were skipped, so the score uses what we have." : ""}</p>
  <p class="eyebrow">What's shaping this score · tap to learn more</p>
  ${F.map((f) => `<details class="hs-fx" data-hs="${f.k}"${hsOpen === f.k ? " open" : ""}><summary><i class="hs-dot" style="background:${HS_C[f.lv]}" aria-hidden="true"></i><span class="hs-nm">${esc(f.nm)}<br><small>${esc(f.t)}</small></span><span class="hs-pts">${f.s}/${f.max}</span><span class="hs-chev" aria-hidden="true">›</span></summary>
    <div class="hs-body"><h4>What this means</h4>${f.a1cRef || ""}<p>${esc(f.mean)}${hsCite(f.cm)}</p><h4>Why it's happening</h4><p>${esc(f.why)}${hsCite(f.cw)}</p><h4>What tends to help</h4><p>${esc(f.help)}${hsCite(f.ch)}</p>${f.note ? `<p class="hs-src">${esc(f.note)}</p>` : ""}</div></details>`).join("")}
  <div class="hs-plan"><p class="eyebrow">With the plan · illustrative</p><div class="hs-pl"><div><small>Now</small><b>${sc}</b></div><span aria-hidden="true">→</span><div><small>At plan end</small><b>${PL}</b></div></div>
  <p class="hint">Shows what the score could look like with the plan's eating, protein and activity targets. We don't predict changes in A1c or waist here, so those parts stay the same. Real results vary.</p></div>
  <p class="hs-doc"><b>Talk with your healthcare provider.</b> This is for learning only. Don't start, stop or change any medicine because of this score.</p>`;
}
document.addEventListener("toggle", (e) => { const d = e.target; if (d && d.classList && d.classList.contains("hs-fx")) { if (d.open) hsOpen = d.dataset.hs; else if (hsOpen === d.dataset.hs) hsOpen = ""; } }, true);
window.BodyPlanSnapshot = { factors: hsFactors, score: hsScore, band: hsBand, input: hsInput };

window.renderSnapshotNow = renderSnapshotNow;
}
