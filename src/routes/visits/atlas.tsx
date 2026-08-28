import { createFileRoute, redirect } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { PlaygroundBanner } from "@/components/visits/playground-banner";
import { AtlasHandoff } from "@/components/visits/atlas-handoff";
import { SHOW_VISIT_DEMO } from "@/lib/demo";

export const Route = createFileRoute("/visits/atlas")({
  beforeLoad: () => {
    if (!SHOW_VISIT_DEMO) throw redirect({ to: "/" });
  },
  component: AtlasPage,
  head: () => ({
    meta: [
      { title: "Atlas.md handoff (playground) — Theosis Medical" },
      { name: "description", content: "Playground mock of handing visits to Atlas.md. Not a real clinic." },
    ],
  }),
});

function AtlasPage() {
  return (
    <SiteShell>
      <PlaygroundBanner />
      <AtlasHandoff />
    </SiteShell>
  );
}
