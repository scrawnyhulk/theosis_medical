import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { NutritionFactsLabel } from "@/components/hacks/nutrition-facts-label";
import { proteinBandMeta, scoreProtein } from "@/lib/protein-score";

export function ProteinLabelPair({ compact = false }: { compact?: boolean }) {
  const [calories, setCalories] = useState("90");
  const [protein, setProtein] = useState("16");

  return (
    <div
      className={
        compact
          ? "grid items-start gap-6 sm:grid-cols-[minmax(0,260px)_minmax(0,1fr)]"
          : "grid items-start gap-8 lg:grid-cols-[minmax(0,280px)_minmax(0,1fr)]"
      }
    >
      <NutritionFactsLabel calories={calories} protein={protein} />
      <ProteinLabelTool
        compact={compact}
        calories={calories}
        protein={protein}
        onCalories={setCalories}
        onProtein={setProtein}
      />
    </div>
  );
}

export function ProteinLabelTool({
  compact = false,
  calories,
  protein,
  onCalories,
  onProtein,
}: {
  compact?: boolean;
  calories: string;
  protein: string;
  onCalories: (value: string) => void;
  onProtein: (value: string) => void;
}) {

  const result = scoreProtein(calories, protein);

  return (
    <div className={compact ? "" : "rounded-xl bg-surface p-5 shadow-border sm:p-8"}>
      {compact ? (
        <p className="mb-5 text-sm leading-relaxed text-muted">
          Pull those two numbers off any package. The label updates as you type.
        </p>
      ) : (
        <>
          <p className="text-xs font-medium tracking-widest text-muted uppercase">Try a label</p>
          <h3 className="mt-2 font-display text-3xl font-semibold tracking-wide">Protein × 10 vs calories</h3>
          <p className="mt-3 max-w-xl text-muted">
            Pull two numbers off the panel. Hitting × 10 (40% protein) is the ideal. 30% or more is still fine.
          </p>
        </>
      )}
      <div className={compact ? "grid gap-4" : "mt-6 grid gap-5 sm:grid-cols-2"}>
        <div>
          <Label htmlFor={compact ? "tldr-hack-calories" : "hack-calories"}>Calories per serving</Label>
          <Input
            id={compact ? "tldr-hack-calories" : "hack-calories"}
            inputMode="decimal"
            value={calories}
            onChange={(e) => onCalories(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor={compact ? "tldr-hack-protein" : "hack-protein"}>Protein grams per serving</Label>
          <Input
            id={compact ? "tldr-hack-protein" : "hack-protein"}
            inputMode="decimal"
            value={protein}
            onChange={(e) => onProtein(e.target.value)}
          />
        </div>
      </div>
      {result ? (
        <div className={cn("mt-6 rounded-md px-5 py-5", proteinBandMeta[result.band].tone)}>
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            {proteinBandMeta[result.band].grade} · {proteinBandMeta[result.band].cutoff}
          </p>
          <p className="mt-2 font-display text-2xl font-semibold tracking-wide">
            Protein × 10 = {result.timesTen}
            <span className="mx-3 text-muted">{result.band === "ideal" ? "≥" : result.band === "fine" ? "close to" : "<"}</span>
            {result.cal} calories
          </p>
          <p className="mt-2 text-lg">{proteinBandMeta[result.band].line}</p>
          <p className="mt-2 text-sm text-muted">
            Roughly {Math.round(result.pct)}% of calories from protein (protein grams × 4 ÷ calories).
          </p>
        </div>
      ) : null}
    </div>
  );
}
