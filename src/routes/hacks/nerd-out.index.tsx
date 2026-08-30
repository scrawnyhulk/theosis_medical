import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { NerdParagraph } from "@/components/hacks/nerd-paragraph";
import { HacksPlaque } from "@/components/site/holwey-hacks-mark";
import { SiteShell } from "@/components/site/site-shell";
import { getHack, hacks, hacksIntro, nerdCovers, nerdGroups, nerdTopics } from "@/lib/hacks";

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

        <p className="mt-12 text-xs font-medium tracking-widest text-muted uppercase">Pick a topic</p>
        <nav className="mt-5 flex flex-wrap gap-x-5 gap-y-2" aria-label="Nerd Out groups">
          {nerdGroups.map((group) => (
            <a
              key={group.id}
              href={`#${group.id}`}
              className="text-sm font-medium text-accent hover:text-fg"
            >
              {group.title}
            </a>
          ))}
        </nav>

        <div className="mt-10 space-y-16">
          {nerdGroups.map((group) => (
            <section key={group.id} id={group.id} className="scroll-mt-24">
              <h2>
                <HacksPlaque title={group.title} />
              </h2>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {group.topicIds.map((id) => {
                  const topic = nerdTopics.find((t) => t.id === id);
                  if (!topic) return null;
                  const n = String(nerdTopics.findIndex((t) => t.id === id) + 1).padStart(2, "0");
                  const cover = nerdCovers[topic.id];
                  return (
                    <Link
                      key={topic.id}
                      to="/hacks/nerd-out/$topic"
                      params={{ topic: topic.id }}
                      className="group relative isolate block min-h-11 overflow-hidden rounded-xl bg-ink shadow-border"
                    >
                      {cover ? (
                        <img
                          src={cover.src}
                          alt={cover.alt}
                          className="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundColor: "rgb(8 13 20)",
                            backgroundImage: "url(/images/navy-grain.jpg)",
                            backgroundSize: "420px",
                          }}
                          aria-hidden
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/10" />
                      <div className="relative flex aspect-[16/10] flex-col justify-end p-6 sm:p-8">
                        <p className="font-display text-3xl font-semibold text-accent">{n}</p>
                        <h3 className="mt-2 font-display text-3xl font-semibold tracking-wide text-white uppercase">
                          {topic.title}
                        </h3>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

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
