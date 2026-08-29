"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const CAL_PER_LB = 31;

function parse(value: string): number | null {
  const n = Number(value);
  if (value.trim() === "" || !Number.isFinite(n) || n <= 0) return null;
  return n;
}

function format(n: number): string {
  return String(Math.round(n * 10) / 10);
}

export function FatBurnCalculator() {
  const [weight, setWeight] = useState("");
  const [bf, setBf] = useState("");
  const [fat, setFat] = useState("");

  function onWeight(value: string) {
    setWeight(value);
    const w = parse(value);
    const b = parse(bf);
    const f = parse(fat);
    if (w && b && b < 100) setFat(format((w * b) / 100));
    else if (w && f && f < w) setBf(format((f / w) * 100));
  }

  function onBf(value: string) {
    setBf(value);
    const b = parse(value);
    const w = parse(weight);
    const f = parse(fat);
    if (!b || b >= 100) return;
    if (w) setFat(format((w * b) / 100));
    else if (f) setWeight(format(f / (b / 100)));
  }

  function onFat(value: string) {
    setFat(value);
    const f = parse(value);
    const w = parse(weight);
    const b = parse(bf);
    if (!f) return;
    if (w && f < w) setBf(format((f / w) * 100));
    else if (b && b < 100) setWeight(format(f / (b / 100)));
  }

  const result = useMemo(() => {
    const w = parse(weight);
    const b = parse(bf);
    const f = parse(fat);
    const fatLbs = f ?? (w && b && b < 100 ? (w * b) / 100 : null);
    if (!fatLbs) return null;
    if (w && fatLbs >= w) return { ok: false as const, error: "Pounds of fat has to be less than body weight." };
    if (b && b >= 100) return { ok: false as const, error: "Body-fat percent has to be under 100." };
    return {
      ok: true as const,
      fatLbs,
      calories: Math.round(fatLbs * CAL_PER_LB),
    };
  }, [weight, bf, fat]);

  return (
    <div className="mt-10 rounded-xl bg-surface p-5 shadow-border sm:p-8">
      <p className="text-xs font-medium tracking-widest text-muted uppercase">Your numbers</p>
      <h3 className="mt-2 font-display text-3xl font-semibold tracking-wide">Fat-burn ceiling</h3>
      <p className="mt-3 max-w-xl text-muted">
        Fill in any two. The third fills itself. Then you get the ~31 calories per day per pound of fat
        ceiling — a rule of thumb, not a lab result.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div>
          <Label htmlFor="fat-weight">Body weight (lb)</Label>
          <Input
            id="fat-weight"
            inputMode="decimal"
            value={weight}
            onChange={(e) => onWeight(e.target.value)}
            placeholder="180"
          />
        </div>
        <div>
          <Label htmlFor="fat-bf">Body fat (%)</Label>
          <Input
            id="fat-bf"
            inputMode="decimal"
            value={bf}
            onChange={(e) => onBf(e.target.value)}
            placeholder="25"
          />
        </div>
        <div>
          <Label htmlFor="fat-lbs">Fat on the body (lb)</Label>
          <Input
            id="fat-lbs"
            inputMode="decimal"
            value={fat}
            onChange={(e) => onFat(e.target.value)}
            placeholder="45"
          />
        </div>
      </div>

      {result && !result.ok ? <p className="mt-6 text-sm text-danger">{result.error}</p> : null}

      <div className="mt-6 rounded-lg bg-ink p-5 text-ink-fg sm:p-6">
        <p className="text-xs font-medium tracking-widest text-ink-muted uppercase">The math</p>
        <p className="mt-3 font-display text-2xl font-semibold tracking-wide sm:text-4xl">
          <span className="tabular-nums">
            {result?.ok ? format(result.fatLbs) : "—"} lb fat
          </span>
          <span className="mx-2 text-accent">×</span>
          <span className="tabular-nums">31</span>
          <span className="mx-2 text-ink-muted">=</span>
          <span className="tabular-nums">
            {result?.ok ? `${result.calories.toLocaleString()} cal/day` : "—"}
          </span>
        </p>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">
          31 calories per day for every pound of fat on the body. That is the ceiling.
        </p>
        {result?.ok ? (
          <>
            <p className="mt-4 text-lg font-medium leading-relaxed text-ink-fg">
              Do not run a deficit larger than {result.calories.toLocaleString()} calories per day.
              Past that, fat may not cover the gap — and muscle starts paying.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              As you get leaner, this number falls. Recalculate. Keep protein high and lift.
            </p>
          </>
        ) : (
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Enter any two numbers above and this fills in.
          </p>
        )}
      </div>
    </div>
  );
}
