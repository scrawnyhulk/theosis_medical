import { whyParagraphs } from "@/lib/content";

export function Why() {
  return (
    <section id="why" className="scroll-mt-20 border-y border-border bg-surface">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
        <h2 className="font-display text-4xl font-semibold tracking-wide sm:text-5xl">
          Why "Theosis Medical"?
        </h2>
        <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
          {whyParagraphs.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
