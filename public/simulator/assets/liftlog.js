/* v7.6.8x Lifting log (Pro preview, Advanced only). Device-only storage (localStorage), no uploads.
   When it has entries and "Use my log" is on, the last 1-4 weeks of logged sets replace the manual Custom lifting guesses
   (sessions a week, hard sets per muscle, per-muscle emphasis) through BodyPlanApp's modeMove() hook.
   The app's growth rules are untouched: muscle grows only with lifting, a deficit gives small recomp gains, extra surplus goes to fat. */
(function () {
  "use strict";
  // ONE flag gates the whole feature. There is no account/payment system yet: true = everyone in Advanced sees it as a "Pro preview".
  // Later: replace with a real entitlement check (e.g. PRO_PREVIEW = user.isPro).
  const PRO_PREVIEW = true;
  const KEY = "theosis-liftlog-v1", VER = 1, WIN_DAYS = 28;
  const MUS = [["chest", "Chest"], ["back", "Back"], ["shoulders", "Shoulders"], ["biceps", "Biceps"], ["triceps", "Triceps"], ["forearms", "Forearms"],
    ["quads", "Quads"], ["hamstrings", "Hamstrings"], ["glutes", "Glutes"], ["calves", "Calves"], ["core", "Core"]];
  const MK = MUS.map((m) => m[0]), MLAB = Object.fromEntries(MUS);
  /* Exercise -> muscle mapping. CONVENTION (a common coaching convention, not a published table):
     each set counts as 1 full hard set for its PRIMARY muscles and 0.5 for its SECONDARY muscles.
     Uses the simulator's 11 muscle areas (same keys as e.groupW). */
  const EX = [
    ["squat", "Squat", ["quads", "glutes"], ["hamstrings", "core"]],
    ["deadlift", "Deadlift", ["hamstrings", "glutes", "back"], ["quads", "forearms", "core"]],
    ["bench", "Bench press", ["chest"], ["triceps", "shoulders"]],
    ["incline", "Incline press", ["chest", "shoulders"], ["triceps"]],
    ["ohp", "Overhead press", ["shoulders"], ["triceps", "core"]],
    ["row", "Row", ["back"], ["biceps", "forearms"]],
    ["pullup", "Pull-up / lat pulldown", ["back"], ["biceps", "forearms"]],
    ["rdl", "Romanian deadlift (RDL)", ["hamstrings", "glutes"], ["back", "forearms"]],
    ["lunge", "Lunge / split squat", ["quads", "glutes"], ["hamstrings"]],
    ["legpress", "Leg press", ["quads", "glutes"], []],
    ["hipthrust", "Hip thrust", ["glutes"], ["hamstrings"]],
    ["legcurl", "Leg curl", ["hamstrings"], []],
    ["legext", "Leg extension", ["quads"], []],
    ["dip", "Dip", ["chest", "triceps"], ["shoulders"]],
    ["pushup", "Push-up", ["chest"], ["triceps", "shoulders", "core"]],
    ["curl", "Biceps curl", ["biceps"], ["forearms"]],
    ["triceps", "Triceps extension / pushdown", ["triceps"], []],
    ["lateral", "Lateral raise", ["shoulders"], []],
    ["calf", "Calf raise", ["calves"], []],
    ["plank", "Plank / ab work", ["core"], []],
  ].map(([id, name, pri, sec]) => ({ id, name, pri, sec }));
  const EXI = Object.fromEntries(EX.map((e) => [e.id, e]));

  const $ = (s, r) => (r || document).querySelector(s), esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const uid = () => Math.random().toString(36).slice(2, 9);
  const pad = (n) => String(n).padStart(2, "0"), dstr = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const today = () => window.__LL_TODAY || dstr(new Date());
  const dnum = (s) => { const [y, m, d] = s.split("-").map(Number); return Math.round(Date.UTC(y, m - 1, d) / 864e5); };
  const nice = (s) => { const [y, m, d] = s.split("-").map(Number); return new Date(y, m - 1, d).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }); };
  const num = (v) => { if (v === "" || v == null) return null; const n = +String(v).replace(",", "."); return isFinite(n) ? n : null; };

  // ---------- storage ----------
  const blank = () => ({ v: VER, on: true, scale: "rir", sessions: [] });
  function clean(o) {
    const L = blank(); if (!o || typeof o !== "object") return L;
    L.on = o.on !== false; L.scale = o.scale === "rpe" ? "rpe" : "rir";
    L.sessions = (Array.isArray(o.sessions) ? o.sessions : []).filter((s) => s && /^\d{4}-\d\d-\d\d$/.test(s.date)).map((s) => ({ id: s.id || uid(), date: s.date,
      ex: (Array.isArray(s.ex) ? s.ex : []).map((e) => ({ id: e.id || uid(), key: EXI[e.key] ? e.key : null, name: String(e.name || (EXI[e.key] || {}).name || "Exercise").slice(0, 60),
        pri: (e.pri || []).filter((k) => MK.includes(k)), sec: (e.sec || []).filter((k) => MK.includes(k)),
        sets: (Array.isArray(e.sets) ? e.sets : []).slice(0, 30).map((x) => ({ reps: num(x.reps), w: num(x.w), unit: x.unit === "kg" ? "kg" : "lb", rir: num(x.rir), rpe: num(x.rpe) })) })) }));
    return L;
  }
  let LOG = (() => { try { return clean(JSON.parse(localStorage.getItem(KEY) || "null")); } catch (e) { return blank(); } })();
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(LOG)); } catch (e) { /* storage full or blocked */ } };
  const exMus = (e) => { const d = e.key && EXI[e.key]; return d ? { pri: d.pri, sec: d.sec } : { pri: e.pri, sec: e.sec }; };

  // ---------- math ----------
  /** reps in reserve for a set: typed RIR, else 10 - RPE, else null (blank) */
  const setRir = (x) => x.rir != null ? x.rir : x.rpe != null ? Math.max(0, 10 - x.rpe) : null;
  /** sets per muscle for a list of sessions. A set counts as HARD if reps > 0 and reps-in-reserve <= 4.
      ASSUMPTION: a set with RIR/RPE left blank is counted as hard (flagged in `blank`). */
  function setsPerMuscle(sessions) {
    const s = Object.fromEntries(MK.map((k) => [k, 0])); let hard = 0, blankN = 0, rirSum = 0, rirN = 0;
    for (const ss of sessions) for (const e of ss.ex) { const m = exMus(e);
      for (const x of e.sets) { if (!(x.reps > 0)) continue; const r = setRir(x); if (r != null && r > 4) continue;
        hard++; if (r == null) blankN++; else { rirSum += r; rirN++; }
        const q = x.reps <= 5 ? 0.75 : 1;   // v7.6.84 (Nick 10/23): a hard set of 1-5 reps counts as 0.75 of a set for growth
        for (const k of m.pri) s[k] += q; for (const k of m.sec) if (!m.pri.includes(k)) s[k] += 0.5 * q; } }
    return { sets: s, hard, blank: blankN, rir: rirN ? rirSum / rirN : null };
  }
  /** the log's training picture from the last 4 weeks (or less if the log is newer): null if nothing usable */
  function derive(L) {
    L = L || LOG; const t = dnum(today());
    const win = L.sessions.filter((s) => { const d = t - dnum(s.date); return d >= 0 && d < WIN_DAYS && s.ex.some((e) => e.sets.some((x) => x.reps > 0)); });
    if (!win.length) return null;
    const first = Math.min(...win.map((s) => dnum(s.date))), weeks = Math.max(1, Math.min(4, Math.ceil((t - first + 1) / 7)));
    const c = setsPerMuscle(win), wk = {}; let mx = 0, tot = 0, n = 0;
    for (const k of MK) { wk[k] = c.sets[k] / weeks; mx = Math.max(mx, wk[k]); if (wk[k] > 0) { tot += wk[k]; n++; } }
    if (mx <= 0) return null;
    const days = new Set(win.map((s) => s.date)).size, freq = days / weeks, avgSets = tot / n;
    const groupW = {}; for (const k of MK) groupW[k] = wk[k] / mx >= 0.1 ? +(wk[k] / mx).toFixed(3) : 0;   // emphasis relative to the most-trained muscle
    const rir = c.rir == null ? "2-3" : c.rir <= 1.5 ? "0-1" : c.rir < 4 ? "2-3" : "4+";
    const setsPerSession = c.hard / days;
    return { weeks, sessions: days, freq, sets: wk, avgSets, groupW, rir, blankSets: c.blank, hardSets: c.hard, min: Math.max(15, Math.min(120, Math.round(setsPerSession * 3))) };
  }
  // same dose-response the app uses for "hard sets per muscle a week" (10 sets = 1.0, diminishing returns)
  const fSets = (s) => Math.max(0.5, Math.min(1.15, s <= 0 ? 0.5 : s < 10 ? 1 + 0.25 * Math.log2(s / 10) : 1 + 0.1 * Math.log2(s / 10)));
  /** hook called by the app's modeMove() in Advanced: returns the move with the log's lifting in place of manual Custom rows */
  function apply(move) {   // v7.6.83: setsW (weekly hard sets per muscle, from logged reps + reps left) drives per-muscle growth in muscleRegions(); weight lifted is kept for your records but does not size growth (hard sets matter more than load, Schoenfeld 2017)
    if (!PRO_PREVIEW || !LOG.on || !move || move.noLift || move.plannerOn || move.preset !== "custom") return move;
    const d = derive(); if (!d) return move;
    const effort = d.rir === "0-1" ? "hard" : d.rir === "4+" ? "easy" : "moderate";
    return { ...move, lifts: [{ type: "hypertrophy", effort, min: d.min, days: +d.freq.toFixed(2), groupW: d.groupW, setsW: d.sets, xMul: fSets(d.avgSets), fromLog: true }],
      adv: { ...(move.adv || {}), sets: Math.round(d.avgSets), rir: d.rir } };
  }
  const S = () => window.BodyPlanApp && window.BodyPlanApp.state;
  const adv = () => { const s = S(); return !!(s && s.ui && s.ui.mode === "advanced"); };
  const active = () => { const s = S(); return PRO_PREVIEW && adv() && LOG.on && s && s.move.preset === "custom" && !s.move.plannerOn && !s.move.noLift && !!derive(); };
  const unit = () => { const s = S(); return s && s.units === "metric" ? "kg" : "lb"; };
  const wkLabel = (n) => n === 1 ? "last week" : `last ${n} weeks`;

  // ---------- UI ----------
  const ui = { date: null, q: "", custom: null, open: false };
  const css = `
#liftlog{margin-top:1rem;padding:1rem;border-radius:14px;background:rgba(14,20,28,.92);box-shadow:0 0 0 1px rgba(91,156,236,.45),0 0 16px rgba(59,130,246,.12)}
#liftlog h3{margin:0;font-size:1.15rem;display:flex;align-items:center;gap:.4rem;flex-wrap:wrap}
.ll-pro{display:inline-block;padding:.12rem .5rem;border-radius:999px;font-size:.7rem;font-weight:700;letter-spacing:.06em;background:linear-gradient(90deg,#2a7ae0,#5c9cf0);color:#fff}
.ll-prev{font-size:.72rem;color:var(--accent-ink,#5c9cf0);box-shadow:0 0 0 1px currentColor;border-radius:999px;padding:.08rem .45rem;font-weight:600}
#liftlog .ll-sub{color:var(--muted,#8e9aab);margin:.35rem 0 .8rem;font-size:.95rem}
#liftlog button{font:inherit;cursor:pointer}
.ll-btn{min-height:2.9rem;padding:0 1rem;border-radius:10px;border:0;background:rgba(42,122,224,.16);color:var(--fg,#e7edf5);box-shadow:0 0 0 1px rgba(91,156,236,.55);font-weight:600;font-size:.98rem}
.ll-btn.pri{background:#2a7ae0;color:#fff;box-shadow:none}.ll-btn.dng{background:transparent;color:#e88;box-shadow:0 0 0 1px rgba(224,112,112,.5)}
.ll-btn.sm{min-height:2.6rem;padding:0 .8rem;font-size:.9rem}
.ll-row{display:flex;gap:.6rem;flex-wrap:wrap;align-items:center;margin:.6rem 0}
.ll-tog{display:flex;align-items:center;gap:.7rem;padding:.7rem .8rem;border-radius:10px;background:rgba(42,122,224,.08);margin:.4rem 0 .8rem;cursor:pointer;min-height:3rem}
.ll-tog input{width:1.5rem;height:1.5rem;accent-color:#3b82f6;flex:none}
#liftlog input[type=date],#liftlog input[type=search],#liftlog input[type=text],#liftlog select{font:inherit;font-size:1rem;min-height:2.9rem;padding:0 .7rem;border-radius:10px;border:0;background:var(--field,#080d14);color:var(--fg,#e7edf5);box-shadow:0 0 0 1px var(--border-strong,rgba(231,237,245,.22));color-scheme:dark}
#liftlog input[type=search]{width:100%}
.ll-res{display:grid;grid-template-columns:repeat(auto-fill,minmax(10.5rem,1fr));gap:.5rem;margin:.6rem 0}
.ll-res button{min-height:3rem;text-align:left;padding:.4rem .7rem;border-radius:10px;border:0;background:rgba(255,255,255,.04);color:var(--fg,#e7edf5);box-shadow:0 0 0 1px var(--border,rgba(231,237,245,.12))}
.ll-res button small{display:block;color:var(--muted,#8e9aab);font-size:.78rem}
.ll-ex{margin:.8rem 0;padding:.8rem;border-radius:12px;background:rgba(255,255,255,.03);box-shadow:0 0 0 1px var(--border,rgba(231,237,245,.12))}
.ll-exh{display:flex;justify-content:space-between;align-items:flex-start;gap:.5rem}.ll-exh b{font-size:1.05rem}
.ll-exh small{display:block;color:var(--muted,#8e9aab);font-size:.82rem;margin-top:.15rem}
.ll-x{min-width:2.75rem;min-height:2.75rem;border-radius:10px;border:0;background:transparent;color:var(--muted,#8e9aab);font-size:1.2rem}
.ll-sets{display:grid;grid-template-columns:2rem 1fr 1fr 1fr 2.75rem;gap:.4rem;align-items:center;margin-top:.6rem}
.ll-sets .h{font-size:.78rem;color:var(--muted,#8e9aab)}
.ll-sets input{width:100%;min-width:0;font:inherit;font-size:1.05rem;min-height:2.9rem;text-align:center;border-radius:10px;border:0;background:var(--field,#080d14);color:var(--fg,#e7edf5);box-shadow:0 0 0 1px var(--border-strong,rgba(231,237,245,.22))}
.ll-sets .n{color:var(--muted,#8e9aab);text-align:center}
.ll-note{padding:.7rem .8rem;border-radius:10px;background:rgba(42,122,224,.12);box-shadow:0 0 0 1px rgba(91,156,236,.4);margin:.6rem 0;font-size:.95rem}
.ll-h4{margin:1.2rem 0 .3rem;font-size:1rem}
.ll-day{display:flex;justify-content:space-between;align-items:center;gap:.5rem;padding:.55rem 0;border-bottom:1px solid var(--hairline,rgba(231,237,245,.1))}
.ll-day small{display:block;color:var(--muted,#8e9aab)}
.ll-wk{display:grid;grid-template-columns:6.2rem 1fr 3.4rem;gap:.35rem .6rem;align-items:center;font-size:.92rem}
.ll-wk .t{height:.6rem;border-radius:99px;background:rgba(255,255,255,.06);overflow:hidden}.ll-wk .t i{display:block;height:100%;background:linear-gradient(90deg,#1d5fb8,#5c9cf0);border-radius:99px}
.ll-wk .v{text-align:right;color:var(--muted,#8e9aab)}
.ll-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin:.5rem 0}
.ll-chips button{min-height:2.6rem;padding:0 .8rem;border-radius:999px;border:0;background:transparent;color:var(--muted,#8e9aab);box-shadow:0 0 0 1px var(--border-strong,rgba(231,237,245,.22))}
.ll-chips button[data-lv="2"]{background:#2a7ae0;color:#fff;box-shadow:none}.ll-chips button[data-lv="1"]{background:rgba(42,122,224,.3);color:#fff;box-shadow:none}
.ll-more{margin-top:1rem}.ll-more summary{cursor:pointer;min-height:2.6rem;display:flex;align-items:center;color:var(--accent-ink,#5c9cf0)}
#ll-proj-note[hidden]{display:none!important}
#lift-list.ll-off{opacity:.45;pointer-events:none}
.ll-proj{display:flex;gap:.7rem;align-items:center}.ll-proj b{color:#cfe0ff}
@media (max-width:480px){#liftlog{padding:.8rem}.ll-row>.ll-btn{flex:1 1 auto}.ll-res{grid-template-columns:1fr 1fr}}`;
  function injectCss() { if (document.getElementById("ll-css")) return; const s = document.createElement("style"); s.id = "ll-css"; s.textContent = css; document.head.appendChild(s); }

  const sessFor = (d) => LOG.sessions.find((s) => s.date === d);
  const sortedPast = () => LOG.sessions.filter((s) => s.ex.length).sort((a, b) => (a.date < b.date ? 1 : -1));
  const musLine = (e) => { const m = exMus(e); return [m.pri.map((k) => MLAB[k]).join(", "), m.sec.length ? `helps: ${m.sec.map((k) => MLAB[k]).join(", ")}` : ""].filter(Boolean).join(" · "); };
  const sumTxt = (s) => { const n = s.ex.reduce((a, e) => a + e.sets.filter((x) => x.reps > 0).length, 0); return `${s.ex.length} exercise${s.ex.length === 1 ? "" : "s"} · ${n} set${n === 1 ? "" : "s"}`; };

  function html() {
    const d = ui.date || (ui.date = today()), s = sessFor(d), u = unit(), D = derive(), sc = LOG.scale, prev = sortedPast().filter((x) => x.date !== d);
    const q = ui.q.trim().toLowerCase(), res = q ? EX.filter((e) => e.name.toLowerCase().includes(q) || musLine(e).toLowerCase().includes(q)) : [];
    let h = `<h3>Lifting log <span class="ll-pro">PRO</span> <span class="ll-prev">Pro preview</span></h3>
<p class="ll-sub">Write down what you lift each day. Your real sets then shape the projection instead of a guess. Saved only on this device.</p>
<div id="ll-top"><label class="ll-tog"><input type="checkbox" id="ll-on" ${LOG.on ? "checked" : ""}><span><b>Use my log for the projection</b><br><small style="color:var(--muted)">${D ? `Using your lifting log from the ${wkLabel(D.weeks)}: about ${D.freq.toFixed(1)} days a week.` : "This starts working once you log a workout."}</small></span></label>
${active() ? `<p class="ll-note">Your log is driving the projection. The lifting rows above are paused while this is on.</p>` : ""}</div>
<div class="ll-row"><label style="display:flex;flex-direction:column;gap:.25rem"><span class="ll-sub" style="margin:0">Workout day</span><input type="date" id="ll-date" value="${d}" max="${today()}"></label></div>
<div class="ll-row">${prev.length ? `<button type="button" class="ll-btn sm" id="ll-copy">Copy last session</button>
<select id="ll-repeat" aria-label="Repeat a past workout"><option value="">Repeat a workout…</option>${prev.slice(0, 20).map((p) => `<option value="${p.id}">${esc(nice(p.date))} · ${esc(p.ex.map((e) => e.name).join(", ").slice(0, 40))}</option>`).join("")}</select>` : ""}</div>`;
    if (s && s.ex.length) h += s.ex.map((e, i) => `<div class="ll-ex" data-ei="${i}"><div class="ll-exh"><div><b>${esc(e.name)}</b><small>${esc(musLine(e))}</small></div><button type="button" class="ll-x" data-delex="${i}" aria-label="Remove ${esc(e.name)}">✕</button></div>
<div class="ll-sets"><span class="h">Set</span><span class="h">Reps</span><span class="h">Weight (${u})</span><span class="h">${sc === "rpe" ? "RPE (opt.)" : "Reps left (opt.)"}</span><span></span>
${e.sets.map((x, j) => `<span class="n">${j + 1}</span><input inputmode="numeric" data-s="${i}.${j}.reps" value="${x.reps ?? ""}" aria-label="Set ${j + 1} reps"><input inputmode="decimal" data-s="${i}.${j}.w" value="${x.w ?? ""}" aria-label="Set ${j + 1} weight"><input inputmode="decimal" data-s="${i}.${j}.${sc}" value="${x[sc] ?? ""}" aria-label="Set ${j + 1} ${sc === "rpe" ? "RPE" : "reps left"}"><button type="button" class="ll-x" data-delset="${i}.${j}" aria-label="Remove set ${j + 1}">✕</button>`).join("")}</div>
<div class="ll-row"><button type="button" class="ll-btn sm" data-addset="${i}">+ Add a set</button></div></div>`).join("");
    else h += `<p class="ll-sub">Nothing logged for ${esc(nice(d))} yet. Add your first exercise below.</p>`;
    h += `<div class="ll-row" style="display:block"><input type="search" id="ll-q" placeholder="Add an exercise: type squat, bench, curl…" value="${esc(ui.q)}" aria-label="Search exercises" autocomplete="off"></div>
<div class="ll-res" id="ll-res">${(q ? res : EX.slice(0, 6)).map((e) => `<button type="button" data-add="${e.id}"><b>${esc(e.name)}</b><small>${esc(musLine(e))}</small></button>`).join("")}<button type="button" data-addcustom="1"><b>+ My own exercise</b><small>Name it and pick the muscles</small></button></div>`;
    if (ui.custom) h += `<div class="ll-ex"><b>Your own exercise</b><div class="ll-row" style="display:block"><input type="text" id="ll-cname" placeholder="Name, e.g. Cable fly" value="${esc(ui.custom.name)}" maxlength="60" style="width:100%"></div>
<p class="ll-sub" style="margin:.2rem 0">Tap a muscle once for <b>main</b>, twice for <b>helper</b>, again to clear.</p>
<div class="ll-chips">${MUS.map(([k, l]) => `<button type="button" data-cm="${k}" data-lv="${ui.custom.pri.includes(k) ? 2 : ui.custom.sec.includes(k) ? 1 : 0}">${l}${ui.custom.pri.includes(k) ? " · main" : ui.custom.sec.includes(k) ? " · helper" : ""}</button>`).join("")}</div>
<div class="ll-row"><button type="button" class="ll-btn pri" id="ll-csave">Add it</button><button type="button" class="ll-btn" id="ll-ccancel">Cancel</button></div></div>`;
    // weekly totals
    const t = dnum(today()), wkS = LOG.sessions.filter((x) => { const a = t - dnum(x.date); return a >= 0 && a < 7; }), w1 = setsPerMuscle(wkS);
    h += `<div id="ll-stats"><h4 class="ll-h4">Hard sets per muscle</h4><p class="ll-sub" style="margin:.1rem 0 .5rem">Last 7 days${D && D.weeks > 1 ? `, and the weekly average over the ${wkLabel(D.weeks)}` : ""}. Main muscle = 1 set, helper muscle = ½ set; a hard set of 1–5 reps counts as ¾.</p>`;
    const mx = Math.max(1, ...MK.map((k) => Math.max(w1.sets[k], D ? D.sets[k] : 0)));
    h += `<div class="ll-wk">${MK.map((k) => `<span>${MLAB[k]}</span><span class="t"><i style="width:${(100 * w1.sets[k] / mx).toFixed(1)}%"></i></span><span class="v" data-wk="${k}">${+w1.sets[k].toFixed(1)}${D && D.weeks > 1 ? ` <small>/ ${+D.sets[k].toFixed(1)}</small>` : ""}</span>`).join("")}</div>`;
    if (w1.blank) h += `<p class="ll-sub" style="margin-top:.5rem">${w1.blank} set${w1.blank === 1 ? "" : "s"} had no "reps left" filled in, so we counted ${w1.blank === 1 ? "it" : "them"} as hard sets. Sets with more than 4 reps left don't count as hard.</p>`;
    // history
    const past = sortedPast();
    h += `<h4 class="ll-h4">History</h4>${past.length ? past.slice(0, 30).map((p) => `<div class="ll-day"><div><b>${esc(nice(p.date))}</b><small>${esc(sumTxt(p))} · ${esc(p.ex.map((e) => e.name).join(", ").slice(0, 60))}</small></div><div style="display:flex;gap:.4rem"><button type="button" class="ll-btn sm" data-edit="${p.date}">Edit</button><button type="button" class="ll-btn sm dng" data-delday="${p.id}" aria-label="Delete ${esc(nice(p.date))}">Delete</button></div></div>`).join("") : `<p class="ll-sub">No workouts yet.</p>`}</div>`;
    h += `<details class="ll-more"><summary>Settings, backup and delete</summary>
<div class="ll-row"><span>Effort scale:</span><button type="button" class="ll-btn sm${sc === "rir" ? " pri" : ""}" data-scale="rir">Reps left</button><button type="button" class="ll-btn sm${sc === "rpe" ? " pri" : ""}" data-scale="rpe">RPE (1–10)</button></div>
<div class="ll-row"><button type="button" class="ll-btn sm" id="ll-export">Save a backup file</button><label class="ll-btn sm" style="display:inline-flex;align-items:center">Load a backup file<input type="file" id="ll-import" accept="application/json,.json" hidden></label><button type="button" class="ll-btn sm dng" id="ll-wipe">Delete my log</button></div>
<p class="ll-sub">Your log stays on this device only. Nothing is uploaded.</p></details>`;
    return h;
  }
  function render() {
    const box = document.getElementById("lift-box"); if (!box) return; injectCss();
    let el = document.getElementById("liftlog");
    if (!PRO_PREVIEW) { if (el) el.remove(); return; }
    if (!el) { el = document.createElement("div"); el.id = "liftlog"; el.className = "adv-only"; box.appendChild(el); bind(el); }
    // typing a set value only refreshes the totals: never rebuild the set rows under someone's thumb
    const s0 = sessFor(ui.date || today()), sig = JSON.stringify([ui.date, ui.q, ui.custom, LOG.on, LOG.scale, unit(), LOG.sessions.map((s) => [s.id, s.date, s.ex.map((e) => e.id + ":" + e.sets.length)]), s0 && s0.id]);
    if (sig === ui.sig && el.firstChild) { const tmp = document.createElement("div"); tmp.innerHTML = html();
      for (const id of ["ll-top", "ll-stats"]) { const a = el.querySelector("#" + id), b = tmp.querySelector("#" + id); if (a && b) a.replaceWith(b); }
    } else { ui.sig = sig;
    const ae = document.activeElement, keep = ae && el.contains(ae) && ae.id === "ll-q" ? ae.selectionStart : null;
    el.innerHTML = html();
    if (keep != null) { const q = document.getElementById("ll-q"); q.focus(); q.setSelectionRange(keep, keep); } }
    const ll = document.getElementById("lift-list"), on = active(); if (ll) ll.classList.toggle("ll-off", on);
    const la = document.getElementById("lift-add"); if (la) la.classList.toggle("ll-off", on);
  }
  function note() {
    const n = document.getElementById("ll-proj-note"); if (!n) return; const D = active() ? derive() : null; n.hidden = !D;
    if (D) n.innerHTML = `<div class="ll-proj"><span class="ll-pro">PRO</span><span><b>Using your lifting log from the ${wkLabel(D.weeks)}.</b> About ${D.freq.toFixed(1)} lifting days a week and ${Math.round(D.avgSets)} hard sets per trained muscle. Muscle gain still needs lifting; in a calorie deficit it stays small.</span></div>`;
  }
  const changed = (full) => { save(); if (full !== false) render(); if (window.BodyPlanApp && window.BodyPlanApp.update) window.BodyPlanApp.update(); };
  function addEx(def) {
    const d = ui.date; let s = sessFor(d); if (!s) { s = { id: uid(), date: d, ex: [] }; LOG.sessions.push(s); }
    const last = sortedPast().find((p) => p.ex.some((e) => (def.key ? e.key === def.key : e.name === def.name)));
    const lx = last && last.ex.find((e) => (def.key ? e.key === def.key : e.name === def.name));
    s.ex.push({ id: uid(), key: def.key || null, name: def.name, pri: def.pri || [], sec: def.sec || [], sets: lx ? lx.sets.map((x) => ({ ...x })) : [{ reps: null, w: null, unit: unit(), rir: null, rpe: null }] });
    ui.q = ""; changed();
  }
  const copyFrom = (src) => { if (!src) return; let s = sessFor(ui.date); if (!s) { s = { id: uid(), date: ui.date, ex: [] }; LOG.sessions.push(s); }
    s.ex.push(...src.ex.map((e) => ({ ...e, id: uid(), sets: e.sets.map((x) => ({ ...x })) }))); changed(); };
  function bind(el) {
    el.addEventListener("click", (ev) => {
      const t = ev.target.closest("button"); if (!t || !el.contains(t)) return; const ds = t.dataset, s = sessFor(ui.date);
      if (ds.add) { const e = EXI[ds.add]; return addEx({ key: e.id, name: e.name }); }
      if (ds.addcustom) { ui.custom = { name: ui.q.trim(), pri: [], sec: [] }; return render(); }
      if (ds.cm) { const c = ui.custom, k = ds.cm; if (c.pri.includes(k)) { c.pri = c.pri.filter((x) => x !== k); c.sec.push(k); } else if (c.sec.includes(k)) c.sec = c.sec.filter((x) => x !== k); else c.pri.push(k);
        const nm = document.getElementById("ll-cname"); if (nm) c.name = nm.value; return render(); }
      if (t.id === "ll-csave") { const c = ui.custom, nm = (document.getElementById("ll-cname").value || "").trim(); if (!nm || !c.pri.length) { alert("Give it a name and tap at least one main muscle."); return; } ui.custom = null; return addEx({ name: nm, pri: c.pri, sec: c.sec }); }
      if (t.id === "ll-ccancel") { ui.custom = null; return render(); }
      if (ds.addset && s) { const e = s.ex[+ds.addset], l = e.sets[e.sets.length - 1]; e.sets.push(l ? { ...l } : { reps: null, w: null, unit: unit(), rir: null, rpe: null }); return changed(); }
      if (ds.delset && s) { const [i, j] = ds.delset.split(".").map(Number); s.ex[i].sets.splice(j, 1); if (!s.ex[i].sets.length) s.ex.splice(i, 1); return changed(); }
      if (ds.delex && s) { s.ex.splice(+ds.delex, 1); return changed(); }
      if (ds.edit) { ui.date = ds.edit; render(); el.scrollIntoView({ block: "start", behavior: "smooth" }); return; }
      if (ds.delday) { const p = LOG.sessions.find((x) => x.id === ds.delday); if (p && confirm(`Delete the workout from ${nice(p.date)}?`)) { LOG.sessions = LOG.sessions.filter((x) => x !== p); changed(); } return; }
      if (t.id === "ll-copy") { return copyFrom(sortedPast().find((p) => p.date !== ui.date)); }
      if (ds.scale) { LOG.scale = ds.scale; return changed(); }
      if (t.id === "ll-export") { const b = new Blob([JSON.stringify(LOG, null, 1)], { type: "application/json" }), a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = `lifting-log-${today()}.json`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000); return; }
      if (t.id === "ll-wipe") { if (confirm("Delete your whole lifting log from this device? This can't be undone.")) { LOG = blank(); try { localStorage.removeItem(KEY); } catch (e) { /* */ } render(); if (window.BodyPlanApp) window.BodyPlanApp.update(); } return; }
    });
    el.addEventListener("input", (ev) => { const t = ev.target;
      if (t.id === "ll-q") { ui.q = t.value; const q = ui.q.trim().toLowerCase(), r = q ? EX.filter((e) => e.name.toLowerCase().includes(q) || musLine(e).toLowerCase().includes(q)) : EX.slice(0, 6);
        document.getElementById("ll-res").innerHTML = r.map((e) => `<button type="button" data-add="${e.id}"><b>${esc(e.name)}</b><small>${esc(musLine(e))}</small></button>`).join("") + `<button type="button" data-addcustom="1"><b>+ My own exercise</b><small>${q ? `Add “${esc(ui.q.trim())}”` : "Name it and pick the muscles"}</small></button>`; return; }
      if (t.dataset.s) { const s = sessFor(ui.date); if (!s) return; const [i, j, k] = t.dataset.s.split("."), x = s.ex[+i].sets[+j]; let v = num(t.value);
        if (v != null) v = k === "reps" ? Math.max(0, Math.min(200, Math.round(v))) : k === "w" ? Math.max(0, Math.min(2000, v)) : k === "rpe" ? Math.max(1, Math.min(10, v)) : Math.max(0, Math.min(10, v));
        x[k] = v; if (k === "w") x.unit = unit(); if (k === "rir") x.rpe = null; if (k === "rpe") x.rir = null; save(); } });
    el.addEventListener("change", (ev) => { const t = ev.target;
      if (t.id === "ll-on") { LOG.on = t.checked; return changed(); }
      if (t.id === "ll-date") { if (t.value) ui.date = t.value; return render(); }
      if (t.id === "ll-repeat") { if (t.value) copyFrom(LOG.sessions.find((x) => x.id === t.value)); return; }
      if (t.dataset.s) { save(); render(); if (window.BodyPlanApp && window.BodyPlanApp.update) window.BodyPlanApp.update(); return; }
      if (t.id === "ll-import" && t.files && t.files[0]) { const f = t.files[0]; f.text().then((txt) => { let o; try { o = JSON.parse(txt); } catch (e) { alert("That file isn't a lifting log backup."); return; }
        const n = clean(o); if (!n.sessions.length) { alert("No workouts found in that file."); return; }
        if (!confirm(`Load ${n.sessions.length} workout day(s)? This replaces the log on this device.`)) return; LOG = n; changed(); }); } });
  }
  window.LiftLog = { PRO_PREVIEW, KEY, EXERCISES: EX, apply, derive, setsPerMuscle, render, note, active, get log() { return LOG; }, reload() { try { LOG = clean(JSON.parse(localStorage.getItem(KEY) || "null")); } catch (e) { LOG = blank(); } } };
})();
