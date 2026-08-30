"use client";

import { useEffect, useRef, useState } from "react";
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
  const scrollerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef({
    id: -1,
    moved: false,
    x: 0,
    y: 0,
    sl: 0,
    st: 0,
  });

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

  useEffect(() => {
    if (!open) return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const drag = dragRef.current;

    const down = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (event.button !== 0) return;
      drag.id = event.pointerId;
      drag.moved = false;
      drag.x = event.clientX;
      drag.y = event.clientY;
      drag.sl = scroller.scrollLeft;
      drag.st = scroller.scrollTop;
      scroller.setPointerCapture(event.pointerId);
    };

    const move = (event: PointerEvent) => {
      if (event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 8) return;
      drag.moved = true;
      scroller.scrollLeft = drag.sl - dx;
      scroller.scrollTop = drag.st - dy;
    };

    const up = (event: PointerEvent) => {
      if (event.pointerId !== drag.id) return;
      drag.id = -1;
    };

    scroller.addEventListener("pointerdown", down);
    scroller.addEventListener("pointermove", move);
    scroller.addEventListener("pointerup", up);
    scroller.addEventListener("pointercancel", up);
    return () => {
      scroller.removeEventListener("pointerdown", down);
      scroller.removeEventListener("pointermove", move);
      scroller.removeEventListener("pointerup", up);
      scroller.removeEventListener("pointercancel", up);
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
          ref={scrollerRef}
          className="fixed inset-0 z-[80] cursor-grab overflow-auto bg-black/85 p-3 select-none sm:p-6 active:cursor-grabbing"
          onClick={() => {
            if (dragRef.current.moved) return;
            setOpen(false);
          }}
          role="dialog"
          aria-modal="true"
          aria-label={alt}
        >
          <div className="mx-auto my-8 w-fit max-w-none">
            <img
              src={src}
              alt={alt}
              draggable={false}
              className="pointer-events-none block h-auto w-auto max-w-none rounded-sm bg-steel"
            />
          </div>
          <span className="pointer-events-none fixed right-4 bottom-6 flex size-11 items-center justify-center rounded-sm bg-ink text-ink-fg shadow-ink-ring">
            <ZoomOut className="size-5" />
          </span>
        </div>
      ) : null}
    </>
  );
}
