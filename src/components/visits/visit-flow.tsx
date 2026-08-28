"use client";

import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  acuteConcerns,
  licensedStates,
  lifestyleGoals,
  lifestyleSlots,
  redFlags,
  saveDemoChart,
  visitMeta,
  type VisitKind,
} from "@/lib/visits";
import { cn } from "@/lib/utils";

type Step = "gate" | "intake" | "history" | "schedule" | "waiting" | "room" | "done";

export function VisitFlow({
  kind,
  view = "patient",
  who = "",
}: {
  kind: VisitKind;
  view?: "patient" | "clinician";
  who?: string;
}) {
  const meta = visitMeta[kind];
  const clinician = view === "clinician";
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(clinician ? "room" : "gate");
  const [noneApply, setNoneApply] = useState(false);
  const [name, setName] = useState("");
  const [state, setState] = useState("");
  const [goal, setGoal] = useState("");
  const [concern, setConcern] = useState("");
  const [notes, setNotes] = useState("");
  const [allergies, setAllergies] = useState("");
  const [meds, setMeds] = useState("");
  const [pmh, setPmh] = useState("");
  const [surgeries, setSurgeries] = useState("");
  const [slot, setSlot] = useState(kind === "acute" ? "Next available · today 4:20 p.m." : "");
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [joined, setJoined] = useState(clinician);
  const patientName = who || name || "Patient";

  const licensed = licensedStates.some((s) => s.code === state);

  function restart() {
    setStep("gate");
    setNoneApply(false);
    setJoined(false);
  }

  return (
    <div className="mx-auto max-w-3xl px-5 py-16 pb-28 sm:px-8 lg:py-24">
      <p className="text-xs font-medium tracking-widest text-muted uppercase">
        Playground · {meta.n} · {meta.time}
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-wide sm:text-5xl">{meta.title}</h1>
      {meta.lede ? <p className="mt-4 text-lg leading-relaxed text-muted">{meta.lede}</p> : null}

      {step === "gate" ? (
        <section className="mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8">
          <h2 className="font-display text-2xl font-semibold tracking-wide">This is not an emergency department</h2>
          <p className="mt-3 leading-relaxed text-muted">
            If any of these are happening, hang up this playground and call 911 or go in. A video
            visit cannot see you the way an ED can.
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
          <Button
            type="button"
            className="mt-8"
            size="lg"
            disabled={!noneApply}
            onClick={() => setStep("intake")}
          >
            Continue
            <ArrowRight />
          </Button>
        </section>
      ) : null}

      {step === "intake" ? (
        <section className="mt-10 space-y-5 rounded-xl bg-surface p-6 shadow-border sm:p-8">
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
            <p className="text-sm font-medium text-fg">Where are you right now?</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {licensedStates.map((s) => (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => setState(s.code)}
                  className={cn(
                    "h-11 rounded-sm px-4 text-sm font-medium shadow-border",
                    state === s.code ? "bg-accent text-accent-fg" : "bg-ink text-fg hover:bg-fg/5",
                  )}
                >
                  {s.name}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setState("XX")}
                className={cn(
                  "h-11 rounded-sm px-4 text-sm font-medium shadow-border",
                  state === "XX" ? "bg-accent text-accent-fg" : "bg-ink text-fg hover:bg-fg/5",
                )}
              >
                Somewhere else
              </button>
            </div>
            {state === "XX" ? (
              <p className="mt-3 text-sm text-danger">
                If this were real, I could not see you there. Licensed in IL, WI, MI, and IN.
              </p>
            ) : null}
          </div>

          {kind === "lifestyle" ? (
            <div>
              <p className="text-sm font-medium text-fg">What are we working on?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {lifestyleGoals.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGoal(g)}
                    className={cn(
                      "h-11 rounded-sm px-4 text-sm font-medium shadow-border",
                      goal === g ? "bg-accent text-accent-fg" : "bg-ink text-fg hover:bg-fg/5",
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm font-medium text-fg">What’s going on?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {acuteConcerns.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setConcern(c)}
                    className={cn(
                      "h-11 rounded-sm px-4 text-sm font-medium shadow-border",
                      concern === c ? "bg-accent text-accent-fg" : "bg-ink text-fg hover:bg-fg/5",
                    )}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label htmlFor="visit-notes" className="text-sm font-medium text-fg">
              Anything else I should know — in your words
            </label>
            <Textarea
              id="visit-notes"
              className="mt-2"
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Playground only. Do not put real medical details."
            />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep("gate")}>
              Back
            </Button>
            <Button
              size="lg"
              disabled={!name.trim() || !licensed || (kind === "lifestyle" ? !goal : !concern)}
              onClick={() => setStep("history")}
            >
              Medical history
              <ArrowRight />
            </Button>
          </div>
        </section>
      ) : null}

      {step === "history" ? (
        <section className="mt-10 space-y-5 rounded-xl bg-surface p-6 shadow-border sm:p-8">
          <h2 className="font-display text-2xl font-semibold tracking-wide">Medical intake</h2>
          <p className="text-sm text-muted">
            If this were live, this would live in the chart, not in my email. Playground only — do not
            enter real information.
          </p>
          {(
            [
              ["allergies", "Allergies", allergies, setAllergies, "NKDA, or list them"],
              ["meds", "Medications", meds, setMeds, "Dose and how you take it"],
              ["pmh", "Past medical history", pmh, setPmh, "Conditions you already have"],
              ["sx", "Surgeries", surgeries, setSurgeries, "None, or list them"],
            ] as const
          ).map(([id, label, value, set, placeholder]) => (
            <div key={id}>
              <label htmlFor={id} className="text-sm font-medium text-fg">
                {label}
              </label>
              <Textarea
                id={id}
                className="mt-2 min-h-24"
                value={value}
                onChange={(e) => set(e.target.value)}
                placeholder={placeholder}
              />
            </div>
          ))}
          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="outline" onClick={() => setStep("intake")}>
              Back
            </Button>
            <Button size="lg" onClick={() => setStep("schedule")}>
              Pick a time
              <ArrowRight />
            </Button>
          </div>
        </section>
      ) : null}

      {step === "schedule" ? (
        <section className="mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8">
          {kind === "acute" ? (
            <>
              <h2 className="font-display text-2xl font-semibold tracking-wide">Next available</h2>
              <p className="mt-3 text-lg text-muted">
                Today · 4:20 p.m. · 15 minutes. One-man shop. Not 400 empty hours on a grid.
              </p>
              <p className="mt-4 text-sm text-muted">
                {name} · {state} · {concern}
              </p>
            </>
          ) : (
            <>
              <h2 className="font-display text-2xl font-semibold tracking-wide">Pick a slot</h2>
              <p className="mt-3 text-muted">These are pretend openings on a locums week.</p>
              <div className="mt-6 grid gap-2 sm:grid-cols-2">
                {lifestyleSlots.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setSlot(`${s.when} · ${s.note}`)}
                    className={cn(
                      "rounded-sm px-4 py-4 text-left shadow-border",
                      slot === `${s.when} · ${s.note}`
                        ? "bg-accent text-accent-fg"
                        : "bg-ink hover:bg-fg/5",
                    )}
                  >
                    <span className="block font-display text-lg font-semibold tracking-wide">
                      {s.when}
                    </span>
                    <span className="mt-1 block text-sm opacity-80">{s.note}</span>
                  </button>
                ))}
              </div>
              <p className="mt-4 text-sm text-muted">
                {name} · {state} · {goal}
              </p>
            </>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setStep("intake")}>
              Back
            </Button>
            <Button
              size="lg"
              disabled={kind === "lifestyle" && !slot}
              onClick={() => {
                saveDemoChart({
                  kind,
                  name: name.trim(),
                  state,
                  reason: kind === "lifestyle" ? goal : concern,
                  notes,
                  allergies,
                  meds,
                  pmh,
                  surgeries,
                  slot,
                  at: new Date().toISOString(),
                });
                setStep("waiting");
              }}
            >
              Join the waiting room
              <ArrowRight />
            </Button>
          </div>
        </section>
      ) : null}

      {step === "waiting" ? (
        <section className="mt-10 overflow-hidden rounded-xl bg-ink shadow-border">
          <div
            className="relative px-6 py-16 text-center sm:px-10 sm:py-24"
            style={{
              backgroundImage: "url(/images/navy-grain.jpg)",
              backgroundSize: "420px",
            }}
          >
            <p className="text-xs font-medium tracking-widest text-ink-muted uppercase">Waiting room</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-wide text-ink-fg sm:text-4xl">
              Nick will join shortly
            </h2>
            <p className="mx-auto mt-4 max-w-md text-ink-muted">
              {slot}. Camera off until you are ready. This is still a demo.
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
                className={cn(
                  "no-outline size-full object-cover object-top",
                  joined ? "opacity-100" : "opacity-40",
                )}
              />
              <p className="absolute bottom-3 left-3 rounded-sm bg-black/70 px-2 py-1 text-xs tracking-wide text-ink-fg uppercase">
                {clinician ? "You · Nick Holwey, PA-C" : joined ? "Nick Holwey, PA-C" : "Connecting…"}
              </p>
            </div>
            <div className="relative flex aspect-video items-center justify-center bg-[#0a121c] sm:aspect-auto sm:min-h-72">
              {cameraOff ? (
                <p className="text-sm text-ink-muted">Camera off</p>
              ) : (
                <p className="font-display text-2xl font-semibold tracking-wide text-steel">
                  {clinician ? patientName : name || "You"}
                </p>
              )}
              <p className="absolute bottom-3 left-3 rounded-sm bg-black/70 px-2 py-1 text-xs tracking-wide text-ink-fg uppercase">
                {clinician ? patientName : "You"} {muted ? "· muted" : ""}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 px-4 py-5">
            {!joined && !clinician ? (
              <Button size="lg" onClick={() => setJoined(true)}>
                Join visit
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
              End visit
            </Button>
          </div>
        </section>
      ) : null}

      {step === "done" ? (
        <section className="mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8">
          <p className="text-xs font-medium tracking-widest text-accent uppercase">After-visit note · demo</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-wide">If this had been real</h2>
          {kind === "lifestyle" ? (
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
              <p>
                We would have gone over your goals and personalized a treatment plan for you. Until
                then, check out some of the hacks that can get you started.
              </p>
            </div>
          ) : (
            <div className="mt-5 space-y-4 text-lg leading-relaxed text-muted">
              <p>
                For {concern.toLowerCase() || "this concern"}, the visit would have been: is this
                appropriate for video, exam as much as a camera allows, treat at home vs go in.
              </p>
              <p>
                This playground does not diagnose or prescribe. If you actually need care, use a real
                clinician or an ED.
              </p>
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            {kind === "lifestyle" ? (
              <Button asChild size="lg">
                <Link to="/hacks">
                  Open the hacks
                  <ArrowRight />
                </Link>
              </Button>
            ) : (
              <Button asChild size="lg">
                <Link to="/visits">
                  Back to visits
                  <ArrowRight />
                </Link>
              </Button>
            )}
            <Button variant="outline" onClick={restart}>
              Run it again
            </Button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
