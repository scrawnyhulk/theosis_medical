"use client";

import { useMemo, useState } from "react";
import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlaygroundBanner } from "@/components/visits/playground-banner";
import { SHOW_VISIT_DEMO } from "@/lib/demo";
import { readDemoChart, sampleCharts, type DemoChart } from "@/lib/visits";

export const Route = createFileRoute("/provider/$id")({
  beforeLoad: () => {
    if (!SHOW_VISIT_DEMO) throw redirect({ to: "/" });
  },
  component: ProviderChart,
  head: () => ({
    meta: [{ title: "Chart (live demo) — Theosis Medical" }],
  }),
});

function findChart(id: string): DemoChart | null {
  if (id === "live") return readDemoChart();
  return (
    sampleCharts.find((c) => c.name.toLowerCase().replace(/\s+/g, "-") === id) ?? sampleCharts[0]
  );
}

function ProviderChart() {
  const { id } = Route.useParams();
  const visit = useMemo(() => findChart(id), [id]);
  const [note, setNote] = useState("");
  const [signed, setSigned] = useState(false);

  if (!visit) {
    return (
      <SiteShell>
        <PlaygroundBanner />
        <p className="px-5 py-16 text-muted">No chart in this live demo session.</p>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <PlaygroundBanner />
      <div className="mx-auto max-w-6xl px-5 py-16 pb-28 sm:px-8 lg:py-24">
        <Link
          to="/provider"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          Board
        </Link>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-medium tracking-widest text-accent uppercase">
              Lifestyle counseling · 45 min · cash
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-wide">{visit.name}</h1>
            <p className="mt-2 text-muted">
              {visit.reason} · {visit.slot}
            </p>
          </div>
          <Button asChild>
            <Link
              to="/visits/$kind"
              params={{ kind: visit.kind }}
              search={{ view: "clinician", who: visit.name }}
            >
              Join video
              <ArrowRight />
            </Link>
          </Button>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <aside className="space-y-4 rounded-xl bg-surface p-6 shadow-border">
            <h2 className="font-display text-xl font-semibold tracking-wide">Session</h2>
            <ChartBlock label="Email" value={visit.email} />
            <ChartBlock label="Working on" value={visit.reason} />
            <ChartBlock label="Their words" value={visit.notes} />
            <ChartBlock label="Paid" value={visit.paid ? "Yes · cash" : "No"} />
          </aside>

          <div className="space-y-4 rounded-xl bg-surface p-6 shadow-border sm:p-8">
            <h2 className="font-display text-xl font-semibold tracking-wide">Coaching note</h2>
            <p className="text-sm text-muted">
              Not a SOAP note. Not a chart. Two or three moves they will actually do this week. If
              they ask for labs, a diagnosis, or a medication change, stop and send them to their
              own clinician.
            </p>
            <Textarea
              className="min-h-48"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={`Working on: ${visit.reason}.\nThis week:\n1. \n2. \n3. `}
            />
            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={() => setSigned(true)} disabled={signed}>
                {signed ? "Saved (demo)" : "Save note"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}

function ChartBlock({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium tracking-widest text-muted uppercase">{label}</p>
      <p className="mt-1 whitespace-pre-wrap text-fg">{value.trim() || "—"}</p>
    </div>
  );
}
