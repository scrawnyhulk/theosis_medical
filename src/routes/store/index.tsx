import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/site/site-shell";
import { MerchInterestForm } from "@/components/store/interest-form";
import { storeIntro, storeItems, type StoreItem } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/store/")({
  component: StorePage,
  head: () => ({
    meta: [
      { title: "The Shop — Theosis Medical" },
      {
        name: "description",
        content:
          "Theosis Medical gear, if it existed: shield tees, a kindness shirt, a hoodie, a cap, a locums mug. Nothing is for sale yet.",
      },
    ],
  }),
});

function ProductCard({
  item,
  onPick,
  selected,
}: {
  item: StoreItem;
  onPick: () => void;
  selected: boolean;
}) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-xl bg-ink shadow-border transition-[box-shadow,transform] duration-200 ease-out",
        selected && "shadow-ink-ring",
      )}
    >
      <button
        type="button"
        onClick={onPick}
        className="group block w-full text-left"
        aria-label={`${item.title}. I’d wear this.`}
      >
        <span className="relative block aspect-square overflow-hidden">
          <img
            src={item.image}
            alt={item.imageAlt}
            className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
          <span className="absolute top-5 left-5 font-display text-2xl font-semibold text-accent">
            {item.n}
          </span>
        </span>
        <span className="block p-6 sm:p-7">
          <span className="block text-xs font-medium tracking-widest text-muted uppercase">
            {item.tag}
          </span>
          <span className="mt-2 block font-display text-3xl font-semibold tracking-wide uppercase">
            {item.title}
          </span>
          <span className="mt-3 block text-sm leading-relaxed text-muted sm:text-base">{item.blurb}</span>
          <span className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-accent">
            {selected ? "Selected — tell me below" : "I’d wear this"}
          </span>
        </span>
      </button>
    </article>
  );
}

function StorePage() {
  const [selected, setSelected] = useState(storeItems[0]?.id ?? "");

  function pick(id: string) {
    setSelected(id);
    document.getElementById("wear")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <SiteShell>
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">{storeIntro.kicker}</p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-wide sm:text-6xl">
            {storeIntro.title}
          </h1>
          <div className="mt-6 max-w-3xl space-y-5 text-lg leading-relaxed text-muted">
            {storeIntro.paragraphs.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8">
          <figure className="overflow-hidden rounded-xl bg-ink shadow-border">
            <img
              src="/images/store/lookbook.jpg"
              alt="Theosis Medical gear laid out on a dark desk: tee, hoodie, cap, mug, stethoscope."
              className="aspect-[16/9] w-full object-cover"
            />
          </figure>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <p className="text-xs font-medium tracking-widest text-muted uppercase">The pieces</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {storeItems.map((item) => (
            <ProductCard
              key={item.id}
              item={item}
              selected={selected === item.id}
              onPick={() => pick(item.id)}
            />
          ))}
        </div>
      </section>

      <section id="wear" className="border-t border-border">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-24">
          <div>
            <p className="text-xs font-medium tracking-widest text-muted uppercase">Would you wear it</p>
            <h2 className="mt-4 font-display text-4xl font-semibold tracking-wide">Tell me.</h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              No checkout. No cart. If this ever exists, it will be because people asked — not
              because I opened a store for the sake of having one.
            </p>
          </div>
          <MerchInterestForm selectedId={selected} />
        </div>
      </section>
    </SiteShell>
  );
}
