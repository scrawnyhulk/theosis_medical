import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const goals = [
  {
    id: "extreme-loss",
    label: "Extreme weight loss",
    multiplier: 8,
    band: "7–9",
    hint: "Bottom of the spectrum. Body weight × 7, 8, or 9. Using 8 here. If it drops too fast, step up.",
  },
  {
    id: "moderate-loss",
    label: "Moderate weight loss",
    multiplier: 10,
    band: "10–12",
    hint: "The 10× walkthrough in the video. 10, 11, or 12. Using 10 because the math is clean. Lose too fast? Bump to 11 or 12.",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    multiplier: 14,
    band: "13–15",
    hint: "Hold the line. Body weight × 13, 14, or 15. Using 14, the middle of the band.",
  },
  {
    id: "moderate-gain",
    label: "Moderate weight gain",
    multiplier: 17,
    band: "16–18",
    hint: "A modest surplus. Body weight × 16, 17, or 18. Using 17.",
  },
  {
    id: "extreme-gain",
    label: "Extreme weight gain",
    multiplier: 20,
    band: "19–21",
    hint: "Top of the spectrum. Body weight × 19, 20, or 21. Using 20.",
  },
] as const;

export function StartCalculator() {
  const [pounds, setPounds] = useState("180");
  const [goalId, setGoalId] = useState<(typeof goals)[number]["id"]>("moderate-loss");

  const goal = goals.find((g) => g.id === goalId) ?? goals[1];

  const result = useMemo(() => {
    const n = Number(pounds);
    if (!Number.isFinite(n) || n <= 0 || pounds === "") return null;
    const protein = Math.round(n);
    const calories = Math.round(n * goal.multiplier);
    const proteinCals = protein * 4;
    const remaining = Math.max(0, calories - proteinCals);
    return { protein, calories, proteinCals, remaining };
  }, [pounds, goal.multiplier]);

  return (
    <div className="rounded-xl bg-surface p-5 shadow-border sm:p-8">
      <p className="text-xs font-medium tracking-widest text-muted uppercase">Your numbers</p>
      <h3 className="mt-2 font-display text-3xl font-semibold tracking-wide">
        Goal → calories → protein
      </h3>
      <p className="mt-3 max-w-xl text-muted">
        Same math as the video: body weight × a number from 7 to 21, then 1 g of protein per pound.
        Every three steps on that scale is a different goal. Leftover calories are ordinary food.
      </p>
      <div className="mt-6 max-w-xs">
        <Label htmlFor="start-pounds">Body weight (pounds)</Label>
        <Input
          id="start-pounds"
          inputMode="decimal"
          value={pounds}
          onChange={(e) => setPounds(e.target.value)}
        />
      </div>
      <div className="mt-6">
        <p className="mb-2 text-xs font-medium tracking-widest text-muted uppercase">The goal</p>
        <div className="flex flex-wrap gap-2">
          {goals.map((g) => (
            <Button
              key={g.id}
              type="button"
              size="sm"
              variant={g.id === goalId ? "default" : "outline"}
              onClick={() => setGoalId(g.id)}
            >
              {g.label}
            </Button>
          ))}
        </div>
        <p className="mt-3 text-sm text-muted">{goal.hint}</p>
      </div>
      {result ? (
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat
            label="Calories / day"
            value={String(result.calories)}
            note={`${goal.multiplier} × body weight (× ${goal.band} in the video)`}
          />
          <Stat label="Protein" value={`${result.protein} g`} note="1 g per pound" />
          <Stat
            label="Leftover after protein"
            value={`${result.remaining} cal`}
            note={`${result.proteinCals} cal from protein at 4 cal/g. Real meat brings some fat with it.`}
          />
        </dl>
      ) : (
        <p className="mt-6 text-muted">Enter a weight to see the targets.</p>
      )}
    </div>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) {
  return (
    <div className={cn("rounded-md bg-ink px-4 py-4 text-ink-fg")}>
      <dt className="text-xs font-medium tracking-widest text-ink-muted uppercase">{label}</dt>
      <dd className="mt-2 font-display text-3xl font-semibold tracking-wide">{value}</dd>
      <p className="mt-2 text-sm text-ink-muted">{note}</p>
    </div>
  );
}
