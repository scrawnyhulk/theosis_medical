import { Link } from "@tanstack/react-router";
import {
  aboutParagraphs,
  glanceGroups,
  proceduralSkills,
} from "@/lib/content";

function AboutParagraph({ text }: { text: string }) {
  const pieces = text.split(/(\[\[hacks\]\])/);
  if (pieces.length === 1) return <p>{text}</p>;
  return (
    <p>
      {pieces.map((piece, i) =>
        piece === "[[hacks]]" ? (
          <Link key={i} to="/hacks" className="font-medium text-accent hover:text-fg">
            changes
          </Link>
        ) : (
          <span key={i}>{piece}</span>
        ),
      )}
    </p>
  );
}

function GlanceList({ items }: { items: readonly string[] }) {
  return (
    <ul className="mt-2 space-y-1 text-sm leading-relaxed text-muted">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function About() {
  return (
    <section id="about" className="scroll-mt-20">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24">
        <div>
          <div className="mb-8 overflow-hidden rounded-xl lg:float-left lg:mb-6 lg:mr-12 lg:w-5/12">
            <img
              src="/images/nick.jpg"
              alt="Nick Holwey, PA-C, physician assistant and founder of Theosis Medical."
              className="aspect-4/5 w-full object-cover object-center"
            />
          </div>
          <h1 className="font-display text-4xl font-semibold tracking-wide sm:text-5xl">
            About Me
          </h1>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-muted">
            {aboutParagraphs.map((p) => (
              <AboutParagraph key={p.slice(0, 40)} text={p} />
            ))}
          </div>
          <div className="clear-both" />
        </div>

        <aside className="mt-12 rounded-xl bg-surface p-6 shadow-border sm:p-8 lg:mt-16">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">
            At a glance
          </p>
          <div className="mt-6 grid gap-8 sm:grid-cols-2">
            {glanceGroups.map((group) => (
              <div key={group.title}>
                <h2 className="font-display text-lg font-semibold tracking-wide text-fg">
                  {group.title}
                </h2>
                <GlanceList items={group.items} />
              </div>
            ))}
            <div className="sm:col-span-2">
              <h2 className="font-display text-lg font-semibold tracking-wide text-fg">
                Procedural Skills
              </h2>
              <ul className="mt-2 grid gap-x-8 gap-y-1 text-sm leading-relaxed text-muted sm:grid-cols-2">
                {proceduralSkills.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span
                      aria-hidden="true"
                      className="mt-2 size-1 shrink-0 rounded-full bg-accent"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
