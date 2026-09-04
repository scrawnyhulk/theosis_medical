import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { minutes, minutesIntro, type Minute } from "@/lib/minutes";

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

function MinuteCard({ minute }: { minute: Minute }) {
  if (minute.cover) {
    return (
      <Link
        to="/minutes/$slug"
        params={{ slug: minute.slug }}
        className="group block overflow-hidden rounded-xl bg-ink shadow-border"
      >
        <span className="relative block aspect-[3/2] overflow-hidden rounded-xl">
          <img
            src={minute.cover}
            alt={minute.coverAlt ?? minute.title}
            className="absolute inset-0 size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
          <span className="relative z-10 flex h-full min-h-11 flex-col justify-end p-6 sm:p-8">
            <span className="font-display text-3xl font-semibold text-accent">{minute.n}</span>
            <span className="mt-2 font-display text-3xl font-semibold tracking-wide text-white uppercase">
              {minute.title}
            </span>
            <span className="mt-2 block text-sm leading-relaxed text-white/85 sm:text-base">
              {minute.lede}
            </span>
          </span>
        </span>
      </Link>
    );
  }

  return (
    <Link
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
  );
}

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
          {[...minutes]
            .sort((a, b) => a.n.localeCompare(b.n))
            .map((minute) => (
              <MinuteCard key={minute.slug} minute={minute} />
            ))}

          <a
            href="/#suggest"
            className="group block overflow-hidden rounded-xl bg-ink shadow-border"
          >
            <span className="relative block aspect-[3/2] overflow-hidden rounded-xl">
              <img
                src="/images/minutes-more-cover.png"
                alt="Laptop on a desk with organs and medical symbols rising off the screen — more Medical Minutes to come."
                className="absolute inset-0 size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
              <span className="relative z-10 flex h-full min-h-11 flex-col justify-end p-6 sm:p-8">
                <span className="font-display text-3xl font-semibold text-accent">10+</span>
                <span className="mt-2 font-display text-3xl font-semibold tracking-wide text-white uppercase">
                  More to come
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-white/85 sm:text-base">
                  More conditions, explained the same way. Have something you keep Googling at 2 a.m., or a
                  topic you wish someone had walked you through in the ER? Tell me what you would find
                  useful.
                </span>
                <span className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent">
                  Suggest a topic
                  <ArrowRight className="size-4 transition-transform duration-150 group-hover:translate-x-0.5" />
                </span>
              </span>
            </span>
          </a>
        </div>
      </section>
    </SiteShell>
  );
}
