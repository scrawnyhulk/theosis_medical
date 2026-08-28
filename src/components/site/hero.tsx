import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/content";

function HeroButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Button asChild variant="onInk" size="lg">
        <a href="#contact">
          How to contact
          <ArrowRight />
        </a>
      </Button>
      <Button asChild variant="onInkOutline" size="lg">
        <a href="#about">About me</a>
      </Button>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative lg:-mt-16">
      <div className="hero-phone">
        <img
          src="/images/logo-phone.png"
          alt="Theosis Medical emblem: a silver shield bearing the Star of Life, a cross, and the serpent of healing."
          className="no-outline mx-auto block h-auto w-full max-w-full object-contain object-top"
        />
        <div className="px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <HeroButtons />
        </div>
      </div>

      <div className="hero-desktop relative min-h-svh">
        <img
          src="/images/logo.jpg"
          alt="Theosis Medical emblem: a silver shield bearing the Star of Life, a cross, and the serpent of healing."
          className="no-outline absolute inset-0 size-full object-cover object-center"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pt-24 pb-8 sm:px-8">
          <div className="stagger-in mx-auto max-w-6xl text-ink-fg">
            <p className="text-xs font-medium tracking-widest text-ink-muted uppercase">{site.tagline}</p>
            <HeroButtons className="mt-5" />
          </div>
        </div>
      </div>
    </section>
  );
}
