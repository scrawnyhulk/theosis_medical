const rows: { label: string; value: string; dv?: string; indent?: boolean }[] = [
  { label: "Total Fat", value: "0g", dv: "0%" },
  { label: "Saturated Fat", value: "0g", dv: "0%", indent: true },
  { label: "Trans Fat", value: "0g", indent: true },
  { label: "Cholesterol", value: "10mg", dv: "3%" },
  { label: "Sodium", value: "60mg", dv: "3%" },
  { label: "Total Carbohydrate", value: "6g", dv: "2%" },
  { label: "Dietary Fiber", value: "0g", dv: "0%", indent: true },
  { label: "Total Sugars", value: "4g", indent: true },
  { label: "Includes 0g Added Sugars", value: "", dv: "0%", indent: true },
];

export function NutritionFactsLabel() {
  return (
    <figure id="nutrition-facts-example" className="mx-auto w-full max-w-xs">
      <div
        className="bg-sesame-card p-3 text-sesame-ink shadow-border"
        role="img"
        aria-label="Example nutrition facts for nonfat Greek yogurt. Calories 90, protein 16 grams. Sixteen times ten is 160, which beats 90 calories, so this food is at least 40 percent protein."
      >
        <p className="font-display text-4xl leading-none font-semibold tracking-tight">Nutrition Facts</p>
        <p className="mt-1 text-xs leading-snug">1 serving per container</p>
        <div className="mt-1 flex items-baseline justify-between text-sm font-semibold">
          <span>Serving size</span>
          <span>1 container (150g)</span>
        </div>
        <div className="mt-1 h-3 bg-sesame-ink" />
        <p className="pt-1 text-xs font-semibold tracking-wide">Amount per serving</p>
        <div className="flex items-end justify-between">
          <span className="font-display text-3xl leading-none font-semibold">Calories</span>
          <span className="font-display text-5xl leading-none font-semibold">90</span>
        </div>
        <div className="mt-1 h-2 bg-sesame-ink" />
        <p className="bg-warn/35 px-2 py-1.5 text-xs leading-snug font-semibold">
          Look here. Compare this to protein × 10.
        </p>
        <p className="border-b border-sesame-ink py-1 text-right text-xs font-semibold">% Daily Value*</p>
        {rows.map((row) => (
          <p
            key={row.label}
            className={`flex items-baseline justify-between border-b border-sesame-ink py-0.5 text-sm leading-tight ${
              row.indent ? "pl-3 font-normal" : "font-semibold"
            }`}
          >
            <span>
              {row.label} {row.value}
            </span>
            {row.dv ? <span className="font-semibold">{row.dv}</span> : <span />}
          </p>
        ))}
        <p className="flex items-baseline justify-between py-0.5 text-sm leading-tight font-semibold">
          <span>Protein 16g</span>
          <span />
        </p>
        <div className="h-2 bg-sesame-ink" />
        <p className="bg-ok/30 px-2 py-1.5 text-xs leading-snug font-semibold">
          Add a zero → 160. 160 beats 90 calories. This yogurt passes.
        </p>
        <p className="mt-2 text-xs leading-snug text-sesame-muted">
          *% DV tells you how much a nutrient in a serving contributes to a daily diet. 2,000 calories a
          day is used for general nutrition advice. Example: nonfat Greek yogurt.
        </p>
      </div>
      <figcaption className="mt-3 text-center text-xs leading-relaxed text-muted">
        Same two lines on every package. Calories, then protein.
      </figcaption>
    </figure>
  );
}
