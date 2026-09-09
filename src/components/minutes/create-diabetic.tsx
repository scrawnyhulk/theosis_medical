"use client";

import { useEffect, useId, useState } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

const SQ = 36;
const VISC = 60;
const ECTO = 82;

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n));
}
function ramp(v: number, a: number, b: number) {
  return clamp01((v - a) / (b - a));
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

const TICKS = [
  { at: SQ, label: "Subcutaneous threshold" },
  { at: VISC, label: "Visceral threshold" },
  { at: ECTO, label: "Ectopic threshold" },
] as const;

export function CreateDiabetic() {
  const uid = useId();
  const [v, setV] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    function onChange() {
      setReduceMotion(mq.matches);
    }
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const subq = ramp(v, 4, SQ);
  const visceral = ramp(v, SQ, VISC);
  const ectopic = ramp(v, VISC, ECTO);
  const spill = ramp(v, ECTO, 100);
  const stage = stageCopy(v);
  const live = `${stage.title}. ${stage.line}`;

  return (
    <div className="mt-10 rounded-xl bg-ink p-5 text-ink-fg shadow-border sm:p-8">
      <p className="text-xs font-medium tracking-widest text-ink-muted uppercase">The overflow</p>
      <h2 className="mt-2 font-display text-3xl font-semibold tracking-wide">Slide the fuel in</h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted sm:text-base">
        Green is empty. Dark red is a full spill into the blood. Three ticks mark the tanks filling up.
      </p>

      <div className="mt-8 flex flex-col items-center gap-8 lg:flex-row lg:items-stretch lg:justify-center lg:gap-10">
        <div className="relative w-full max-w-sm">
          <PersonFigure
            uid={uid}
            subq={subq}
            visceral={visceral}
            ectopic={ectopic}
            spill={spill}
            reduceMotion={reduceMotion}
          />
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
    <div className="flex w-full max-w-md flex-col gap-4 lg:w-56 lg:max-w-none">
      <div className="hidden lg:flex lg:flex-1 lg:flex-col">
        <p className="mb-2 text-[10px] font-medium tracking-[0.18em] text-ink-muted uppercase">Type 2 diabetes</p>
        <div className="relative min-h-80 flex-1">
          <div
            className="absolute inset-y-0 left-5 w-3 rounded-full"
            style={{
              background:
                "linear-gradient(to top, #3d9a6a 0%, #b7c94a 28%, #d4a056 52%, #e07070 78%, #6b1212 100%)",
            }}
          />
          {TICKS.map((tick) => (
            <div
              key={tick.at}
              className="absolute right-0 left-0"
              style={{ bottom: `${tick.at}%`, transform: "translateY(50%)" }}
            >
              <div className="flex items-center gap-2">
                <span className="ml-2 h-px w-6 bg-ink-fg/70" />
                <span className="max-w-[9.5rem] text-[11px] leading-tight text-ink-muted">{tick.label}</span>
              </div>
            </div>
          ))}
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            aria-valuetext={live}
            aria-label="Fat accumulation from lean to type 2 diabetes"
            onChange={(e) => onChange(Number(e.target.value))}
            className={cn(
              "absolute inset-y-0 -left-1 w-10 cursor-pointer appearance-none bg-transparent",
              "[&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c5d0de] [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_#05080d,inset_0_1px_2px_rgba(255,255,255,0.55),0_6px_14px_rgba(0,0,0,0.45)]",
              "[&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#c5d0de]",
            )}
            style={{ writingMode: "vertical-lr", direction: "rtl" }}
          />
        </div>
        <p className="mt-2 text-[10px] font-medium tracking-[0.18em] text-ink-muted uppercase">No extra fat</p>
      </div>

      <div className="lg:hidden">
        <div className="flex justify-between text-[10px] font-medium tracking-[0.18em] text-ink-muted uppercase">
          <span>No extra fat</span>
          <span>Type 2 diabetes</span>
        </div>
        <div className="relative mt-3 h-12">
          <div
            className="absolute top-4 right-0 left-0 h-3 rounded-full"
            style={{
              background:
                "linear-gradient(to right, #3d9a6a 0%, #b7c94a 28%, #d4a056 52%, #e07070 78%, #6b1212 100%)",
            }}
          />
          {TICKS.map((tick) => (
            <div
              key={tick.at}
              className="absolute top-0"
              style={{ left: `${tick.at}%`, transform: "translateX(-50%)" }}
            >
              <span className="mx-auto block h-3 w-px bg-ink-fg/70" />
              <span className="mt-6 block w-20 text-center text-[10px] leading-tight text-ink-muted">
                {tick.label}
              </span>
            </div>
          ))}
          <input
            type="range"
            min={0}
            max={100}
            value={value}
            aria-valuetext={live}
            aria-label="Fat accumulation from lean to type 2 diabetes"
            onChange={(e) => onChange(Number(e.target.value))}
            className={cn(
              "absolute top-2 right-0 left-0 h-8 w-full cursor-pointer appearance-none bg-transparent",
              "[&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#c5d0de] [&::-webkit-slider-thumb]:shadow-[0_0_0_3px_#05080d,inset_0_1px_2px_rgba(255,255,255,0.55),0_6px_14px_rgba(0,0,0,0.45)]",
              "[&::-moz-range-track]:bg-transparent [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-[#c5d0de]",
            )}
          />
        </div>
      </div>
    </div>
  );
}

function PersonFigure({
  uid,
  subq,
  visceral,
  ectopic,
  spill,
  reduceMotion,
}: {
  uid: string;
  subq: number;
  visceral: number;
  ectopic: number;
  spill: number;
  reduceMotion: boolean;
}) {
  const fatId = `${uid}-fat`;
  const muscleId = `${uid}-muscle`;
  const liverId = `${uid}-liver`;
  const glowId = `${uid}-glow`;

  const subqScale = 1 + subq * 0.16;
  const viscOpacity = 0.15 + visceral * 0.7;
  const liverFill = ectopic > 0.05 ? `url(#${liverId})` : "#8a3030";
  const pancreasFill = ectopic > 0.15 ? "#c9b056" : "#c4a07a";
  const vessel = spill > 0.08 ? "#e6c15a" : "#9b2b2b";
  const vesselWidth = 2.2 + spill * 1.6;

  return (
    <svg viewBox="0 0 240 540" className="h-auto w-full" role="img" aria-hidden="true">
      <defs>
        <linearGradient id={muscleId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#7a333c" />
          <stop offset="1" stopColor="#3a161c" />
        </linearGradient>
        <radialGradient id={fatId} cx="50%" cy="40%" r="60%">
          <stop offset="0" stopColor="#f3d78a" stopOpacity="0.92" />
          <stop offset="1" stopColor="#c48a32" stopOpacity="0.55" />
        </radialGradient>
        <linearGradient id={liverId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c9b056" />
          <stop offset="1" stopColor="#8a6a20" />
        </linearGradient>
        <filter id={glowId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.5" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <ellipse cx="120" cy="500" rx="70" ry="10" fill="#000" opacity="0.35" />

      {/* Subcutaneous halo */}
      <g
        opacity={0.15 + subq * 0.75}
        transform={`translate(120 250) scale(${subqScale} ${1 + subq * 0.1}) translate(-120 -250)`}
      >
        <path d={BODY} fill={`url(#${fatId})`} />
      </g>

      {/* Muscle body */}
      <path d={BODY} fill={`url(#${muscleId})`} />
      <path d={BODY} fill="none" stroke="#1a0c0e" strokeWidth="1.2" />

      {/* Muscle marbling */}
      <g opacity={ectopic * 0.7} stroke="#e6c15a" strokeWidth="1.4" fill="none">
        <path d="M100 330 C 96 360, 98 400, 96 450" />
        <path d="M108 328 C 106 365, 108 405, 104 455" />
        <path d="M140 330 C 144 360, 142 400, 144 450" />
        <path d="M132 328 C 134 365, 132 405, 136 455" />
        <path d="M64 160 C 58 190, 56 220, 58 250" />
        <path d="M176 160 C 182 190, 184 220, 182 250" />
      </g>

      {/* Organs */}
      <g opacity="0.95">
        <ellipse cx="118" cy="148" rx="16" ry="14" fill="#a33b3b" />
        <ellipse cx="132" cy="146" rx="13" ry="12" fill="#8f2f2f" />
        <path d="M86 176 C 78 188, 80 210, 96 218 C 110 224, 118 210, 116 196 C 114 182, 100 170, 86 176 Z" fill={liverFill} />
        <ellipse cx="132" cy="208" rx="18" ry="12" fill="#b85c5c" opacity="0.9" />
        <ellipse cx="124" cy="216" rx="22" ry="8" fill={pancreasFill} />
        <path
          d="M100 232 C 92 248, 96 268, 120 272 C 144 268, 148 248, 140 232 C 132 244, 108 244, 100 232 Z"
          fill="#9a4444"
          opacity="0.85"
        />
      </g>

      {/* Visceral fat wrapping organs */}
      <g opacity={viscOpacity} fill={`url(#${fatId})`}>
        <ellipse cx="120" cy="248" rx={38 + visceral * 10} ry={28 + visceral * 8} />
        <ellipse cx="102" cy="220" rx={16 + visceral * 6} ry={14 + visceral * 4} />
        <ellipse cx="140" cy="222" rx={14 + visceral * 5} ry={12 + visceral * 4} />
      </g>

      {/* Re-draw organs on top of visceral so they stay readable */}
      <g opacity={0.55 + visceral * 0.2}>
        <path d="M86 176 C 78 188, 80 210, 96 218 C 110 224, 118 210, 116 196 C 114 182, 100 170, 86 176 Z" fill={liverFill} />
        <ellipse cx="124" cy="216" rx="22" ry="8" fill={pancreasFill} />
      </g>

      {/* Vessels */}
      <g
        fill="none"
        stroke={vessel}
        strokeWidth={vesselWidth}
        strokeLinecap="round"
        filter={spill > 0.2 ? `url(#${glowId})` : undefined}
      >
        <path d="M120 160 L120 280" />
        <path d="M120 280 L102 330 L96 500" />
        <path d="M120 280 L138 330 L144 500" />
        <path d="M120 168 L90 200" />
        <path d="M120 168 L150 198" />
      </g>

      {/* Spill particles */}
      {spill > 0.05
        ? [0, 1, 2, 3, 4, 5].map((i) => (
            <circle
              key={i}
              r={2.2 + (i % 3) * 0.4}
              fill={i % 2 === 0 ? "#f5d76e" : "#e07070"}
              opacity={0.4 + spill * 0.6}
            >
              {reduceMotion ? (
                <animate
                  attributeName="opacity"
                  values="0.3;0.9;0.3"
                  dur="2.4s"
                  begin={`${i * 0.3}s`}
                  repeatCount="indefinite"
                />
              ) : (
                <animateMotion
                  dur={`${3.6 + i * 0.35}s`}
                  begin={`${i * 0.45}s`}
                  repeatCount="indefinite"
                  path={i % 2 === 0 ? "M120 168 L120 280 L96 500" : "M120 168 L120 280 L144 500"}
                />
              )}
            </circle>
          ))
        : null}

      {/* Head / neck overlay so fat halo does not swallow the face */}
      <ellipse cx="120" cy="44" rx="23" ry="27" fill={`url(#${muscleId})`} />
      <ellipse cx="120" cy="44" rx="23" ry="27" fill="none" stroke="#1a0c0e" strokeWidth="1.2" />
      <rect x="112" y="68" width="16" height="18" rx="4" fill={`url(#${muscleId})`} />

      {spill > 0.55 ? (
        <text
          x="120"
          y="28"
          textAnchor="middle"
          fill="#e07070"
          fontFamily="Barlow Condensed, sans-serif"
          fontSize="15"
          fontWeight="600"
          letterSpacing="0.12em"
        >
          TYPE 2 DIABETES
        </text>
      ) : null}
    </svg>
  );
}

const BODY =
  "M120 14 C140 14 150 30 150 46 C150 60 142 72 134 78 L142 94 L182 104 C196 108 202 124 200 150 L192 268 C190 282 178 288 168 278 L158 266 L162 498 C162 512 150 520 138 516 L128 392 L112 392 L102 516 C90 520 78 512 78 498 L82 266 L72 278 C62 288 50 282 48 268 L40 150 C38 124 44 108 58 104 L98 94 L106 78 C98 72 90 60 90 46 C90 30 100 14 120 14 Z";
