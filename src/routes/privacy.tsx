import { createFileRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/site/site-shell";
import privacyMd from "@/content/privacy.md?raw";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Notice — Theosis Medical" },
      { name: "description", content: "How the theosismedical.com website handles your information." },
    ],
  }),
});

/** Renders the small markdown subset used by the legal text: # / ## headings, - bullets, **bold**. */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={i} className="font-semibold text-fg">{part.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function renderMarkdown(md: string): ReactNode[] {
  const out: ReactNode[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length) {
      const items = list;
      out.push(
        <ul key={`ul${out.length}`} className="mt-4 list-disc space-y-3 pl-6">
          {items.map((li, i) => <li key={i}>{inline(li)}</li>)}
        </ul>,
      );
      list = [];
    }
  };
  for (const raw of md.split("\n")) {
    const line = raw.trimEnd();
    if (line.startsWith("- ")) { list.push(line.slice(2)); continue; }
    flush();
    if (!line) continue;
    if (line.startsWith("## ")) {
      out.push(<h2 key={out.length} className="mt-10 font-display text-2xl font-semibold tracking-wide text-fg">{line.slice(3)}</h2>);
    } else if (line.startsWith("# ")) {
      out.push(<h1 key={out.length} className="font-display text-4xl font-semibold tracking-wide text-fg sm:text-5xl">{line.slice(2)}</h1>);
    } else {
      out.push(<p key={out.length} className="mt-4">{inline(line)}</p>);
    }
  }
  flush();
  return out;
}

function PrivacyPage() {
  return (
    <SiteShell>
      <article className="mx-auto max-w-3xl px-5 py-16 text-lg leading-relaxed text-muted sm:px-8 lg:py-24">
        {renderMarkdown(privacyMd)}
      </article>
    </SiteShell>
  );
}
