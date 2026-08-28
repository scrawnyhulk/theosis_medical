import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function ProteinLabelTool() {
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");

  const result = useMemo(() => {
    const cal = Number(calories);
    const pro = Number(protein);
    if (!Number.isFinite(cal) || !Number.isFinite(pro) || calories === "" || protein === "") {
      return null;
    }
    const timesTen = pro * 10;
    const pct = cal > 0 ? (pro * 4 * 100) / cal : 0;
    const pass = timesTen >= cal && cal >= 0 && pro >= 0;
    const band =
      pass || pct >= 40
        ? "ideal"
        : pct >= 30
          ? "fine"
          : pct >= 25
            ? "mid"
            : pct >= 20
              ? "c"
              : pct >= 10
                ? "soap"
                : "balloon";
    return { cal, pro, timesTen, pct, band };
  }, [calories, protein]);

  const copy: Record<string, string> = {
    ideal: "Ideal. At least 40% of calories from protein.",
    fine: "Good. 30% or more — still a solid pick.",
    mid: "Fair. Not a protein food, but not junk.",
    c: "Mediocre. More fuel than building material.",
    soap: "Poor. The calories are doing most of the work.",
    balloon: "Very poor. Almost no protein for the energy.",
  };

  const tone: Record<string, string> = {
    ideal: "bg-ok/15 text-fg",
    fine: "bg-accent/15 text-fg",
    mid: "bg-warn/15 text-fg",
    c: "bg-warn/20 text-fg",
    soap: "bg-danger/15 text-fg",
    balloon: "bg-danger/25 text-fg",
  };

  return (
    <div className="rounded-xl bg-surface p-5 shadow-border sm:p-8">
      <p className="text-xs font-medium tracking-widest text-muted uppercase">Try a label</p>
      <h3 className="mt-2 font-display text-3xl font-semibold tracking-wide">Protein × 10 vs calories</h3>
      <p className="mt-3 max-w-xl text-muted">
        Pull two numbers off the panel. Hitting × 10 (40% protein) is the ideal. 30% or more is still fine.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="hack-calories">Calories per serving</Label>
          <Input
            id="hack-calories"
            inputMode="decimal"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="hack-protein">Protein grams per serving</Label>
          <Input
            id="hack-protein"
            inputMode="decimal"
            value={protein}
            onChange={(e) => setProtein(e.target.value)}
          />
        </div>
      </div>
      {result ? (
        <div className={cn("mt-6 rounded-md px-5 py-5", tone[result.band])}>
          <p className="font-display text-2xl font-semibold tracking-wide">
            Protein × 10 = {result.timesTen}
            <span className="mx-3 text-muted">{result.band === "ideal" ? "≥" : result.band === "fine" ? "close to" : "<"}</span>
            {result.cal} calories
          </p>
          <p className="mt-2 text-lg">{copy[result.band]}</p>
          <p className="mt-2 text-sm text-muted">
            Roughly {Math.round(result.pct)}% of calories from protein (protein grams × 4 ÷ calories).
          </p>
        </div>
      ) : null}
    </div>
  );
}
