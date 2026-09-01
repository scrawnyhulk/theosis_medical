import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { minutes, minutesIntro } from "@/lib/minutes";

export const Route = createFileRoute("/minutes/")({
  component: MinutesHub,
  head: () => ({
    meta: [
      { title: "Medical Minutes — Theosis Medical" },
      {
        name: "description",
        content:
          "Medical Minutes: common conditions explained in plain language — the talks Nick Holwey, PA-C, gives in the emergency department.",
      },
    ],
  }),
});

function MinutesHub() {
  return (
    <SiteShell>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            {minutesIntro.kicker}
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-wide sm:text-6xl">
            {minutesIntro.title}
          </h1>
          <div className="mt-6 max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
            {minutesIntro.paragraphs.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-sm text-muted">{minutesIntro.disclaimer}</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">Minutes</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {minutes.map((minute) => (
            <Link
              key={minute.slug}
              to="/minutes/$slug"
              params={{ slug: minute.slug }}
              className="group flex flex-col rounded-xl bg-surface p-6 shadow-border transition-colors duration-150 hover:bg-fg/5 sm:p-8"
            >
              <p className="font-display text-3xl font-semibold text-accent">{minute.n}</p>
              <h2 className="mt-4 font-display text-3xl font-semibold tracking-wide uppercase">
                {minute.title}
              </h2>
              <p className="mt-3 flex-1 leading-relaxed text-muted">{minute.lede}</p>
              <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent">
                Open this minute
                <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}

          <a
            href="/#suggest"
            className="group flex flex-col rounded-xl border border-dashed border-border-strong bg-surface/60 p-6 shadow-border transition-colors duration-150 hover:bg-fg/5 sm:p-8"
          >
            <p className="font-display text-3xl font-semibold text-muted">09+</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-wide uppercase">
              More to come
            </h2>
            <p className="mt-3 flex-1 leading-relaxed text-muted">
              More conditions, explained the same way. Have something you keep Googling at 2 a.m., or a
              topic you wish someone had walked you through in the ER? Tell me what you would find
              useful.
            </p>
            <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent">
              Suggest a topic
              <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
            </span>
          </a>
        </div>
      </section>
    </SiteShell>
  );
}
