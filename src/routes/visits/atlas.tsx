import { createFileRoute, redirect } from "@tanstack/react-router";
import { SHOW_VISIT_DEMO } from "@/lib/demo";

export const Route = createFileRoute("/visits/atlas")({
  beforeLoad: () => {
    if (!SHOW_VISIT_DEMO) throw redirect({ to: "/" });
    throw redirect({ to: "/visits" });
  },
});
