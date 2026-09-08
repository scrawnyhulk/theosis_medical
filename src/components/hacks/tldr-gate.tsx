"use client";

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hackCovers } from "@/lib/hacks";
import { cn } from "@/lib/utils";

const KEY = "theosis-hacks-tldr-gate";

export function TldrGate() {
  const [mounted, setMounted] = useState(false);
  const [inView, setInView] = useState(false);
  const cover = hackCovers.tldr;

  useEffect(() => {
    if (sessionStorage.getItem(KEY) === "1") return;
    setMounted(true);
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setInView(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") dismiss();
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [mounted]);

  function dismiss() {
    sessionStorage.setItem(KEY, "1");
    setInView(false);
  }

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[70] flex items-center justify-center overflow-hidden p-4 sm:p-8",
        "bg-ink/80 transition-opacity duration-500 ease-out motion-reduce:duration-150",
        inView ? "opacity-100" : "opacity-0",
      )}
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tldr-gate-title"
    >
      <div
        className={cn(
          "relative w-full max-w-5xl overflow-hidden rounded-xl bg-ink shadow-ink-ring",
          "origin-right transition-[transform,opacity] duration-500 motion-reduce:duration-150",
          inView
            ? "translate-x-0 opacity-100"
            : "translate-x-[110%] opacity-40 motion-reduce:translate-x-0 motion-reduce:opacity-0",
        )}
        style={{ transitionTimingFunction: "var(--ease-out)" }}
        onClick={(e) => e.stopPropagation()}
        onTransitionEnd={(e) => {
          if (e.target !== e.currentTarget) return;
          if (e.propertyName !== "transform") return;
          if (!inView) setMounted(false);
        }}
      >
        <div className="relative aspect-[16/10] max-h-[82vh] min-h-[20rem] w-full sm:min-h-[24rem]">
          {cover ? (
            <img
              src={cover.src}
              alt=""
              className="absolute inset-0 size-full object-cover"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15" />
          <button
            type="button"
            onClick={dismiss}
            className="absolute top-3 right-3 z-10 inline-flex size-11 items-center justify-center rounded-sm text-ink-fg hover:bg-ink-fg/10 sm:top-4 sm:right-4"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
          <div className="relative flex h-full flex-col justify-end p-6 sm:p-10">
            <p className="font-display text-3xl font-semibold tracking-wide text-accent uppercase sm:text-5xl">
              In a rush?
            </p>
            <h2
              id="tldr-gate-title"
              className="mt-2 font-display text-4xl font-semibold tracking-wide text-ink-fg uppercase sm:text-6xl"
            >
              Here’s the TL;DR
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl">
              If not, a plethora of info awaits ahead.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button asChild size="lg">
                <Link to="/hacks/$slug" params={{ slug: "tldr" }} onClick={dismiss}>
                  Show me the short list
                </Link>
              </Button>
              <Button type="button" variant="onInkOutline" size="lg" onClick={dismiss}>
                I’ll take the long way
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
