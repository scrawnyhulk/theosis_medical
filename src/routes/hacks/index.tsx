import { createFileRoute, Link } from "@tanstack/react-router";
import { HacksCarousel } from "@/components/hacks/hacks-carousel";
import { SiteShell } from "@/components/site/site-shell";
import { hacksIntro } from "@/lib/hacks";

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
  return (
    <SiteShell>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 pt-12 pb-8 sm:px-8 lg:pt-16 lg:pb-10">
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

      <section className="px-5 py-10 sm:px-8 lg:py-12">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">Pick a hack</p>
        </div>
        <HacksCarousel />
      </section>
    </SiteShell>
  );
}
