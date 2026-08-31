"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hacks, nerdGroups, nerdTopics } from "@/lib/hacks";
import { minutes } from "@/lib/minutes";
import { nav } from "@/lib/content";
import { searchSite, type SearchHit } from "@/lib/site-search";
import { cn } from "@/lib/utils";

type Section = "minutes" | "hacks" | "nerd" | null;

export function QuickFind() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section>(null);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function close() {
    setOpen(false);
    setSection(null);
    setQuery("");
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const hits = searchSite(query);
  const searching = query.trim().length > 0;

  const panel = (
    <>
      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-ink/40"
          aria-label="Close quick find"
          onClick={close}
        />
      ) : null}
      <nav
        id="quick-find-panel"
        aria-label="Quick find"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-border bg-ink shadow-ink-ring transition-transform duration-200 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-3 py-3">
          <p className="px-2 font-display text-2xl font-semibold tracking-wide uppercase">
            Quick Find
          </p>
          <Button variant="ghost" size="icon" aria-label="Close quick find" onClick={close}>
            <X className="size-5" />
          </Button>
        </div>

        <div className="border-b border-border px-3 py-3">
          <label className="relative block">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search the site…"
              className="h-11 w-full rounded-sm bg-fg/8 pr-3 pl-10 text-sm text-ink-fg placeholder:text-muted focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
            />
          </label>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {searching ? (
            hits.length === 0 ? (
              <p className="px-3 py-6 text-sm text-muted">Nothing matches “{query.trim()}”.</p>
            ) : (
              <ul>
                {hits.map((hit) => (
                  <li key={hit.id}>
                    <HitLink hit={hit} onPick={close} />
                  </li>
                ))}
              </ul>
            )
          ) : (
            <>
              {nav.map((item) => (
                <Link
                  key={item.hash}
                  to="/"
                  hash={item.hash}
                  onClick={close}
                  className="flex min-h-11 items-center rounded-sm px-3 text-sm font-medium tracking-wide text-ink-fg uppercase hover:bg-fg/10"
                >
                  {item.label}
                </Link>
              ))}

              <SectionBlock
                open={section === "minutes"}
                label="Medical Minutes"
                onToggle={() => setSection((v) => (v === "minutes" ? null : "minutes"))}
              >
                <Link to="/minutes" onClick={close} className="flex min-h-11 items-center px-3 text-sm text-accent">
                  All Medical Minutes
                </Link>
                {minutes.map((m) => (
                  <Link
                    key={m.slug}
                    to="/minutes/$slug"
                    params={{ slug: m.slug }}
                    onClick={close}
                    className="flex min-h-11 items-center gap-3 px-3 text-sm leading-snug text-fg hover:bg-fg/10"
                  >
                    <span className="font-display text-lg font-semibold text-accent">{m.n}</span>
                    {m.title}
                  </Link>
                ))}
              </SectionBlock>

              <SectionBlock
                open={section === "hacks"}
                label="Holwey Health Hacks"
                onToggle={() => setSection((v) => (v === "hacks" ? null : "hacks"))}
              >
                <Link to="/hacks" onClick={close} className="flex min-h-11 items-center px-3 text-sm text-accent">
                  All Health Hacks
                </Link>
                {hacks.map((h) =>
                  h.slug === "nerd-out" ? (
                    <Link
                      key={h.slug}
                      to="/hacks/nerd-out"
                      onClick={close}
                      className="flex min-h-11 items-center gap-3 px-3 text-sm leading-snug text-fg hover:bg-fg/10"
                    >
                      <span className="font-display text-lg font-semibold text-accent">{h.n}</span>
                      {h.title}
                    </Link>
                  ) : (
                    <Link
                      key={h.slug}
                      to="/hacks/$slug"
                      params={{ slug: h.slug }}
                      onClick={close}
                      className="flex min-h-11 items-center gap-3 px-3 text-sm leading-snug text-fg hover:bg-fg/10"
                    >
                      <span className="font-display text-lg font-semibold text-accent">{h.n}</span>
                      {h.title}
                    </Link>
                  ),
                )}
              </SectionBlock>

              <SectionBlock
                open={section === "nerd"}
                label="Nutritional Nerd Out"
                onToggle={() => setSection((v) => (v === "nerd" ? null : "nerd"))}
              >
                <Link
                  to="/hacks/nerd-out"
                  onClick={close}
                  className="flex min-h-11 items-center px-3 text-sm text-accent"
                >
                  All Nutritional Nerd Out
                </Link>
                {nerdGroups.map((group) => (
                  <div key={group.id} className="mb-3">
                    <p className="px-3 py-2 text-xs font-medium tracking-widest text-accent uppercase">
                      {group.title}
                    </p>
                    {group.topicIds.map((id) => {
                      const topic = nerdTopics.find((t) => t.id === id);
                      if (!topic) return null;
                      return (
                        <Link
                          key={id}
                          to="/hacks/nerd-out/$topic"
                          params={{ topic: id }}
                          onClick={close}
                          className="flex min-h-11 items-center px-3 text-sm leading-snug text-fg hover:bg-fg/10"
                        >
                          {topic.title}
                        </Link>
                      );
                    })}
                  </div>
                ))}
              </SectionBlock>
            </>
          )}
        </div>
      </nav>
    </>
  );

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        aria-expanded={open}
        aria-controls="quick-find-panel"
        aria-label={open ? "Close quick find" : "Quick find"}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? <X className="size-6" /> : (
          <svg viewBox="0 0 28 20" className="size-6" aria-hidden="true">
            <path
              d="M2 4h24M2 10h24M2 16h24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        )}
      </Button>
      {mounted ? createPortal(panel, document.body) : null}
    </>
  );
}

function HitLink({ hit, onPick }: { hit: SearchHit; onPick: () => void }) {
  const className = "flex min-h-11 flex-col justify-center rounded-sm px-3 py-2 hover:bg-fg/10";
  const inner = (
    <>
      <span className="text-[10px] font-medium tracking-widest text-accent uppercase">{hit.section}</span>
      <span className="text-sm leading-snug text-fg">{hit.title}</span>
    </>
  );
  if (hit.hrefKind === "hash") {
    return (
      <Link to="/" hash={hit.hash} onClick={onPick} className={className}>
        {inner}
      </Link>
    );
  }
  if (hit.hrefKind === "minutes") {
    return (
      <Link to="/minutes" onClick={onPick} className={className}>
        {inner}
      </Link>
    );
  }
  if (hit.hrefKind === "minute") {
    return (
      <Link to="/minutes/$slug" params={{ slug: hit.slug }} onClick={onPick} className={className}>
        {inner}
      </Link>
    );
  }
  if (hit.hrefKind === "hacks") {
    return (
      <Link to="/hacks" onClick={onPick} className={className}>
        {inner}
      </Link>
    );
  }
  if (hit.hrefKind === "hack") {
    return (
      <Link to="/hacks/$slug" params={{ slug: hit.slug }} onClick={onPick} className={className}>
        {inner}
      </Link>
    );
  }
  if (hit.hrefKind === "nerd-hub") {
    return (
      <Link to="/hacks/nerd-out" onClick={onPick} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <Link to="/hacks/nerd-out/$topic" params={{ topic: hit.topic }} onClick={onPick} className={className}>
      {inner}
    </Link>
  );
}

function SectionBlock({
  open,
  label,
  onToggle,
  children,
}: {
  open: boolean;
  label: string;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="mb-1">
      <button
        type="button"
        onClick={onToggle}
        className="flex min-h-11 w-full items-center justify-between rounded-sm px-3 text-left text-sm font-medium tracking-wide text-ink-fg uppercase hover:bg-fg/10"
        aria-expanded={open}
      >
        {label}
        <ChevronDown className={cn("size-4 text-accent transition-transform", open && "rotate-180")} />
      </button>
      {open ? <div className="pb-2">{children}</div> : null}
    </div>
  );
}
