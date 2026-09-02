"use client";

import { useEffect, useId, useMemo, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function wrap(n: number, count: number) {
  return ((n % count) + count) % count;
}

function circularOffset(from: number, to: number, count: number) {
  let d = to - from;
  while (d > count / 2) d -= count;
  while (d < -count / 2) d += count;
  return d;
}

export function SpinWheel({
  count,
  label,
  children,
  className,
  onCardClick,
}: {
  count: number;
  label: string;
  children: (index: number, active: boolean) => ReactNode;
  className?: string;
  onCardClick?: (index: number, active: boolean) => void;
}) {
  const uid = useId();
  const stageRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [spin, setSpin] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [narrow, setNarrow] = useState(false);
  const drag = useRef({ x: 0, spin: 0, moved: false, down: false, id: -1 });
  const wheelLock = useRef(0);
  const goByRef = useRef<(delta: number) => void>(() => {});
  const step = count > 0 ? 360 / count : 360;
  const position = count ? -spin / step : 0;

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setNarrow(el.clientWidth < 640));
    ro.observe(el);
    setNarrow(el.clientWidth < 640);

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const now = performance.now();
      if (now - wheelLock.current < 380) return;
      const primary = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      if (Math.abs(primary) < 6) return;
      wheelLock.current = now;
      goByRef.current(primary > 0 ? 1 : -1);
    }
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      ro.disconnect();
      el.removeEventListener("wheel", onWheel);
    };
  }, []);

  function goBy(delta: number) {
    if (!count) return;
    setIndex((i) => wrap(i + delta, count));
    setSpin((s) => s - delta * step);
  }
  goByRef.current = goBy;

  function goTo(next: number) {
    goBy(circularOffset(index, next, count));
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        goBy(1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goBy(-1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const items = useMemo(() => Array.from({ length: count }, (_, i) => i), [count]);

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    drag.current = { x: e.clientX, spin, moved: false, down: true, id: e.pointerId };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current.down || e.pointerId !== drag.current.id) return;
    const dx = e.clientX - drag.current.x;
    if (!drag.current.moved && Math.abs(dx) < 8) return;
    if (!drag.current.moved) {
      drag.current.moved = true;
      e.currentTarget.setPointerCapture(e.pointerId);
      setDragging(true);
    }
    const nextSpin = drag.current.spin + dx * 0.32;
    setSpin(nextSpin);
    setIndex(wrap(Math.round(-nextSpin / step), count));
  }

  function onPointerUp(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current.down || e.pointerId !== drag.current.id) return;
    const wasDrag = drag.current.moved;
    drag.current.down = false;
    if (wasDrag) {
      setDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {
        /* already released */
      }
      const snapped = Math.round(spin / step) * step;
      setSpin(snapped);
      setIndex(wrap(Math.round(-snapped / step), count));
    }
  }

  if (count < 1) return null;

  return (
    <div className={cn("mt-6", className)}>
      <div className="flex items-end justify-between gap-3">
        <p className="font-display text-sm font-semibold tracking-widest text-accent uppercase">
          {String(index + 1).padStart(2, "0")} of {String(count).padStart(2, "0")}
        </p>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-sm text-fg shadow-border hover:bg-fg/8"
            aria-label={`Previous ${label}`}
            onClick={() => goBy(-1)}
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            className="flex size-11 items-center justify-center rounded-sm text-fg shadow-border hover:bg-fg/8"
            aria-label={`Next ${label}`}
            onClick={() => goBy(1)}
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div className="relative left-1/2 mt-4 w-screen max-w-[100vw] -translate-x-1/2 overflow-visible">
        <div
          ref={stageRef}
          className="relative mx-auto h-[42rem] max-w-[90rem] cursor-grab touch-pan-y select-none overflow-visible active:cursor-grabbing sm:h-[46rem]"
          style={{
            perspective: "1100px",
            perspectiveOrigin: "50% 50%",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, transparent 0%, #000 12%, #000 88%, transparent 100%)",
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          role="region"
          aria-roledescription="carousel"
          aria-label={label}
        >
          {items.map((i) => {
            const offset = circularOffset(position, i, count);
            if (Math.abs(offset) > 2.6) return null;
            const abs = Math.abs(offset);
            const active = Math.round(offset) === 0;
            const x = offset * (narrow ? 46 : 62);
            const rot = offset * (narrow ? -42 : -50);
            const z = -abs * (narrow ? 90 : 130);
            const scale = 1 - abs * (narrow ? 0.12 : 0.1);
            const opacity = Math.max(0, 1 - abs * 0.42);
            return (
              <div
                key={`${uid}-${i}`}
                className="absolute top-1/2 left-1/2 w-[min(22rem,calc(100vw-3rem))]"
                style={{
                  transform: `translate(-50%, -50%) translateX(${x}%) rotateY(${rot}deg) translateZ(${z}px) scale(${scale})`,
                  transformStyle: "preserve-3d",
                  zIndex: Math.round((2.5 - abs) * 10),
                  opacity,
                  transition: dragging
                    ? "none"
                    : "transform 650ms cubic-bezier(0.22, 1, 0.36, 1), opacity 650ms ease",
                  pointerEvents: abs < 1.6 ? "auto" : "none",
                }}
              >
                <button
                  type="button"
                  tabIndex={active ? 0 : -1}
                  aria-current={active ? "true" : undefined}
                  aria-label={`${active ? "Enlarge" : "Show"} ${label} ${i + 1}`}
                  className="block w-full cursor-zoom-in rounded-xl text-left"
                  onClick={() => {
                    if (drag.current.moved) return;
                    if (!active) goTo(i);
                    onCardClick?.(i, active);
                  }}
                >
                  {children(i, active)}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-3 flex justify-center gap-1.5">
        {items.map((i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to ${label} ${i + 1}`}
            onClick={() => goTo(i)}
            className={cn(
              "size-2 rounded-full transition-transform duration-200",
              i === index ? "scale-125 bg-accent" : "bg-steel/35 hover:bg-steel/60",
            )}
          />
        ))}
      </div>
    </div>
  );
}
