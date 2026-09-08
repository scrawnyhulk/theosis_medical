import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const goals = [
  {
    id: "extreme-loss",
    label: "Extreme fat loss",
    also: "Aggressive diabetes reversal",
    multiplier: 8,
    band: "7–9",
    hint: "Calories = body weight × 8. Range 7–9. Too fast? Step up.",
  },
  {
    id: "moderate-loss",
    label: "Moderate fat loss",
    also: "Moderate diabetes reversal",
    multiplier: 10,
    band: "10–12",
    hint: "Calories = body weight × 10. Range 10–12. Too fast? Step up.",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    multiplier: 14,
    band: "13–15",
    hint: "Calories = body weight × 14. Range 13–15.",
  },
  {
    id: "moderate-gain",
    label: "Moderate weight gain",
    multiplier: 17,
    band: "16–18",
    hint: "Calories = body weight × 17. Range 16–18.",
  },
  {
    id: "extreme-gain",
    label: "Extreme weight gain",
    multiplier: 20,
    band: "19–21",
    hint: "Calories = body weight × 20. Range 19–21.",
  },
] as const;

export function StartCalculator({ compact = false }: { compact?: boolean }) {
  const [pounds, setPounds] = useState("");
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
    <div className={compact ? "" : "rounded-xl bg-surface p-5 shadow-border sm:p-8"}>
      {compact ? (
        <p className="mb-4 text-sm text-muted">
          Calories = body weight × a goal number. Protein = 1 g per pound.
        </p>
      ) : (
        <>
          <p className="text-xs font-medium tracking-widest text-muted uppercase">Your numbers</p>
          <h3 className="mt-2 font-display text-3xl font-semibold tracking-wide">
            Goal → calories → protein
          </h3>
          <p className="mt-3 max-w-xl text-muted">
            Calories = body weight × 7–21. Protein = 1 g per pound. Leftover calories are ordinary food.
          </p>
        </>
      )}
      <div className={compact ? "max-w-xs" : "mt-6 max-w-xs"}>
        <Label htmlFor={compact ? "tldr-start-pounds" : "start-pounds"}>Body weight (pounds)</Label>
        <Input
          id={compact ? "tldr-start-pounds" : "start-pounds"}
          inputMode="decimal"
          value={pounds}
          onChange={(e) => setPounds(e.target.value)}
        />
      </div>
      <div className="mt-6">
        <p className="mb-2 text-xs font-medium tracking-widest text-muted uppercase">The goal</p>
        <div className="flex flex-wrap gap-2">
          {goals.map((g) => {
            const selected = g.id === goalId;
            const also = "also" in g ? g.also : undefined;
            return (
              <Button
                key={g.id}
                type="button"
                size="sm"
                variant={selected ? "default" : "outline"}
                className={also ? "h-auto min-h-11 flex-col items-start gap-0.5 whitespace-normal py-2 text-left" : undefined}
                onClick={() => setGoalId(g.id)}
              >
                <span>{g.label}</span>
                {also ? (
                  <span
                    className={cn(
                      "text-[0.7rem] font-medium tracking-wider uppercase",
                      selected ? "text-accent-fg/80" : "text-muted",
                    )}
                  >
                    {also}
                  </span>
                ) : null}
              </Button>
            );
          })}
        </div>
        <p className="mt-3 text-sm text-muted">{goal.hint}</p>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-warn">
          On insulin or other glucose-lowering meds? Don’t start a drastic calorie cut without talking with your physician first.
        </p>
      </div>
      {result ? (
        <dl className="mt-8 grid gap-4 sm:grid-cols-3">
          <Stat
            label="Calories / day"
            value={String(result.calories)}
            note={`${goal.multiplier} × body weight`}
          />
          <Stat label="Protein" value={`${result.protein} g`} note="1 g per pound" />
          <Stat
            label="Leftover after protein"
            value={`${result.remaining} cal`}
            note="Protein at 4 cal/g. Real food brings some fat with it."
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
