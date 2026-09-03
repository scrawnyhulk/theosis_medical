import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight, Star } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { PlaygroundBanner } from "@/components/visits/playground-banner";
import { SesameMark } from "@/components/visits/sesame-mark";
import { SHOW_VISIT_DEMO } from "@/lib/demo";
import { coachingAgreement, sessionMinutes, sessionPrice } from "@/lib/visits";

export const Route = createFileRoute("/visits/")({
  beforeLoad: () => {
    if (!SHOW_VISIT_DEMO) throw redirect({ to: "/" });
  },
  component: VisitsHub,
  head: () => ({
    meta: [
      { title: "Live demo · Sesame counseling — Theosis Medical" },
      {
        name: "description",
        content:
          "Live demo. How cash-pay lifestyle counseling would look if booked on Sesame. Not a real booking.",
      },
    ],
  }),
});

function VisitsHub() {
  return (
    <SiteShell>
      <PlaygroundBanner />
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">Live demo</p>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-semibold tracking-wide sm:text-6xl">
            If this went live on Sesame
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-muted">
            Sesame is the cash-pay marketplace: they take the card, they host the video, they send
            the join link. You would list lifestyle counseling there — not a clinic, not labs, not a
            prescription. This page is a mock of that interface so you can see the patient path
            before anything is real.
          </p>
        </div>
      </section>

      <div className="bg-sesame-paper text-sesame-ink">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 border-b border-sesame-ink/10 px-5 py-4 sm:px-8">
          <div className="flex items-center gap-2">
            <SesameMark className="text-sesame-ink" />
            <span className="font-sans text-xl font-semibold tracking-tight lowercase">sesame</span>
          </div>
          <p className="text-xs font-medium text-sesame-muted">Find care · cash prices</p>
        </div>
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 lg:py-16">
          <p className="text-sm text-sesame-muted">Video visits · lifestyle counseling</p>
          <h2 className="mt-2 font-sans text-3xl font-semibold tracking-tight sm:text-4xl">
            Providers near you
          </h2>
          <article className="mt-8 max-w-3xl overflow-hidden rounded-2xl bg-sesame-card ring-1 ring-sesame-ink/8">
            <div className="grid sm:grid-cols-[12rem_1fr]">
              <img
                src="/images/nick.jpg"
                alt="Nick Holwey"
                className="no-outline h-48 w-full object-cover object-top sm:h-full"
              />
              <div className="p-6 sm:p-8">
                <p className="text-xs font-semibold tracking-widest text-sesame-muted uppercase">
                  Independent provider
                </p>
                <h3 className="mt-1 font-sans text-2xl font-semibold">Nick Holwey, PA-C</h3>
                <p className="mt-1 text-sm text-sesame-muted">
                  Lifestyle counseling · Theosis Medical, LLC
                </p>
                <p className="mt-3 flex items-center gap-1 text-sm font-medium">
                  <Star className="size-4 fill-sesame-lime-ink text-sesame-lime-ink" />
                  4.9 demo · video visit
                </p>
                <p className="mt-4 font-sans text-3xl font-semibold">
                  ${sessionPrice}
                  <span className="ml-2 text-base font-medium text-sesame-muted">
                    · {sessionMinutes} min
                  </span>
                </p>
                <p className="mt-2 text-sm text-sesame-muted">Next available today · 4:30 p.m.</p>
                <Link
                  to="/visits/$kind"
                  params={{ kind: "lifestyle" }}
                  className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-sesame-lime px-6 text-sm font-semibold text-sesame-lime-ink hover:brightness-95"
                >
                  Book video visit
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>

      <section>
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-wide">The real setup</h2>
              <ol className="mt-6 space-y-4 text-lg leading-relaxed text-muted">
                <li>
                  <span className="font-medium text-fg">1. List on Sesame.</span> Cash-pay lifestyle
                  counseling, not a medical visit. Price on the card. Video only.
                </li>
                <li>
                  <span className="font-medium text-fg">2. The agreement.</span> They check every box
                  before Sesame takes the card. Not a patient. Not a diagnosis. Emergencies go to
                  911.
                </li>
                <li>
                  <span className="font-medium text-fg">3. Sesame takes payment.</span> $
                  {sessionPrice} cash for {sessionMinutes} minutes. No insurance billing.
                </li>
                <li>
                  <span className="font-medium text-fg">4. Sesame’s video room.</span> They email the
                  join link. You show up in the provider app. No Zoom to host.
                </li>
                <li>
                  <span className="font-medium text-fg">5. One email to malpractice.</span> Tell the
                  carrier you added cash-pay lifestyle counseling so you know it is covered.
                </li>
              </ol>
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
                  I’m Nick — open the Sesame provider inbox
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
