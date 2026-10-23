import { Link, useRouterState } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LogoLockup } from "@/components/site/logo-lockup";
import { QuickFind } from "@/components/site/quick-find";
import { nav } from "@/lib/content";
import { SHOW_VISIT_DEMO } from "@/lib/demo";

import { CircleUser, ClipboardList, Clock, Heart, Map, Mail, MessageCircle, PlayCircle, Star, User } from "lucide-react";
import { PHONE_ICON_STYLE, TabFace, tabClass, type TabIcons } from "@/components/site/phone-tabs";

/** Option A hand-drawn icons (24px line style shared with theosishealth.com). */
const lp = { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 2.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true };
type P = { className?: string };
const A = {
  user: ({ className }: P) => <svg {...lp} className={className}><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" /></svg>,
  heart: ({ className }: P) => <svg {...lp} className={className}><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg>,
  clock: ({ className }: P) => <svg {...lp} className={className}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>,
  map: ({ className }: P) => <svg {...lp} className={className}><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" /><path d="M9 4v14M15 6v14" /></svg>,
  mail: ({ className }: P) => <svg {...lp} className={className}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>,
};

const phoneNav: { to: "/" | "/minutes"; hash?: string; short: string; icons: TabIcons }[] = [
  { to: "/", hash: "about", short: "About", icons: { A: A.user, B: CircleUser, C: User } },
  { to: "/", hash: "why", short: "Why Theosis", icons: { A: A.heart, B: Heart, C: Star } },
  { to: "/minutes", short: "Minutes", icons: { A: A.clock, B: Clock, C: PlayCircle } },
  { to: "/", hash: "plans", short: "Plans", icons: { A: A.map, B: Map, C: ClipboardList } },
  { to: "/", hash: "contact", short: "Contact", icons: { A: A.mail, B: Mail, C: MessageCircle } },
];

export function SiteHeader() {
  function close() {}
  const path = useRouterState({ select: (s) => s.location.pathname });
  // Only real pages highlight (hash tabs are sections of the home page).
  const active = (n: (typeof phoneNav)[number]) => !n.hash && path.startsWith(n.to);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-5">
          <QuickFind />
          <Link to="/" className="group hidden min-h-11 shrink-0 items-center xl:flex" onClick={close}>
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
            {SHOW_VISIT_DEMO ? (
              <Link
                to="/visits"
                className="shrink-0 text-sm font-medium tracking-wide text-muted uppercase transition-colors duration-150 hover:text-fg"
                activeProps={{ className: "text-fg" }}
              >
                Counseling
                <span className="ml-1 text-[9px] tracking-widest text-accent">Demo</span>
              </Link>
            ) : null}
          </nav>
        </div>
        {/* Phones/tablets (<xl): ☰ Quick find on the left + one-tap page icons (same pattern as theosishealth.com). */}
        <nav className="flex flex-1 items-stretch justify-around gap-0.5 xl:hidden" aria-label="Pages">
          {phoneNav.map((n) => (
            <Link key={n.short} to={n.to} hash={n.hash} aria-current={active(n) ? "page" : undefined}
              aria-label={PHONE_ICON_STYLE === "D" ? n.short : undefined} className={tabClass(active(n))}>
              <TabFace icons={n.icons} label={n.short} active={active(n)} />
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 xl:flex">
          <Button asChild variant="invert" size="sm">
            <Link to="/" hash="contact">
              How to contact
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
