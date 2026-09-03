import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { PlaygroundBanner } from "@/components/visits/playground-banner";
import { VisitFlow } from "@/components/visits/visit-flow";
import { SHOW_VISIT_DEMO } from "@/lib/demo";
import { isVisitKind, visitMeta } from "@/lib/visits";

export const Route = createFileRoute("/visits/$kind")({
  beforeLoad: ({ params }) => {
    if (!SHOW_VISIT_DEMO) throw redirect({ to: "/" });
    if (params.kind === "acute") throw redirect({ to: "/visits/$kind", params: { kind: "lifestyle" } });
  },
  validateSearch: (search: Record<string, unknown>): { view?: "clinician"; who?: string } => ({
    ...(search.view === "clinician" ? { view: "clinician" as const } : {}),
    ...(typeof search.who === "string" && search.who ? { who: search.who } : {}),
  }),
  component: VisitKindPage,
  head: ({ params }) => {
    const kind = params.kind;
    const meta = isVisitKind(kind) ? visitMeta[kind] : null;
    return {
      meta: [
        { title: meta ? `${meta.title} (live demo) — Theosis Medical` : "Visit — Theosis Medical" },
        {
          name: "description",
          content: "Live demo. How a Sesame cash-pay counseling visit would look. Not a real booking.",
        },
      ],
    };
  },
});

function VisitKindPage() {
  const { kind } = Route.useParams();
  const { view, who } = Route.useSearch();
  if (!isVisitKind(kind)) throw notFound();

  return (
    <SiteShell>
      <PlaygroundBanner />
      <VisitFlow kind={kind} view={view} who={who} />
    </SiteShell>
  );
}
