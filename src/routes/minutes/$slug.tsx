import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { EnlargeableImage } from "@/components/hacks/enlargeable-image";
import { SiteShell } from "@/components/site/site-shell";
import { Button } from "@/components/ui/button";
import { getMinute, minutesIntro } from "@/lib/minutes";

export const Route = createFileRoute("/minutes/$slug")({
  component: MinutePage,
  head: ({ params }) => {
    const minute = getMinute(params.slug);
    return {
      meta: [
        {
          title: minute
            ? `${minute.title} — Medical Minutes`
            : "Medical Minutes — Theosis Medical",
        },
        {
          name: "description",
          content: minute?.lede ?? "Common conditions explained in plain language.",
        },
      ],
    };
  },
});

function MinutePage() {
  const { slug } = Route.useParams();
  const minute = getMinute(slug);

  if (!minute) {
    return (
      <SiteShell>
        <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
          <h1 className="font-display text-4xl font-semibold tracking-wide">That minute is not here.</h1>
          <p className="mt-4 text-lg text-muted">More will be added as they exist.</p>
          <Button asChild className="mt-8">
            <Link to="/minutes">
              <ArrowLeft />
              All Medical Minutes
            </Link>
          </Button>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
        <Link
          to="/minutes"
          className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-fg"
        >
          <ArrowLeft className="size-4" />
          All Medical Minutes
        </Link>
        <p className="mt-8 font-display text-3xl font-semibold text-accent">{minute.n}</p>
        <h1 className="mt-2 font-display text-4xl font-semibold tracking-wide sm:text-5xl">
          {minute.title}
        </h1>
        <p className="mt-5 text-xl leading-relaxed text-fg">{minute.lede}</p>
        <div className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
          {minute.paragraphs.map((p) => (
            <p key={p.slice(0, 36)}>{p}</p>
          ))}
        </div>
        <figure className="mt-10">
          <EnlargeableImage src={minute.image} alt={minute.imageAlt} />
        </figure>
        <p className="mt-12 text-sm text-muted">{minutesIntro.disclaimer}</p>
      </article>
    </SiteShell>
  );
}
