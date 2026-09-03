import { Link } from "@tanstack/react-router";

export function PlaygroundBanner() {
  return (
    <p className="border-b border-border bg-ink px-5 py-2.5 text-center text-xs leading-relaxed text-ink-muted sm:px-8">
      Live demo. How this would look if counseling were booked on Sesame — not a real Sesame
      account, not a medical visit, not a patient relationship. Do not send real health information.{" "}
      <Link to="/" hash="contact" className="text-accent hover:text-ink-fg">
        How to contact
      </Link>
      {" · "}
      <Link to="/hacks" className="text-accent hover:text-ink-fg">
        Health Hacks
      </Link>
    </p>
  );
}
