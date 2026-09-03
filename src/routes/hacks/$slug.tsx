import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { EnlargeableImage } from "@/components/hacks/enlargeable-image";
import { FastFoodStepper } from "@/components/hacks/fast-food-stepper";
import { HormoziCookbook } from "@/components/hacks/hormozi-recipe-card";
import { NerdParagraph } from "@/components/hacks/nerd-paragraph";
import { NerdStepper } from "@/components/hacks/nerd-stepper";
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
  fastingStyles,
  getHack,
  hacks,
  hacksIntro,
  hormoziRecipeNotes,
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

        {hack.slug === "why-hard" ? (
          <div className="mt-10 space-y-10">
            <figure>
              <EnlargeableImage
                src="/images/hacks-why-hard.png"
                alt="Why eating healthy feels so hard: ancient survival biology in a 2026 food world. Carb plus fat reward, rare in nature, biology-environment mismatch, and how to make the environment work for you."
              />
              <figcaption className="mt-3 text-xs tracking-wide text-muted">
                Evidence: DiFeliceantonio et al., Cell Metabolism (2018) · Hall et al., Cell Metabolism / NIH (2019)
              </figcaption>
            </figure>
            <figure>
              <EnlargeableImage
                src="/images/hacks-why-hard-succeed.png"
                alt="How to succeed, part 2: do not build the most aggressive diet you can tolerate. Build the easiest deficit you can repeat. Reasonable deficit, high satiety, low friction, flexible consistency, and a maintenance plan."
              />
              <figcaption className="mt-3 text-xs tracking-wide text-muted">
                Evidence: Leidy et al., AJCN (2015) · Burke et al., JADA (2011) · NIDDK
              </figcaption>
            </figure>
          </div>
        ) : null}

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

  if (slug === "protein-per-pound") {
    return (
      <div className="mt-10 space-y-8">
        <VideoCard
          videoId="-BcGPN2nXs0"
          title="How Much Protein Is Too Much for Your Kidneys?"
          credit="Dr. Layne Norton"
          summary="Human trials: higher protein does not harm healthy kidneys. The 1980s myth does not match the data."
          anchor="protein-kidneys"
        />
        <figure>
          <EnlargeableImage
            src="/images/protein-kidney.png"
            alt="Infographic: high protein does not equal kidney damage when your kidneys are healthy. More filtration is adaptation, not injury. Established CKD is the exception — personalize protein with a clinician."
          />
        </figure>
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
            to="/hacks/nerd-out/$topic"
            params={{ topic: "energy" }}
            className="font-medium text-accent hover:text-fg"
          >
            What do we mean by “energy”?
          </Link>
        </p>
        <FastFoodStepper chains={fastFoodChains} />
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

  if (slug === "fasting") {
    return (
      <div className="mt-10">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">The styles</p>
        <p className="mt-3 text-lg leading-relaxed text-muted">
          This is the menu of styles. Each one will get its own write-up — what a Tuesday looks like,
          who it actually fits, and how to keep protein from falling off a cliff. For now, pick the
          clock. The rest is coming.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {fastingStyles.map((style) => (
            <article key={style.id} className="rounded-xl bg-surface p-5 shadow-border sm:p-6">
              <p className="font-display text-2xl font-semibold tracking-wide text-accent">{style.name}</p>
              <p className="mt-1 text-xs font-medium tracking-widest text-muted uppercase">{style.window}</p>
              <p className="mt-3 leading-relaxed text-muted">{style.blurb}</p>
            </article>
          ))}
        </div>
      </div>
    );
  }

  if (slug === "exercise") {
    return (
      <NerdStepper
        topicId="exercise"
        steps={[
          {
            title: "Resistance",
            image: "/images/med-resistance.png",
            imageAlt:
              "Infographic: minimum effective dose of resistance training. The 20% that delivers most of the results: two times a week, hard sets, compound lifts, full range, progress over time.",
            imageCredit: "The 20% of lifting most of us will actually do. Educational only.",
          },
          {
            title: "Cardio",
            image: "/images/med-cardio.png",
            imageAlt:
              "Infographic: the minimum effective dose of cardio. Three lanes — HIIT, steady state, and walking. 80% of the return, 20% of the complexity. The best dose is the smallest one you will repeat.",
            imageCredit: "The smallest dose you will actually repeat. Educational only.",
          },
          {
            title: "The workout",
            image: "/images/muscle-growth.png",
            imageAlt:
              "Infographic: muscle grows when you challenge it with resistance training, eat enough protein, and recover. A simple push, pull, and legs workout using one set to failure plus rest-pause.",
            imageCredit: "One set to failure. Push, pull, legs. Educational only.",
          },
          {
            title: "Sleep",
            paragraphs: [
              "Lift to create the signal. Eat to supply the material. Sleep to protect the result. You do not build muscle from sleep alone — but poor sleep can weaken the response to good training.",
            ],
            image: "/images/med-sleep.png",
            imageAlt:
              "Infographic: sleep builds what training starts. The overnight rebuild shift for muscle growth and recovery. Training, protein, and sleep are the three gears. Poor sleep can blunt adaptations and shift a deficit toward muscle loss.",
            imageCredit:
              "Sleep is part of the program. Educational only. AASM · Lamon et al. 2021 · Saner et al. 2020 · Nedeltcheva et al. 2010.",
          },
        ]}
      />
    );
  }

  if (slug === "staples") {
    return (
      <div className="mt-10 space-y-8">
        <figure>
          <EnlargeableImage
            src="/images/staples-poster.png"
            alt="High protein staples: the 40% rule, grab-and-go protein, sweet options that do not blow the budget, at-home protein anchors, and how to build the plate."
          />
        </figure>
        <div>
          <h2 className="font-display text-3xl font-semibold tracking-wide sm:text-4xl">
            Holwey stolen Hormozi High Protein Hacks
          </h2>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
            Yup...I once again stole from business bro. He has hacked his health heavily...you can too! See below...
          </p>
        </div>
        <VideoCard
          videoId="hGX_z5rXRlU"
          title="The Alex Hormozi Cookbook [REVEALED]"
          credit="Alex Hormozi"
          summary="Zero-prep high-protein assemblies. The recipes below are the grocery-aisle version of that video."
          anchor="hormozi-cookbook"
        />
        <HormoziCookbook />
        <div className="rounded-xl bg-ink p-6 text-ink-fg shadow-border sm:p-8">
          <h2 className="font-display text-xl font-semibold tracking-wide">Fine print</h2>
          <ul className="mt-4 space-y-3 text-ink-muted">
            {hormoziRecipeNotes.map((note) => (
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

  if (slug === "nerd-out") {
    return null;
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
              {video.usedOn.slug === "nerd-out" && "hash" in video.usedOn && video.usedOn.hash ? (
                <Link
                  to="/hacks/nerd-out/$topic"
                  params={{ topic: video.usedOn.hash }}
                  className="font-medium text-accent hover:text-fg"
                >
                  {video.usedOn.label}
                </Link>
              ) : (
                <Link
                  to="/hacks/$slug"
                  params={{ slug: video.usedOn.slug }}
                  hash={"hash" in video.usedOn ? video.usedOn.hash : undefined}
                  className="font-medium text-accent hover:text-fg"
                >
                  {video.usedOn.label}
                </Link>
              )}
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

function WhyProteinLink() {
  return (
    <p className="mt-8 text-lg">
      <Link
        to="/hacks/nerd-out/$topic"
        params={{ topic: "protein" }}
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
        to="/hacks/nerd-out/$topic"
        params={{ topic: "energy" }}
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
