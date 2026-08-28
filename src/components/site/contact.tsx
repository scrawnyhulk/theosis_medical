import { Mail, Phone } from "lucide-react";
import { InquiryForm } from "@/components/site/inquiry-form";
import { site } from "@/lib/content";

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 bg-ink text-ink-fg">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-24">
        <div>
          <p className="text-xs font-medium tracking-widest text-ink-muted uppercase">
            How to contact
          </p>
          <h2 className="mt-4 font-display text-4xl font-semibold tracking-wide uppercase sm:text-5xl">
            Call, write, or send the days you need covered.
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted">
            Facility, setting, dates, and anything that will matter in credentialing. A short
            note is enough to start.
          </p>
          <ul className="mt-8 space-y-3">
            <li>
              <a
                href={site.phoneHref}
                className="inline-flex min-h-11 items-center gap-3 text-lg text-ink-fg transition-colors hover:text-accent"
              >
                <Phone className="size-5 shrink-0 text-accent" aria-hidden="true" />
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={site.emailHref}
                className="inline-flex min-h-11 items-center gap-3 text-lg text-ink-fg transition-colors hover:text-accent"
              >
                <Mail className="size-5 shrink-0 text-accent" aria-hidden="true" />
                {site.email}
              </a>
            </li>
          </ul>
          <p className="mt-4 text-sm text-ink-muted">{site.entityLine}</p>
        </div>
        <InquiryForm />
      </div>
    </section>
  );
}
