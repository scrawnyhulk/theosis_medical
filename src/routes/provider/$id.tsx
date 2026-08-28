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
    meta: [{ title: "Chart (playground) — Theosis Medical" }],
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
  const [rx, setRx] = useState(false);

  if (!visit) {
    return (
      <SiteShell>
        <PlaygroundBanner />
        <p className="px-5 py-16 text-muted">No chart in this playground session.</p>
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
              {visit.kind === "lifestyle" ? "Lifestyle consult" : "Acute video"}
            </p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-wide">{visit.name}</h1>
            <p className="mt-2 text-muted">
              {visit.state} · {visit.reason} · {visit.slot}
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
            <h2 className="font-display text-xl font-semibold tracking-wide">Chart</h2>
            <ChartBlock label="Allergies" value={visit.allergies} />
            <ChartBlock label="Medications" value={visit.meds} />
            <ChartBlock label="Past medical history" value={visit.pmh} />
            <ChartBlock label="Surgeries" value={visit.surgeries} />
            <ChartBlock label="Their words" value={visit.notes} />
          </aside>

          <div className="space-y-4 rounded-xl bg-surface p-6 shadow-border sm:p-8">
            <h2 className="font-display text-xl font-semibold tracking-wide">Note</h2>
            <p className="text-sm text-muted">
              Live this would write to a real EHR (Elation, Athena, Healthie — not this website
              database). SOAP, sign, lock.
            </p>
            <Textarea
              className="min-h-48"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={`S: ${visit.reason}.\nO: Video exam, playground.\nA: \nP: `}
            />
            <div className="flex flex-wrap gap-3">
              <Button type="button" onClick={() => setSigned(true)} disabled={signed}>
                {signed ? "Signed (demo)" : "Sign note"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setRx(true)} disabled={rx}>
                {rx ? "Sent to pharmacy (demo)" : "ePrescribe"}
              </Button>
            </div>
            {rx ? (
              <p className="text-sm text-muted">
                Live, this would open DoseSpot / the EHR eRx module — identity-proofed, EPCS if
                controlled, pharmacy routing. Not a form on theosis medical.com.
              </p>
            ) : null}
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
