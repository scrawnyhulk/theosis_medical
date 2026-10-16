/* Theosis Body Plan: food search core. Normalizes Open Food Facts products and USDA FoodData Central foods into one
   shape: { id, src, name, brand, per100: {kcal, protein, carbs, fat, fiber, sugar, satFat, sodiumMg}, servings: [{label, g}] }.
   Pure functions, no DOM; used by the page and by netlify/functions/food.js (UMD). */
(function (root, factory) { const api = factory(); if (typeof module !== "undefined" && module.exports) module.exports = api; else root.FoodCore = api; })(typeof self !== "undefined" ? self : this, function () {
"use strict";
const num = (v) => (v === null || v === undefined || v === "" || !Number.isFinite(+v) ? null : +v);
const r1 = (v) => (v == null ? null : Math.round(v * 10) / 10);
const clean = (s, n = 120) => String(s || "").replace(/[\u0000-\u001f<>]/g, " ").replace(/\s+/g, " ").trim().slice(0, n);
const title = (s) => { s = clean(s); return s && s === s.toUpperCase() ? s.toLowerCase().replace(/(^|[\s,(/-])([a-z])/g, (m, a, b) => a + b.toUpperCase()) : s; };
const isBarcode = (q) => /^\d{8,14}$/.test(String(q || "").replace(/\s+/g, ""));

// ---------- Open Food Facts ----------
const OFF_FIELDS = "code,product_name,product_name_en,generic_name,brands,nutriments,serving_size,serving_quantity,serving_quantity_unit,quantity";
function offSearchUrl(q, n = 12, host = "us") {          // us. = products sold in the US; "world" for everything
  return `https://${host}.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(q)}&search_simple=1&action=process&json=1&page_size=${n}&sort_by=unique_scans_n&fields=${OFF_FIELDS}`;
}
const offProductUrl = (code) => `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=${OFF_FIELDS}`;
function normOFF(p) {
  if (!p) return null;
  const n = p.nutriments || {};
  let kcal = num(n["energy-kcal_100g"]);
  if (kcal == null && num(n.energy_100g) != null) kcal = num(n.energy_100g) / 4.184;        // kJ -> kcal
  if (kcal == null || kcal < 0 || kcal > 950) return null;
  const name = title(p.product_name_en || p.product_name || p.generic_name);
  if (!name) return null;
  const per100 = { kcal: r1(kcal), protein: r1(num(n.proteins_100g)), carbs: r1(num(n.carbohydrates_100g)), fat: r1(num(n.fat_100g)),
    fiber: r1(num(n.fiber_100g)), sugar: r1(num(n.sugars_100g)), satFat: r1(num(n["saturated-fat_100g"])), sodiumMg: num(n.sodium_100g) != null ? Math.round(num(n.sodium_100g) * 1000) : null };
  const servings = [];
  const sq = num(p.serving_quantity);
  if (sq && sq > 0 && sq < 2000) servings.push({ label: `1 serving${p.serving_size ? ` (${clean(p.serving_size, 40)}${new RegExp("\\b" + r1(sq) + "\\s*(g|ml)", "i").test(String(p.serving_size)) ? "" : `, ${r1(sq)} g`})` : ` (${r1(sq)} g)`}`, g: sq, unit: /ml/i.test(p.serving_quantity_unit || p.serving_size || "") ? "ml" : "g" });
  servings.push({ label: "100 g", g: 100 }, { label: "1 g", g: 1 });
  return { id: "off:" + p.code, src: "off", code: p.code || null, name, brand: clean(String(p.brands || "").split(",")[0], 60), per100, servings, liquid: servings[0].unit === "ml" };
}

// ---------- USDA FoodData Central ----------
const FDC_BASE = "https://api.nal.usda.gov/fdc/v1/foods/search";
const FDC_GENERIC = ["Foundation", "SR Legacy", "Survey (FNDDS)"];
function fdcSearchUrl(q, key, opts = {}) {
  const types = opts.branded ? ["Branded"] : opts.all ? FDC_GENERIC.concat("Branded") : FDC_GENERIC;
  return `${FDC_BASE}?api_key=${encodeURIComponent(key)}&query=${encodeURIComponent(q)}&pageSize=${opts.n || 10}&dataType=${types.map(encodeURIComponent).join(",")}`;
}
// nutrient ids (and legacy nutrient numbers) used by FDC search results
const NUT = { kcal: [[1008, "208"], [2047, "957"], [2048, "958"]], protein: [[1003, "203"]], fat: [[1004, "204"]], carbs: [[1005, "205"]],
  fiber: [[1079, "291"]], sugar: [[2000, "269"], [1063, "269.3"]], satFat: [[1258, "606"]], sodiumMg: [[1093, "307"]] };
function fdcNutrient(list, key) {
  for (const [id, no] of NUT[key]) {
    const hit = list.find((x) => (x.nutrientId === id || String(x.nutrientNumber) === no || (x.nutrient && (x.nutrient.id === id || String(x.nutrient.number) === no)))
      && !(key === "kcal" && /kj/i.test(x.unitName || (x.nutrient && x.nutrient.unitName) || "")));
    if (hit) { const v = num(hit.value != null ? hit.value : hit.amount); if (v != null) return v; }
  }
  return null;
}
function normFDC(f) {
  if (!f || !Array.isArray(f.foodNutrients)) return null;
  const L = f.foodNutrients, kcal = fdcNutrient(L, "kcal");
  if (kcal == null || kcal < 0 || kcal > 950) return null;
  const per100 = { kcal: r1(kcal) };
  for (const k of ["protein", "carbs", "fat", "fiber", "sugar", "satFat"]) per100[k] = r1(fdcNutrient(L, k));
  const na = fdcNutrient(L, "sodiumMg"); per100.sodiumMg = na == null ? null : Math.round(na);
  const servings = [];
  const ss = num(f.servingSize), su = String(f.servingSizeUnit || "").toLowerCase();
  if (ss && ss > 0 && ss < 2000 && (su === "g" || su === "grm" || su === "ml" || su === "mlt"))
    servings.push({ label: `1 serving${f.householdServingFullText ? ` (${clean(f.householdServingFullText, 30)}, ${r1(ss)} ${su.startsWith("m") ? "ml" : "g"})` : ` (${r1(ss)} ${su.startsWith("m") ? "ml" : "g"})`}`, g: ss, unit: su.startsWith("m") ? "ml" : "g" });
  for (const m of (f.foodMeasures || []).slice(0, 6)) {
    const g = num(m.gramWeight), t = clean(m.disseminationText, 40);
    if (g && g > 0 && g < 2000 && t && !/quantity not specified/i.test(t)) servings.push({ label: `${t} (${r1(g)} g)`, g });
  }
  // v7.6.7: Foundation and SR Legacy search results carry no portions, so "Eggs, Grade A, Large" showed 148 kcal for 100 g.
  // Add the USDA household portion for common foods (gram weights from FoodData Central SR Legacy / FNDDS) and make it the default.
  if (f.dataType !== "Branded") { const cp = commonPortion(f.description); if (cp && !servings.length) servings.unshift({ label: `${cp.label} (${r1(cp.g)} g)`, g: cp.g, common: true }); }
  servings.push({ label: "100 g", g: 100 }, { label: "1 g", g: 1 });
  const branded = f.dataType === "Branded";
  return { id: "fdc:" + f.fdcId, src: "usda", fdcId: f.fdcId, dataType: clean(f.dataType, 30), name: title(f.description), brand: branded ? clean(f.brandName || f.brandOwner, 60) : "",
    code: f.gtinUpc ? String(f.gtinUpc) : null, per100, servings, liquid: servings[0].unit === "ml" };
}

// ---------- v7.6.7: common household portions (USDA FoodData Central SR Legacy / FNDDS gram weights) ----------
// First match wins; patterns test the lower-cased USDA description. Only used when the search result has no portion of its own.
const PORTIONS = [
  [/\b(duck|goose|quail|turkey)\b.*\begg|\begg\b.*\b(duck|goose|quail|turkey)\b|pita|bagel|\broll\b|substitute|powder|dried|noodle/, null, 0],
  [/\begg[s]?\b.*\bwhite\b|\bwhite\b.*\begg/, "1 large egg white", 33], [/\begg[s]?\b.*\byolk\b|\byolk\b.*\begg/, "1 large egg yolk", 17],
  [/\begg[s]?\b.*\bextra large\b/, "1 extra-large egg", 56], [/\begg[s]?\b.*\bjumbo\b/, "1 jumbo egg", 63], [/\begg[s]?\b.*\bmedium\b/, "1 medium egg", 44], [/\begg[s]?\b.*\bsmall\b/, "1 small egg", 38],
  [/^eggs?,.*(whole|large|grade a)|^egg, whole/, "1 large egg", 50],
  [/^bananas?, raw/, "1 medium banana", 118], [/^apples?,.*raw/, "1 medium apple", 182], [/^oranges?, raw/, "1 medium orange", 131],
  [/^avocados?, raw, california/, "1 avocado (no skin or seed)", 136], [/^avocados?, raw, florida/, "1 avocado (no skin or seed)", 304], [/^avocados?, raw/, "1 avocado (no skin or seed)", 201], [/^strawberries, raw/, "1 cup halves", 152], [/^blueberries, raw/, "1 cup", 148],
  [/^bread,.*whole[- ]wheat/, "1 slice", 32], [/^bread,/, "1 slice", 25],
  [/^rice,.*brown.*cooked/, "1 cup cooked", 195], [/^rice,.*cooked/, "1 cup cooked", 158], [/^pasta,.*cooked|^spaghetti,.*cooked/, "1 cup cooked", 140],
  [/^cereals?,.*oats?.*(dry|regular and quick)|^oats\b/, "1/2 cup dry", 40],
  [/^oil,.*olive|^olive oil/, "1 tbsp", 13.5], [/^oil,/, "1 tbsp", 13.6], [/^butter,/, "1 tbsp", 14.2], [/^peanut butter/, "2 tbsp", 32],
  [/^nuts?,.*almonds|^almonds/, "1 oz (about 23 almonds)", 28.4],
  [/^milk,/, "1 cup", 244], [/^yogurt,.*greek/, "1 container", 170], [/^cheese,.*cheddar/, "1 oz", 28.4],
  [/^potatoes?,.*baked/, "1 medium potato", 173], [/^sweet ?potato.*baked/, "1 medium sweet potato", 114],
  [/^broccoli,.*cooked/, "1 cup chopped, cooked", 156], [/^broccoli, raw/, "1 cup chopped", 91],
  [/^chicken,.*breast/, "3 oz", 85], [/^(beef|pork|turkey|lamb),/, "3 oz", 85], [/^fish,|^salmon|^tuna/, "3 oz", 85],
];
function commonPortion(desc) { const d = String(desc || "").toLowerCase(); for (const [re, label, g] of PORTIONS) if (re.test(d)) return label ? { label, g } : null; return null; }

// v7.6.8: FDA label rounding for displayed calories (21 CFR 101.9(c)(1)): under 5 → 0; 5–50 → nearest 5; above 50 → nearest 10. Display only; totals stay exact.
function labelKcal(k) { if (k == null || !Number.isFinite(+k)) return null; k = +k; if (k < 5) return 0; if (k <= 50) return Math.round(k / 5) * 5; return Math.round(k / 10) * 10; }
// ---------- amounts ----------
const KEYS = ["kcal", "protein", "carbs", "fat", "fiber", "sugar", "satFat", "sodiumMg"];
function scale(per100, grams) { const o = {}; for (const k of KEYS) o[k] = per100[k] == null ? null : per100[k] * grams / 100; return o; }
function totals(log) {
  const t = { kcal: 0, protein: 0, carbs: 0, fat: 0 };
  for (const it of log || []) { const a = scale(it.per100, it.g * it.servings); for (const k of Object.keys(t)) t[k] += a[k] || 0; }
  return t;
}
return { OFF_FIELDS, offSearchUrl, offProductUrl, normOFF, FDC_BASE, FDC_GENERIC, fdcSearchUrl, normFDC, scale, totals, isBarcode, clean, commonPortion, PORTIONS, labelKcal };
});
