"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HacksPlaque } from "@/components/site/holwey-hacks-mark";
import { nerdCovers, nerdGroups, nerdTopics } from "@/lib/hacks";

const slides = nerdGroups.flatMap((group) =>
  group.topicIds.map((id) => {
    const topic = nerdTopics.find((t) => t.id === id);
    if (!topic) return null;
    const n = String(nerdTopics.findIndex((t) => t.id === id) + 1).padStart(2, "0");
    return { topic, group, n, cover: nerdCovers[topic.id] };
  }),
).filter((s) => s !== null);

const fadeMask =
  "linear-gradient(90deg, transparent 0%, #000 4%, #000 96%, transparent 100%)";

export function NerdOutCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const scrollingRef = useRef(false);
  const draggedRef = useRef(false);

  const goTo = useCallback((i: number) => {
    const next = Math.max(0, Math.min(slides.length - 1, i));
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
        const mid = slide.offsetLeft + slide.clientWidth / 2;
        const dist = Math.abs(mid - center);
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

  const current = slides[index];
  const upcoming = slides[index + 1];

  return (
    <div className="mt-10">
      <div
        className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2"
        style={
          {
            "--card-h": "min(calc(70vw * 10 / 16), calc(100svh - 22rem))",
            "--card-w": "calc(var(--card-h) * 16 / 10)",
            "--card-inset": "max(0.75rem, calc((100% - var(--card-w)) / 2))",
          } as CSSProperties
        }
      >
        <nav
          className="mb-3 flex flex-wrap items-center gap-x-5 gap-y-2"
          style={{ paddingInline: "var(--card-inset)" }}
          aria-label="Nutritional Nerd Out groups"
        >
          {nerdGroups.map((group) => {
            const first = slides.findIndex((s) => s.group.id === group.id);
            const active = current?.group.id === group.id;
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
          aria-label="Nutritional Nerd Out topics"
        >
          {slides.map((slide, i) => (
            <Link
              key={slide.topic.id}
              to="/hacks/nerd-out/$topic"
              params={{ topic: slide.topic.id }}
              className="group relative isolate h-[var(--card-h)] w-[var(--card-w)] shrink-0 snap-center overflow-hidden rounded-xl bg-ink shadow-border"
              draggable={false}
              onClick={(event) => {
                if (draggedRef.current) event.preventDefault();
              }}
            >
              {slide.cover ? (
                <img
                  src={slide.cover.src}
                  alt={slide.cover.alt}
                  draggable={false}
                  className="pointer-events-none absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
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
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
              <div className="relative flex h-full flex-col justify-end p-5 sm:p-7 lg:p-8">
                <p className="font-display text-3xl font-semibold text-accent sm:text-4xl">{slide.n}</p>
                <h3 className="mt-1 font-display text-2xl font-semibold tracking-wide text-white uppercase sm:text-4xl">
                  {slide.topic.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className="absolute top-1/2 left-2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm disabled:opacity-30 sm:left-4 sm:size-12"
          aria-label="Previous topic"
        >
          <ChevronLeft className="size-6" />
        </button>
        <button
          type="button"
          onClick={() => goTo(index + 1)}
          disabled={index === slides.length - 1}
          className="absolute top-1/2 right-2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm disabled:opacity-30 sm:right-4 sm:size-12"
          aria-label="Next topic"
        >
          <ChevronRight className="size-6" />
        </button>
        </div>
      </div>

      <div className="mx-auto mt-4 max-w-xl px-2">
        <label className="sr-only" htmlFor="nerd-out-slider">
          Scrub through Nutritional Nerd Out topics
        </label>
        <input
          id="nerd-out-slider"
          type="range"
          min={0}
          max={slides.length - 1}
          step={1}
          value={index}
          onChange={(event) => goTo(Number(event.target.value))}
          aria-valuetext={`${current?.n} ${current?.topic.title}`}
          className="nerd-out-slider w-full"
        />
        <div className="mt-4 flex items-baseline justify-between gap-4 text-sm">
          <p className="font-medium text-fg">
            {current?.n} / {String(slides.length).padStart(2, "0")}
          </p>
          {upcoming ? (
            <button
              type="button"
              onClick={() => goTo(index + 1)}
              className="truncate text-right text-muted hover:text-fg"
            >
              Next: {upcoming.topic.title}
            </button>
          ) : (
            <p className="text-muted">Last topic</p>
          )}
        </div>
      </div>
    </div>
  );
}
