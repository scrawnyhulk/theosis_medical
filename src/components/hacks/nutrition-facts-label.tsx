import { proteinBandMeta, scoreProtein } from "@/lib/protein-score";

const rows: { label: string; indent?: boolean }[] = [
  { label: "Total Fat" },
  { label: "Saturated Fat", indent: true },
  { label: "Trans Fat", indent: true },
  { label: "Cholesterol" },
  { label: "Sodium" },
  { label: "Total Carbohydrate" },
  { label: "Dietary Fiber", indent: true },
  { label: "Total Sugars", indent: true },
  { label: "Includes Added Sugars", indent: true },
];

function fmt(n: number) {
  return Number.isInteger(n) ? String(n) : String(Math.round(n * 10) / 10);
}

export function NutritionFactsLabel({ calories, protein }: { calories: string; protein: string }) {
  const scored = scoreProtein(calories, protein);
  const calorieText = scored ? fmt(scored.cal) : calories.trim() === "" ? "—" : calories;
  const proteinText = scored ? `${fmt(scored.pro)}g` : protein.trim() === "" ? "—" : `${protein}g`;
  const proteinDv = scored ? `${Math.max(0, Math.round((scored.pro / 50) * 100))}%` : "";
  const meta = scored ? proteinBandMeta[scored.band] : null;

  const proteinNote = !scored
    ? "Add a zero to the protein grams, then compare to calories."
    : `Add a zero → ${fmt(scored.timesTen)}. ${meta?.line}`;

  return (
    <figure className="mx-auto w-full max-w-xs">
      <div
        className="bg-sesame-card p-3 text-sesame-ink shadow-border"
        aria-live="polite"
        aria-label={`Nutrition facts. Calories ${calorieText}. Protein ${proteinText}. ${proteinNote}`}
      >
        <p className="font-display text-4xl leading-none font-semibold tracking-tight">Nutrition Facts</p>
        <p className="mt-1 text-xs leading-snug">1 serving per container</p>
        <div className="mt-1 flex items-baseline justify-between text-sm font-semibold">
          <span>Serving size</span>
          <span>1 serving</span>
        </div>
        <div className="mt-1 h-3 bg-sesame-ink" />
        <p className="pt-1 text-xs font-semibold tracking-wide">Amount per serving</p>
        <div className="flex items-end justify-between">
          <span className="font-display text-3xl leading-none font-semibold">Calories</span>
          <span className="font-display text-5xl leading-none font-semibold tabular-nums">{calorieText}</span>
        </div>
        <div className="mt-1 h-2 bg-sesame-ink" />
        <p className="bg-warn/35 px-2 py-1.5 text-xs leading-snug font-semibold">
          Look here. Compare this to protein × 10.
        </p>
        <p className="border-b border-sesame-ink py-1 text-right text-xs font-semibold">% Daily Value*</p>
        {rows.map((row) => (
          <p
            key={row.label}
            className={`flex items-baseline justify-between border-b border-sesame-ink py-0.5 text-sm leading-tight text-sesame-muted ${
              row.indent ? "pl-3 font-normal" : "font-semibold"
            }`}
          >
            <span>{row.label} —</span>
            <span />
          </p>
        ))}
        <p className="flex items-baseline justify-between py-0.5 text-sm leading-tight font-semibold">
          <span>
            Protein <span className="tabular-nums">{proteinText}</span>
          </span>
          {proteinDv ? <span className="tabular-nums">{proteinDv}</span> : <span />}
        </p>
        <div className="h-2 bg-sesame-ink" />
        <p
          className={`px-2 py-1.5 text-xs leading-snug font-semibold ${
            meta ? meta.labelTone : "bg-steel/40"
          }`}
        >
          {proteinNote}
        </p>
        <p className="mt-2 text-xs leading-snug text-sesame-muted">
          *Calories and protein update from the boxes. The other lines stay blank on purpose — those two numbers
          are the trick.
        </p>
      </div>
      <figcaption className="mt-3 text-center text-xs leading-relaxed text-muted">
        Same two lines on every package. Calories, then protein.
      </figcaption>
    </figure>
  );
}
