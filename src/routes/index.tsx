import { createFileRoute } from "@tanstack/react-router";
import { About } from "@/components/site/about";
import { Contact } from "@/components/site/contact";
import { FuturePlans } from "@/components/site/future-plans";
import { Hero } from "@/components/site/hero";
import { SiteShell } from "@/components/site/site-shell";
import { Why } from "@/components/site/why";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <SiteShell>
      <Hero />
      <About />
      <Why />
      <Contact />
      <FuturePlans />
    </SiteShell>
  );
}
