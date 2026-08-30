import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NerdOutCarousel } from "@/components/hacks/nerd-out-carousel";
import { NerdParagraph } from "@/components/hacks/nerd-paragraph";
import { SiteShell } from "@/components/site/site-shell";
import { getHack, hacks, hacksIntro } from "@/lib/hacks";

export const Route = createFileRoute("/hacks/nerd-out/")({
  component: NerdOutHub,
  head: () => ({
    meta: [
      { title: "Nerd Out — Holwey’s Handy Health Hacks" },
      {
        name: "description",
        content: "Mechanisms. How stuff actually works. Optional reading. Compulsory if you are me.",
      },
    ],
  }),
});

function NerdOutHub() {
  const hack = getHack("nerd-out");
  const index = hacks.findIndex((h) => h.slug === "nerd-out");
  const prev = index > 0 ? hacks[index - 1] : undefined;
  const next = index >= 0 && index < hacks.length - 1 ? hacks[index + 1] : undefined;

  return (
    <SiteShell>
      <article className="mx-auto max-w-6xl px-5 pt-8 pb-16 sm:px-8 lg:pt-10 lg:pb-24">
        <Link
          to="/hacks"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          All Holwey’s Handy Health Hacks
        </Link>
        <p className="mt-5 font-display text-3xl font-semibold text-accent">{hack?.n ?? "08"}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-wide sm:text-5xl">
          {hack?.title ?? "Nerd Out"}
        </h1>
        {hack?.lede ? <p className="mt-5 max-w-3xl text-xl leading-relaxed text-fg">{hack.lede}</p> : null}
        <div className="mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
          {hack?.paragraphs.map((p) => (
            <NerdParagraph key={p.slice(0, 36)} text={p} />
          ))}
        </div>

        <NerdOutCarousel />

        <p className="mt-12 text-sm text-muted">{hacksIntro.disclaimer}</p>

        <nav className="mt-12 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between">
          {prev ? (
            <Link
              to="/hacks/$slug"
              params={{ slug: prev.slug }}
              className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg"
            >
              <ArrowLeft className="size-4" />
              {prev.n} {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to="/hacks/$slug"
              params={{ slug: next.slug }}
              className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg sm:ml-auto"
            >
              {next.n} {next.title}
              <ArrowRight className="size-4" />
            </Link>
          ) : null}
        </nav>
      </article>
    </SiteShell>
  );
}
