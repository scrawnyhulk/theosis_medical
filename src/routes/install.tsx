import { createFileRoute, Link } from "@tanstack/react-router";
import { Share } from "lucide-react";
import { SiteShell } from "@/components/site/site-shell";
import { InstallButton } from "@/components/site/install-button";

export const Route = createFileRoute("/install")({
  component: InstallPage,
  head: () => ({
    meta: [
      { title: "Add to Home Screen — Theosis Medical" },
      {
        name: "description",
        content:
          "Add Theosis Medical to your phone’s home screen so it opens like an app — no App Store needed.",
      },
    ],
  }),
});

function InstallPage() {
  return (
    <SiteShell>
      <section>
        <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
          <p className="text-xs font-medium tracking-widest text-muted uppercase">On your phone</p>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-wide sm:text-6xl">
            Add Theosis to your Home Screen
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            This is still the website — it does not go through the App Store. Once it is on your
            home screen, it opens full-screen like an app: the Theosis shield, no browser chrome.
          </p>

          <div className="mt-8">
            <InstallButton />
          </div>

          <ol className="mt-12 space-y-10">
            <li>
              <p className="text-xs font-medium tracking-widest text-accent uppercase">iPhone · Safari</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-wide">iOS</h2>
              <ol className="mt-4 space-y-3 text-lg leading-relaxed text-muted">
                <li>
                  1. Open this site in <span className="text-fg">Safari</span> (not Chrome, not the
                  in-app browser).
                </li>
                <li className="flex flex-wrap items-center gap-2">
                  2. Tap Share
                  <span className="inline-flex size-9 items-center justify-center rounded-md bg-surface text-fg shadow-border">
                    <Share className="size-4" />
                  </span>
                  at the bottom of the screen.
                </li>
                <li>
                  3. Scroll and tap <span className="text-fg">Add to Home Screen</span>.
                </li>
                <li>
                  4. Tap <span className="text-fg">Add</span>. The shield lands on your home screen.
                </li>
              </ol>
            </li>
            <li>
              <p className="text-xs font-medium tracking-widest text-accent uppercase">Android · Chrome</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-wide">Android</h2>
              <ol className="mt-4 space-y-3 text-lg leading-relaxed text-muted">
                <li>1. Open this site in Chrome.</li>
                <li>
                  2. Tap the three dots, then <span className="text-fg">Install app</span> or{" "}
                  <span className="text-fg">Add to Home screen</span>.
                </li>
                <li>
                  3. Confirm. If a banner says <span className="text-fg">Install</span> at the
                  bottom, that is the same thing — use that.
                </li>
              </ol>
            </li>
          </ol>

          <p className="mt-12 text-sm text-muted">
            After that it launches like any other icon. It is still this site underneath — just
            without the address bar.
          </p>
          <p className="mt-6">
            <Link to="/" className="text-sm font-medium text-accent hover:text-fg">
              Back to Theosis Medical
            </Link>
          </p>
        </div>
      </section>
    </SiteShell>
  );
}
