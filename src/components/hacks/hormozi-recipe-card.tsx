"use client";

import { useEffect, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { SpinWheel } from "@/components/site/spin-wheel";
import { hormoziRecipes, proteinPercent, type StapleRecipe } from "@/lib/hacks";
import { cn } from "@/lib/utils";

export function HormoziRecipeCard({
  recipe,
  index,
  size = "wheel",
}: {
  recipe: StapleRecipe;
  index: number;
  size?: "wheel" | "large";
}) {
  const pct = Math.round(proteinPercent(recipe));
  const large = size === "large";

  return (
    <article
      className={cn(
        "relative rounded-xl bg-surface shadow-border",
        large ? "p-6 sm:p-10" : "p-5 sm:p-7",
      )}
    >
      {!large ? (
        <span className="absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-sm bg-ink/80 text-ink-fg">
          <ZoomIn className="size-5" />
        </span>
      ) : null}
      <p
        className={cn(
          "font-display font-semibold text-accent",
          large ? "text-3xl" : "text-2xl",
        )}
      >
        {String(index + 1).padStart(2, "0")}
      </p>
      <h3
        className={cn(
          "mt-1 font-display font-semibold tracking-wide",
          large ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl",
        )}
      >
        {recipe.name}
      </h3>
      <p className={cn("mt-3 leading-relaxed text-muted", large ? "text-xl" : "text-[15px]")}>
        {recipe.how}
      </p>
      <ul className={cn("mt-3 space-y-1.5 text-fg", large ? "text-lg" : "text-[15px]")}>
        {recipe.ingredients.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
      {recipe.swap ? (
        <p className={cn("mt-3 leading-relaxed text-muted", large ? "text-lg" : "text-sm")}>
          {recipe.swap}
        </p>
      ) : null}
      <dl
        className={cn(
          "grid grid-cols-2 gap-2 sm:grid-cols-4",
          large ? "mt-6 text-base" : "mt-4 pr-12 text-sm",
        )}
      >
        <Macro label="Calories" value={recipe.calories} />
        <Macro label="Protein" value={`${recipe.protein} g`} />
        <Macro
          label="Carbs / Fat"
          value={`${recipe.carbs} g / ${recipe.fat} g`}
        />
        <Macro label="% protein" value={`${pct}%`} />
      </dl>
    </article>
  );
}

function Macro({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-md bg-ink px-3 py-2">
      <dt className="text-[10px] tracking-widest text-ink-muted uppercase">{label}</dt>
      <dd className="mt-1 font-medium tabular-nums text-ink-fg">{value}</dd>
    </div>
  );
}

export function HormoziRecipeLightbox({
  recipe,
  index,
  onClose,
}: {
  recipe: StapleRecipe;
  index: number;
  onClose: () => void;
}) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[80] cursor-zoom-out overflow-auto bg-black/85 p-4 sm:p-8"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={recipe.name}
    >
      <div className="mx-auto my-6 w-full max-w-2xl cursor-zoom-out">
        <HormoziRecipeCard recipe={recipe} index={index} size="large" />
      </div>
      <span className="pointer-events-none fixed right-4 bottom-6 flex size-11 items-center justify-center rounded-sm bg-ink text-ink-fg shadow-ink-ring">
        <ZoomOut className="size-5" />
      </span>
    </div>
  );
}

export function HormoziCookbook() {
  const [open, setOpen] = useState<number | null>(null);
  const recipe = open == null ? undefined : hormoziRecipes[open];

  return (
    <>
      <SpinWheel
        count={hormoziRecipes.length}
        label="Hormozi recipe"
        onCardClick={(i) => setOpen(i)}
      >
        {(i) => {
          const item = hormoziRecipes[i];
          if (!item) return null;
          return <HormoziRecipeCard recipe={item} index={i} />;
        }}
      </SpinWheel>
      {recipe && open != null ? (
        <HormoziRecipeLightbox recipe={recipe} index={open} onClose={() => setOpen(null)} />
      ) : null}
    </>
  );
}
