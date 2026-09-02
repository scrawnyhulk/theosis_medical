import { i as __toESM } from "./_runtime.mjs";
import { c as visitMeta, i as lifestyleSlots, n as isVisitKind, r as lifestyleGoals, s as saveDemoChart, t as coachingAgreement } from "./_ssr/visits-DmpcM3pS.mjs";
import { r as require_react } from "./_libs/@hookform/resolvers+[...].mjs";
import { _ as Link, v as useNavigate, z as notFound } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "./_libs/@radix-ui/react-label+[...].mjs";
import { a as VideoOff, b as ArrowRight, d as Mic, f as MicOff, i as Video, u as PhoneOff } from "./_libs/lucide-react.mjs";
import { r as Route$3 } from "./_ssr/router-GxyqUeUH.mjs";
import { i as cn, r as SiteShell, t as Button } from "./_ssr/site-shell-B5yAaicX.mjs";
import { t as Textarea } from "./_ssr/textarea-FHpjy-8i.mjs";
import { t as PlaygroundBanner } from "./_ssr/playground-banner-BdkZ_4cb.mjs";
import { t as Input } from "./_ssr/input-BVIZKCFy.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_kind-C2v2dwL8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VisitFlow({ kind, view = "patient", who = "" }) {
	const meta = visitMeta.lifestyle;
	const clinician = view === "clinician";
	const navigate = useNavigate();
	const [step, setStep] = (0, import_react.useState)(clinician ? "room" : "agreement");
	const [accepted, setAccepted] = (0, import_react.useState)({});
	const [name, setName] = (0, import_react.useState)("");
	const [email, setEmail] = (0, import_react.useState)("");
	const [goal, setGoal] = (0, import_react.useState)("");
	const [notes, setNotes] = (0, import_react.useState)("");
	const [slot, setSlot] = (0, import_react.useState)("");
	const [card, setCard] = (0, import_react.useState)("");
	const [exp, setExp] = (0, import_react.useState)("");
	const [cvc, setCvc] = (0, import_react.useState)("");
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [cameraOff, setCameraOff] = (0, import_react.useState)(false);
	const [joined, setJoined] = (0, import_react.useState)(clinician);
	const clientName = who || name || "You";
	const allAccepted = coachingAgreement.every((item) => accepted[item.id]);
	function restart() {
		setStep("agreement");
		setAccepted({});
		setJoined(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-5 py-16 pb-28 sm:px-8 lg:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-medium tracking-widest text-muted uppercase",
				children: [
					"Playground · how this would look if it went live today · ",
					45,
					" min"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl font-semibold tracking-wide sm:text-5xl",
				children: meta.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-lg leading-relaxed text-muted",
				children: meta.lede
			}),
			kind === "acute" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-warn",
				children: "Acute medical video visits are not this product. This walkthrough is cash-pay lifestyle counseling only."
			}) : null,
			step === "agreement" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-accent uppercase",
						children: "Before you book"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl font-semibold tracking-wide",
						children: "Coaching agreement"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 leading-relaxed text-muted",
						children: "Read this. Check every box. This is the legal wall that keeps the session in the counseling lane — and the reason it can start without a physician-owned clinic."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 leading-relaxed text-muted",
						children: [
							"Nick Holwey, through Theosis Medical, LLC, offers lifestyle counseling. He is an emergency medicine physician assistant by training.",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "font-medium text-fg",
								children: "This session is not medical care."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-8 space-y-4",
						children: coachingAgreement.map((item) => {
							const on = Boolean(accepted[item.id]);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setAccepted((prev) => ({
									...prev,
									[item.id]: !on
								})),
								className: "flex w-full cursor-pointer items-start gap-3 text-left text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									className: cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[3px] border", on ? "border-accent bg-accent text-accent-fg" : "border-steel bg-ink"),
									children: on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
										viewBox: "0 0 12 12",
										className: "size-3.5",
										fill: "none",
										stroke: "currentColor",
										strokeWidth: "2",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2 6.2 4.6 9 10 3" })
									}) : null
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[15px] leading-relaxed",
									children: item.label
								})]
							}) }, item.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						type: "button",
						className: "mt-8",
						size: "lg",
						disabled: !allAccepted,
						onClick: () => setStep("intake"),
						children: ["I agree — continue", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
					})
				]
			}) : null,
			step === "intake" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 space-y-5 rounded-xl bg-surface p-6 shadow-border sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold tracking-wide",
						children: "What we’re working on"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Coaching intake. Not a chart. Do not send labs, medication lists, or diagnoses."
					}),
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "visit-email",
						className: "text-sm font-medium text-fg",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "visit-email",
						type: "email",
						className: "mt-2",
						value: email,
						onChange: (e) => setEmail(e.target.value),
						placeholder: "Where the video link would go",
						autoComplete: "email"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium text-fg",
						children: "What do you want help with?"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: lifestyleGoals.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setGoal(g),
							className: cn("min-h-11 rounded-sm px-4 py-2 text-sm font-medium shadow-border", goal === g ? "bg-accent text-accent-fg" : "bg-ink text-fg hover:bg-fg/5"),
							children: g
						}, g))
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "visit-notes",
						className: "text-sm font-medium text-fg",
						children: "Anything about your schedule, kitchen, or constraints — in your words"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "visit-notes",
						className: "mt-2",
						rows: 4,
						value: notes,
						onChange: (e) => setNotes(e.target.value),
						placeholder: "Playground only. No real health information. No lab PDFs."
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-3 pt-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setStep("agreement"),
							children: "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							disabled: !name.trim() || !email.trim() || !goal,
							onClick: () => setStep("pay"),
							children: [
								"Pay $",
								150,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})
							]
						})]
					})
				]
			}) : null,
			step === "pay" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-accent uppercase",
						children: "Cash pay · no insurance"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "mt-2 font-display text-2xl font-semibold tracking-wide",
						children: [
							"$",
							150,
							" · ",
							45,
							" minutes"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 leading-relaxed text-muted",
						children: "Live, this would be Stripe. Card charged, receipt emailed, no claim submitted. This playground does not charge a real card."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-sm text-muted",
						children: [
							name,
							" · ",
							goal
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "card",
							className: "text-sm font-medium text-fg",
							children: "Card number"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "card",
							className: "mt-2",
							inputMode: "numeric",
							autoComplete: "off",
							placeholder: "4242 4242 4242 4242",
							value: card,
							onChange: (e) => setCard(e.target.value)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-4 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "exp",
								className: "text-sm font-medium text-fg",
								children: "Exp"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "exp",
								className: "mt-2",
								placeholder: "MM / YY",
								value: exp,
								onChange: (e) => setExp(e.target.value)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "cvc",
								className: "text-sm font-medium text-fg",
								children: "CVC"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "cvc",
								className: "mt-2",
								placeholder: "123",
								value: cvc,
								onChange: (e) => setCvc(e.target.value)
							})] })]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setStep("intake"),
							children: "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							disabled: card.replace(/\s/g, "").length < 12,
							onClick: () => setStep("schedule"),
							children: [
								"Pay $",
								150,
								" — demo, no charge",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})
							]
						})]
					})
				]
			}) : null,
			step === "schedule" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl font-semibold tracking-wide",
						children: "Pick a time"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted",
						children: "Live, this would be a calendar (Calendly, or slots you open on locums weeks) and a Zoom or Google Meet link in your email. These are pretend openings."
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setStep("pay"),
							children: "Back"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							disabled: !slot,
							onClick: () => {
								saveDemoChart({
									kind: "lifestyle",
									name: name.trim(),
									email: email.trim(),
									state: "",
									reason: goal,
									notes,
									slot,
									at: (/* @__PURE__ */ new Date()).toISOString(),
									paid: true
								});
								setStep("waiting");
							},
							children: ["Hold this time", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
						})]
					})
				]
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
							children: [slot, ". Live, this would be the Zoom/Meet waiting room. Camera off until you are ready. Still coaching, still not a clinic."]
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
							children: clinician ? "You · Nick" : joined ? "Nick · counseling" : "Connecting…"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex aspect-video items-center justify-center bg-[#0a121c] sm:aspect-auto sm:min-h-72",
						children: [cameraOff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-ink-muted",
							children: "Camera off"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-2xl font-semibold tracking-wide text-steel",
							children: clientName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "absolute bottom-3 left-3 rounded-sm bg-black/70 px-2 py-1 text-xs tracking-wide text-ink-fg uppercase",
							children: [
								clinician ? clientName : "You",
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
							children: "Join session"
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
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, {}), "End session"]
						})
					]
				})]
			}) : null,
			step === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-accent uppercase",
						children: "After the session · demo"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-3xl font-semibold tracking-wide",
						children: "If this had been real"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 space-y-4 text-lg leading-relaxed text-muted",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "We would have picked two or three moves you can actually do this week — protein first, a walking default, a hotel/shift food rule — and you would leave with that list. Not a diagnosis. Not a lab interpretation. Not a prescription." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Until a live calendar exists, the Health Hacks are the same 80/20, free." })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/hacks",
								children: ["Open the hacks", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
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
