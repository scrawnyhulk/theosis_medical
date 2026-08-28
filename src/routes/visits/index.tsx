import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { PlaygroundBanner } from "@/components/visits/playground-banner";
import { SHOW_VISIT_DEMO } from "@/lib/demo";
import { visitMeta } from "@/lib/visits";

export const Route = createFileRoute("/visits/")({
  beforeLoad: () => {
    if (!SHOW_VISIT_DEMO) throw redirect({ to: "/" });
  },
  component: VisitsHub,
  head: () => ({
    meta: [
      { title: "Visits (playground) — Theosis Medical" },
      {
        name: "description",
        content: "Playground only. Hypothetical lifestyle consults and acute video visits. Not a real clinic.",
      },
    ],
  }),
});

function VisitsHub() {
  return (
    <SiteShell>
      <PlaygroundBanner />
      <section>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">Playground</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-wide sm:text-6xl">
            Request a visit
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
            This is what it would look like if Theosis Medical took consults and appropriate acute
            video visits. Two doors. Same grain. Nick on the other end — not a call center.
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
            Licensed in Illinois, Wisconsin, Michigan, and Indiana. If this were real, you would
            still need to be in a state where I can see you.
          </p>
          <p className="mt-6">
            <Link to="/provider" className="text-sm font-medium text-accent hover:text-fg">
              I’m the clinician — open the board
            </Link>
            <span className="text-sm text-muted"> (your side, not the public site)</span>
          </p>

          <div className="mt-12 grid gap-px bg-border-strong sm:grid-cols-2">
            {(
              [
                { kind: "lifestyle" as const, meta: visitMeta.lifestyle },
                { kind: "acute" as const, meta: visitMeta.acute },
              ] as const
            ).map(({ kind, meta }) => (
              <article key={kind} className="flex flex-col bg-surface px-6 py-8 sm:px-10 sm:py-12">
                <p className="font-display text-3xl font-semibold text-accent">{meta.n}</p>
                <p className="mt-3 text-xs font-medium tracking-widest text-muted uppercase">
                  {meta.time}
                </p>
                <h2 className="mt-2 font-display text-3xl font-semibold tracking-wide uppercase sm:text-4xl">
                  {meta.title}
                </h2>
                <p className="mt-4 flex-1 text-lg leading-relaxed text-muted">{meta.body}</p>
                <Button asChild className="mt-8 w-fit" size="lg">
                  <Link to="/visits/$kind" params={{ kind }}>
                    {kind === "lifestyle" ? "Book a consult" : "Start a video visit"}
                    <ArrowRight />
                  </Link>
                </Button>
              </article>
            ))}
          </div>

          <article className="mt-px bg-surface px-6 py-8 sm:px-10 sm:py-12">
            <p className="text-xs font-medium tracking-widest text-accent uppercase">If we used Atlas.md</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-wide uppercase sm:text-4xl">
              This site books. Atlas runs the visit.
            </h2>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
              Red flags and licensed states stay here. Chart, card, HIPAA video, and eRx live in
              Atlas Patient Hub. This walkthrough is a mock — no real clinic on the other end.
            </p>
            <Button asChild className="mt-8 w-fit" size="lg">
              <Link to="/visits/atlas">
                Show me the Atlas handoff
                <ArrowRight />
              </Link>
            </Button>
          </article>
        </div>
      </section>
    </SiteShell>
  );
}
