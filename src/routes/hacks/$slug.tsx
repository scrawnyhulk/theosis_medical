import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EnlargeableImage } from "@/components/hacks/enlargeable-image";
import { ProteinLabelTool } from "@/components/hacks/protein-label-tool";
import { StartCalculator } from "@/components/hacks/start-calculator";
import { VideoCard } from "@/components/hacks/video-card";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import {
  creditKicker,
  drinkSwaps,
  fastFoodChains,
  fastFoodNotes,
  getHack,
  hacks,
  hacksIntro,
  nerdTopics,
  peRatio,
  peTone,
  proteinPercent,
  readingList,
  referenceVideos,
  type HackSlug,
} from "@/lib/hacks";

export const Route = createFileRoute("/hacks/$slug")({
  component: HackPage,
  head: ({ params }) => {
    const hack = getHack(params.slug);
    return {
      meta: [
        {
          title: hack
            ? `${hack.title} — Holwey’s Handy Health Hacks`
            : "Holwey’s Handy Health Hacks — Theosis Medical",
        },
        {
          name: "description",
          content: hack?.lede ?? "Easy, high-leverage health hacks from Theosis Medical.",
        },
      ],
    };
  },
});

function HackPage() {
  const { slug } = Route.useParams();
  const hack = getHack(slug);
  const index = hacks.findIndex((h) => h.slug === slug);
  const prev = index > 0 ? hacks[index - 1] : undefined;
  const next = index >= 0 && index < hacks.length - 1 ? hacks[index + 1] : undefined;

  if (!hack) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
          <h1 className="font-display text-4xl font-semibold tracking-wide">That hack is not here.</h1>
          <p className="mt-4 text-lg text-muted">It may have moved. The full list is still short on purpose.</p>
          <Button asChild className="mt-8">
            <Link to="/hacks">
              <ArrowLeft />
              All Holwey’s Handy Health Hacks
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
          to="/hacks"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          All Holwey’s Handy Health Hacks
        </Link>
        <p className="mt-8 font-display text-3xl font-semibold text-accent">{hack.n}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-wide sm:text-5xl">
          {hack.title}
        </h1>
        {hack.stolenFrom ? (
          <p className="mt-4 text-xs font-medium tracking-widest text-accent uppercase">
            {creditKicker(hack.stolenFrom, hack.jokeSteal)}
          </p>
        ) : null}
        {hack.lede && hack.slug !== "exercise" ? (
          <p className="mt-5 text-xl leading-relaxed text-fg">{hack.lede}</p>
        ) : null}

        {hack.slug === "where-to-start" ? (
          <div className="mt-8">
            <VideoCard
              videoId="fxyhIXZ6Yog"
              title="The Alex Hormozi Diet (REVEALED)"
              credit="Alex Hormozi"
              summary="Five minutes. Calories from body weight and your goal, a gram of protein per pound, leftover calories spent however you want."
              anchor="hormozi"
            />
          </div>
        ) : null}

        <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
          {hack.slug === "dont-drink-calories" ? (
            <>
              {hack.paragraphs.slice(0, 2).map((p) => (
                <NerdParagraph key={p.slice(0, 36)} text={p} />
              ))}
              <FakeSugarLink />
              {hack.paragraphs.slice(2).map((p) => (
                <NerdParagraph key={p.slice(0, 36)} text={p} />
              ))}
            </>
          ) : (
            hack.paragraphs.map((p) => <NerdParagraph key={p.slice(0, 36)} text={p} />)
          )}
        </div>

        {hack.slug === "protein-per-pound" || hack.slug === "protein-label" ? (
          <WhyProteinLink />
        ) : null}

        {hack.slug === "protein-label" ? <WhyEnergyLink /> : null}

        <HackExtras slug={hack.slug} />

        {hack.slug === "where-to-start" ? <WhyProteinLink /> : null}

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

function HackExtras({ slug }: { slug: HackSlug }) {
  if (slug === "where-to-start") {
    return (
      <div className="mt-10">
        <StartCalculator />
      </div>
    );
  }

  if (slug === "dont-drink-calories") {
    return (
      <div className="mt-10 space-y-8">
        <div className="overflow-hidden rounded-xl shadow-border">
          <table className="w-full text-left text-sm sm:text-base">
            <thead className="bg-surface text-xs font-medium tracking-widest text-muted uppercase">
              <tr>
                <th className="px-5 py-3 font-medium">Instead of</th>
                <th className="px-5 py-3 font-medium">Do this</th>
              </tr>
            </thead>
            <tbody>
              {drinkSwaps.map((row) => (
                <tr key={row.from} className="border-t border-border">
                  <td className="px-5 py-4 text-muted">{row.from}</td>
                  <td className="px-5 py-4 text-fg">{row.to}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (slug === "protein-label") {
    return (
      <div className="mt-10 space-y-8">
        <figure>
          <EnlargeableImage
            src="/images/naiman-protein-40.png"
            alt="The add-a-zero protein test: multiply protein grams by 10 and compare to calories. If it meets or beats calories, the food is at least 40% protein."
          />
        </figure>
        <ProteinLabelTool />
      </div>
    );
  }

  if (slug === "fast-food") {
    return (
      <div className="mt-10 space-y-8">
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="rounded-md bg-ok/20 px-3 py-1.5 text-ok">P:E ≥ 2</span>
          <span className="rounded-md bg-ok/10 px-3 py-1.5 text-ok">P:E ≥ 1</span>
          <span className="rounded-md bg-warn/20 px-3 py-1.5 text-warn">P:E ≥ 0.5</span>
          <span className="rounded-md bg-danger/20 px-3 py-1.5 text-danger">{"P:E < 0.5"}</span>
        </div>
        <p className="max-w-3xl text-lg leading-relaxed text-muted">
          P:E is protein grams divided by carb grams plus fat grams. Green is more parts than fuel. Red is the
          opposite.{" "}
          <Link
            to="/hacks/$slug"
            params={{ slug: "nerd-out" }}
            hash="energy"
            className="font-medium text-accent hover:text-fg"
          >
            What do we mean by “energy”?
          </Link>
        </p>
        {fastFoodChains.map((chain) => (
          <article key={chain.place} className="rounded-xl bg-surface p-6 shadow-border sm:p-8">
            <h2 className="font-display text-2xl font-semibold tracking-wide">{chain.place}</h2>
            <p className="mt-3 leading-relaxed text-muted">{chain.blurb}</p>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[36rem] text-left text-sm">
                <thead className="text-xs font-medium tracking-widest text-muted uppercase">
                  <tr>
                    <th className="py-2 pr-3 font-medium">Order</th>
                    <th className="py-2 pr-3 font-medium">Cal</th>
                    <th className="py-2 pr-3 font-medium">P / C / F</th>
                    <th className="py-2 pr-3 font-medium">% protein</th>
                    <th className="py-2 font-medium">P:E</th>
                  </tr>
                </thead>
                <tbody>
                  {[...chain.items]
                    .sort((a, b) => peRatio(b) - peRatio(a))
                    .map((item) => {
                      const pe = peRatio(item);
                      const tone = peTone(pe);
                      const pct = Math.round(proteinPercent(item));
                      const peLabel = Number.isFinite(pe) ? pe.toFixed(1) : "∞";
                      return (
                        <tr key={item.name} className="border-t border-border align-top">
                          <td className="py-3 pr-3">
                            <p className="text-fg">{item.name}</p>
                            <p className="mt-1 text-muted">{item.how}</p>
                            <p className="mt-1 text-xs tracking-wide text-muted uppercase">
                              {item.source === "official"
                                ? "Their nutrition page"
                                : item.source === "built"
                                  ? "Built from their ingredient numbers"
                                  : "Common tracker listing"}
                            </p>
                          </td>
                          <td className="py-3 pr-3 tabular-nums text-fg">{item.calories}</td>
                          <td className="py-3 pr-3 tabular-nums text-muted">
                            {item.protein} / {item.carbs} / {item.fat}
                          </td>
                          <td className="py-3 pr-3 tabular-nums text-fg">{pct}%</td>
                          <td className="py-3">
                            <span
                              className={
                                tone === "best"
                                  ? "inline-block rounded-md bg-ok/20 px-2.5 py-1 font-medium tabular-nums text-ok"
                                  : tone === "good"
                                    ? "inline-block rounded-md bg-ok/10 px-2.5 py-1 font-medium tabular-nums text-ok"
                                    : tone === "mid"
                                      ? "inline-block rounded-md bg-warn/20 px-2.5 py-1 font-medium tabular-nums text-warn"
                                      : "inline-block rounded-md bg-danger/20 px-2.5 py-1 font-medium tabular-nums text-danger"
                              }
                            >
                              {peLabel}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </article>
        ))}
        <div className="rounded-xl bg-ink p-6 text-ink-fg shadow-border sm:p-8">
          <h2 className="font-display text-xl font-semibold tracking-wide">Fine print</h2>
          <ul className="mt-4 space-y-3 text-ink-muted">
            {fastFoodNotes.map((note) => (
              <li key={note} className="flex gap-2">
                <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
  if (slug === "exercise") {
    return (
      <div className="mt-10 space-y-10">
        <figure>
          <EnlargeableImage
            src="/images/med-resistance.png"
            alt="Infographic: minimum effective dose of resistance training. The 20% that delivers most of the results: two times a week, hard sets, compound lifts, full range, progress over time."
          />
        </figure>
        <figure>
          <EnlargeableImage
            src="/images/med-cardio.png"
            alt="Infographic: minimum effective dose of cardio. Low-volume HIIT about three times a week versus about 150 minutes of brisk walking. Similar fat-loss potential."
          />
        </figure>
        <figure>
          <EnlargeableImage
            src="/images/muscle-growth.png"
            alt="Infographic: muscle grows when you challenge it with resistance training, eat enough protein, and recover. A simple push, pull, and legs workout using one set to failure plus rest-pause."
          />
        </figure>
      </div>
    );
  }

  if (slug === "staples") {
    return (
      <div className="mt-10">
        <figure>
          <EnlargeableImage
            src="/images/staples-poster.png"
            alt="Staples of good foods: protein you can grab, drinks that do not count, produce, PB2, sweet-tooth options, and low-carb bread hacks."
          />
        </figure>
      </div>
    );
  }

  if (slug === "nerd-out") {
    return (
      <div className="mt-10 space-y-12">
        {nerdTopics.map((topic) => (
          <section key={topic.id} id={topic.id} className="scroll-mt-24">
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
            {"seeAlso" in topic && topic.seeAlso && !("image" in topic && topic.image) ? (
              <SeeAlsoLink label={topic.seeAlso.label} hash={topic.seeAlso.hash} note={topic.seeAlso.note} />
            ) : null}
            {"image" in topic && topic.image ? (
              <figure className={topic.paragraphs.length > 0 ? "mt-8" : "mt-5"}>
                <EnlargeableImage src={topic.image} alt={topic.imageAlt} />
                <figcaption className="mt-3 text-sm leading-relaxed text-muted">{topic.imageCredit}</figcaption>
              </figure>
            ) : null}
            {"seeAlso" in topic && topic.seeAlso && "image" in topic && topic.image ? (
              <SeeAlsoLink label={topic.seeAlso.label} hash={topic.seeAlso.hash} note={topic.seeAlso.note} />
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
        ))}
      </div>
    );
  }

  if (slug === "helpful-videos") {
    return (
      <div className="mt-10 space-y-8">
        {referenceVideos.map((video) => (
          <div key={video.videoId}>
            <VideoCard
              videoId={video.videoId}
              title={video.title}
              credit={video.credit}
              summary={video.summary}
              anchor={video.anchor}
            />
            <p className="mt-3 text-sm text-muted">
              Also on{" "}
              <Link
                to="/hacks/$slug"
                params={{ slug: video.usedOn.slug }}
                hash={"hash" in video.usedOn ? video.usedOn.hash : undefined}
                className="font-medium text-accent hover:text-fg"
              >
                {video.usedOn.label}
              </Link>
            </p>
          </div>
        ))}
      </div>
    );
  }

  if (slug === "reading-list") {
    return (
      <div className="mt-10 space-y-4">
        {readingList.map((book, i) => (
          <article key={book.title} className="rounded-xl bg-surface p-6 shadow-border sm:p-8">
            <p className="font-display text-2xl font-semibold text-accent">
              {String(i + 1).padStart(2, "0")}
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-wide">{book.title}</h2>
            <p className="mt-1 text-sm font-medium tracking-wide text-muted uppercase">
              {book.authors}
            </p>
            <p className="mt-3 leading-relaxed text-muted">{book.why}</p>
          </article>
        ))}
      </div>
    );
  }

  return null;
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

function SeeAlsoLink({
  label,
  hash,
  note,
}: {
  label: string;
  hash: string;
  note?: string;
}) {
  return (
    <p className="mt-6 text-lg">
      <Link
        to="/hacks/$slug"
        params={{ slug: "nerd-out" }}
        hash={hash}
        className="font-medium text-accent hover:text-fg"
      >
        {label}
      </Link>
      {note ? <span className="text-muted"> {note}</span> : null}
    </p>
  );
}

function WhyProteinLink() {
  return (
    <p className="mt-8 text-lg">
      <Link
        to="/hacks/$slug"
        params={{ slug: "nerd-out" }}
        hash="protein"
        className="font-medium text-accent hover:text-fg"
      >
        Why do we care about protein?
      </Link>
      <span className="text-muted"> It is not a gym-bro thing.</span>
    </p>
  );
}

function WhyEnergyLink() {
  return (
    <p className="mt-4 text-lg">
      <Link
        to="/hacks/$slug"
        params={{ slug: "nerd-out" }}
        hash="energy"
        className="font-medium text-accent hover:text-fg"
      >
        What do we mean by “energy”?
      </Link>
      <span className="text-muted"> Parts, fuel, and what the P:E numbers actually are.</span>
    </p>
  );
}

function FakeSugarLink() {
  return (
    <p>
      <Link
        to="/hacks/$slug"
        params={{ slug: "helpful-videos" }}
        hash="fake-sugar"
        className="font-medium text-accent hover:text-fg"
      >
        But it’s fake sugar — bad?
      </Link>
    </p>
  );
}
