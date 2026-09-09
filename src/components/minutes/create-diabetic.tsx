"use client";

import { useCallback, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const SQ = 36;
const VISC = 60;
const ECTO = 82;

const STAGES = [
  { src: "/images/diabetic-lean.jpg", at: 0, alt: "Lean anatomical figure with healthy organs and little stored fat." },
  { src: "/images/diabetic-subq.jpg", at: SQ, alt: "Subcutaneous fat filling under the skin of the abdomen and thighs." },
  { src: "/images/diabetic-visceral.jpg", at: VISC, alt: "Visceral fat wrapping the intestines and abdominal organs." },
  { src: "/images/diabetic-ectopic.jpg", at: ECTO, alt: "Fatty liver, fatty pancreas, and marbled muscle — ectopic fat." },
  { src: "/images/diabetic-spill.jpg", at: 100, alt: "Fuel spilling into the bloodstream — type 2 diabetes." },
] as const;

const TICKS = [
  { at: SQ, label: "Subcutaneous threshold" },
  { at: VISC, label: "Visceral threshold" },
  { at: ECTO, label: "Ectopic threshold" },
] as const;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}

function opacities(v: number): number[] {
  const ats = STAGES.map((s) => s.at);
  const out = ats.map(() => 0);
  if (v <= ats[0]) {
    out[0] = 1;
    return out;
  }
  if (v >= ats[ats.length - 1]) {
    out[ats.length - 1] = 1;
    return out;
  }
  for (let i = 0; i < ats.length - 1; i++) {
    if (v >= ats[i] && v <= ats[i + 1]) {
      const t = (v - ats[i]) / (ats[i + 1] - ats[i]);
      out[i] = 1 - t;
      out[i + 1] = t;
      return out;
    }
  }
  return out;
}

function stageCopy(v: number) {
  if (v < 6) {
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

export function CreateDiabetic() {
  const [v, setV] = useState(0);
  const stage = stageCopy(v);
  const layers = opacities(v);
  const live = `${stage.title}. ${stage.line}`;

  return (
    <div className="mt-10 rounded-xl bg-ink p-5 text-ink-fg shadow-border sm:p-8">
      <p className="text-xs font-medium tracking-widest text-ink-muted uppercase">The overflow</p>
      <h2 className="mt-2 font-display text-3xl font-semibold tracking-wide">Slide the fuel in</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
        Green is empty. Dark red is a full spill into the blood. Three ticks mark the tanks filling up. Drag the
        slider — or the bar itself.
      </p>

      <div className="mt-8 flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:justify-center lg:gap-12">
        <div className="relative w-full max-w-md">
          <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-[#070b12]">
            {STAGES.map((s, i) => (
              <img
                key={s.src}
                src={s.src}
                alt={i === 0 ? s.alt : ""}
                className="absolute inset-0 size-full object-cover object-top"
                style={{ opacity: layers[i], transition: "opacity 80ms linear" }}
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
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const apply = useCallback(
    (clientY: number) => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const t = 1 - (clientY - r.top) / r.height;
      onChange(Math.round(clamp01(t) * 100));
    },
    [onChange],
  );

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col", className)}>
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
          className="absolute inset-y-0 left-0 z-10 w-14 cursor-ns-resize touch-none outline-none"
          onPointerDown={(e) => {
            e.preventDefault();
            dragging.current = true;
            e.currentTarget.setPointerCapture(e.pointerId);
            apply(e.clientY);
          }}
          onPointerMove={(e) => {
            if (dragging.current) apply(e.clientY);
          }}
          onPointerUp={() => {
            dragging.current = false;
          }}
          onPointerCancel={() => {
            dragging.current = false;
          }}
          onKeyDown={(e) => {
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
          }}
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
            className="pointer-events-none absolute left-12 right-0"
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
  const trackRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const apply = useCallback(
    (clientX: number) => {
      const el = trackRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const t = (clientX - r.left) / r.width;
      onChange(Math.round(clamp01(t) * 100));
    },
    [onChange],
  );

  return (
    <div className={cn("w-full pb-10", className)}>
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
        className="relative mt-3 h-11 w-full cursor-ew-resize touch-none outline-none"
        onPointerDown={(e) => {
          e.preventDefault();
          dragging.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          apply(e.clientX);
        }}
        onPointerMove={(e) => {
          if (dragging.current) apply(e.clientX);
        }}
        onPointerUp={() => {
          dragging.current = false;
        }}
        onPointerCancel={() => {
          dragging.current = false;
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            onChange(Math.min(100, value + 2));
          }
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
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
        }}
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
