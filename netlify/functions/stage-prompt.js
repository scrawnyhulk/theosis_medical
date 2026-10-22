/**
 * Shared "photo projection" prompt builder, used by ai.js (action "stage": See yourself at each stage) and preview.js
 * (See it on your photo). ONE template so the two can't drift.
 *
 * Safety design: the prompt is built ONLY from fields this file validates (numbers within ranges, fixed enums, arrays of enums).
 * No free text from the user ever reaches Gemini. Unknown fields (for example "ancestry") are dropped on purpose:
 * ancestry only shapes the fat-distribution estimate on the device (the phenotype / fatFirst fields) and is never sent as appearance.
 * Gemini draws; the simulator's engine computes the numbers.
 */
const MUSCLE_KEYS = ["chest", "back", "shoulders", "biceps", "triceps", "forearms", "quads", "hamstrings", "glutes", "calves", "core"];
const MUSCLE_WORD = { chest: "chest", back: "back", shoulders: "shoulders", biceps: "biceps", triceps: "triceps", forearms: "forearms", quads: "quads (front of thighs)", hamstrings: "hamstrings (back of thighs)", glutes: "glutes", calves: "calves", core: "abs and core" };
const FAT_REGIONS = ["belly", "hips_thighs", "arms_upper"];
const FAT_REGION_WORD = { belly: "the belly and waist", hips_thighs: "the hips and thighs", arms_upper: "the arms, chest and upper back" };
const TRAIN = ["none", "broad", "targeted"];
const PHENO = ["visceral", "mixed", "subcutaneous"];

const num = (v, lo, hi) => { const n = Number(v); if (v === "" || v === null || typeof v === "boolean" || !Number.isFinite(n) || n < lo || n > hi) throw new Error("bad number"); return n; };
const optNum = (v, lo, hi) => (v === undefined || v === null ? null : num(v, lo, hi));
const optEnum = (v, list) => { if (v === undefined || v === null || v === "") return null; if (!list.includes(v)) throw new Error("bad enum"); return v; };
const enumList = (v, list, max) => { if (v === undefined || v === null) return []; if (!Array.isArray(v) || v.length > max) throw new Error("bad list"); const out = []; for (const x of v) { if (!list.includes(x)) throw new Error("bad enum"); if (!out.includes(x)) out.push(x); } return out; };

const growthMap = (v) => { if (v === undefined || v === null) return {}; if (typeof v !== "object" || Array.isArray(v)) throw new Error("bad map"); const o = {}; for (const k of Object.keys(v)) { if (!MUSCLE_KEYS.includes(k)) throw new Error("bad enum"); o[k] = num(v[k], 0, 0.5); } return o; };

/** Validate + normalise the projection fields. Throws on anything out of range. `o.maxWeek` etc. let preview.js keep its tighter limits. */
function sanitize(q, o) {
  q = q || {}; o = o || {};
  const p = {
    sex: q.sex === "f" ? "f" : "m",
    week: num(q.week != null ? q.week : q.weeks, o.minWeek || 1, o.maxWeek || 520),
    startWeightKg: num(q.startWeightKg, 30, 330), endWeightKg: num(q.endWeightKg, 30, 330), startBf: num(q.startBf, 3, 70), endBf: num(q.endBf, 3, 70),
    fatChangeKg: num(q.fatChangeKg, -150, o.maxFatGain || 80), leanChangeKg: num(q.leanChangeKg, -40, o.maxLeanGain || 25),
    // ---- optional (v7.6.19) ----
    age: optNum(q.age, 18, 90), heightCm: optNum(q.heightCm, 120, 230),
    bfSource: optEnum(q.bfSource, ["measured", "estimated"]),
    kcalDelta: optNum(q.kcalDelta, -2500, 2500),            // average daily intake minus maintenance over the period
    steps: optNum(q.steps, 0, 40000),
    train: optEnum(q.train, TRAIN),                          // none = no lifting, broad = whole-body program, targeted = specific groups only
    liftDays: optNum(q.liftDays, 0, 14),
    trained: enumList(q.trained, MUSCLE_KEYS, MUSCLE_KEYS.length),
    spill: enumList(q.spill, MUSCLE_KEYS, MUSCLE_KEYS.length),
    localGrowth: optNum(q.localGrowth, 0, 1),                // expected relative growth of the trained muscles (0.05 = 5%)
    muscleGrowth: growthMap(q.muscleGrowth),                 // v7.6.34: per-group relative size gain from training (0.05 = 5%), computed by the app's engine
    ffmi: optNum(q.ffmi, 8, 40),
    phenotype: optEnum(q.phenotype, PHENO),
    fatFirst: enumList(q.fatFirst, FAT_REGIONS, FAT_REGIONS.length),
    depotsMeasured: q.depotsMeasured === true,
    vatStartKg: optNum(q.vatStartKg, 0, 60), vatEndKg: optNum(q.vatEndKg, 0, 60), subqStartKg: optNum(q.subqStartKg, 0, 250), subqEndKg: optNum(q.subqEndKg, 0, 250),
  };
  if (p.train === "targeted" && !p.trained.length) p.train = "broad";
  if (p.train !== "targeted") { p.trained = []; p.spill = []; }
  return p;
}

/** "No image if nothing real changes": body composition barely moves, or the calories are at maintenance and nothing else moved. */
function gate(p) {
  const dBf = Math.abs(p.endBf - p.startBf);
  if (dBf < 0.8 && Math.abs(p.leanChangeKg) < 0.8) return { code: "no_change", message: "This plan doesn't change your body enough at this point to illustrate." };
  if (p.kcalDelta != null && Math.abs(p.kcalDelta) < 100 && !(p.train && p.train !== "none" && p.leanChangeKg >= 0.8) && Math.abs(p.fatChangeKg) < 1.5)
    return { code: "no_change", message: "Your calories are at maintenance and training doesn't change your body enough to illustrate." };
  return null;
}

const lb = (kg) => Math.abs(kg) * 2.2046;
const ftIn = (cm) => { const t = Math.round(cm / 2.54); return `${Math.floor(t / 12)} ft ${t % 12} in`; };
const r5 = (n, s) => Math.round(n / s) * s;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const list = (a) => a.length <= 1 ? a.join("") : a.slice(0, -1).join(", ") + " and " + a[a.length - 1];

function fatWords(p) {
  const startFat = p.startWeightKg * p.startBf / 100, rel = Math.abs(p.fatChangeKg) / Math.max(3, startFat);
  if (Math.abs(p.fatChangeKg) < 0.3) return "about the same body fat";
  const m = rel < 0.06 ? "slightly" : rel < 0.15 ? "moderately" : rel < 0.3 ? "clearly" : "much";
  return p.fatChangeKg < 0 ? `${m} less body fat` : `${m} more body fat`;
}
function leanWords(p) {
  const startLean = p.startWeightKg * (1 - p.startBf / 100), rel = Math.abs(p.leanChangeKg) / Math.max(20, startLean);
  if (Math.abs(p.leanChangeKg) < 0.3) return "about the same muscle";
  const m = rel < 0.015 ? "slightly" : rel < 0.04 ? "moderately" : "clearly";
  return p.leanChangeKg > 0 ? `${m} more muscle` : `${m} less muscle`;
}
function muscleLevel(p) {
  if (p.ffmi == null) return null; const f = p.ffmi + (p.sex === "f" ? 3 : 0);
  return f < 17 ? "a lighter, lower-muscle build" : f < 20 ? "an average amount of muscle" : f < 22.5 ? "an above-average, muscular build" : "a very muscular build";
}
/** v7.6.34: concrete look of a body-fat percentage (adult, healthy build). Descriptions of the TARGET look; sex-specific. */
function bfLook(sex, bf) {
  const M = [[8, "very lean: clearly visible abs with deep separation, striated shoulders, visible vascularity on the arms, a sharply narrow waist, defined jaw and neck, hollower cheeks"],
    [10.5, "about 10% body fat, clearly lean: a flat, tight stomach with visible upper and lower abs and no fat roll or pinch over the lower belly, NO love handles (the sides of the waist are flat and the waist is visibly narrower than the ribcage and chest), separated chest and shoulders, visible muscle lines in the shoulders and arms, a defined jaw, leaner cheeks and neck, some vein visibility on the forearms"],
    [12.5, "lean and athletic: visible abs, separated chest and shoulders, a clearly narrower waist, a defined jaw and a leaner face and neck, little to no fat over the lower belly, some vein visibility on the forearms"],
    [15, "fit: faint abs outline in good light, visible shoulder and arm shape, a flatter stomach with a slight softness lower down, a trim waist, a slightly leaner face"],
    [20, "average to slightly soft: no visible abs, a soft rounded stomach and waist, muscles visible in shape but not separated, a fuller face and neck"],
    [26, "soft: a rounded belly that hangs slightly over the waistband, fuller chest, arms and face, no muscle separation"],
    [200, "high body fat: a large rounded belly, a thick waist, fuller arms, chest, face and neck, no muscle definition"]];
  const F = [[16, "very lean and athletic: visible abdominal outline, defined shoulders and arms, a clearly narrow waist, little fat at the hips and thighs, a defined jawline"],
    [19, "equivalent to about 10% on a man, clearly lean: a flat toned stomach with a visible abdominal outline and no softness below the navel, a clearly narrow waist with a visible waist-to-hip curve and no side roll, defined shoulders and arms, lean (not bulky) thighs, a defined jawline and lean face; keep natural feminine proportions at the hips and chest"],
    [21, "lean and fit: a flat toned stomach, defined shoulders and arms, a narrow waist, toned (not bulky) thighs, a lean face"],
    [26, "fit: a flat to softly rounded stomach, visible arm and shoulder shape, a slim waist, smooth rounded hips and thighs"],
    [32, "average: a softly rounded stomach, fuller hips and thighs, soft arms, no visible muscle separation"],
    [38, "soft: a rounded belly, fuller hips, thighs and arms, a softer jaw and face"],
    [200, "high body fat: a large rounded belly, wide hips and thighs, fuller arms, face and neck, no muscle definition"]];
  for (const [mx, txt] of (sex === "f" ? F : M)) if (bf < mx) return txt; return "";
}
function visibilityWords(p) {
  const dBf = p.startBf - p.endBf; if (dBf < 1.5) return null;
  const amt = dBf < 4 ? "slightly" : dBf < 8 ? "noticeably" : "much";
  const parts = [`As body fat drops, the muscle the person ALREADY has becomes ${amt} more visible: more skin-level definition, separation between muscles and (at lean levels) vascularity. This is visibility from less fat on top of the muscle, NOT new muscle size.`];
  const regs = ["the shoulders and arms", "the chest", "the abs and waist"]; if (p.endBf < (p.sex === "f" ? 24 : 15)) regs.push("the back and legs");
  parts.push(`Greater visibility applies by area as fat comes off: ${list(regs)}, including muscle groups that were not trained. Visibility changes how defined a muscle looks, never how big it is.`);
  return parts.join(" ");
}
function grownGroups(p) {
  const cap = Math.min(0.4, 0.008 * p.week), g = {}; for (const k of Object.keys(p.muscleGrowth || {})) g[k] = Math.min(p.muscleGrowth[k], cap);
  return { g, ks: MUSCLE_KEYS.filter((k) => g[k] >= 0.005 && (p.train === "targeted" ? p.trained.includes(k) || g[k] >= 0.02 : true)) };
}
function sizeWords(p) {
  const cap = Math.min(0.4, 0.008 * p.week), g = {}; for (const k of Object.keys(p.muscleGrowth || {})) g[k] = Math.min(p.muscleGrowth[k], cap);   // realism cap: about 0.8% per week of local size at most (about 10% in 12 weeks)
  const ks = MUSCLE_KEYS.filter((k) => g[k] >= 0.005 && (p.train === "targeted" ? p.trained.includes(k) || g[k] >= 0.02 : true));
  if (!ks.length) return null;
  return `ACTUAL MUSCLE SIZE CHANGE from training (modeled; keep it realistic and modest): ${ks.map((k) => `${MUSCLE_WORD[k]} ${growthWord(g[k])} bigger and fuller (about ${Math.round(g[k] * 100)}% more size)`).join("; ")}. ${p.train === "targeted" ? "Every muscle group not listed keeps exactly its current SIZE (it may still look more defined from lower body fat)." : "Groups not listed keep their current size."} Do not exaggerate: a gain of about 5 to 10 percent in arm size is clearly visible but is not a bodybuilder look.`;
}
function growthWord(g) { return g < 0.01 ? "barely perceptibly" : g < 0.03 ? "slightly" : g < 0.07 ? "moderately" : "clearly"; }
const depotChange = (a, b) => { if (a == null || b == null || a <= 0) return null; const r = (b - a) / a; return Math.abs(r) < 0.03 ? "about the same" : r < 0 ? (r > -0.12 ? "slightly lower" : r > -0.3 ? "moderately lower" : "much lower") : (r < 0.12 ? "slightly higher" : "moderately higher"); };

/** The one shared template. Sections left out when their data is absent, so old payloads still work. */
function build(p, opt) {
  const soft = !!(opt && opt.soft);
  p = sanitize(p);   // idempotent: callers may pass raw or already-validated fields
  const sex = p.sex === "f" ? "woman" : "man", W = p.week, L = [], dW = p.endWeightKg - p.startWeightKg;
  const wk = Math.abs(W - Math.round(W)) < 0.05 ? String(Math.round(W)) : String(+W.toFixed(1));
  // v7.6.21: framed around BODY-FAT PERCENTAGE and muscle level (what works when asked directly in Gemini), with no weights, no weight-change or weight-loss wording and no calorie talk.
  L.push(soft
    ? `TASK: Using the attached fully clothed fitness progress photo of an adult ${sex}, create a realistic health-education illustration of the same person at about ${p.endBf}% body fat (the photo shows about ${p.startBf}%), after ${wk} weeks of consistent nutrition and training. This is a wholesome, non-sexual, modest illustration of a modeled estimate, not a measurement or a guarantee.`
    : `TASK: Edit the attached photo of an adult ${sex} to show the same person at about ${p.endBf}% body fat (the photo shows about ${p.startBf}%), after ${wk} weeks of consistent nutrition and training. This is an illustration of a modeled estimate, not a measurement or a guarantee.`);
  // ---- starting point ----
  let s = `STARTING POINT (what the photo shows): ${sex}`;
  if (p.age != null) s += `, about ${r5(p.age, 5)} years old`; if (p.heightCm != null) s += `, ${ftIn(p.heightCm)}`;
  s += `, about ${p.startBf}% body fat`; if (p.bfSource) s += ` (${p.bfSource === "measured" ? "measured" : "estimated"})`;
  const ml = muscleLevel(p); if (ml) s += `, ${ml}`;
  L.push(s + ".");
  // ---- what they did ----
  const did = [];
  if (p.train === "targeted") {
    const tr = p.trained.map((k) => MUSCLE_WORD[k]);
    did.push(`Resistance training ONLY for the ${list(tr)}${p.liftDays ? ` (about ${p.liftDays} days a week)` : ""}. No other muscle group is trained directly.`);
    const sp = p.spill.filter((k) => !p.trained.includes(k)).map((k) => MUSCLE_WORD[k]);
    if (sp.length) did.push(`The ${list(sp)} get only a small indirect stimulus from those lifts.`);
  } else if (p.train === "broad") did.push(`Whole-body resistance training${p.liftDays ? ` (about ${p.liftDays} sessions a week)` : ""} covering all the major muscle groups, in a generic balanced program, with nothing emphasised.`);
  else if (p.train === "none") did.push("No resistance training.");
  if (did.length) L.push(`TRAINING over ${wk} weeks: ${did.join(". ").replace(/\.\./g, ".")}${/[.]$/.test(did[did.length - 1]) ? "" : "."}`);
  // ---- modeled result ----
  L.push(`TARGET LOOK at week ${wk}: about ${p.endBf}% body fat (from ${p.startBf}%); ${leanWords(p)}.`);
  { const look = bfLook(p.sex, p.endBf); if (look) L.push(`WHAT ${p.endBf}% BODY FAT LOOKS LIKE on ${p.sex === "f" ? "a woman" : "a man"}: ${look}. Render this level of leanness on this person's own frame; keep the same bone structure and height.`);
    if (p.endBf != null && p.endBf <= (p.sex === "f" ? 20 : 12) && p.startBf - p.endBf >= 4) L.push(`COMMIT TO THE TARGET: image models tend to stop partway, and a result that still looks like ${p.sex === "f" ? "22-24%" : "14-15%"} body fat is wrong. At ${p.endBf}% the lower belly and the sides of the waist (love handles) must be fully lean, with no soft roll or pinch, and the waist must read clearly narrower than the start. Show the change by body area: face and neck first, then waist and lower belly, then chest and shoulders. Fat is lost from the person's own frame only; do not alter bone structure, height or identity.`);
    const sz = sizeWords(p); if (sz) L.push(sz); const vis = visibilityWords(p); if (vis) L.push(`MUSCLE VISIBILITY (separate from size): ${vis}`); }
  // ---- where it shows ----
  const lose = p.fatChangeKg < -0.3, gain = p.fatChangeKg > 0.3, w = [];
  if (p.train === "targeted") {
    const gk = grownGroups(p).ks, tr = list((gk.length ? gk : p.trained).map((k) => MUSCLE_WORD[k]));
    if (p.leanChangeKg >= 0.3) w.push(`New muscle size appears ONLY in the ${tr}${p.localGrowth != null && !gk.length ? `, which look ${growthWord(p.localGrowth)} bigger and fuller` : ", each by the amount listed above"}. Every other muscle keeps exactly its current size (it may look more defined from lower body fat).`);
    else w.push(`No visible muscle change; the ${tr} look about the same.`);
  } else if (p.train === "broad") {
    if (p.leanChangeKg >= 0.3) w.push("Muscle changes are broad and even across the whole body: slightly fuller, more defined muscle everywhere in proportion, with no single area emphasised or sculpted.");
    if (lose) w.push("At the lower body-fat percentage the whole body looks subtly more defined, evenly, not in one spot.");
  } else {
    if (lose) w.push("There is no new muscle. The change is a subtle whole-body sharpening at the lower body-fat percentage while keeping the same muscle: a little more natural definition overall. It is not spot work on any one area.");
    else if (gain) w.push("There is no added muscle; the change is a higher body-fat percentage, spread evenly.");
  }
  if (lose || gain) {
    const order = p.fatFirst.map((k) => FAT_REGION_WORD[k]);
    const pat = p.phenotype === "visceral" ? "mostly in a firm, round belly (fat around the organs)" : p.phenotype === "subcutaneous" ? "mostly as pinchable fat under the skin, on the hips, thighs and arms" : p.phenotype === "mixed" ? "in a mix of belly and under-the-skin fat" : null;
    let f = `The body-fat change is a whole-body change`; if (pat) f += `; this person stores fat ${pat}`; if (order.length) f += `, so the change shows first in ${list(order)}`;
    w.push(f + ". Follow that pattern; do not sculpt any single region in isolation.");
  }
  const vd = depotChange(p.vatStartKg, p.vatEndKg), sd = depotChange(p.subqStartKg, p.subqEndKg);
  if (vd || sd) {
    const src = p.depotsMeasured ? "MEASURED (body-composition scale or scan), so treat them as more reliable than the model's estimates" : "model ESTIMATES, not measured, so keep the effect modest";
    let d = `Visceral and under-the-skin fat are ${src}.`;
    if (p.depotsMeasured && p.vatStartKg != null && p.subqStartKg != null) d += ` At the start: about ${Math.round(lb(p.vatStartKg) * 10) / 10} lb visceral and ${Math.round(lb(p.subqStartKg))} lb under the skin.`;
    if (vd) d += ` Visceral fat ends ${vd}; this shows as ${p.vatEndKg < p.vatStartKg ? "a softer, less firm and less round belly" : "a firmer, rounder belly"}.`;
    if (sd) d += ` Under-the-skin fat ends ${sd}.`;
    w.push(d);
  }
  if (w.length) L.push(`WHERE IT SHOWS: ${w.join(" ")}`);
  // ---- constraints ----
  L.push(p.train === "targeted"
    ? `CHANGE ONLY: the ${list(p.trained.map((k) => MUSCLE_WORD[k]))}${lose || gain ? ` and overall body fat as described above` : ""}. Everything else must be untouched: all other muscles, bone structure, proportions, height.`
    : "CHANGE ONLY: body shape (overall fat level and muscle definition), in proportion to the numbers above. Do not change bone structure, proportions or height.");
  L.push("Keep EXACTLY the same person: same face and identity, expression, skin tone and all facial and ethnic features, hair, tattoos, clothing, pose, camera angle, lighting, background and image framing, so a row of these images looks like the same photo at different times.");
  if (soft) L.push("Keep the clothing exactly as in the photo and keep the image modest and non-sexual: do not remove, loosen or add any clothing, and do not emphasise or sculpt any body part. Subtle, realistic fitness progress change only.");
  L.push("Be realistic: small changes in the numbers give small visual changes, and large changes in the numbers must be fully visible, matching the stated body-fat level without falling short or overshooting. Do not exaggerate muscularity beyond the numbers, do not beautify, do not add or remove clothing, do not change age. Photorealistic. No text, labels or watermark.");
  return L.join("\n");
}

module.exports = { sanitize, gate, build, MUSCLE_KEYS, FAT_REGIONS, TRAIN, PHENO };
