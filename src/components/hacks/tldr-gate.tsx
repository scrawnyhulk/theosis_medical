"use client";

import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hackCovers } from "@/lib/hacks";

const KEY = "theosis-hacks-tldr-gate";

export function TldrGate() {
  const [open, setOpen] = useState(false);
  const cover = hackCovers.tldr;

  useEffect(() => {
    if (sessionStorage.getItem(KEY) === "1") return;
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  function dismiss() {
    sessionStorage.setItem(KEY, "1");
    setOpen(false);
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-ink/80 p-4 sm:p-8"
      onClick={dismiss}
      role="dialog"
      aria-modal="true"
      aria-labelledby="tldr-gate-title"
    >
      <div
        className="relative w-full max-w-lg overflow-hidden rounded-xl bg-ink shadow-ink-ring"
        onClick={(e) => e.stopPropagation()}
      >
        {cover ? (
          <img
            src={cover.src}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/25" />
        <button
          type="button"
          onClick={dismiss}
          className="absolute top-3 right-3 z-10 inline-flex size-11 items-center justify-center rounded-sm text-ink-fg hover:bg-ink-fg/10"
          aria-label="Close"
        >
          <X className="size-5" />
        </button>
        <div className="relative flex min-h-[28rem] flex-col justify-end p-6 sm:p-8">
          <p className="text-xs font-medium tracking-widest text-accent uppercase">In a rush?</p>
          <h2
            id="tldr-gate-title"
            className="mt-3 font-display text-4xl font-semibold tracking-wide text-ink-fg uppercase sm:text-5xl"
          >
            Here’s the TL;DR
          </h2>
          <p className="mt-4 max-w-sm text-lg leading-relaxed text-ink-muted">
            If not, a plethora of info awaits ahead.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button asChild>
              <Link to="/hacks/$slug" params={{ slug: "tldr" }} onClick={dismiss}>
                Show me the short list
              </Link>
            </Button>
            <Button type="button" variant="onInkOutline" onClick={dismiss}>
              I’ll take the long way
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
