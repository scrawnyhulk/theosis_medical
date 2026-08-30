import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EnlargeableImage } from "@/components/hacks/enlargeable-image";
import { FatBurnCalculator } from "@/components/hacks/fat-burn-calculator";
import { NerdParagraph } from "@/components/hacks/nerd-paragraph";
import { VideoCard } from "@/components/hacks/video-card";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { creditKicker, getNerdTopic, hacksIntro, nerdTopics } from "@/lib/hacks";

export const Route = createFileRoute("/hacks/nerd-out/$topic")({
  component: NerdTopicPage,
  head: ({ params }) => {
    const topic = getNerdTopic(params.topic);
    return {
      meta: [
        {
          title: topic
            ? `${topic.title} — Nerd Out`
            : "Nerd Out — Holwey’s Handy Health Hacks",
        },
        {
          name: "description",
          content: topic?.lede ?? "Mechanisms. How stuff actually works.",
        },
      ],
    };
  },
});

function NerdTopicPage() {
  const { topic: topicId } = Route.useParams();
  const topic = getNerdTopic(topicId);
  const index = nerdTopics.findIndex((item) => item.id === topicId);
  const n = index >= 0 ? String(index + 1).padStart(2, "0") : undefined;
  const prev = index > 0 ? nerdTopics[index - 1] : undefined;
  const next = index >= 0 && index < nerdTopics.length - 1 ? nerdTopics[index + 1] : undefined;

  if (!topic) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
          <h1 className="font-display text-4xl font-semibold tracking-wide">That topic is not here.</h1>
          <p className="mt-4 text-lg text-muted">Pick another from the list.</p>
          <Button asChild className="mt-8">
            <Link to="/hacks/nerd-out">
              <ArrowLeft />
              All Nerd Out topics
            </Link>
          </Button>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
        <Link
          to="/hacks/nerd-out"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          All Nerd Out topics
        </Link>
        <p className="mt-8 font-display text-3xl font-semibold text-accent">{n}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-wide sm:text-5xl">
          {topic.title}
        </h1>
        {"stolenFrom" in topic && topic.stolenFrom ? (
          <p className="mt-4 text-xs font-medium tracking-widest text-accent uppercase">
            {creditKicker(
              topic.stolenFrom,
              "jokeSteal" in topic ? Boolean(topic.jokeSteal) : false,
            )}
          </p>
        ) : null}
        {topic.lede ? (
          <div className="mt-5 space-y-5 text-xl leading-relaxed text-fg">
            {topic.lede.split("\n\n").map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>
        ) : null}

        {"tldrImage" in topic && topic.tldrImage ? (
          <figure className="mt-8">
            <p className="mb-3 font-display text-2xl font-semibold tracking-wide">TL;DR version</p>
            <EnlargeableImage src={topic.tldrImage} alt={topic.tldrImageAlt} />
            <figcaption className="mt-3 text-sm leading-relaxed text-muted">
              {topic.tldrImageCredit}
            </figcaption>
          </figure>
        ) : null}

        {topic.paragraphs.length > 0 ? (
          <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
            {topic.paragraphs.map((p) => (
              <NerdParagraph key={p.slice(0, 36)} text={p} />
            ))}
          </div>
        ) : null}

        {"image" in topic && topic.image ? (
          <figure className={topic.paragraphs.length > 0 || ("tldrImage" in topic && topic.tldrImage) ? "mt-10" : "mt-8"}>
            {"tldrImage" in topic && topic.tldrImage ? (
              <p className="mb-3 font-display text-2xl font-semibold tracking-wide">The full nerdy nerd version for nerds like me</p>
            ) : null}
            <EnlargeableImage src={topic.image} alt={topic.imageAlt} />
            <figcaption className="mt-3 text-sm leading-relaxed text-muted">
              {topic.imageCredit}
            </figcaption>
          </figure>
        ) : null}

        {topic.id === "fat-burn-limit" ? <FatBurnCalculator /> : null}

        {"seeAlso" in topic && topic.seeAlso ? (
          <p className="mt-8 text-lg">
            <Link
              to="/hacks/nerd-out/$topic"
              params={{ topic: topic.seeAlso.hash }}
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
          <div className="mt-8">
            <VideoCard
              videoId={topic.videoId}
              title={topic.videoTitle}
              credit={topic.videoCredit}
              summary={topic.videoSummary}
            />
          </div>
        ) : null}

        <p className="mt-12 text-sm text-muted">{hacksIntro.disclaimer}</p>

        <nav className="mt-12 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between">
          {prev ? (
            <Link
              to="/hacks/nerd-out/$topic"
              params={{ topic: prev.id }}
              className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg"
            >
              <ArrowLeft className="size-4" />
              {prev.title}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              to="/hacks/nerd-out/$topic"
              params={{ topic: next.id }}
              className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg sm:ml-auto"
            >
              {next.title}
              <ArrowRight className="size-4" />
            </Link>
          ) : null}
        </nav>
      </article>
    </SiteShell>
  );
}
