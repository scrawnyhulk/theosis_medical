import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EnlargeableImage } from "@/components/hacks/enlargeable-image";
import { HowMuchSection } from "@/components/hacks/how-much-section";
import { VideoCard } from "@/components/hacks/video-card";
import { SiteShell } from "@/components/site/site-shell";
import { creditKicker, getHack, hacks, hacksIntro, nerdTopics } from "@/lib/hacks";

export const Route = createFileRoute("/hacks/nerd-out")({
  component: NerdOutPage,
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

function NerdOutPage() {
  const hack = getHack("nerd-out");
  const index = hacks.findIndex((h) => h.slug === "nerd-out");
  const prev = index > 0 ? hacks[index - 1] : undefined;
  const next = index >= 0 && index < hacks.length - 1 ? hacks[index + 1] : undefined;

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 pt-8 pb-16 sm:px-8 lg:pt-10 lg:pb-24">
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
        {hack?.lede ? <p className="mt-5 text-xl leading-relaxed text-fg">{hack.lede}</p> : null}
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
          {hack?.paragraphs.map((p) => (
            <NerdParagraph key={p.slice(0, 36)} text={p} />
          ))}
        </div>

        <div className="mt-10 space-y-12">
          {nerdTopics.map((topic) => (
            <div key={topic.id}>
              <section id={topic.id} className="scroll-mt-20">
                <h2 className="font-display text-3xl font-semibold tracking-wide">{topic.title}</h2>
                {"stolenFrom" in topic && topic.stolenFrom ? (
                  <p className="mt-2 text-xs font-medium tracking-widest text-accent uppercase">
                    {creditKicker(
                      topic.stolenFrom,
                      "jokeSteal" in topic ? Boolean(topic.jokeSteal) : false,
                    )}
                  </p>
                ) : null}
                {topic.paragraphs.length > 0 ? (
                  <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
                    {topic.paragraphs.map((p) => (
                      <NerdParagraph key={p.slice(0, 36)} text={p} />
                    ))}
                  </div>
                ) : null}
                {"image" in topic && topic.image ? (
                  <figure className={topic.paragraphs.length > 0 ? "mt-8" : "mt-5"}>
                    <EnlargeableImage src={topic.image} alt={topic.imageAlt} />
                    <figcaption className="mt-3 text-sm leading-relaxed text-muted">
                      {topic.imageCredit}
                    </figcaption>
                  </figure>
                ) : null}
                {"seeAlso" in topic && topic.seeAlso ? (
                  <p className="mt-6 text-lg">
                    <Link
                      to="/hacks/nerd-out"
                      hash={topic.seeAlso.hash}
                      className="font-medium text-accent hover:text-fg"
                    >
                      {topic.seeAlso.label}
                    </Link>
                    {topic.seeAlso.note ? (
                      <span className="text-muted"> {topic.seeAlso.note}</span>
                    ) : null}
                  </p>
                ) : null}
                {"videoId" in topic && topic.videoId ? (
                  <div className="mt-6">
                    <VideoCard
                      videoId={topic.videoId}
                      title={topic.videoTitle}
                      credit={topic.videoCredit}
                      summary={topic.videoSummary}
                    />
                  </div>
                ) : null}
              </section>
              {topic.id === "carbon" ? <div className="mt-12"><HowMuchSection /></div> : null}
            </div>
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

function NerdParagraph({ text }: { text: string }) {
  const tokens: Record<
    string,
    { slug: "where-to-start" | "nerd-out" | "fast-food"; hash?: string; label: string }
  > = {
    hormozi: { slug: "where-to-start", hash: "hormozi", label: "Go back here" },
    a1c: { slug: "nerd-out", hash: "a1c", label: "hemoglobin A1c" },
    takeout: { slug: "fast-food", label: "takeout splurges" },
    energy: { slug: "nerd-out", hash: "energy", label: "energy" },
    diabetes: { slug: "nerd-out", hash: "personal-fat-threshold", label: "causes type 2 diabetes" },
    reverse: { slug: "nerd-out", hash: "reverse-diabetes", label: "can I reverse it?" },
    grow: { slug: "nerd-out", hash: "muscle", label: "How do we grow muscle?" },
    whymuscle: {
      slug: "nerd-out",
      hash: "why-muscle",
      label: "Why you should care about growing muscle",
    },
  };

  const pieces = text.split(/(\[\[\w+\]\])/);
  if (pieces.length === 1) return <p>{text}</p>;

  return (
    <p>
      {pieces.map((piece, i) => {
        const key = piece.match(/^\[\[(\w+)\]\]$/)?.[1];
        const token = key ? tokens[key] : undefined;
        if (!token) return <span key={i}>{piece}</span>;
        if (token.slug === "nerd-out") {
          return (
            <Link
              key={i}
              to="/hacks/nerd-out"
              hash={token.hash}
              className="font-medium text-accent hover:text-fg"
            >
              {token.label}
            </Link>
          );
        }
        return (
          <Link
            key={i}
            to="/hacks/$slug"
            params={{ slug: token.slug }}
            hash={token.hash}
            className="font-medium text-accent hover:text-fg"
          >
            {token.label}
          </Link>
        );
      })}
    </p>
  );
}
