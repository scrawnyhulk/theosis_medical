import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { creditKicker, hacks, hacksIntro } from "@/lib/hacks";

export const Route = createFileRoute("/hacks/")({
  component: HacksHub,
  head: () => ({
    meta: [
      { title: "Holwey’s Handy Health Hacks — Theosis Medical" },
      {
        name: "description",
        content:
          "Holwey’s Handy Health Hacks: the 20% that does 80% of the work. Protein, calories, drinks, fast food, and the mechanisms behind them.",
      },
    ],
  }),
});

function HacksHub() {
  const featured = hacks.find((h) => h.featured);
  const rest = hacks.filter((h) => !h.featured);

  return (
    <SiteShell>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            {hacksIntro.kicker}
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-wide sm:text-6xl">
            {hacksIntro.title}
          </h1>
          <div className="mt-6 max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
            {hacksIntro.paragraphs.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm text-muted">{hacksIntro.disclaimer}</p>
          <p className="mt-6 text-lg">
            <Link
              to="/hacks/nerd-out/$topic"
              params={{ topic: "protein" }}
              className="font-medium text-accent hover:text-fg"
            >
              Why do we care about protein?
            </Link>
            <span className="text-muted"> The short nerd version.</span>
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">Pick a hack</p>
        {featured ? (
          <Link
            to="/hacks/$slug"
            params={{ slug: featured.slug }}
            className="group mt-8 flex flex-col rounded-xl bg-surface p-6 shadow-border transition-colors duration-150 hover:bg-fg/5 sm:p-10 md:flex-row md:items-end md:justify-between md:gap-10"
          >
            <div className="max-w-2xl">
              <p className="text-xs font-medium tracking-widest text-accent uppercase">Start here</p>
              <p className="mt-3 font-display text-3xl font-semibold text-accent">{featured.n}</p>
              <h2 className="mt-2 font-display text-4xl font-semibold tracking-wide uppercase sm:text-5xl">
                {featured.title}
              </h2>
              {featured.stolenFrom ? (
                <p className="mt-3 text-xs font-medium tracking-widest text-muted uppercase">
                  {creditKicker(featured.stolenFrom, featured.jokeSteal)}
                </p>
              ) : null}
              <p className="mt-4 text-lg leading-relaxed text-muted">{featured.lede}</p>
            </div>
            <span className="mt-6 inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-medium text-accent md:mt-0">
              Open this hack
              <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </span>
          </Link>
        ) : null}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {rest.map((hack) => (
            <Link
              key={hack.slug}
              to="/hacks/$slug"
              params={{ slug: hack.slug }}
              className="group flex flex-col rounded-xl bg-surface p-6 shadow-border transition-colors duration-150 hover:bg-fg/5 sm:p-8"
            >
              <p className="font-display text-3xl font-semibold text-accent">{hack.n}</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-wide uppercase">
                {hack.title}
              </h2>
              {hack.stolenFrom ? (
                <p className="mt-2 text-xs font-medium tracking-widest text-muted uppercase">
                  {creditKicker(hack.stolenFrom, hack.jokeSteal)}
                </p>
              ) : null}
              <p className="mt-3 flex-1 leading-relaxed text-muted">{hack.lede}</p>
              <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent">
                Open this hack
                <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
