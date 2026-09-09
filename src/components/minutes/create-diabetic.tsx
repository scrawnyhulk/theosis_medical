"use client";

import { useCallback, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const SQ = 36;
const VISC = 60;
const ECTO = 82;

const STAGES = [
  { src: "/images/diabetic-lean.jpg", alt: "Lean anatomical figure with healthy organs and little stored fat." },
  { src: "/images/diabetic-subq.jpg", alt: "Subcutaneous fat filling under the skin of the abdomen and thighs." },
  { src: "/images/diabetic-visceral.jpg", alt: "Visceral fat wrapping the intestines and abdominal organs." },
  { src: "/images/diabetic-ectopic.jpg", alt: "Fatty liver, fatty pancreas, and marbled muscle — ectopic fat." },
  { src: "/images/diabetic-spill.jpg", alt: "Fuel spilling into the bloodstream — type 2 diabetes." },
] as const;

const TICKS = [
  { at: SQ, label: "Subcutaneous threshold" },
  { at: VISC, label: "Visceral threshold" },
  { at: ECTO, label: "Ectopic threshold" },
] as const;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function stageIndex(v: number) {
  if (v < 8) return 0;
  if (v < SQ) return 1;
  if (v < VISC) return 2;
  if (v < ECTO) return 3;
  return 4;
}

function stageCopy(v: number) {
  if (v < 8) {
    return {
      title: "Lean",
      line: "No extra fuel in the tank. Muscle, organs, and blood look the way they should.",
    };
  }
  if (v < SQ) {
    return {
      title: "Filling subcutaneous fat",
      line: "The pinchable fat under the skin is the safe storage tank. This is where extra fuel is supposed to go.",
    };
  }
  if (v < VISC) {
    return {
      title: "Subcutaneous threshold crossed",
      line: "That tank is full. Extra fuel now wraps the organs as visceral fat.",
    };
  }
  if (v < ECTO) {
    return {
      title: "Visceral threshold crossed",
      line: "The space around the organs is full. Fat is landing in the liver, pancreas, and muscle — places that were never meant to be storage.",
    };
  }
  return {
    title: "Ectopic fat maxed — type 2 diabetes",
    line: "Liver, pancreas, and muscle are saturated. Glucose and fat spill into the blood. That is type 2 diabetes.",
  };
}

function useSliderDrag(axis: "x" | "y", onChange: (n: number) => void) {
  const trackRef = useRef<HTMLDivElement>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  const read = useCallback(
    (clientX: number, clientY: number) => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const t =
        axis === "y"
          ? 1 - (clientY - r.top) / Math.max(1, r.height)
          : (clientX - r.left) / Math.max(1, r.width);
      onChangeRef.current(Math.round(clamp01(t) * 100));
    },
    [axis],
  );

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      e.preventDefault();
      e.currentTarget.focus();
      read(e.clientX, e.clientY);

      const move = (ev: PointerEvent) => {
        ev.preventDefault();
        read(ev.clientX, ev.clientY);
      };
      const up = () => {
        window.removeEventListener("pointermove", move);
        window.removeEventListener("pointerup", up);
        window.removeEventListener("pointercancel", up);
      };
      window.addEventListener("pointermove", move, { passive: false });
      window.addEventListener("pointerup", up);
      window.addEventListener("pointercancel", up);
    },
    [read],
  );

  return { trackRef, onPointerDown };
}

function keys(onChange: (n: number) => void, value: number) {
  return (e: React.KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "ArrowRight") {
      e.preventDefault();
      onChange(Math.min(100, value + 2));
    }
    if (e.key === "ArrowDown" || e.key === "ArrowLeft") {
      e.preventDefault();
      onChange(Math.max(0, value - 2));
    }
    if (e.key === "Home") {
      e.preventDefault();
      onChange(0);
    }
    if (e.key === "End") {
      e.preventDefault();
      onChange(100);
    }
  };
}

export function CreateDiabetic() {
  const [v, setV] = useState(0);
  const stage = stageCopy(v);
  const shown = stageIndex(v);
  const live = `${stage.title}. ${stage.line}`;

  return (
    <div className="mt-10 rounded-xl bg-ink p-5 text-ink-fg shadow-border sm:p-8">
      <p className="text-xs font-medium tracking-widest text-ink-muted uppercase">The overflow</p>
      <h2 className="mt-2 font-display text-3xl font-semibold tracking-wide">Slide the fuel in</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
        Green is empty. Dark red is a full spill into the blood. Three ticks mark the tanks filling up. Drag the
        slider.
      </p>

      <div className="mt-8 flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:justify-center lg:gap-12">
        <div className="relative w-full max-w-md">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-[#070b12]">
            {STAGES.map((s, i) => (
              <img
                key={s.src}
                src={s.src}
                alt={i === shown ? s.alt : ""}
                className="absolute inset-0 size-full object-cover object-top"
                style={{ opacity: i === shown ? 1 : 0 }}
                draggable={false}
              />
            ))}
            {v >= ECTO ? (
              <p className="pointer-events-none absolute inset-x-0 top-4 text-center font-display text-sm font-semibold tracking-[0.22em] text-[#e07070] sm:text-base">
                TYPE 2 DIABETES
              </p>
            ) : null}
          </div>
        </div>

        <SpectrumSlider value={v} onChange={setV} live={live} />
      </div>

      <div className="mt-8 border-t border-white/10 pt-6">
        <p className="font-display text-2xl font-semibold tracking-wide text-accent">{stage.title}</p>
        <p className="mt-2 max-w-2xl text-base leading-relaxed text-ink-fg/90">{stage.line}</p>
        <p className="mt-4 text-sm text-warn">
          On insulin or other glucose-lowering meds? Don’t start a drastic calorie cut without talking with your
          physician first.
        </p>
        <p className="mt-4 text-sm text-ink-muted">
          This is a teaching model of the personal fat threshold — not your personal threshold, and not type 1
          diabetes. The longer version, with the studies, is in{" "}
          <Link
            to="/hacks/nerd-out/$topic"
            params={{ topic: "personal-fat-threshold" }}
            className="text-accent hover:text-accent-fg"
          >
            Nutritional Nerd Out
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

function SpectrumSlider({
  value,
  onChange,
  live,
}: {
  value: number;
  onChange: (n: number) => void;
  live: string;
}) {
  return (
    <div className="flex w-full max-w-lg flex-col gap-8 lg:w-64 lg:max-w-none lg:self-stretch">
      <VerticalBar value={value} onChange={onChange} live={live} className="hidden lg:flex" />
      <HorizontalBar value={value} onChange={onChange} live={live} className="lg:hidden" />
    </div>
  );
}

function VerticalBar({
  value,
  onChange,
  live,
  className,
}: {
  value: number;
  onChange: (n: number) => void;
  live: string;
  className?: string;
}) {
  const { trackRef, onPointerDown } = useSliderDrag("y", onChange);

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col select-none", className)}>
      <p className="mb-3 text-[10px] font-medium tracking-[0.18em] text-ink-muted uppercase">Type 2 diabetes</p>
      <div className="relative min-h-80 flex-1">
        <div
          ref={trackRef}
          role="slider"
          tabIndex={0}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={live}
          aria-label="Fat accumulation from lean to type 2 diabetes"
          aria-orientation="vertical"
          className="absolute inset-y-0 left-0 z-10 w-16 cursor-ns-resize touch-none outline-none"
          onPointerDown={onPointerDown}
          onKeyDown={keys(onChange, value)}
        >
          <span
            className="pointer-events-none absolute top-0 bottom-0 left-5 w-3 rounded-full"
            style={{
              background:
                "linear-gradient(to top, #3d9a6a 0%, #b7c94a 28%, #d4a056 52%, #e07070 78%, #6b1212 100%)",
            }}
          />
          <span
            className="pointer-events-none absolute left-[1.05rem] size-5 -translate-y-1/2 rounded-full bg-[#c5d0de] shadow-[0_0_0_3px_#05080d,inset_0_1px_2px_rgba(255,255,255,0.55),0_6px_14px_rgba(0,0,0,0.45)]"
            style={{ top: `${100 - value}%` }}
          />
        </div>
        {TICKS.map((tick) => (
          <div
            key={tick.at}
            className="pointer-events-none absolute left-14 right-0"
            style={{ bottom: `${tick.at}%`, transform: "translateY(50%)" }}
          >
            <div className="flex items-center gap-2">
              <span className="h-px w-5 bg-ink-fg/70" />
              <span className="text-[11px] leading-tight text-ink-muted">{tick.label}</span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] font-medium tracking-[0.18em] text-ink-muted uppercase">No extra fat</p>
    </div>
  );
}

function HorizontalBar({
  value,
  onChange,
  live,
  className,
}: {
  value: number;
  onChange: (n: number) => void;
  live: string;
  className?: string;
}) {
  const { trackRef, onPointerDown } = useSliderDrag("x", onChange);

  return (
    <div className={cn("w-full pb-10 select-none", className)}>
      <div className="flex justify-between text-[10px] font-medium tracking-[0.18em] text-ink-muted uppercase">
        <span>No extra fat</span>
        <span>Type 2 diabetes</span>
      </div>
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={value}
        aria-valuetext={live}
        aria-label="Fat accumulation from lean to type 2 diabetes"
        aria-orientation="horizontal"
        className="relative mt-3 h-14 w-full cursor-ew-resize touch-none outline-none"
        onPointerDown={onPointerDown}
        onKeyDown={keys(onChange, value)}
      >
        <span
          className="pointer-events-none absolute top-1/2 right-0 left-0 h-3 -translate-y-1/2 rounded-full"
          style={{
            background:
              "linear-gradient(to right, #3d9a6a 0%, #b7c94a 28%, #d4a056 52%, #e07070 78%, #6b1212 100%)",
          }}
        />
        <span
          className="pointer-events-none absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#c5d0de] shadow-[0_0_0_3px_#05080d,inset_0_1px_2px_rgba(255,255,255,0.55),0_6px_14px_rgba(0,0,0,0.45)]"
          style={{ left: `${value}%` }}
        />
        {TICKS.map((tick) => (
          <span
            key={tick.at}
            className="pointer-events-none absolute top-full mt-2 w-24 -translate-x-1/2 text-center text-[10px] leading-tight text-ink-muted"
            style={{ left: `${tick.at}%` }}
          >
            {tick.label}
          </span>
        ))}
      </div>
    </div>
  );
}
