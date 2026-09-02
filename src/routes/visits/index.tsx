import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { PlaygroundBanner } from "@/components/visits/playground-banner";
import { SHOW_VISIT_DEMO } from "@/lib/demo";
import { coachingAgreement, sessionMinutes, sessionPrice, visitMeta } from "@/lib/visits";

export const Route = createFileRoute("/visits/")({
  beforeLoad: () => {
    if (!SHOW_VISIT_DEMO) throw redirect({ to: "/" });
  },
  component: VisitsHub,
  head: () => ({
    meta: [
      { title: "Lifestyle counseling (playground) — Theosis Medical" },
      {
        name: "description",
        content:
          "Playground only. Cash-pay lifestyle counseling — coaching, not a medical visit. Not a real booking.",
      },
    ],
  }),
});

function VisitsHub() {
  const meta = visitMeta.lifestyle;

  return (
    <SiteShell>
      <PlaygroundBanner />
      <section>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">Playground · go-live shape</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-wide sm:text-6xl">
            Lifestyle counseling
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
            This is the version you could stand up today: cash-pay video coaching through Theosis
            Medical, LLC. Education and accountability. Not a clinic, not labs, not a prescription,
            not “send me your bloodwork.”
          </p>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-muted">
            Nick is an emergency medicine PA by training. This offering does not use that license.
            No collaborating physician. No insurance. If the conversation turns medical, the session
            stops.
          </p>

          <div className="mt-12 max-w-3xl rounded-xl bg-surface p-6 shadow-border sm:p-10">
            <p className="font-display text-3xl font-semibold text-accent">{meta.n}</p>
            <p className="mt-3 text-xs font-medium tracking-widest text-muted uppercase">{meta.time}</p>
            <h2 className="mt-2 font-display text-3xl font-semibold tracking-wide uppercase sm:text-4xl">
              {meta.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted">{meta.body}</p>
            <Button asChild className="mt-8 w-fit" size="lg">
              <Link to="/visits/$kind" params={{ kind: "lifestyle" }}>
                Book a counseling session
                <ArrowRight />
              </Link>
            </Button>
          </div>

          <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-wide">If this went live today</h2>
              <ol className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
                <li>
                  <span className="font-medium text-fg">1. This page.</span> It says counseling /
                  coaching. It does not say consult, treatment, or lab review.
                </li>
                <li>
                  <span className="font-medium text-fg">2. The agreement.</span> They check every box
                  before they pay. Not a patient. Not a diagnosis. Emergencies go to 911.
                </li>
                <li>
                  <span className="font-medium text-fg">3. Stripe.</span> ${sessionPrice} cash for{" "}
                  {sessionMinutes} minutes. No insurance billing.
                </li>
                <li>
                  <span className="font-medium text-fg">4. A calendar + a video link.</span> Calendly
                  and Zoom or Google Meet. The room in this demo is a stand-in.
                </li>
                <li>
                  <span className="font-medium text-fg">5. One email to malpractice.</span> Tell the
                  carrier you added cash-pay lifestyle counseling so you know it is covered.
                </li>
              </ol>
              <p className="mt-6 text-sm text-muted">
                That is an afternoon of work, not a six-month entity build. Labs-and-plan as medical
                care is the other structure. It is not this playground.
              </p>
            </div>
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-wide">They must agree</h2>
              <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted">
                {coachingAgreement.map((item) => (
                  <li key={item.id} className="flex gap-3">
                    <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-8">
                <Link to="/provider" className="text-sm font-medium text-accent hover:text-fg">
                  I’m Nick — open the session list
                </Link>
                <span className="text-sm text-muted"> (your side, not the public site)</span>
              </p>
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
