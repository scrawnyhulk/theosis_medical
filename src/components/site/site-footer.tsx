import { Link } from "@tanstack/react-router";
import { LogoLockup } from "@/components/site/logo-lockup";
import { site } from "@/lib/content";
import { SHOW_VISIT_DEMO } from "@/lib/demo";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-ink-fg">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 border-t border-border px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-3">
          <Link to="/">
            <LogoLockup />
          </Link>
          <p className="text-sm text-ink-muted">{site.founderLine}</p>
          <Link to="/minutes" className="text-sm text-ink-muted hover:text-ink-fg">
            Medical Minutes
          </Link>
          <Link to="/hacks" className="text-sm text-ink-muted hover:text-ink-fg">
            Holwey’s Handy Health Hacks
          </Link>
          {SHOW_VISIT_DEMO ? (
            <Link to="/visits" className="text-sm text-ink-muted hover:text-ink-fg">
              Counseling · playground
            </Link>
          ) : null}
        </div>
        <div className="flex flex-col gap-2 text-sm text-ink-muted md:items-end">
          <a href={site.phoneHref} className="hover:text-ink-fg">
            {site.phoneDisplay}
          </a>
          <a href={site.emailHref} className="hover:text-ink-fg">
            {site.email}
          </a>
          <p>© {site.year} Theosis Medical, LLC</p>
        </div>
      </div>
    </footer>
  );
}
