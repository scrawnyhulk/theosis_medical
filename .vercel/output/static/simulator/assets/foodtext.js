/* v7.6.57 Theosis Metabolic Simulator: "Type what you ate" for the Food Log (lazy asset; index.html is near its size limit).
   Flow: the person types a sentence -> /.netlify/functions/foodparse reads it into items {brand, food, flavor, quantity, unit, count}
   -> each item is looked up in USDA FoodData Central through the food function -> best match + other matches + serving math are
   proposed ("Best match, please check") -> the person edits, then taps Add. Nothing is logged without that tap.
   Fallback: if the reader is off or fails, the text is split on "and" / commas and each part is searched as typed.
   Brand names only come from what the person typed or from the database. No health claims here. */
(function () {
"use strict";
const FT = window.FoodText = window.FoodText || {};
const PARSE = "/.netlify/functions/foodparse", FOOD = "/.netlify/functions/food";
const CONTAINER = /^(bag|box|package|pack|packet|container|carton|sleeve|tray|tub|jar)$/;
const NUMW = { a: 1, an: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, half: 0.5, dozen: 12 };
const STOP = new Set(["the", "a", "an", "of", "with", "and", "brand", "flavor", "flavour", "i", "had", "ate", "some", "my", "whole", "for", "in", "on", "s"]);
const sing = (w) => w.replace(/ies$/, "y").replace(/(ch|sh|x|ss)es$/, "$1").replace(/([^s])s$/, "$1");
const toks = (s) => String(s || "").toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter((w) => w && !STOP.has(w)).map(sing);

/* ---------- pure helpers (also used by the test suite) ---------- */
// Fallback reader: split on "and", commas, "+", ";" and "then"; a leading number or number word becomes the quantity.
FT.splitText = function (text) {
  const out = [];
  for (let s of String(text || "").replace(/^\s*(i\s+(had|ate|have)|for \w+ i (had|ate))\s+/i, "").split(/,|;|\+|\band\b|\bthen\b|\balso\b/i)) {
    s = s.trim().replace(/^(the|some)\s+/i, ""); if (!toks(s).length) continue;
    // "..., the cinnamon flavor" belongs to the food before it
    if (out.length && /\bflavou?r(ed)?\b/i.test(s) && toks(s).length <= 3) { out[out.length - 1].food = (out[out.length - 1].food + " " + s.replace(/\bflavou?r(ed)?\b/ig, "")).replace(/\s+/g, " ").trim().slice(0, 80); continue; }
    const m = /^(\d+(?:\.\d+)?|a|an|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|half|dozen)\s+(.+)$/i.exec(s);
    const food = (m ? m[2] : s).replace(/^(whole\s+)?(bag|box|package|pack)\s+of\s+(the\s+)?/i, "").replace(/\b(brand|with the|with)\b/ig, " ").replace(/\s+/g, " ").trim();
    out.push({ brand: "", food: food.slice(0, 80), flavor: "", quantity: m ? (NUMW[m[1].toLowerCase()] || +m[1]) : 1, unit: "serving", count: null, raw: true });
  }
  return out.slice(0, 12);
};
// How many pieces one serving holds, read from a USDA serving label like "1 serving (2 Pastries (96g), 96 g)" or "1 serving (1 patty, 85 g)".
FT.piecesPerServing = function (label) {
  const m = /\(\s*(\d+(?:\.\d+)?)\s+([a-z][a-z-]*)/i.exec(String(label || "")); if (!m) return null;
  const n = +m[1], w = m[2].toLowerCase();
  if (!(n > 0) || /^(g|grm|gram|oz|onz|ml|mlt|cup|cups|tbsp|tsp|fl|lb|serving|container|package|box|bag)s?$/.test(w)) return null;
  return { n, word: w };
};
const r4 = (x) => Math.round(x * 4) / 4;
const plural = (n, w) => `${+n === 1 ? w : w.replace(/y$/, "ie") + "s"}`;
// Serving math for one parsed item against one food (first USDA serving). Returns {servings, note, sure}.
FT.servingMath = function (it, food) {
  const q = +it.quantity > 0 ? +it.quantity : 1, u = sing(String(it.unit || "serving").toLowerCase()), c = +it.count > 1 ? +it.count : null;
  const sv = food && food.servings && food.servings[0], pp = sv ? FT.piecesPerServing(sv.label) : null;
  let pieces = null, what = "";
  if (CONTAINER.test(u)) { if (c) { pieces = q * c; what = `${q} ${plural(q, u)} of ${c} = ${pieces} pieces`; } }
  else if (u !== "serving") { pieces = q; what = `${q} ${plural(q, u)}`; }
  if (pieces != null && pp) { const s = r4(pieces / pp.n) || 0.25; return { servings: s, sure: true, note: `${what}. One serving on the label is ${pp.n} ${pp.word}, so about ${s} serving${s === 1 ? "" : "s"}. Please check.` }; }
  if (pieces != null && CONTAINER.test(u)) return { servings: r4(pieces) || 1, sure: false, note: `${what}. Counted as one piece per serving. Please check the package.` };
  if (CONTAINER.test(u)) return { servings: q, sure: false, note: `Counted as ${q} serving${q === 1 ? "" : "s"}. A whole ${u} is often more than one serving, so check the package for servings per ${u}.` };
  return { servings: r4(q) || 1, sure: pieces == null || !!pp, note: pieces != null ? `${what}, counted as ${r4(q)} serving${r4(q) === 1 ? "" : "s"}. Please check the serving size.` : "" };
};
// Rank database foods for one parsed item: brand words count most, then food words, then flavor.
FT.score = function (it, f) {
  const hay = new Set(toks((f.brand || "") + " " + (f.name || ""))), hit = (ws) => ws.filter((w) => hay.has(w)).length;
  const b = toks(it.brand), fd = toks(it.food), fl = toks(it.flavor);
  return (fd.length && !hit(fd) ? -4 : 0) + hit(b) * 3 + hit(fd) * 2 + hit(fl) + (b.length && hit(b) === b.length ? 2 : 0) + (fd.length && hit(fd) === fd.length ? 2 : 0) - (f.src === "usda" && f.dataType !== "Branded" && b.length ? 1 : 0);
};
FT.rank = function (it, foods) {
  const seen = new Set(), out = [];
  for (const f of foods || []) { if (!f || !f.id || seen.has(f.id)) continue; seen.add(f.id); out.push({ f, s: FT.score(it, f) }); }
  return out.sort((a, b) => b.s - a.s).map((x) => Object.assign(x.f, { _score: x.s }));
};
FT.query = (it) => [it.brand, it.flavor, it.food].filter(Boolean).join(" ").replace(/\s+/g, " ").trim().slice(0, 80);
// The log entry for a chosen food + amount (same shape the search adds).
FT.entry = function (f, svIdx, servings) {
  const sv = f.servings[svIdx] || f.servings[0];
  return { name: f.name, brand: f.brand || "", src: f.src || "usda", per100: f.per100, g: sv.g, unit: sv.unit || "g", label: sv.label, servings: Math.min(50, Math.max(0.1, +servings || 1)), servingsList: f.servings.map((s) => ({ label: s.label, g: s.g, unit: s.unit || "g" })) };
};

/* ---------- network ---------- */
const J = async (url, opt) => { const r = await fetch(url, opt); let d = null; try { d = await r.json(); } catch (e) { d = null; } if (!r.ok) { const e = new Error((d && d.error) || "HTTP " + r.status); e.status = r.status; throw e; } return d || {}; };
FT.parse = async function (text) {
  for (let i = 0; i < 2; i++) {   // one retry: the AI service sometimes fails once and then answers
    try { const d = await J(PARSE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
      if (Array.isArray(d.items) && d.items.length) return { items: d.items.slice(0, 12), ai: !d.mock, mock: !!d.mock }; break; }
    catch (e) { if (!e.status && !navigator.onLine) return { items: [], net: true }; if (!e.status || (e.status >= 400 && e.status < 500) || e.status === 503) break; }   /* reader off / limit: plain search below */
  }
  return { items: FT.splitText(text), ai: false };
};
async function search(q, kind) {
  if (location.protocol === "file:") { const C = window.FoodCore, k = (window.BodyPlanApp && window.BodyPlanApp.config && window.BodyPlanApp.config.FDC_PUBLIC_KEY) || "DEMO_KEY";
    const d = await J(C.fdcSearchUrl(q, k, { branded: kind === "branded", all: kind === "all", n: 10 })); return (d.foods || []).map(C.normFDC).filter(Boolean); }
  const d = await J(`${FOOD}?q=${encodeURIComponent(q)}&kind=${kind}`); return Array.isArray(d.items) ? d.items : [];
}
async function offSearch(q) {   // v7.6.59: Open Food Facts via the food function (new search API, then the old one); from disk, straight to the old one
  if (location.protocol !== "file:") { let d = null; try { d = await J(`${FOOD}?src=off&q=${encodeURIComponent(q)}`); } catch (e) { d = null; } if (d && Array.isArray(d.items)) return d.items; }
  const C = window.FoodCore; for (const host of ["us", "world"]) { try { const d = await J(C.offSearchUrl(q, 12, host)); return (d.products || []).map(C.normOFF).filter(Boolean); } catch (e) { /* try world, then give up */ } } throw new Error("off down");
}
// Every database the food search uses: USDA branded + generic (FoodData Central) and Open Food Facts. r.checked lists what answered.
FT.lookup = async function (it, checked) {
  checked = checked || []; const q = FT.query(it), plain = [it.flavor, it.food].filter(Boolean).join(" ");
  let foods = [], rate = null; const tries = it.brand ? [[q, "branded", "USDA branded"], [plain, "all", "USDA generic + branded"]] : [[q, "all", "USDA generic + branded"]];
  for (const [qq, k, nm] of tries) { if (qq.length < 2) continue; try { foods = foods.concat(await search(qq, k)); checked.push(nm); } catch (e) { checked.push(nm + " (unavailable)"); if (e.status === 429) rate = e; } }
  if (q.length >= 2) { try { foods = foods.concat(await offSearch(q)); checked.push("Open Food Facts"); } catch (e) { checked.push("Open Food Facts (unavailable)"); } }
  if (!foods.length && rate) throw rate;
  return FT.rank(it, foods).slice(0, 6);
};
/* v7.6.58: brand not in USDA -> grounded web lookup of that product's label (server-side). Only brand/food/flavor are sent. */
const WEB = "/.netlify/functions/foodweb";
// v7.6.59: the web lookup runs unless a database food has the typed brand AND the food words AND the flavor (exact product).
// A brand-only match (other flavor/variety) stays in the list as a database option; the web result, if sourced, is proposed first.
FT.exactFound = (it, f) => { if (!f) return false; const hay = toks((f.brand || "") + " " + f.name), all = (ws) => ws.every((w) => hay.includes(w)); return FT.brandFound(it, f) && all(toks(it.food)) && all(toks(it.flavor)); };
FT.brandFound = (it, f) => { const bw = toks(it.brand), hay = toks((f && (f.brand || "") + " " + f.name) || ""); return !bw.length || (!!f && bw.every((w) => hay.includes(w))); };
FT.webFood = function (r) {
  if (!r || r.kcal == null || !Array.isArray(r.sources) || !r.sources.length) return null;   // no source, no numbers
  const g = r.servingGrams > 0 ? r.servingGrams : 100, k = 100 / g, pc = r.piecesPerServing > 0 && r.pieceWord ? `${r.piecesPerServing} ${r.pieceWord}, ` : "";
  const per100 = { kcal: r.kcal * k }; for (const x of ["protein", "carbs", "fat"]) per100[x] = r[x] == null ? null : r[x] * k;
  const label = r.servingGrams > 0 ? `1 serving (${pc}${g} g)` : `1 serving (${pc}${r.serving || "as on the package"})`;
  return { id: "web:" + (r.brand + r.product).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60), src: "web", name: r.product, brand: r.brand, per100, servings: [{ label: label.slice(0, 60), g, unit: "g" }], sources: r.sources.slice(0, 3), _score: 99 };
};
FT.web = async function (it) {
  try { const d = await J(WEB, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ brand: it.brand, food: it.food, flavor: it.flavor || "" }) }); return FT.webFood(d && d.result); }
  catch (e) { return null; }
};
/* v7.6.58: offline queue. The typed text is kept on THIS device only (localStorage) until the connection is back; never auto-added. */
const PKEY = "theosis-foodtext-pending";
FT.pending = { get() { try { const v = JSON.parse(localStorage.getItem(PKEY) || "null"); return v && typeof v.text === "string" ? v.text.slice(0, 500) : ""; } catch (e) { return ""; } },
  set(t) { try { localStorage.setItem(PKEY, JSON.stringify({ text: String(t).slice(0, 500), at: Date.now() })); return true; } catch (e) { return false; } },
  clear() { try { localStorage.removeItem(PKEY); } catch (e) { /* ignore */ } } };
const OFFMSG = "You're offline. What you typed is saved on this device, and we'll look for these foods when you're back online. You'll still check each one before anything is added.";
/* ---------- UI ---------- */
const st = { text: "", busy: false, rows: [], ai: null, msg: "" };
const B = () => window.__BP, X = () => window.__FLX;
const esc = (s) => B().esc(s), fK = (v) => B().fK(v);
const CSS = `.ft-box textarea{width:100%;min-height:5.2rem;font:inherit;font-size:1.05rem;line-height:1.4;padding:.7rem .8rem;border-radius:10px;border:1px solid rgba(207,214,224,.28);background:rgba(0,0,0,.18);color:inherit;resize:vertical;box-sizing:border-box}
.ft-box .ft-l{display:block;font-weight:600;margin:0 0 .35rem}.ft-note{color:var(--muted);font-size:.84rem;margin:.45rem 0 0}
.ft-list{list-style:none;margin:.9rem 0 0;padding:0;display:grid;gap:.75rem}.ft-it{border:1px solid rgba(207,214,224,.18);border-radius:12px;padding:.75rem .8rem}
.ft-it.off{opacity:.55}.ft-typed{font-size:.86rem;color:var(--muted);margin:0 0 .35rem}.ft-best{display:inline-block;font-size:.78rem;font-weight:700;padding:.12rem .45rem;border-radius:999px;background:rgba(80,140,220,.18);color:#9cc3ff;margin-bottom:.35rem}
.ft-best.web{background:rgba(120,190,255,.14);color:#bfe0ff}.ft-src{font-size:.8rem;color:var(--muted);margin:.2rem 0 0;word-break:break-word}.ft-src a{color:#9cc3ff}
.ft-best.weak{background:rgba(230,170,60,.16);color:#f0c070}.ft-it select,.ft-it input[type=text],.ft-it input[inputmode]{font:inherit;font-size:1rem;min-height:44px;width:100%;box-sizing:border-box}
.ft-row{display:grid;grid-template-columns:1fr 1fr;gap:.6rem;margin-top:.55rem}.ft-math{font-size:.84rem;color:var(--muted);margin:.45rem 0 0}.ft-kcal{margin:.45rem 0 0;font-weight:600}
.ft-again{display:flex;gap:.5rem;margin-top:.55rem}.ft-again input{flex:1;padding:.5rem .65rem;border-radius:10px;border:1px solid rgba(207,214,224,.28);background:rgba(0,0,0,.18);color:inherit}.ft-inc{display:flex;align-items:center;gap:.45rem;margin-top:.55rem;font-size:.92rem;min-height:40px}.ft-inc input{width:22px;height:22px}
.ft-alt{display:flex;flex-wrap:wrap;align-items:center;gap:.5rem;margin-top:.7rem}.ft-alt-l{color:var(--muted);font-size:.9rem}.ft-alt .btn{min-height:46px}.ft-alt .btn[disabled]{opacity:.55;cursor:not-allowed}.ft-alt small{font-weight:400}
.ft-acts{display:flex;flex-wrap:wrap;gap:.6rem;margin-top:.9rem}.ft-acts .btn{min-height:48px}.ft-msg{margin:.7rem 0 0}
@media (max-width:560px){.ft-row{grid-template-columns:1fr}}`;
function css() { if (document.getElementById("ft-css")) return; const s = document.createElement("style"); s.id = "ft-css"; s.textContent = CSS; document.head.appendChild(s); }
const mealName = () => { const m = window.FoodLog.MEALS.find((x) => x[0] === X().fl.meal); return m ? m[1] : "Snacks"; };
function rowHtml(r, i) {
  const it = r.item, typed = [it.quantity !== 1 || it.unit !== "serving" ? `${it.quantity} ${it.unit}` : "", it.brand, it.flavor, it.food].filter(Boolean).join(" · ") + (it.count ? ` (${it.count} per ${it.unit})` : "");
  if (r.loading) return `<li class="ft-it" data-ft-i="${i}"><p class="ft-typed">You typed: ${esc(typed)}</p><p class="hint">${r.webBusy ? "That brand isn't in the USDA database. Checking the web for its label…" : "Looking this up…"}</p></li>`;
  const f = r.matches[r.pick], again = `<div class="ft-again"><input type="text" data-ft-q="${i}" data-local="1" maxlength="80" value="${esc(r.q)}" aria-label="Search words for ${esc(it.food)}"><button type="button" class="btn btn-ghost" data-ft-search="${i}">Search again</button></div>`;
  if (!f) return `<li class="ft-it off" data-ft-i="${i}"><p class="ft-typed">You typed: ${esc(typed)}</p><p>${r.err ? esc(r.err) : "No match found in the USDA food database."} Try different words, or use Quick add.</p>${again}</li>`;
  const sv = f.servings[r.sv] || f.servings[0], n = window.FoodLog.itemNutr({ per100: f.per100, g: sv.g, servings: r.n }), bw = toks(it.brand), hay = toks((f.brand || "") + " " + f.name), noBrand = bw.length && !bw.every((w) => hay.includes(w)), weak = (f._score || 0) < 4 || noBrand;
  return `<li class="ft-it${r.on ? "" : " off"}" data-ft-i="${i}"><p class="ft-typed">You typed: ${esc(typed)}</p>
    ${f.src === "web" ? `<span class="ft-best web">Found on the web, please check the package</span><p class="ft-src">Source: ${f.sources.map((x) => `<a href="${esc(x.url)}" target="_blank" rel="noopener noreferrer nofollow">${esc(x.title)}</a>`).join(", ")}</p>`
      : `<span class="ft-best${weak ? " weak" : ""}">${noBrand ? `That brand wasn't found${r.webMiss ? " in the food databases or on the web" : ""}. Closest match, please check` : weak ? "Closest match, please check" : "Best match, please check"}</span>`}
    <label class="field"><span class="label">Food</span><span class="control"><select data-ft-pick="${i}">${r.matches.map((m, j) => `<option value="${j}" ${j === r.pick ? "selected" : ""}>${m.src === "web" ? "Web: " : ""}${esc(m.name)}${m.brand ? " (" + esc(m.brand) + ")" : ""}</option>`).join("")}</select></span></label>
    <div class="ft-row"><label class="field"><span class="label">How many</span><span class="control"><input inputmode="decimal" data-ft-n="${i}" data-local="1" value="${+r.n}"></span></label>
      <label class="field"><span class="label">Serving</span><span class="control"><select data-ft-sv="${i}">${f.servings.map((s, j) => `<option value="${j}" ${j === r.sv ? "selected" : ""}>${esc(s.label)}</option>`).join("")}</select></span></label></div>
    ${r.note ? `<p class="ft-math">${esc(r.note)}</p>` : ""}<p class="ft-kcal">About ${fK(n.kcal)} kcal · ${fK(n.protein || 0)} g protein</p>
    ${r.checked && r.checked.length ? `<p class="ft-src">Checked: ${esc(r.checked.join(", "))}</p>` : ""}<label class="ft-inc"><input type="checkbox" data-ft-on="${i}" ${r.on ? "checked" : ""}> Add this one</label>${again}</li>`;
}
let drawing = false, again = false;
// Rebuilding the pane can blur a focused field, which fires "change" and asks for another draw. Run that one after, never inside.
function draw() { if (drawing) { again = true; return; } drawing = true; try { drawNow(); } finally { drawing = false; } if (again) { again = false; setTimeout(draw, 0); } }
function drawNow() {
  const box = document.getElementById("fl-text"); if (!box) return; css();
  const on = st.rows.filter((r) => r.on && r.matches && r.matches[r.pick]).length, any = st.rows.length;
  box.innerHTML = `<div class="ft-box"><label class="ft-l" for="ft-in">Type what you ate</label>
    <textarea id="ft-in" data-local="1" maxlength="500" placeholder="e.g. two scrambled eggs, a slice of toast and a coffee with milk">${esc(st.text)}</textarea>
    <p class="ft-note">Write it the way you'd say it, with amounts if you know them. What you type is sent to an AI service only to pick out the foods; it isn't saved. Matches come from the USDA and Open Food Facts databases, or, if a brand isn't there, from its label found on the web. You check each one before anything is added.</p>
    <div class="ft-acts"><button type="button" class="btn btn-steel" id="ft-go" ${st.busy ? "disabled" : ""}>${st.busy ? "Finding…" : "Find these foods"}</button>${any ? `<button type="button" class="btn btn-ghost" id="ft-clear">Start over</button>` : ""}</div>
    <div class="ft-alt" role="group" aria-label="Other ways to add"><span class="ft-alt-l">Or:</span><button type="button" class="btn btn-ghost" id="ft-scan">▦ Scan a barcode</button><button type="button" class="btn btn-ghost" id="ft-photo" disabled aria-disabled="true" title="Coming soon">📷 Photo of food <small>(coming soon)</small></button></div>
    ${st.queued ? `<div class="ft-acts ft-pend"><button type="button" class="btn btn-ghost" id="ft-retry">Try now</button><button type="button" class="btn btn-ghost" id="ft-unqueue">Clear saved text</button></div>` : ""}
    ${st.msg ? `<p class="ft-msg hint" role="status">${esc(st.msg)}</p>` : ""}
    ${any ? `<ul class="ft-list" aria-label="Foods found">${st.rows.map(rowHtml).join("")}</ul>
      <div class="ft-acts"><button type="button" class="btn btn-steel" id="ft-add" ${on && !st.busy ? "" : "disabled"}>Add ${on} food${on === 1 ? "" : "s"} to ${esc(mealName())}</button><button type="button" class="btn btn-ghost" id="ft-cancel">Cancel</button></div>
      <p class="ft-note">Estimates from food databases or labels found on the web. Packages differ, so check amounts against the label.</p>` : ""}</div>`;
}
function setMatch(r, j) { r.pick = j; const f = r.matches[j]; if (!f) return; const m = FT.servingMath(r.item, f); r.sv = 0; r.n = m.servings; r.note = m.note; }
async function lookRow(r, q) {
  r.loading = true; draw();
  try { r.checked = []; r.matches = await FT.lookup(q ? { brand: "", food: q, flavor: "" } : r.item, r.checked); r.err = "";
    if (!q && r.item.brand && !r.matches.some((m) => FT.exactFound(r.item, m))) { r.webBusy = true; draw(); const w = await FT.web(r.item); r.webBusy = false; r.checked.push(w ? "Web search (label found)" : "Web search (no sourced label)"); if (w) r.matches.unshift(w); else r.webMiss = true; } }
  catch (e) { r.matches = []; r.err = e.status === 429 ? "The food database is busy right now. Try again in a minute." : "Couldn't reach the food database."; }
  r.loading = false; setMatch(r, 0); r.on = !!r.matches.length; draw();
}
async function go() {
  const ta = document.getElementById("ft-in"); st.text = ta ? ta.value.trim().slice(0, 500) : st.text;
  if (st.text.length < 2) { st.msg = "Type what you ate first, for example: two eggs and a banana."; draw(); return; }
  if (navigator.onLine === false) { FT.pending.set(st.text); st.queued = true; st.rows = []; st.msg = OFFMSG; draw(); return; }
  st.busy = true; st.msg = "Reading what you typed…"; st.rows = []; st.queued = false; draw();
  const p = await FT.parse(st.text); st.ai = p.ai;
  if (p.net) { FT.pending.set(st.text); st.queued = true; st.busy = false; st.msg = OFFMSG; draw(); return; }
  FT.pending.clear();
  st.rows = p.items.map((item) => ({ item, q: FT.query(item), matches: [], pick: 0, sv: 0, n: 1, on: false, loading: true, note: "" }));
  st.msg = !st.rows.length ? "No foods found in that. Try naming each food, like: 2 eggs and a banana." : p.ai || p.mock ? `Found ${st.rows.length} food${st.rows.length === 1 ? "" : "s"}. Please check each match and amount.` : "Couldn't read that automatically, so each part was searched as typed. Please check each one.";
  draw();
  for (const r of st.rows) await lookRow(r);
  st.busy = false; draw();
}
function add() {
  const x = X(); let n = 0; const names = [];
  for (const r of st.rows) { const f = r.on && r.matches[r.pick]; if (!f || !(+r.n > 0)) continue; if (x.add(FT.entry(f, r.sv, r.n))) { n++; names.push(f.name); } }
  const meal = mealName().toLowerCase(); st.rows = []; st.text = ""; st.msg = n ? `Added ${n} food${n === 1 ? "" : "s"} to ${meal}.` : "Nothing was added.";
  x.fl.status = st.msg; x.render(); draw();
}
function bind() {
  if (FT.bound) return; FT.bound = true;
  document.addEventListener("click", (ev) => {
    const t = ev.target.closest("#fl-text button"); if (!t) return;
    if (t.id === "ft-go") return void go();
    if (t.id === "ft-scan") { const x = X(); x.fl.tab = "search"; x.render(); const b = document.getElementById("fs-scan"); if (b) { b.scrollIntoView({ block: "center" }); b.click(); } return; }
    if (t.id === "ft-add") return add();
    if (t.id === "ft-retry") return void go();
    if (t.id === "ft-unqueue") { FT.pending.clear(); st.queued = false; st.text = ""; st.msg = "Saved text cleared. Nothing was added."; draw(); return; }
    if (t.id === "ft-clear" || t.id === "ft-cancel") { st.rows = []; if (st.queued) { FT.pending.clear(); st.queued = false; } st.msg = t.id === "ft-cancel" ? "Canceled. Nothing was added." : ""; if (t.id === "ft-clear") st.text = ""; draw(); const ta = document.getElementById("ft-in"); ta && ta.focus(); return; }
    if (t.dataset.ftSearch != null) { const i = +t.dataset.ftSearch, r = st.rows[i], inp = document.querySelector(`[data-ft-q="${i}"]`); if (r && inp && inp.value.trim().length >= 2) { r.q = inp.value.trim().slice(0, 80); lookRow(r, r.q); } }
  });
  document.addEventListener("change", (ev) => {
    const t = ev.target; if (!t.closest || !t.closest("#fl-text")) return;
    if (t.id === "ft-in") { st.text = t.value; return; }
    const r = (k) => st.rows[+t.dataset[k]];
    if (t.dataset.ftPick != null) { setMatch(r("ftPick"), +t.value); draw(); }
    else if (t.dataset.ftSv != null) { const x = r("ftSv"); x.sv = +t.value; x.note = ""; draw(); }
    else if (t.dataset.ftN != null) { const x = r("ftN"), v = parseFloat(String(t.value).replace(",", ".")); if (v > 0 && v <= 50) x.n = v; x.note = x.note && /Please check/.test(x.note) ? x.note : ""; draw(); }
    else if (t.dataset.ftOn != null) { r("ftOn").on = t.checked; draw(); }
  });
  document.addEventListener("input", (ev) => { if (ev.target && ev.target.id === "ft-in") st.text = ev.target.value; });
  document.addEventListener("keydown", (ev) => { const t = ev.target; if (ev.key === "Enter" && t && t.dataset && t.dataset.ftQ != null) { ev.preventDefault(); const b = document.querySelector(`[data-ft-search="${t.dataset.ftQ}"]`); b && b.click(); }
    if (ev.key === "Enter" && t && t.id === "ft-in" && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); go(); } });
}
// Back online (or loaded while online with saved text): read + search again and show the normal confirm card. Never adds.
FT.resume = function () {
  const t = FT.pending.get(); if (!t || st.busy || navigator.onLine === false) return false;
  st.text = t; st.queued = true; const x = X();
  if (x && x.fl.open && x.fl.tab !== "text") { x.fl.tab = "text"; x.render(); }
  go(); return true;
};
if (window.addEventListener) window.addEventListener("online", () => FT.resume());
FT.state = st;
window.ftRender = function () { bind(); const box = document.getElementById("fl-text"); if (box && !box.querySelector(".ft-box")) { const t = FT.pending.get(); if (t && !st.text) { st.text = t; st.queued = true; st.msg = OFFMSG; } draw(); if (t && navigator.onLine !== false) FT.resume(); } };
if (typeof localStorage !== "undefined" && FT.pending.get() && navigator.onLine !== false) setTimeout(() => { const x = X(); if (x && x.fl.open) { if (x.fl.tab !== "text") { x.fl.tab = "text"; x.render(); } } }, 0);
})();
