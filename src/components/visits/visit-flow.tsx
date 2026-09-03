"use client";

import { useState, type ButtonHTMLAttributes } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Mic, MicOff, PhoneOff, Star, Video, VideoOff } from "lucide-react";
import { SesameMark } from "@/components/visits/sesame-mark";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  coachingAgreement,
  lifestyleGoals,
  lifestyleSlots,
  saveDemoChart,
  sessionMinutes,
  sessionPrice,
  type VisitKind,
} from "@/lib/visits";
import { cn } from "@/lib/utils";

type Step = "agreement" | "profile" | "intake" | "pay" | "schedule" | "waiting" | "room" | "done";

function LimeButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-sesame-lime px-6 text-sm font-semibold text-sesame-lime-ink transition-transform duration-150 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-sesame-ink ring-1 ring-sesame-ink/15 hover:bg-sesame-ink/5",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function SesameHeader({ kicker }: { kicker: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-sesame-ink/10 px-5 py-4 sm:px-8">
      <div className="flex items-center gap-2 text-sesame-ink">
        <SesameMark className="text-sesame-ink" />
        <span className="font-sans text-xl font-semibold tracking-tight lowercase">sesame</span>
      </div>
      <p className="text-xs font-medium tracking-wide text-sesame-muted">{kicker}</p>
    </div>
  );
}

export function VisitFlow({
  kind,
  view = "patient",
  who = "",
}: {
  kind: VisitKind;
  view?: "patient" | "clinician";
  who?: string;
}) {
  const clinician = view === "clinician";
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(clinician ? "room" : "agreement");
  const [accepted, setAccepted] = useState<Record<string, boolean>>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [goal, setGoal] = useState("");
  const [notes, setNotes] = useState("");
  const [slot, setSlot] = useState("");
  const [card, setCard] = useState("");
  const [exp, setExp] = useState("");
  const [cvc, setCvc] = useState("");
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [joined, setJoined] = useState(clinician);
  const clientName = who || name || "You";
  const allAccepted = coachingAgreement.every((item) => accepted[item.id]);

  function restart() {
    setStep("agreement");
    setAccepted({});
    setJoined(false);
  }

  const field =
    "mt-2 bg-sesame-card text-sesame-ink shadow-none ring-1 ring-sesame-ink/12 placeholder:text-sesame-muted focus-visible:ring-sesame-ink/30";

  return (
    <div className="bg-sesame-paper text-sesame-ink">
      <SesameHeader kicker={`Live demo · ${sessionMinutes} min video`} />
      <div className="mx-auto max-w-3xl px-5 py-10 pb-24 sm:px-8 lg:py-14">
        {kind === "acute" ? (
          <p className="mb-6 text-sm text-sesame-muted">
            Acute medical video visits are a different legal structure. This walkthrough is cash-pay
            lifestyle counseling only.
          </p>
        ) : null}

        {step === "agreement" ? (
          <section className="rounded-2xl bg-sesame-card p-6 ring-1 ring-sesame-ink/8 sm:p-8">
            <p className="text-xs font-semibold tracking-widest text-sesame-muted uppercase">
              Before you book on Sesame
            </p>
            <h1 className="mt-2 font-sans text-3xl font-semibold tracking-tight sm:text-4xl">
              Coaching agreement
            </h1>
            <p className="mt-3 leading-relaxed text-sesame-muted">
              Sesame is the cash-pay marketplace and the video room. This agreement is the Theosis
              Medical add-on that keeps the session in the counseling lane — coaching, not a clinic.
            </p>
            <p className="mt-4 leading-relaxed text-sesame-muted">
              Nick Holwey, through Theosis Medical, LLC, offers lifestyle counseling. He is an
              emergency medicine physician assistant by training.{" "}
              <strong className="font-semibold text-sesame-ink">This session is not medical care.</strong>
            </p>
            <ul className="mt-8 space-y-4">
              {coachingAgreement.map((item) => {
                const on = Boolean(accepted[item.id]);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setAccepted((prev) => ({ ...prev, [item.id]: !on }))}
                      className="flex w-full cursor-pointer items-start gap-3 text-left"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[4px] border",
                          on
                            ? "border-sesame-lime-ink bg-sesame-lime text-sesame-lime-ink"
                            : "border-sesame-ink/25 bg-sesame-paper",
                        )}
                      >
                        {on ? (
                          <svg viewBox="0 0 12 12" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M2 6.2 4.6 9 10 3" />
                          </svg>
                        ) : null}
                      </span>
                      <span className="text-[15px] leading-relaxed text-sesame-ink">{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <LimeButton className="mt-8" disabled={!allAccepted} onClick={() => setStep("profile")}>
              I agree — see Nick on Sesame
              <ArrowRight className="size-4" />
            </LimeButton>
          </section>
        ) : null}

        {step === "profile" ? (
          <section>
            <p className="text-sm text-sesame-muted">Video visit · lifestyle counseling · cash pay</p>
            <h1 className="mt-2 font-sans text-3xl font-semibold tracking-tight sm:text-4xl">
              Book Nick Holwey
            </h1>
            <article className="mt-8 overflow-hidden rounded-2xl bg-sesame-card ring-1 ring-sesame-ink/8">
              <div className="grid sm:grid-cols-[11rem_1fr]">
                <img
                  src="/images/nick.jpg"
                  alt=""
                  className="no-outline h-44 w-full object-cover object-top sm:h-full"
                />
                <div className="p-6 sm:p-8">
                  <p className="text-xs font-semibold tracking-widest text-sesame-muted uppercase">
                    Independent provider on Sesame
                  </p>
                  <h2 className="mt-1 font-sans text-2xl font-semibold">Nick Holwey, PA-C</h2>
                  <p className="mt-1 text-sm text-sesame-muted">
                    Lifestyle counseling · Theosis Medical, LLC · IL-based, multi-state licensed
                  </p>
                  <p className="mt-3 flex items-center gap-1 text-sm font-medium">
                    <Star className="size-4 fill-sesame-lime-ink text-sesame-lime-ink" />
                    4.9 demo rating · video
                  </p>
                  <p className="mt-4 font-sans text-3xl font-semibold tracking-tight">
                    ${sessionPrice}
                    <span className="ml-2 text-base font-medium text-sesame-muted">
                      · {sessionMinutes} min
                    </span>
                  </p>
                  <p className="mt-2 text-sm text-sesame-muted">
                    Next available: Tue · 4:30 p.m. · After clinic
                  </p>
                  <LimeButton className="mt-6" onClick={() => setStep("intake")}>
                    Book video visit
                    <ArrowRight className="size-4" />
                  </LimeButton>
                </div>
              </div>
            </article>
            <p className="mt-6 text-sm leading-relaxed text-sesame-muted">
              Live, this card would sit on Sesame next to other cash-pay providers. You would not
              host the video yourself — Sesame’s room, Sesame’s payment, your counseling agreement
              in front of it.
            </p>
            <GhostButton className="mt-4" onClick={() => setStep("agreement")}>
              Back
            </GhostButton>
          </section>
        ) : null}

        {step === "intake" ? (
          <section className="rounded-2xl bg-sesame-card p-6 ring-1 ring-sesame-ink/8 sm:p-8">
            <h1 className="font-sans text-3xl font-semibold tracking-tight">What’s this visit for?</h1>
            <p className="mt-2 text-sm text-sesame-muted">
              Sesame asks a short reason so Nick can show up prepared. Coaching intake — not a
              chart. Do not send labs or medication lists.
            </p>
            <div className="mt-6">
              <label htmlFor="visit-name" className="text-sm font-medium">
                Name
              </label>
              <Input
                id="visit-name"
                className={field}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="First and last"
                autoComplete="name"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="visit-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="visit-email"
                type="email"
                className={field}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Where Sesame would send the join link"
                autoComplete="email"
              />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium">What do you want help with?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {lifestyleGoals.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoal(g)}
                    className={cn(
                      "min-h-11 rounded-full px-4 py-2 text-sm font-medium",
                      goal === g
                        ? "bg-sesame-lime text-sesame-lime-ink"
                        : "bg-sesame-paper text-sesame-ink ring-1 ring-sesame-ink/10 hover:bg-sesame-ink/5",
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4">
              <label htmlFor="visit-notes" className="text-sm font-medium">
                Anything about your schedule, kitchen, or constraints
              </label>
              <Textarea
                id="visit-notes"
                className={cn(field, "min-h-24")}
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Live demo only. No real health information."
              />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <GhostButton onClick={() => setStep("profile")}>Back</GhostButton>
              <LimeButton disabled={!name.trim() || !email.trim() || !goal} onClick={() => setStep("schedule")}>
                Pick a time
                <ArrowRight className="size-4" />
              </LimeButton>
            </div>
          </section>
        ) : null}

        {step === "schedule" ? (
          <section className="rounded-2xl bg-sesame-card p-6 ring-1 ring-sesame-ink/8 sm:p-8">
            <h1 className="font-sans text-3xl font-semibold tracking-tight">Choose a time</h1>
            <p className="mt-2 text-sesame-muted">
              Live, these would be the openings Nick published on Sesame for locums weeks and days
              off.
            </p>
            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              {lifestyleSlots.map((s) => {
                const value = `${s.when} · ${s.note}`;
                const on = slot === value;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSlot(value)}
                    className={cn(
                      "rounded-2xl px-4 py-4 text-left",
                      on
                        ? "bg-sesame-lime text-sesame-lime-ink"
                        : "bg-sesame-paper ring-1 ring-sesame-ink/10 hover:bg-sesame-ink/5",
                    )}
                  >
                    <span className="block font-semibold">{s.when}</span>
                    <span className="mt-1 block text-sm opacity-80">{s.note} · video</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <GhostButton onClick={() => setStep("intake")}>Back</GhostButton>
              <LimeButton disabled={!slot} onClick={() => setStep("pay")}>
                Continue to pay
                <ArrowRight className="size-4" />
              </LimeButton>
            </div>
          </section>
        ) : null}

        {step === "pay" ? (
          <section className="rounded-2xl bg-sesame-card p-6 ring-1 ring-sesame-ink/8 sm:p-8">
            <p className="text-xs font-semibold tracking-widest text-sesame-muted uppercase">
              Sesame checkout · cash · no insurance
            </p>
            <h1 className="mt-2 font-sans text-3xl font-semibold tracking-tight">
              ${sessionPrice}
            </h1>
            <p className="mt-1 text-sesame-muted">
              {sessionMinutes} min video with Nick Holwey, PA-C
            </p>
            <p className="mt-3 text-sm text-sesame-muted">
              {name} · {goal} · {slot}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-sesame-muted">
              Live, Sesame would charge the card and pay the provider. This demo does not charge
              anyone.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="card" className="text-sm font-medium">
                  Card number
                </label>
                <Input
                  id="card"
                  className={field}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="4242 4242 4242 4242"
                  value={card}
                  onChange={(e) => setCard(e.target.value)}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="exp" className="text-sm font-medium">
                    Exp
                  </label>
                  <Input id="exp" className={field} placeholder="MM / YY" value={exp} onChange={(e) => setExp(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="cvc" className="text-sm font-medium">
                    CVC
                  </label>
                  <Input id="cvc" className={field} placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} />
                </div>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <GhostButton onClick={() => setStep("schedule")}>Back</GhostButton>
              <LimeButton
                disabled={card.replace(/\s/g, "").length < 12}
                onClick={() => {
                  saveDemoChart({
                    kind: "lifestyle",
                    name: name.trim(),
                    email: email.trim(),
                    state: "",
                    reason: goal,
                    notes,
                    slot,
                    at: new Date().toISOString(),
                    paid: true,
                  });
                  setStep("waiting");
                }}
              >
                Pay ${sessionPrice} — demo, no charge
              </LimeButton>
            </div>
          </section>
        ) : null}

        {step === "waiting" ? (
          <section className="overflow-hidden rounded-2xl bg-sesame-card text-center ring-1 ring-sesame-ink/8">
            <div className="px-6 py-16 sm:px-10 sm:py-24">
              <SesameMark className="mx-auto inline-flex text-sesame-ink" />
              <p className="mt-4 text-xs font-semibold tracking-widest text-sesame-muted uppercase">
                Sesame waiting room
              </p>
              <h1 className="mt-3 font-sans text-3xl font-semibold tracking-tight sm:text-4xl">
                You’re booked
              </h1>
              <p className="mx-auto mt-4 max-w-md text-sesame-muted">
                {slot}. Live, Sesame would text and email a join link. Nick joins from the provider
                app. Camera off until you are ready.
              </p>
              <LimeButton className="mt-10" onClick={() => setStep("room")}>
                Join video visit
              </LimeButton>
            </div>
          </section>
        ) : null}

        {step === "room" ? (
          <section className="overflow-hidden rounded-2xl bg-[#111] text-sesame-card">
            <div className="flex items-center justify-between gap-3 px-4 py-3 text-sesame-card">
              <div className="flex items-center gap-2">
                <SesameMark className="text-sesame-lime" />
                <span className="text-sm font-semibold lowercase">sesame</span>
                <span className="hidden text-xs text-white/50 sm:inline">
                  Lifestyle counseling · {sessionMinutes}:00
                </span>
              </div>
              <p className="text-xs text-white/50">Live demo · not a real visit</p>
            </div>
            <div className="grid gap-px bg-white/10 sm:grid-cols-2">
              <div className="relative aspect-video bg-black sm:aspect-auto sm:min-h-72">
                <img
                  src="/images/nick.jpg"
                  alt=""
                  className={cn("no-outline size-full object-cover object-top", joined ? "opacity-100" : "opacity-40")}
                />
                <p className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs">
                  {clinician ? "You · Nick" : joined ? "Nick Holwey, PA-C" : "Connecting…"}
                </p>
              </div>
              <div className="relative flex aspect-video items-center justify-center bg-[#1a1a1a] sm:aspect-auto sm:min-h-72">
                {cameraOff ? (
                  <p className="text-sm text-white/50">Camera off</p>
                ) : (
                  <p className="font-sans text-2xl font-semibold">{clientName}</p>
                )}
                <p className="absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs">
                  {clinician ? clientName : "You"} {muted ? "· muted" : ""}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-5">
              {!joined && !clinician ? (
                <LimeButton onClick={() => setJoined(true)}>Join video</LimeButton>
              ) : null}
              <button
                type="button"
                aria-label={muted ? "Unmute" : "Mute"}
                onClick={() => setMuted((v) => !v)}
                className="flex size-12 items-center justify-center rounded-full bg-white/10 text-sesame-card hover:bg-white/20"
              >
                {muted ? <MicOff className="size-5" /> : <Mic className="size-5" />}
              </button>
              <button
                type="button"
                aria-label={cameraOff ? "Camera on" : "Camera off"}
                onClick={() => setCameraOff((v) => !v)}
                className="flex size-12 items-center justify-center rounded-full bg-white/10 text-sesame-card hover:bg-white/20"
              >
                {cameraOff ? <VideoOff className="size-5" /> : <Video className="size-5" />}
              </button>
              <button
                type="button"
                onClick={() => {
                  if (clinician) navigate({ to: "/provider" });
                  else setStep("done");
                }}
                className="flex min-h-12 items-center gap-2 rounded-full bg-danger px-5 text-sm font-semibold text-fg hover:bg-danger/90"
              >
                <PhoneOff className="size-4" />
                Leave
              </button>
            </div>
          </section>
        ) : null}

        {step === "done" ? (
          <section className="rounded-2xl bg-sesame-card p-6 ring-1 ring-sesame-ink/8 sm:p-8">
            <p className="text-xs font-semibold tracking-widest text-sesame-muted uppercase">
              After the Sesame visit · demo
            </p>
            <h1 className="mt-2 font-sans text-3xl font-semibold tracking-tight">If this had been real</h1>
            <div className="mt-5 space-y-4 leading-relaxed text-sesame-muted">
              <p>
                Sesame would have taken the ${sessionPrice}, run the video, and emailed a receipt.
                Nick would have picked two or three moves you can actually do this week — protein
                first, a walking default, a hotel/shift food rule. Not a diagnosis. Not labs. Not a
                prescription.
              </p>
              <p>Until a live Sesame listing exists, the Health Hacks are the same 80/20, free.</p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/hacks"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-sesame-lime px-6 text-sm font-semibold text-sesame-lime-ink hover:brightness-95"
              >
                Open the hacks
                <ArrowRight className="size-4" />
              </Link>
              <GhostButton onClick={restart}>Run the live demo again</GhostButton>
            </div>
            <p className="mt-6">
              <Link to="/provider" className="text-sm font-medium text-sesame-ink underline underline-offset-4">
                I’m Nick — open the provider inbox
              </Link>
            </p>
          </section>
        ) : null}
      </div>
    </div>
  );
}
