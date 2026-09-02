"use client";

import { useMemo, useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { PlaygroundBanner } from "@/components/visits/playground-banner";
import { SHOW_VISIT_DEMO } from "@/lib/demo";
import { readDemoChart, sampleCharts, type DemoChart } from "@/lib/visits";

export const Route = createFileRoute("/provider/")({
  beforeLoad: () => {
    if (!SHOW_VISIT_DEMO) throw redirect({ to: "/" });
  },
  component: ProviderHome,
  head: () => ({
    meta: [
      { title: "Clinician board (playground) — Theosis Medical" },
      { name: "description", content: "Playground clinician inbox. Not a real EHR. No real PHI." },
    ],
  }),
});

function ProviderHome() {
  const [in_, setIn] = useState(false);
  const live = useMemo(() => (typeof window === "undefined" ? null : readDemoChart()), [in_]);
  const queue: DemoChart[] = live ? [live, ...sampleCharts] : sampleCharts;

  return (
    <SiteShell>
      <PlaygroundBanner />
      <div className="mx-auto max-w-6xl px-5 py-16 pb-28 sm:px-8 lg:py-24">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">Clinician · playground</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-wide sm:text-5xl">
          Today’s board
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted">
          This is your side. Clients never see this. Live, it would sit behind your login — a list
          of counseling sessions, not a medical chart.
        </p>

        {!in_ ? (
          <div className="mt-10 max-w-lg rounded-xl bg-surface p-6 shadow-border sm:p-8">
            <p className="text-muted">
              Live: you sign in. MFA. Nobody else gets the queue. This button is a stand-in.
            </p>
            <Button className="mt-6" size="lg" onClick={() => setIn(true)}>
              Enter as Nick
              <ArrowRight />
            </Button>
          </div>
        ) : (
          <div className="mt-10 space-y-3">
            {queue.map((visit, i) => (
              <Link
                key={`${visit.name}-${visit.at}-${i}`}
                to="/provider/$id"
                params={{ id: i === 0 && live ? "live" : visit.name.toLowerCase().replace(/\s+/g, "-") }}
                className="flex flex-col rounded-xl bg-surface p-5 shadow-border transition-colors hover:bg-fg/5 sm:flex-row sm:items-center sm:justify-between sm:p-6"
              >
                <div>
                  <p className="text-xs font-medium tracking-widest text-accent uppercase">
                    {visit.kind === "lifestyle" ? "Counseling · 45 min · cash" : "Not this playground"}
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold tracking-wide">{visit.name}</p>
                  <p className="mt-1 text-muted">{visit.reason}</p>
                </div>
                <p className="mt-4 text-sm text-muted sm:mt-0">{visit.slot}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
