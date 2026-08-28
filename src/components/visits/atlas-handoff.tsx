"use client";

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { redFlags } from "@/lib/visits";
import { cn } from "@/lib/utils";

type Step = "why" | "gate" | "hub" | "pick" | "pay" | "ready" | "room" | "done";

const plans = [
  {
    id: "lifestyle",
    title: "Lifestyle consult",
    time: "30–45 min",
    note: "Nutrition, labs, cholesterol, diabetes, busy-life health. One visit. Paid in Atlas.",
  },
  {
    id: "acute",
    title: "Acute video visit",
    time: "15 min",
    note: "Sore throat, rash, sinus, mild aches. Appropriate concerns only.",
  },
  {
    id: "member",
    title: "Membership (DPC-style)",
    time: "Monthly",
    note: "Atlas is built for this. Messaging, follow-ups, visits inside the Patient Hub. Example only — not a real plan.",
  },
] as const;

export function AtlasHandoff() {
  const [step, setStep] = useState<Step>("why");
  const [noneApply, setNoneApply] = useState(false);
  const [email, setEmail] = useState("");
  const [plan, setPlan] = useState("");
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 pb-28 sm:px-8 lg:py-24">
      <p className="text-xs font-medium tracking-widest text-muted uppercase">
        Playground · Atlas.md handoff
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-wide sm:text-5xl">
        Theosis stays the front door
      </h1>

      {step === "why" ? (
        <section className="mt-8 space-y-5 text-lg leading-relaxed text-muted">
          <p>
            This site keeps brand, hacks, red flags, and “are you in IL / WI / MI / IN.” Atlas keeps
            the chart, payment, Patient Hub, HIPAA video, and ePrescribe (DrFirst). Nothing medical
            lives on this website.
          </p>
          <p>
            Click through a fake booking. There is no real Atlas clinic on the other end. Do not
            enter a real card or real health information.
          </p>
          <Button className="mt-4" size="lg" onClick={() => setStep("gate")}>
            Start the handoff
            <ArrowRight />
          </Button>
        </section>
      ) : null}

      {step === "gate" ? (
        <section className="mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8">
          <p className="text-xs font-medium tracking-widest text-accent uppercase">On this site</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-wide">
            This is not an emergency department
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Same wall as the other demo. Atlas never sees a chest-pain click.
          </p>
          <ul className="mt-6 space-y-3 text-muted">
            {redFlags.map((flag) => (
              <li key={flag} className="flex gap-3">
                <span aria-hidden="true" className="mt-2 size-1.5 shrink-0 rounded-full bg-danger" />
                <span>{flag}</span>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={() => setNoneApply((v) => !v)}
            className="mt-8 flex w-full cursor-pointer items-start gap-3 text-left text-fg"
          >
            <span
              aria-hidden="true"
              className={cn(
                "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[3px] border",
                noneApply ? "border-accent bg-accent text-accent-fg" : "border-steel bg-ink",
              )}
            >
              {noneApply ? (
                <svg viewBox="0 0 12 12" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 6.2 4.6 9 10 3" />
                </svg>
              ) : null}
            </span>
            <span>None of these apply. I understand this is a demo, not care.</span>
          </button>
          <Button className="mt-8" size="lg" disabled={!noneApply} onClick={() => setStep("hub")}>
            Continue to Atlas Patient Hub
            <ArrowRight />
          </Button>
        </section>
      ) : null}

      {step === "hub" ? (
        <section className="mt-10 overflow-hidden rounded-xl shadow-border">
          <div className="bg-[#1a2330] px-6 py-4 text-ink-fg">
            <p className="text-[10px] font-medium tracking-[0.2em] text-[#8aa4c4] uppercase">
              Atlas.md · Patient Hub · mock
            </p>
            <p className="mt-1 font-display text-xl font-semibold tracking-wide">Sign in</p>
          </div>
          <div className="space-y-5 bg-surface p-6 sm:p-8">
            <p className="text-muted">
              Live, this screen is Atlas — their login, their encryption. We would drop you here
              with a link, not rebuild their portal.
            </p>
            <div>
              <label htmlFor="atlas-email" className="text-sm font-medium text-fg">
                Email
              </label>
              <Input
                id="atlas-email"
                className="mt-2"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com — playground only"
              />
            </div>
            <Button size="lg" disabled={!email.includes("@")} onClick={() => setStep("pick")}>
              Magic link (demo)
              <ArrowRight />
            </Button>
          </div>
        </section>
      ) : null}

      {step === "pick" ? (
        <section className="mt-10 overflow-hidden rounded-xl shadow-border">
          <div className="bg-[#1a2330] px-6 py-4 text-ink-fg">
            <p className="text-[10px] font-medium tracking-[0.2em] text-[#8aa4c4] uppercase">
              Atlas.md · Patient Hub · mock
            </p>
            <p className="mt-1 font-display text-xl font-semibold tracking-wide">What do you need?</p>
          </div>
          <div className="space-y-3 bg-surface p-6 sm:p-8">
            {plans.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlan(p.id)}
                className={cn(
                  "w-full rounded-sm px-4 py-4 text-left shadow-border",
                  plan === p.id ? "bg-accent text-accent-fg" : "bg-ink hover:bg-fg/5",
                )}
              >
                <span className="block font-display text-lg font-semibold tracking-wide">{p.title}</span>
                <span className="mt-1 block text-sm opacity-80">{p.time}</span>
                <span className="mt-2 block text-sm opacity-90">{p.note}</span>
              </button>
            ))}
            <Button className="mt-4" size="lg" disabled={!plan} onClick={() => setStep("pay")}>
              Continue to payment
              <ArrowRight />
            </Button>
          </div>
        </section>
      ) : null}

      {step === "pay" ? (
        <section className="mt-10 overflow-hidden rounded-xl shadow-border">
          <div className="bg-[#1a2330] px-6 py-4 text-ink-fg">
            <p className="text-[10px] font-medium tracking-[0.2em] text-[#8aa4c4] uppercase">
              Atlas.md · billing · mock
            </p>
            <p className="mt-1 font-display text-xl font-semibold tracking-wide">Pay in Atlas</p>
          </div>
          <div className="space-y-5 bg-surface p-6 sm:p-8">
            <p className="text-muted">
              Card or ACH, logged to the chart. This playground does not charge anyone. Do not type
              a real card.
            </p>
            <Input placeholder="Name on card" autoComplete="off" />
            <Input placeholder="•••• •••• •••• ••••" autoComplete="off" />
            <Button size="lg" onClick={() => setStep("ready")}>
              Pay (demo)
              <ArrowRight />
            </Button>
          </div>
        </section>
      ) : null}

      {step === "ready" ? (
        <section className="mt-10 overflow-hidden rounded-xl shadow-border">
          <div className="bg-[#1a2330] px-6 py-4 text-ink-fg">
            <p className="text-[10px] font-medium tracking-[0.2em] text-[#8aa4c4] uppercase">
              Atlas.md · Patient Hub · mock
            </p>
            <p className="mt-1 font-display text-xl font-semibold tracking-wide">You’re on the board</p>
          </div>
          <div className="space-y-5 bg-surface p-6 sm:p-8">
            <p className="text-lg text-fg">
              {plans.find((p) => p.id === plan)?.title ?? "Visit"} · Nick Holwey, PA-C
            </p>
            <p className="text-muted">
              Intake, allergies, meds, and the note live here. You join video from this same Hub —
              on your phone in the Atlas patient app, or in the browser. I join from the Atlas
              clinician app.
            </p>
            <Button size="lg" onClick={() => setStep("room")}>
              Join Atlas video
              <ArrowRight />
            </Button>
          </div>
        </section>
      ) : null}

      {step === "room" ? (
        <section className="mt-10 overflow-hidden rounded-xl bg-ink shadow-border">
          <p className="px-4 py-3 text-[10px] font-medium tracking-[0.2em] text-[#8aa4c4] uppercase">
            Atlas.md · HIPAA video · mock
          </p>
          <div className="grid gap-px bg-border sm:grid-cols-2">
            <div className="relative aspect-video bg-black sm:min-h-72">
              <img src="/images/nick.jpg" alt="" className="no-outline size-full object-cover object-top" />
              <p className="absolute bottom-3 left-3 rounded-sm bg-black/70 px-2 py-1 text-xs tracking-wide text-ink-fg uppercase">
                Nick Holwey, PA-C
              </p>
            </div>
            <div className="relative flex aspect-video items-center justify-center bg-[#0a121c] sm:min-h-72">
              <p className="font-display text-2xl font-semibold tracking-wide text-steel">
                {cameraOff ? "Camera off" : "You"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-5">
            <Button variant="outline" size="icon" aria-label="Mute" onClick={() => setMuted((v) => !v)}>
              {muted ? <MicOff /> : <Mic />}
            </Button>
            <Button variant="outline" size="icon" aria-label="Camera" onClick={() => setCameraOff((v) => !v)}>
              {cameraOff ? <VideoOff /> : <Video />}
            </Button>
            <Button className="bg-danger text-fg hover:bg-danger/90" onClick={() => setStep("done")}>
              <PhoneOff />
              End visit
            </Button>
          </div>
        </section>
      ) : null}

      {step === "done" ? (
        <section className="mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8">
          <p className="text-xs font-medium tracking-widest text-accent uppercase">Back on this site</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-wide">If this had been real</h2>
          <p className="mt-5 text-lg leading-relaxed text-muted">
            The note, Rx, and receipt would stay in Atlas. We would have gone over your goals and
            personalized a treatment plan. Until then, check out some of the hacks that can get you
            started.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/hacks">
                Open the hacks
                <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" onClick={() => setStep("why")}>
              Run it again
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
