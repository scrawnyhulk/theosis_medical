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
    hint: "Calories are a height-adjusted weight × 7–9. Shown is 8. Too fast? Increase to 9.",
  },
  {
    id: "moderate-loss",
    label: "Moderate fat loss",
    also: "Moderate diabetes reversal",
    multiplier: 10,
    band: "10–12",
    hint: "Calories are a height-adjusted weight × 10–12. Shown is 10. Too fast? Increase to 11 or 12.",
  },
  {
    id: "maintenance",
    label: "Maintenance",
    multiplier: 14,
    band: "13–15",
    hint: "Calories are a height-adjusted weight × 13–15. Shown is 14.",
  },
  {
    id: "moderate-gain",
    label: "Moderate weight gain",
    multiplier: 17,
    band: "16–18",
    hint: "Calories are a height-adjusted weight × 16–18. Shown is 17.",
  },
  {
    id: "extreme-gain",
    label: "Extreme weight gain",
    multiplier: 20,
    band: "19–21",
    hint: "Calories are a height-adjusted weight × 19–21. Shown is 20.",
  },
] as const;

type Sex = "female" | "male";

/** Hamwi goal weight. Under 5 feet, the per-inch amount is subtracted. */
function heightGoalPounds(sex: Sex, totalInches: number) {
  const over = totalInches - 60;
  return sex === "female" ? 100 + 5 * over : 106 + 6 * over;
}

/**
 * The video multiplies scale weight. Stored fat does not burn like lean tissue,
 * so weight above a height-based goal only counts 40% (adjusted body weight).
 */
function adjustedPounds(actual: number, goal: number) {
  if (actual <= goal) return actual;
  return goal + 0.4 * (actual - goal);
}

export function StartCalculator({ compact = false }: { compact?: boolean }) {
  const [pounds, setPounds] = useState("");
  const [feet, setFeet] = useState("");
  const [inches, setInches] = useState("");
  const [sex, setSex] = useState<Sex | "">("");
  const [goalId, setGoalId] = useState<(typeof goals)[number]["id"]>("moderate-loss");

  const goal = goals.find((g) => g.id === goalId) ?? goals[1];

  const result = useMemo(() => {
    const n = Number(pounds);
    const ft = Number(feet);
    const inch = inches === "" ? 0 : Number(inches);
    if (!Number.isFinite(n) || n <= 0 || pounds === "") return null;
    if (!sex || !Number.isFinite(ft) || ft < 4 || ft > 7 || feet === "") return null;
    if (!Number.isFinite(inch) || inch < 0 || inch >= 12) return null;
    const totalInches = ft * 12 + inch;
    const heightGoal = heightGoalPounds(sex, totalInches);
    if (heightGoal < 70) return null;
    const basis = adjustedPounds(n, heightGoal);
    const protein = Math.round(basis);
    const calories = Math.round(basis * goal.multiplier);
    const remaining = Math.max(0, calories - protein * 4);
    const scaleCalories = Math.round(n * goal.multiplier);
    return {
      protein,
      calories,
      remaining,
      basis: Math.round(basis),
      heightGoal: Math.round(heightGoal),
      scaleCalories,
      adjusted: Math.round(basis) !== Math.round(n),
    };
  }, [pounds, feet, inches, sex, goal.multiplier]);

  const ready = Boolean(sex) && feet !== "" && pounds !== "";

  return (
    <div className={compact ? "" : "rounded-xl bg-surface p-5 shadow-border sm:p-8"}>
      {compact ? (
        <p className="mb-4 text-sm text-muted">
          Same goal multipliers as the video. Height and sex correct the weight first, so a shorter person is not handed a tall person’s calories.
        </p>
      ) : (
        <>
          <p className="text-xs font-medium tracking-widest text-muted uppercase">Your numbers</p>
          <h3 className="mt-2 font-display text-3xl font-semibold tracking-wide">
            Goal → calories → protein
          </h3>
          <p className="mt-3 max-w-xl text-muted">
            The video is body weight × 7–21. That overshoots when a lot of the weight is stored fat, which is common in a shorter person. Height sets a goal weight. Only 40% of the pounds above that still count. Then his multiplier runs.
          </p>
        </>
      )}
      <div className={cn("grid gap-4 sm:grid-cols-2", compact ? "" : "mt-6")}>
        <div>
          <Label htmlFor={compact ? "tldr-start-pounds" : "start-pounds"}>Body weight (pounds)</Label>
          <Input
            id={compact ? "tldr-start-pounds" : "start-pounds"}
            inputMode="decimal"
            value={pounds}
            onChange={(e) => setPounds(e.target.value)}
          />
        </div>
        <div>
          <Label>Height</Label>
          <div className="grid grid-cols-2 gap-2">
            <Input
              id={compact ? "tldr-start-feet" : "start-feet"}
              inputMode="numeric"
              aria-label="Height, feet"
              placeholder="ft"
              value={feet}
              onChange={(e) => setFeet(e.target.value)}
            />
            <Input
              id={compact ? "tldr-start-inches" : "start-inches"}
              inputMode="numeric"
              aria-label="Height, inches"
              placeholder="in"
              value={inches}
              onChange={(e) => setInches(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <p className="mb-2 text-xs font-medium tracking-widest text-muted uppercase">Sex</p>
        <div className="flex flex-wrap gap-2">
          {(
            [
              ["female", "Female"],
              ["male", "Male"],
            ] as const
          ).map(([id, label]) => (
            <Button
              key={id}
              type="button"
              size="sm"
              variant={sex === id ? "default" : "outline"}
              onClick={() => setSex(id)}
            >
              {label}
            </Button>
          ))}
        </div>
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
        <>
          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat
              label="Calories / day"
              value={String(result.calories)}
              note={
                result.adjusted
                  ? `${goal.multiplier} × ${result.basis} lb, adjusted for height`
                  : `${goal.multiplier} × body weight`
              }
            />
            <Stat
              label="Protein"
              value={`${result.protein} g`}
              note={result.adjusted ? "1 g per pound of that adjusted weight" : "1 g per pound"}
            />
            <Stat
              label="Leftover after protein"
              value={`${result.remaining} cal`}
              note="Eat whatever you want within this amount of total calories"
            />
          </dl>
          {result.adjusted ? (
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Scale weight × {goal.multiplier} would be {result.scaleCalories.toLocaleString()} calories. A height goal for this person is about {result.heightGoal} lb. Only 40% of the weight above that counts, so the multiplier uses {result.basis} lb.
            </p>
          ) : null}
        </>
      ) : (
        <p className="mt-6 text-muted">
          {ready ? "Check the height." : "Enter weight, height, and sex to see the targets."}
        </p>
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
