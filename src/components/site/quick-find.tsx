"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Link } from "@tanstack/react-router";
import { ChevronDown, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hacks, nerdGroups, nerdTopics } from "@/lib/hacks";
import { minutes } from "@/lib/minutes";
import { nav } from "@/lib/content";
import { cn } from "@/lib/utils";

type Section = "minutes" | "hacks" | "nerd" | null;

export function QuickFind() {
  const [open, setOpen] = useState(false);
  const [section, setSection] = useState<Section>(null);
  const [mounted, setMounted] = useState(false);

  function close() {
    setOpen(false);
    setSection(null);
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

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
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-ink shadow-ink-ring transition-transform duration-200 ease-out",
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

        <div className="flex-1 overflow-y-auto p-2">
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
            label="Nerd Out"
            onToggle={() => setSection((v) => (v === "nerd" ? null : "nerd"))}
          >
            <Link
              to="/hacks/nerd-out"
              onClick={close}
              className="flex min-h-11 items-center px-3 text-sm text-accent"
            >
              All Nerd Out
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
