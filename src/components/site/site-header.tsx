import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoLockup } from "@/components/site/logo-lockup";
import { HolweyHacksMark } from "@/components/site/holwey-hacks-mark";
import { QuickFind } from "@/components/site/quick-find";
import { nav } from "@/lib/content";
import { SHOW_VISIT_DEMO } from "@/lib/demo";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  function close() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-5">
          <QuickFind />
          <Link to="/" className="group flex min-h-11 shrink-0 items-center" onClick={close}>
            <LogoLockup />
          </Link>
          <nav className="hidden items-center gap-4 whitespace-nowrap xl:flex" aria-label="Primary">
            {nav.map((item) => (
              <Link
                key={item.hash}
                to="/"
                hash={item.hash}
                className="shrink-0 text-sm font-medium tracking-wide text-muted uppercase transition-colors duration-150 hover:text-fg"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/minutes"
              className="shrink-0 text-sm font-medium tracking-wide text-muted uppercase transition-colors duration-150 hover:text-fg"
              activeProps={{ className: "text-fg" }}
            >
              Medical Minutes
            </Link>
            <Link
              to="/hacks"
              className="group shrink-0"
              activeProps={{ className: "group" }}
              aria-label="Holwey Health Hacks"
            >
              <HolweyHacksMark />
            </Link>
            {SHOW_VISIT_DEMO ? (
              <Link
                to="/visits"
                className="shrink-0 text-sm font-medium tracking-wide text-muted uppercase transition-colors duration-150 hover:text-fg"
                activeProps={{ className: "text-fg" }}
              >
                Visits
                <span className="ml-1 text-[9px] tracking-widest text-accent">Demo</span>
              </Link>
            ) : null}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild variant="invert" size="sm" className="hidden md:inline-flex">
            <Link to="/" hash="contact">
              How to contact
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>
      <div
        id="mobile-nav"
        hidden={!open}
        className={cn(
          "border-t border-border bg-bg/90 backdrop-blur-md xl:hidden",
          open ? "block" : "hidden",
        )}
      >
        <nav className="mx-auto flex max-w-6xl flex-col px-5 py-3" aria-label="Mobile">
          {nav.map((item) => (
            <Link
              key={item.hash}
              to="/"
              hash={item.hash}
              className="flex min-h-12 items-center border-b border-border text-base font-medium text-fg"
              onClick={close}
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/minutes"
            className="flex min-h-12 items-center border-b border-border text-base font-medium tracking-wide text-fg uppercase"
            onClick={close}
          >
            Medical Minutes
          </Link>
          <Link
            to="/hacks"
            className="group flex min-h-12 items-center border-b border-border py-2"
            onClick={close}
            aria-label="Holwey Health Hacks"
          >
            <HolweyHacksMark />
          </Link>
          {SHOW_VISIT_DEMO ? (
            <Link
              to="/visits"
              className="flex min-h-12 items-center border-b border-border text-base font-medium text-fg"
              onClick={close}
            >
              Visits
              <span className="ml-2 text-[10px] tracking-widest text-accent uppercase">Demo</span>
            </Link>
          ) : null}
          <Link
            to="/"
            hash="contact"
            className="flex min-h-12 items-center text-base font-medium text-accent"
            onClick={close}
          >
            How to contact
          </Link>
        </nav>
      </div>
    </header>
  );
}
