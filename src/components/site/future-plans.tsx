import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { SuggestionForm } from "@/components/site/suggestion-form";
import { aheadCards, futureParagraphs, shapeParagraphs } from "@/lib/content";
import { SHOW_VISIT_DEMO } from "@/lib/demo";

export function FuturePlans() {
  const [first, ...rest] = futureParagraphs;
  const splitAt = "healthier, stronger, and more resilient but in a way that fits their life.";
  const lead = first.slice(0, first.indexOf(splitAt));

  return (
    <section id="plans" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">Future plans</p>
        <h2 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-wide sm:text-5xl">
          Better Health. Made Practical.
        </h2>
        <div className="mt-6 max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
          <p>
            {lead}
            <span className="text-fg">{splitAt}</span>
          </p>
          {rest.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link to="/hacks">
              Holwey’s Handy Health Hacks
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#suggest">
              Share a Suggestion
              <ArrowRight />
            </a>
          </Button>
        </div>

        <h3 className="mt-16 font-display text-4xl font-semibold tracking-wide sm:text-5xl">
          What's Ahead
        </h3>
        <div className="mt-8 grid gap-px bg-border-strong sm:grid-cols-3">
          {aheadCards.map((card) => (
            <article key={card.n} className="flex flex-col bg-surface px-6 py-8 sm:px-8 sm:py-10">
              <p className="font-display text-3xl font-semibold text-accent">{card.n}</p>
              <h3 className="mt-4 font-display text-3xl font-semibold tracking-wide uppercase">
                {card.title}
              </h3>
              <p className="mt-3 flex-1 leading-relaxed text-muted">{card.body}</p>
              {card.n === "01" ? (
                <Button asChild className="mt-6 w-fit" size="sm">
                  <Link to="/hacks">
                    Open the hacks
                    <ArrowRight />
                  </Link>
                </Button>
              ) : null}
              {SHOW_VISIT_DEMO && card.n === "01" ? (
                <Button asChild className="mt-3 w-fit" size="sm" variant="outline">
                  <Link to="/visits/$kind" params={{ kind: "lifestyle" }}>
                    Demo a consult
                    <ArrowRight />
                  </Link>
                </Button>
              ) : null}
              {SHOW_VISIT_DEMO && card.n === "03" ? (
                <Button asChild className="mt-6 w-fit" size="sm" variant="outline">
                  <Link to="/visits/$kind" params={{ kind: "acute" }}>
                    Demo a video visit
                    <ArrowRight />
                  </Link>
                </Button>
              ) : null}
            </article>
          ))}
        </div>

        <div id="suggest" className="mt-16 grid scroll-mt-20 gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h3 className="font-display text-4xl font-semibold tracking-wide sm:text-5xl">
              Help Shape What's Next
            </h3>
            <div className="mt-5 space-y-5 text-lg leading-relaxed text-muted">
              {shapeParagraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          <SuggestionForm />
        </div>
      </div>
    </section>
  );
}
