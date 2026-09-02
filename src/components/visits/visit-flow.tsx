"use client";

import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Mic, MicOff, PhoneOff, Video, VideoOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  coachingAgreement,
  lifestyleGoals,
  lifestyleSlots,
  saveDemoChart,
  sessionMinutes,
  sessionPrice,
  visitMeta,
  type VisitKind,
} from "@/lib/visits";
import { cn } from "@/lib/utils";

type Step = "agreement" | "intake" | "pay" | "schedule" | "waiting" | "room" | "done";

export function VisitFlow({
  kind,
  view = "patient",
  who = "",
}: {
  kind: VisitKind;
  view?: "patient" | "clinician";
  who?: string;
}) {
  const meta = visitMeta.lifestyle;
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

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 pb-28 sm:px-8 lg:py-24">
      <p className="text-xs font-medium tracking-widest text-muted uppercase">
        Playground · how this would look if it went live today · {sessionMinutes} min
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-wide sm:text-5xl">{meta.title}</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted">{meta.lede}</p>
      {kind === "acute" ? (
        <p className="mt-4 text-sm text-warn">
          Acute medical video visits are not this product. This walkthrough is cash-pay lifestyle
          counseling only.
        </p>
      ) : null}

      {step === "agreement" ? (
        <section className="mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8">
          <p className="text-xs font-medium tracking-widest text-accent uppercase">Before you book</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-wide">
            Coaching agreement
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Read this. Check every box. This is the legal wall that keeps the session in the
            counseling lane — and the reason it can start without a physician-owned clinic.
          </p>
          <p className="mt-4 leading-relaxed text-muted">
            Nick Holwey, through Theosis Medical, LLC, offers lifestyle counseling. He is an
            emergency medicine physician assistant by training.{" "}
            <strong className="font-medium text-fg">This session is not medical care.</strong>
          </p>
          <ul className="mt-8 space-y-4">
            {coachingAgreement.map((item) => {
              const on = Boolean(accepted[item.id]);
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => setAccepted((prev) => ({ ...prev, [item.id]: !on }))}
                    className="flex w-full cursor-pointer items-start gap-3 text-left text-fg"
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[3px] border",
                        on ? "border-accent bg-accent text-accent-fg" : "border-steel bg-ink",
                      )}
                    >
                      {on ? (
                        <svg viewBox="0 0 12 12" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M2 6.2 4.6 9 10 3" />
                        </svg>
                      ) : null}
                    </span>
                    <span className="text-[15px] leading-relaxed">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <Button type="button" className="mt-8" size="lg" disabled={!allAccepted} onClick={() => setStep("intake")}>
            I agree — continue
            <ArrowRight />
          </Button>
        </section>
      ) : null}

      {step === "intake" ? (
        <section className="mt-10 space-y-5 rounded-xl bg-surface p-6 shadow-border sm:p-8">
          <h2 className="font-display text-2xl font-semibold tracking-wide">What we’re working on</h2>
          <p className="text-sm text-muted">
            Coaching intake. Not a chart. Do not send labs, medication lists, or diagnoses.
          </p>
          <div>
            <label htmlFor="visit-name" className="text-sm font-medium text-fg">
              Name
            </label>
            <Input
              id="visit-name"
              className="mt-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="First and last"
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="visit-email" className="text-sm font-medium text-fg">
              Email
            </label>
            <Input
              id="visit-email"
              type="email"
              className="mt-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Where the video link would go"
              autoComplete="email"
            />
          </div>
          <div>
            <p className="text-sm font-medium text-fg">What do you want help with?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {lifestyleGoals.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGoal(g)}
                  className={cn(
                    "min-h-11 rounded-sm px-4 py-2 text-sm font-medium shadow-border",
                    goal === g ? "bg-accent text-accent-fg" : "bg-ink text-fg hover:bg-fg/5",
                  )}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="visit-notes" className="text-sm font-medium text-fg">
              Anything about your schedule, kitchen, or constraints — in your words
            </label>
            <Textarea
              id="visit-notes"
              className="mt-2"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Playground only. No real health information. No lab PDFs."
            />
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep("agreement")}>
              Back
            </Button>
            <Button size="lg" disabled={!name.trim() || !email.trim() || !goal} onClick={() => setStep("pay")}>
              Pay ${sessionPrice}
              <ArrowRight />
            </Button>
          </div>
        </section>
      ) : null}

      {step === "pay" ? (
        <section className="mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8">
          <p className="text-xs font-medium tracking-widest text-accent uppercase">Cash pay · no insurance</p>
          <h2 className="mt-2 font-display text-2xl font-semibold tracking-wide">
            ${sessionPrice} · {sessionMinutes} minutes
          </h2>
          <p className="mt-3 leading-relaxed text-muted">
            Live, this would be Stripe. Card charged, receipt emailed, no claim submitted. This
            playground does not charge a real card.
          </p>
          <p className="mt-4 text-sm text-muted">
            {name} · {goal}
          </p>
          <div className="mt-8 space-y-4">
            <div>
              <label htmlFor="card" className="text-sm font-medium text-fg">
                Card number
              </label>
              <Input
                id="card"
                className="mt-2"
                inputMode="numeric"
                autoComplete="off"
                placeholder="4242 4242 4242 4242"
                value={card}
                onChange={(e) => setCard(e.target.value)}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="exp" className="text-sm font-medium text-fg">
                  Exp
                </label>
                <Input id="exp" className="mt-2" placeholder="MM / YY" value={exp} onChange={(e) => setExp(e.target.value)} />
              </div>
              <div>
                <label htmlFor="cvc" className="text-sm font-medium text-fg">
                  CVC
                </label>
                <Input id="cvc" className="mt-2" placeholder="123" value={cvc} onChange={(e) => setCvc(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setStep("intake")}>
              Back
            </Button>
            <Button
              size="lg"
              disabled={card.replace(/\s/g, "").length < 12}
              onClick={() => setStep("schedule")}
            >
              Pay ${sessionPrice} — demo, no charge
              <ArrowRight />
            </Button>
          </div>
        </section>
      ) : null}

      {step === "schedule" ? (
        <section className="mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8">
          <h2 className="font-display text-2xl font-semibold tracking-wide">Pick a time</h2>
          <p className="mt-3 text-muted">
            Live, this would be a calendar (Calendly, or slots you open on locums weeks) and a Zoom
            or Google Meet link in your email. These are pretend openings.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {lifestyleSlots.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSlot(`${s.when} · ${s.note}`)}
                className={cn(
                  "rounded-sm px-4 py-4 text-left shadow-border",
                  slot === `${s.when} · ${s.note}` ? "bg-accent text-accent-fg" : "bg-ink hover:bg-fg/5",
                )}
              >
                <span className="block font-display text-lg font-semibold tracking-wide">{s.when}</span>
                <span className="mt-1 block text-sm opacity-80">{s.note}</span>
              </button>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setStep("pay")}>
              Back
            </Button>
            <Button
              size="lg"
              disabled={!slot}
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
              Hold this time
              <ArrowRight />
            </Button>
          </div>
        </section>
      ) : null}

      {step === "waiting" ? (
        <section className="mt-10 overflow-hidden rounded-xl bg-ink shadow-border">
          <div
            className="relative px-6 py-16 text-center sm:px-10 sm:py-24"
            style={{ backgroundImage: "url(/images/navy-grain.jpg)", backgroundSize: "420px" }}
          >
            <p className="text-xs font-medium tracking-widest text-ink-muted uppercase">Waiting room</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-wide text-ink-fg sm:text-4xl">
              Nick will join shortly
            </h2>
            <p className="mx-auto mt-4 max-w-md text-ink-muted">
              {slot}. Live, this would be the Zoom/Meet waiting room. Camera off until you are ready.
              Still coaching, still not a clinic.
            </p>
            <Button className="mt-10" size="lg" onClick={() => setStep("room")}>
              I’m here
              <ArrowRight />
            </Button>
          </div>
        </section>
      ) : null}

      {step === "room" ? (
        <section className="mt-10 overflow-hidden rounded-xl bg-ink shadow-border">
          <div className="grid gap-px bg-border sm:grid-cols-2">
            <div className="relative aspect-video bg-black sm:aspect-auto sm:min-h-72">
              <img
                src="/images/nick.jpg"
                alt=""
                className={cn("no-outline size-full object-cover object-top", joined ? "opacity-100" : "opacity-40")}
              />
              <p className="absolute bottom-3 left-3 rounded-sm bg-black/70 px-2 py-1 text-xs tracking-wide text-ink-fg uppercase">
                {clinician ? "You · Nick" : joined ? "Nick · counseling" : "Connecting…"}
              </p>
            </div>
            <div className="relative flex aspect-video items-center justify-center bg-[#0a121c] sm:aspect-auto sm:min-h-72">
              {cameraOff ? (
                <p className="text-sm text-ink-muted">Camera off</p>
              ) : (
                <p className="font-display text-2xl font-semibold tracking-wide text-steel">{clientName}</p>
              )}
              <p className="absolute bottom-3 left-3 rounded-sm bg-black/70 px-2 py-1 text-xs tracking-wide text-ink-fg uppercase">
                {clinician ? clientName : "You"} {muted ? "· muted" : ""}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-5">
            {!joined && !clinician ? (
              <Button size="lg" onClick={() => setJoined(true)}>
                Join session
              </Button>
            ) : null}
            <Button variant="outline" size="icon" aria-label={muted ? "Unmute" : "Mute"} onClick={() => setMuted((v) => !v)}>
              {muted ? <MicOff /> : <Mic />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              aria-label={cameraOff ? "Camera on" : "Camera off"}
              onClick={() => setCameraOff((v) => !v)}
            >
              {cameraOff ? <VideoOff /> : <Video />}
            </Button>
            <Button
              className="bg-danger text-fg hover:bg-danger/90"
              onClick={() => {
                if (clinician) navigate({ to: "/provider" });
                else setStep("done");
              }}
            >
              <PhoneOff />
              End session
            </Button>
          </div>
        </section>
      ) : null}

      {step === "done" ? (
        <section className="mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8">
          <p className="text-xs font-medium tracking-widest text-accent uppercase">After the session · demo</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-wide">If this had been real</h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
            <p>
              We would have picked two or three moves you can actually do this week — protein first,
              a walking default, a hotel/shift food rule — and you would leave with that list. Not a
              diagnosis. Not a lab interpretation. Not a prescription.
            </p>
            <p>
              Until a live calendar exists, the Health Hacks are the same 80/20, free.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/hacks">
                Open the hacks
                <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" onClick={restart}>
              Run it again
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
