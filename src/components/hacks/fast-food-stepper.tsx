"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  peRatio,
  peTone,
  proteinPercent,
  type FastFoodChain,
  type FastFoodItem,
} from "@/lib/hacks";

function sourceLabel(source: FastFoodItem["source"]) {
  if (source === "official") return "Their nutrition page";
  if (source === "built") return "Built from their ingredient numbers";
  return "Common tracker listing";
}

function peClass(tone: ReturnType<typeof peTone>) {
  if (tone === "best") return "bg-ok/20 text-ok";
  if (tone === "good") return "bg-ok/10 text-ok";
  if (tone === "mid") return "bg-warn/20 text-warn";
  return "bg-danger/20 text-danger";
}

export function FastFoodStepper({ chains }: { chains: readonly FastFoodChain[] }) {
  const [index, setIndex] = useState(0);
  const last = chains.length - 1;
  const chain = chains[Math.min(index, last)];
  if (!chain) return null;

  function go(next: number) {
    setIndex(Math.max(0, Math.min(last, next)));
  }

  const items = [...chain.items].sort((a, b) => peRatio(b) - peRatio(a));
  const n = String(index + 1).padStart(2, "0");

  return (
    <div className="mt-2">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-sm font-semibold tracking-widest text-accent uppercase">
            {n} of {String(chains.length).padStart(2, "0")}
          </p>
          <h2 className="mt-1 font-display text-3xl font-semibold tracking-wide sm:text-4xl">{chain.place}</h2>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-sm text-fg shadow-border hover:bg-fg/8 disabled:opacity-30"
            aria-label="Previous restaurant"
            disabled={index === 0}
            onClick={() => go(index - 1)}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-sm text-fg shadow-border hover:bg-fg/8 disabled:opacity-30"
            aria-label="Next restaurant"
            disabled={index === last}
            onClick={() => go(index + 1)}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <p className="mt-3 max-w-3xl leading-relaxed text-muted">{chain.blurb}</p>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[36rem] text-left text-sm">
          <thead className="text-xs font-medium tracking-widest text-muted uppercase">
            <tr>
              <th className="py-2 pr-3 font-medium">Order</th>
              <th className="py-2 pr-3 font-medium">Cal</th>
              <th className="py-2 pr-3 font-medium">P / C / F</th>
              <th className="py-2 pr-3 font-medium">% protein</th>
              <th className="py-2 font-medium">P:E</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const pe = peRatio(item);
              const tone = peTone(pe);
              const pct = Math.round(proteinPercent(item));
              const peLabel = Number.isFinite(pe) ? pe.toFixed(1) : "∞";
              return (
                <tr key={item.name} className="border-t border-border align-top">
                  <td className="py-3 pr-3">
                    <p className="text-fg">{item.name}</p>
                    <p className="mt-1 text-muted">{item.how}</p>
                    <p className="mt-1 text-xs tracking-wide text-muted uppercase">{sourceLabel(item.source)}</p>
                  </td>
                  <td className="py-3 pr-3 tabular-nums text-fg">{item.calories}</td>
                  <td className="py-3 pr-3 tabular-nums text-muted">
                    {item.protein} / {item.carbs} / {item.fat}
                  </td>
                  <td className="py-3 pr-3 tabular-nums text-fg">{pct}%</td>
                  <td className="py-3">
                    <span className={cn("inline-block rounded-md px-2.5 py-1 font-medium tabular-nums", peClass(tone))}>
                      {peLabel}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <ol className="mt-8 flex flex-wrap gap-2">
        {chains.map((entry, i) => (
          <li key={entry.place}>
            <button
              type="button"
              onClick={() => go(i)}
              className={cn(
                "rounded-sm px-3 py-2 text-left text-xs font-medium tracking-wide uppercase",
                i === index ? "bg-accent text-accent-fg" : "text-muted shadow-border hover:text-fg",
              )}
              aria-current={i === index ? "step" : undefined}
            >
              {String(i + 1).padStart(2, "0")} — {entry.place}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
