"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HacksPlaque } from "@/components/site/holwey-hacks-mark";
import {
  creditKicker,
  hackCovers,
  hackGroups,
  hacks,
  type Hack,
  type HackSlug,
} from "@/lib/hacks";
import { cn } from "@/lib/utils";

const fadeMask =
  "linear-gradient(90deg, transparent 0%, #000 5%, #000 95%, transparent 100%)";

function HackCardLink({
  hack,
  className,
  children,
  onClick,
}: {
  hack: Hack;
  className?: string;
  children: ReactNode;
  onClick?: (event: MouseEvent) => void;
}) {
  if (hack.slug === "nerd-out") {
    return (
      <Link to="/hacks/nerd-out" className={className} draggable={false} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <Link
      to="/hacks/$slug"
      params={{ slug: hack.slug }}
      className={className}
      draggable={false}
      onClick={onClick}
    >
      {children}
    </Link>
  );
}

function cardLine(hack: Hack) {
  if (hack.byline) return hack.byline;
  if (hack.stolenFrom && hack.slug !== "where-to-start") {
    return creditKicker(hack.stolenFrom, hack.jokeSteal);
  }
  return hack.lede;
}

export function HacksCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const scrollingRef = useRef(false);
  const draggedRef = useRef(false);
  const wheelLock = useRef(0);

  const goTo = useCallback((i: number) => {
    const next = Math.max(0, Math.min(hacks.length - 1, i));
    const scroller = scrollerRef.current;
    const slide = scroller?.children[next] as HTMLElement | undefined;
    if (!scroller || !slide) return;
    scrollingRef.current = true;
    setIndex(next);
    const left = slide.offsetLeft - (scroller.clientWidth - slide.clientWidth) / 2;
    scroller.scrollTo({ left, behavior: "smooth" });
    window.setTimeout(() => {
      scrollingRef.current = false;
    }, 420);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onScroll = () => {
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < scroller.children.length; i++) {
        const slide = scroller.children[i] as HTMLElement;
        const dist = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      setIndex(best);
    };

    scroller.addEventListener("scroll", onScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const drag = { id: -1, x: 0, scroll: 0, moved: false };

    const nearest = () => {
      const center = scroller.scrollLeft + scroller.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < scroller.children.length; i++) {
        const slide = scroller.children[i] as HTMLElement;
        const dist = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - center);
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      return best;
    };

    const down = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (event.button !== 0) return;
      drag.id = event.pointerId;
      drag.x = event.clientX;
      drag.scroll = scroller.scrollLeft;
      drag.moved = false;
    };

    const move = (event: PointerEvent) => {
      if (event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) < 12) return;
      if (!drag.moved) {
        drag.moved = true;
        draggedRef.current = true;
        scroller.setPointerCapture(event.pointerId);
        scroller.style.scrollSnapType = "none";
      }
      event.preventDefault();
      scroller.scrollLeft = drag.scroll - dx;
    };

    const up = (event: PointerEvent) => {
      if (event.pointerId !== drag.id) return;
      drag.id = -1;
      scroller.style.scrollSnapType = "";
      if (drag.moved) {
        goTo(nearest());
        window.setTimeout(() => {
          draggedRef.current = false;
        }, 250);
      }
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
  }, [goTo]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const onWheel = (event: WheelEvent) => {
      if (event.ctrlKey) return;
      const mostlyVertical = Math.abs(event.deltaY) > Math.abs(event.deltaX);
      if (!mostlyVertical && event.deltaX === 0) return;
      event.preventDefault();
      const now = Date.now();
      if (now - wheelLock.current < 380) return;
      const delta = mostlyVertical ? event.deltaY : event.deltaX;
      if (Math.abs(delta) < 8) return;
      wheelLock.current = now;
      goTo(index + (delta > 0 ? 1 : -1));
    };

    scroller.addEventListener("wheel", onWheel, { passive: false });
    return () => scroller.removeEventListener("wheel", onWheel);
  }, [goTo, index]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
      if (event.key === "ArrowRight") {
        event.preventDefault();
        goTo(index + 1);
      }
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        goTo(index - 1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goTo, index]);

  const current = hacks[index];
  const upcoming = hacks[index + 1];
  const currentGroup =
    hackGroups.find((group) => (group.slugs as readonly HackSlug[]).includes(current?.slug)) ??
    hackGroups[0];

  return (
    <div className="mt-8">
      <div
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2"
        style={
          {
            "--card-h": "min(calc(72vw * 2 / 3), calc(100svh - 21rem))",
            "--card-w": "calc(var(--card-h) * 3 / 2)",
            "--card-inset": "max(0.75rem, calc((100% - var(--card-w)) / 2))",
          } as CSSProperties
        }
      >
        <nav
          className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2"
          style={{ paddingInline: "var(--card-inset)" }}
          aria-label="Health Hack tracks"
        >
          {hackGroups.map((group) => {
            const first = hacks.findIndex((hack) =>
              (group.slugs as readonly HackSlug[]).includes(hack.slug),
            );
            const active = group.id === currentGroup.id;
            if (active) {
              return (
                <h2 key={group.id} className="m-0">
                  <HacksPlaque title={group.title} inline />
                </h2>
              );
            }
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => goTo(first)}
                className="min-h-11 font-display text-sm font-semibold tracking-[0.16em] text-muted uppercase hover:text-fg"
              >
                {group.title}
              </button>
            );
          })}
        </nav>

        <div className="relative">
          <div
            ref={scrollerRef}
            className="flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto pb-2 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden active:cursor-grabbing"
            style={{
              WebkitMaskImage: fadeMask,
              maskImage: fadeMask,
              paddingInline: "var(--card-inset)",
            }}
            aria-label="Health Hacks"
          >
            {hacks.map((hack, i) => {
              const cover = hackCovers[hack.slug];
              const active = i === index;
              return (
                <HackCardLink
                  key={hack.slug}
                  hack={hack}
                  className={cn(
                    "group relative isolate h-[var(--card-h)] w-[var(--card-w)] shrink-0 snap-center overflow-hidden rounded-xl bg-ink shadow-border transition-transform duration-300 ease-out",
                    active ? "scale-100" : "scale-[0.94]",
                  )}
                  onClick={(event) => {
                    if (draggedRef.current) event.preventDefault();
                  }}
                >
                  {cover ? (
                    <img
                      src={cover.src}
                      alt={cover.alt}
                      draggable={false}
                      className={cn(
                        "pointer-events-none absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105",
                        cover.object ?? "object-center",
                      )}
                      loading={i < 2 ? "eager" : "lazy"}
                    />
                  ) : (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundColor: "rgb(8 13 20)",
                        backgroundImage: "url(/images/navy-grain.jpg)",
                        backgroundSize: "420px",
                      }}
                      aria-hidden
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
                  <div className="relative flex h-full flex-col justify-end p-5 sm:p-7 lg:p-8">
                    {hack.featured ? (
                      <p className="mb-2 text-xs font-medium tracking-widest text-accent uppercase">
                        Read this first
                      </p>
                    ) : null}
                    <p className="font-display text-3xl font-semibold text-accent sm:text-4xl">{hack.n}</p>
                    <h3 className="mt-1 font-display text-2xl font-semibold tracking-wide text-white uppercase sm:text-4xl">
                      {hack.title}
                    </h3>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/85 sm:text-base">
                      {cardLine(hack)}
                    </p>
                  </div>
                </HackCardLink>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => goTo(index - 1)}
            disabled={index === 0}
            className="absolute top-1/2 left-2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm disabled:opacity-30 sm:left-4 sm:size-12"
            aria-label="Previous hack"
          >
            <ChevronLeft className="size-6" />
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            disabled={index === hacks.length - 1}
            className="absolute top-1/2 right-2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm disabled:opacity-30 sm:right-4 sm:size-12"
            aria-label="Next hack"
          >
            <ChevronRight className="size-6" />
          </button>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-xl px-2">
        <label className="sr-only" htmlFor="hacks-slider">
          Scrub through Health Hacks
        </label>
        <input
          id="hacks-slider"
          type="range"
          min={0}
          max={hacks.length - 1}
          step={1}
          value={index}
          onChange={(event) => goTo(Number(event.target.value))}
          aria-valuetext={`${current?.n} ${current?.title}`}
          className="nerd-out-slider w-full"
        />
        <div className="mt-4 flex items-baseline justify-between gap-4 text-sm">
          <p className="font-medium text-fg">
            {current?.n} / {String(hacks.length).padStart(2, "0")}
          </p>
          {upcoming ? (
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="truncate text-right text-muted hover:text-fg"
            >
              Next: {upcoming.title}
            </button>
          ) : (
            <p className="text-muted">Last hack</p>
          )}
        </div>
      </div>
    </div>
  );
}
