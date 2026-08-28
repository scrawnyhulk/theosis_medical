"use client";

import { useEffect, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { cn } from "@/lib/utils";

export function EnlargeableImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="group relative block w-full cursor-zoom-in rounded-xl text-left"
        aria-label={`Enlarge: ${alt}`}
      >
        <img src={src} alt={alt} className={cn("w-full rounded-xl bg-steel", className)} />
        <span className="absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-sm bg-ink/80 text-ink-fg">
          <ZoomIn className="size-5" />
        </span>
      </button>
      {open ? (
        <div
          className="fixed inset-0 z-[80] overflow-y-auto bg-black/85 p-3 sm:p-6"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <div className="mx-auto my-12 max-w-5xl cursor-zoom-out sm:my-16">
            <img src={src} alt={alt} className="w-full rounded-sm bg-steel" />
          </div>
          <span className="pointer-events-none fixed right-4 bottom-6 flex size-11 items-center justify-center rounded-sm bg-ink text-ink-fg shadow-ink-ring">
            <ZoomOut className="size-5" />
          </span>
        </div>
      ) : null}
    </>
  );
}
