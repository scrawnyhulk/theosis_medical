import { EnlargeableImage } from "@/components/hacks/enlargeable-image";
import { creditKicker } from "@/lib/hacks";

export function HowMuchSection() {
  return (
    <section id="how-much" className="scroll-mt-20">
      <h2 className="font-display text-3xl font-semibold tracking-wide">
        How much you eat, matters more than what you eat
      </h2>
      <p className="mt-2 text-xs font-medium tracking-widest text-accent uppercase">
        {creditKicker("Open Evidence")}
      </p>
      <figure className="mt-5">
        <EnlargeableImage
          src="/images/excess-body-fat.png"
          alt="Infographic: excess body fat is the biggest lever for metabolic health. How much you eat often matters more than eating perfectly."
        />
        <figcaption className="mt-3 text-sm leading-relaxed text-muted">
          Credit / reference: Open Evidence — openevidence.com
        </figcaption>
      </figure>
    </section>
  );
}
