"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { EnlargeableImage } from "@/components/hacks/enlargeable-image";
import { NerdParagraph } from "@/components/hacks/nerd-paragraph";
import { cn } from "@/lib/utils";

export type NerdStep = {
  title: string;
  kicker?: string;
  paragraphs?: readonly string[];
  image: string;
  imageAlt: string;
  imageCredit: string;
  extraImage?: string;
  extraImageAlt?: string;
  extraImageCredit?: string;
};

export function NerdStepper({ steps, topicId }: { steps: readonly NerdStep[]; topicId: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
  }, [topicId]);

  const last = steps.length - 1;
  const step = steps[Math.min(index, last)];
  if (!step) return null;

  function go(next: number) {
    setIndex(Math.max(0, Math.min(last, next)));
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        go(index + 1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(index - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, last]);

  const n = String(index + 1).padStart(2, "0");

  return (
    <div className="mt-10">
      <div className="flex items-end justify-between gap-3">
        <div>
          <p className="font-display text-sm font-semibold tracking-widest text-accent uppercase">
            {n} of {String(steps.length).padStart(2, "0")}
          </p>
          <h2 className="mt-1 font-display text-3xl font-semibold tracking-wide sm:text-4xl">{step.title}</h2>
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-sm text-fg shadow-border hover:bg-fg/8 disabled:opacity-30"
            aria-label="Previous graphic"
            disabled={index === 0}
            onClick={() => go(index - 1)}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-sm text-fg shadow-border hover:bg-fg/8 disabled:opacity-30"
            aria-label="Next graphic"
            disabled={index === last}
            onClick={() => go(index + 1)}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      {step.kicker ? (
        <p className="mt-4 font-display text-2xl font-semibold tracking-wide">{step.kicker}</p>
      ) : null}

      {step.paragraphs && step.paragraphs.length > 0 ? (
        <div className="mt-5 space-y-5 text-lg leading-relaxed text-muted">
          {step.paragraphs.map((p) => (
            <NerdParagraph key={p.slice(0, 36)} text={p} />
          ))}
        </div>
      ) : null}

      <figure className="mt-6">
        <EnlargeableImage src={step.image} alt={step.imageAlt} />
        <figcaption className="mt-3 text-sm leading-relaxed text-muted">{step.imageCredit}</figcaption>
      </figure>

      {step.extraImage ? (
        <figure className="mt-8">
          <EnlargeableImage src={step.extraImage} alt={step.extraImageAlt ?? ""} />
          <figcaption className="mt-3 text-sm leading-relaxed text-muted">{step.extraImageCredit}</figcaption>
        </figure>
      ) : null}

      <ol className="mt-8 flex flex-wrap gap-2">
        {steps.map((item, i) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => go(i)}
              className={cn(
                "rounded-sm px-3 py-2 text-left text-xs font-medium tracking-wide uppercase",
                i === index ? "bg-accent text-accent-fg" : "text-muted shadow-border hover:text-fg",
              )}
              aria-current={i === index ? "step" : undefined}
            >
              {String(i + 1).padStart(2, "0")} — {item.title}
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
