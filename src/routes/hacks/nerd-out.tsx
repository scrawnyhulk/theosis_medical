import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/hacks/nerd-out")({
  component: () => <Outlet />,
});
