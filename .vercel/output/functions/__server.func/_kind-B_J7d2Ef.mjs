import { i as __toESM } from "./_runtime.mjs";
import { r as require_react } from "./_libs/@hookform/resolvers+[...].mjs";
import { _ as Link, v as useNavigate, z as notFound } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "./_libs/@radix-ui/react-label+[...].mjs";
import { a as VideoOff, b as ArrowRight, d as Mic, f as MicOff, i as Video, u as PhoneOff } from "./_libs/lucide-react.mjs";
import { B as licensedStates, H as lifestyleSlots, K as saveDemoChart, R as acuteConcerns, V as lifestyleGoals, W as redFlags, q as visitMeta, r as Route$3, z as isVisitKind } from "./_ssr/router-B-HKWIc8.mjs";
import { i as cn, r as SiteShell, t as Button } from "./_ssr/site-shell-ByYPgQOt.mjs";
import { t as Textarea } from "./_ssr/textarea-KSYp_v9I.mjs";
import { t as PlaygroundBanner } from "./_ssr/playground-banner-C-Ew33f2.mjs";
import { t as Input } from "./_ssr/input-BxK92cCY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_kind-B_J7d2Ef.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VisitFlow({ kind, view = "patient", who = "" }) {
	const meta = visitMeta[kind];
	const clinician = view === "clinician";
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(clinician ? "room" : "gate");
	const [noneApply, setNoneApply] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [state, setState] = (0, import_react.useState)("");
	const [goal, setGoal] = (0, import_react.useState)("");
	const [concern, setConcern] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [allergies, setAllergies] = (0, import_react.useState)("");
	const [meds, setMeds] = (0, import_react.useState)("");
	const [pmh, setPmh] = (0, import_react.useState)("");
	const [surgeries, setSurgeries] = (0, import_react.useState)("");
	const [slot, setSlot] = (0, import_react.useState)(kind === "acute" ? "Next available · today 4:20 p.m." : "");
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [cameraOff, setCameraOff] = (0, import_react.useState)(false);
	const [joined, setJoined] = (0, import_react.useState)(clinician);
	const patientName = who || name || "Patient";
	const licensed = licensedStates.some((s) => s.code === state);
	function restart() {
		setStep("gate");
		setNoneApply(false);
		setJoined(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-5 py-16 pb-28 sm:px-8 lg:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-medium tracking-widest text-muted uppercase",
				children: [
					"Playground · ",
					meta.n,
					" · ",
					meta.time
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl font-semibold tracking-wide sm:text-5xl",
				children: meta.title
			}),
			meta.lede ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-lg leading-relaxed text-muted",
				children: meta.lede
			}) : null,
			step === "gate" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold tracking-wide",
						children: "This is not an emergency department"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 leading-relaxed text-muted",
						children: "If any of these are happening, hang up this playground and call 911 or go in. A video visit cannot see you the way an ED can."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-6 space-y-3 text-muted",
						children: redFlags.map((flag) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								"aria-hidden": "true",
								className: "mt-2 size-1.5 shrink-0 rounded-full bg-danger"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: flag })]
						}, flag))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setNoneApply((v) => !v),
						className: "mt-8 flex w-full cursor-pointer items-start gap-3 text-left text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[3px] border", noneApply ? "border-accent bg-accent text-accent-fg" : "border-steel bg-ink"),
							children: noneApply ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
								viewBox: "0 0 12 12",
								className: "size-3.5",
								fill: "none",
								stroke: "currentColor",
								strokeWidth: "2",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2 6.2 4.6 9 10 3" })
							}) : null
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "None of these apply. I understand this is a demo, not care." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						className: "mt-8",
						size: "lg",
						disabled: !noneApply,
						onClick: () => setStep("intake"),
						children: ["Continue", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
					})
				]
			}) : null,
			step === "intake" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 space-y-5 rounded-xl bg-surface p-6 shadow-border sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "visit-name",
						className: "text-sm font-medium text-fg",
						children: "Name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "visit-name",
						className: "mt-2",
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "First and last",
						autoComplete: "name"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-fg",
							children: "Where are you right now?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex flex-wrap gap-2",
							children: [licensedStates.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setState(s.code),
								className: cn("h-11 rounded-sm px-4 text-sm font-medium shadow-border", state === s.code ? "bg-accent text-accent-fg" : "bg-ink text-fg hover:bg-fg/5"),
								children: s.name
							}, s.code)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setState("XX"),
								className: cn("h-11 rounded-sm px-4 text-sm font-medium shadow-border", state === "XX" ? "bg-accent text-accent-fg" : "bg-ink text-fg hover:bg-fg/5"),
								children: "Somewhere else"
							})]
						}),
						state === "XX" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-danger",
							children: "If this were real, I could not see you there. Licensed in IL, WI, MI, and IN."
						}) : null
					] }),
					kind === "lifestyle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-fg",
						children: "What are we working on?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: lifestyleGoals.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setGoal(g),
							className: cn("h-11 rounded-sm px-4 text-sm font-medium shadow-border", goal === g ? "bg-accent text-accent-fg" : "bg-ink text-fg hover:bg-fg/5"),
							children: g
						}, g))
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-fg",
						children: "What’s going on?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: acuteConcerns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setConcern(c),
							className: cn("h-11 rounded-sm px-4 text-sm font-medium shadow-border", concern === c ? "bg-accent text-accent-fg" : "bg-ink text-fg hover:bg-fg/5"),
							children: c
						}, c))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "visit-notes",
						className: "text-sm font-medium text-fg",
						children: "Anything else I should know — in your words"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "visit-notes",
						className: "mt-2",
						rows: 4,
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						placeholder: "Playground only. Do not put real medical details."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setStep("gate"),
							children: "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							disabled: !name.trim() || !licensed || (kind === "lifestyle" ? !goal : !concern),
							onClick: () => setStep("history"),
							children: ["Medical history", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
						})]
					})
				]
			}) : null,
			step === "history" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 space-y-5 rounded-xl bg-surface p-6 shadow-border sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold tracking-wide",
						children: "Medical intake"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "If this were live, this would live in the chart, not in my email. Playground only — do not enter real information."
					}),
					[
						[
							"allergies",
							"Allergies",
							allergies,
							setAllergies,
							"NKDA, or list them"
						],
						[
							"meds",
							"Medications",
							meds,
							setMeds,
							"Dose and how you take it"
						],
						[
							"pmh",
							"Past medical history",
							pmh,
							setPmh,
							"Conditions you already have"
						],
						[
							"sx",
							"Surgeries",
							surgeries,
							setSurgeries,
							"None, or list them"
						]
					].map(([id, label, value, set, placeholder]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: id,
						className: "text-sm font-medium text-fg",
						children: label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id,
						className: "mt-2 min-h-24",
						value,
						onChange: (e) => set(e.target.value),
						placeholder
					})] }, id)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setStep("intake"),
							children: "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							onClick: () => setStep("schedule"),
							children: ["Pick a time", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
						})]
					})
				]
			}) : null,
			step === "schedule" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8",
				children: [kind === "acute" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold tracking-wide",
						children: "Next available"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-lg text-muted",
						children: "Today · 4:20 p.m. · 15 minutes. One-man shop. Not 400 empty hours on a grid."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted",
						children: [
							name,
							" · ",
							state,
							" · ",
							concern
						]
					})
				] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold tracking-wide",
						children: "Pick a slot"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted",
						children: "These are pretend openings on a locums week."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 grid gap-2 sm:grid-cols-2",
						children: lifestyleSlots.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setSlot(`${s.when} · ${s.note}`),
							className: cn("rounded-sm px-4 py-4 text-left shadow-border", slot === `${s.when} · ${s.note}` ? "bg-accent text-accent-fg" : "bg-ink hover:bg-fg/5"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-display text-lg font-semibold tracking-wide",
								children: s.when
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-sm opacity-80",
								children: s.note
							})]
						}, s.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted",
						children: [
							name,
							" · ",
							state,
							" · ",
							goal
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setStep("intake"),
						children: "Back"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						size: "lg",
						disabled: kind === "lifestyle" && !slot,
						onClick: () => {
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
								at: (/* @__PURE__ */ new Date()).toISOString()
							});
							setStep("waiting");
						},
						children: ["Join the waiting room", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
					})]
				})]
			}) : null,
			step === "waiting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mt-10 overflow-hidden rounded-xl bg-ink shadow-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative px-6 py-16 text-center sm:px-10 sm:py-24",
					style: {
						backgroundImage: "url(/images/navy-grain.jpg)",
						backgroundSize: "420px"
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-widest text-ink-muted uppercase",
							children: "Waiting room"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 font-display text-3xl font-semibold tracking-wide text-ink-fg sm:text-4xl",
							children: "Nick will join shortly"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mx-auto mt-4 max-w-md text-ink-muted",
							children: [slot, ". Camera off until you are ready. This is still a demo."]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "mt-10",
							size: "lg",
							onClick: () => setStep("room"),
							children: ["I’m here", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
						})
					]
				})
			}) : null,
			step === "room" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 overflow-hidden rounded-xl bg-ink shadow-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-px bg-border sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative aspect-video bg-black sm:aspect-auto sm:min-h-72",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/images/nick.jpg",
							alt: "",
							className: cn("no-outline size-full object-cover object-top", joined ? "opacity-100" : "opacity-40")
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "absolute bottom-3 left-3 rounded-sm bg-black/70 px-2 py-1 text-xs tracking-wide text-ink-fg uppercase",
							children: clinician ? "You · Nick Holwey, PA-C" : joined ? "Nick Holwey, PA-C" : "Connecting…"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex aspect-video items-center justify-center bg-[#0a121c] sm:aspect-auto sm:min-h-72",
						children: [cameraOff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-ink-muted",
							children: "Camera off"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl font-semibold tracking-wide text-steel",
							children: clinician ? patientName : name || "You"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "absolute bottom-3 left-3 rounded-sm bg-black/70 px-2 py-1 text-xs tracking-wide text-ink-fg uppercase",
							children: [
								clinician ? patientName : "You",
								" ",
								muted ? "· muted" : ""
							]
						})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-center gap-3 px-4 py-5",
					children: [
						!joined && !clinician ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "lg",
							onClick: () => setJoined(true),
							children: "Join visit"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							"aria-label": muted ? "Unmute" : "Mute",
							onClick: () => setMuted((v) => !v),
							children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							size: "icon",
							"aria-label": cameraOff ? "Camera on" : "Camera off",
							onClick: () => setCameraOff((v) => !v),
							children: cameraOff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							className: "bg-danger text-fg hover:bg-danger/90",
							onClick: () => {
								if (clinician) navigate({ to: "/provider" });
								else setStep("done");
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, {}), "End visit"]
						})
					]
				})]
			}) : null,
			step === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-accent uppercase",
						children: "After-visit note · demo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-3xl font-semibold tracking-wide",
						children: "If this had been real"
					}),
					kind === "lifestyle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 space-y-4 text-lg leading-relaxed text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We would have gone over your goals and personalized a treatment plan for you. Until then, check out some of the hacks that can get you started." })
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 space-y-4 text-lg leading-relaxed text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"For ",
							concern.toLowerCase() || "this concern",
							", the visit would have been: is this appropriate for video, exam as much as a camera allows, treat at home vs go in."
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This playground does not diagnose or prescribe. If you actually need care, use a real clinician or an ED." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [kind === "lifestyle" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/hacks",
								children: ["Open the hacks", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
							})
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/visits",
								children: ["Back to visits", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: restart,
							children: "Run it again"
						})]
					})
				]
			}) : null
		]
	});
}
function VisitKindPage() {
	const { kind } = Route$3.useParams();
	const { view, who } = Route$3.useSearch();
	if (!isVisitKind(kind)) throw notFound();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaygroundBanner, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VisitFlow, {
		kind,
		view,
		who
	})] });
}
//#endregion
export { VisitKindPage as component };
