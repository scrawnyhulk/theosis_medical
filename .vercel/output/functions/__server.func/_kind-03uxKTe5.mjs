import { i as __toESM } from "./_runtime.mjs";
import { i as lifestyleSlots, n as isVisitKind, r as lifestyleGoals, s as saveDemoChart, t as coachingAgreement } from "./_ssr/visits-BPR-9BBc.mjs";
import { r as require_react } from "./_libs/@hookform/resolvers+[...].mjs";
import { _ as Link, v as useNavigate, z as notFound } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "./_libs/@radix-ui/react-label+[...].mjs";
import { S as ArrowRight, a as VideoOff, f as PhoneOff, i as Video, m as MicOff, p as Mic, s as Star } from "./_libs/lucide-react.mjs";
import { r as Route$3 } from "./_ssr/router-BnbxP_CZ.mjs";
import { i as cn, r as SiteShell } from "./_ssr/site-shell-DHj3ZVbe.mjs";
import { t as Textarea } from "./_ssr/textarea-BDkoYV62.mjs";
import { t as PlaygroundBanner } from "./_ssr/playground-banner-CTrUT8xW.mjs";
import { t as Input } from "./_ssr/input-BQ6RNFRg.mjs";
import { t as SesameMark } from "./_ssr/sesame-mark-zKxQdq97.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_kind-03uxKTe5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LimeButton({ children, className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-sesame-lime px-6 text-sm font-semibold text-sesame-lime-ink transition-transform duration-150 hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-40", className),
		...props,
		children
	});
}
function GhostButton({ children, className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold text-sesame-ink ring-1 ring-sesame-ink/15 hover:bg-sesame-ink/5", className),
		...props,
		children
	});
}
function SesameHeader({ kicker }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-3 border-b border-sesame-ink/10 px-5 py-4 sm:px-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 text-sesame-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SesameMark, { className: "text-sesame-ink" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-sans text-xl font-semibold tracking-tight lowercase",
				children: "sesame"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-wide text-sesame-muted",
			children: kicker
		})]
	});
}
function VisitFlow({ kind, view = "patient", who = "" }) {
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
	const field = "mt-2 bg-sesame-card text-sesame-ink shadow-none ring-1 ring-sesame-ink/12 placeholder:text-sesame-muted focus-visible:ring-sesame-ink/30";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-sesame-paper text-sesame-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SesameHeader, { kicker: `Live demo · 45 min video` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-5 py-10 pb-24 sm:px-8 lg:py-14",
			children: [
				kind === "acute" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-6 text-sm text-sesame-muted",
					children: "Acute medical video visits are a different legal structure. This walkthrough is cash-pay lifestyle counseling only."
				}) : null,
				step === "agreement" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-sesame-card p-6 ring-1 ring-sesame-ink/8 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-widest text-sesame-muted uppercase",
							children: "Before you book on Sesame"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-sans text-3xl font-semibold tracking-tight sm:text-4xl",
							children: "Coaching agreement"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 leading-relaxed text-sesame-muted",
							children: "Sesame is the cash-pay marketplace and the video room. This agreement is the Theosis Medical add-on that keeps the session in the counseling lane — coaching, not a clinic."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 leading-relaxed text-sesame-muted",
							children: [
								"Nick Holwey, through Theosis Medical, LLC, offers lifestyle counseling. He is an emergency medicine physician assistant by training.",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
									className: "font-semibold text-sesame-ink",
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
									className: "flex w-full cursor-pointer items-start gap-3 text-left",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										className: cn("mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[4px] border", on ? "border-sesame-lime-ink bg-sesame-lime text-sesame-lime-ink" : "border-sesame-ink/25 bg-sesame-paper"),
										children: on ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
											viewBox: "0 0 12 12",
											className: "size-3.5",
											fill: "none",
											stroke: "currentColor",
											strokeWidth: "2",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M2 6.2 4.6 9 10 3" })
										}) : null
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[15px] leading-relaxed text-sesame-ink",
										children: item.label
									})]
								}) }, item.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LimeButton, {
							className: "mt-8",
							disabled: !allAccepted,
							onClick: () => setStep("profile"),
							children: ["I agree — see Nick on Sesame", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})
					]
				}) : null,
				step === "profile" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-sesame-muted",
						children: "Video visit · lifestyle counseling · cash pay"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-sans text-3xl font-semibold tracking-tight sm:text-4xl",
						children: "Book Nick Holwey"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
						className: "mt-8 overflow-hidden rounded-2xl bg-sesame-card ring-1 ring-sesame-ink/8",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid sm:grid-cols-[11rem_1fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/images/nick.jpg",
								alt: "",
								className: "no-outline h-44 w-full object-cover object-top sm:h-full"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-6 sm:p-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-semibold tracking-widest text-sesame-muted uppercase",
										children: "Independent provider on Sesame"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "mt-1 font-sans text-2xl font-semibold",
										children: "Nick Holwey, PA-C"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm text-sesame-muted",
										children: "Lifestyle counseling · Theosis Medical, LLC · IL-based, multi-state licensed"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-3 flex items-center gap-1 text-sm font-medium",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-4 fill-sesame-lime-ink text-sesame-lime-ink" }), "4.9 demo rating · video"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-4 font-sans text-3xl font-semibold tracking-tight",
										children: [
											"$",
											150,
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "ml-2 text-base font-medium text-sesame-muted",
												children: [
													"· ",
													45,
													" min"
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-sm text-sesame-muted",
										children: "Next available: Tue · 4:30 p.m. · After clinic"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LimeButton, {
										className: "mt-6",
										onClick: () => setStep("intake"),
										children: ["Book video visit", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
									})
								]
							})]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 text-sm leading-relaxed text-sesame-muted",
						children: "Live, this card would sit on Sesame next to other cash-pay providers. You would not host the video yourself — Sesame’s room, Sesame’s payment, your counseling agreement in front of it."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, {
						className: "mt-4",
						onClick: () => setStep("agreement"),
						children: "Back"
					})
				] }) : null,
				step === "intake" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-sesame-card p-6 ring-1 ring-sesame-ink/8 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-sans text-3xl font-semibold tracking-tight",
							children: "What’s this visit for?"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-sesame-muted",
							children: "Sesame asks a short reason so Nick can show up prepared. Coaching intake — not a chart. Do not send labs or medication lists."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "visit-name",
								className: "text-sm font-medium",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "visit-name",
								className: field,
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "First and last",
								autoComplete: "name"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "visit-email",
								className: "text-sm font-medium",
								children: "Email"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "visit-email",
								type: "email",
								className: field,
								value: email,
								onChange: (e) => setEmail(e.target.value),
								placeholder: "Where Sesame would send the join link",
								autoComplete: "email"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: "What do you want help with?"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-3 flex flex-wrap gap-2",
								children: lifestyleGoals.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setGoal(g),
									className: cn("min-h-11 rounded-full px-4 py-2 text-sm font-medium", goal === g ? "bg-sesame-lime text-sesame-lime-ink" : "bg-sesame-paper text-sesame-ink ring-1 ring-sesame-ink/10 hover:bg-sesame-ink/5"),
									children: g
								}, g))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "visit-notes",
								className: "text-sm font-medium",
								children: "Anything about your schedule, kitchen, or constraints"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "visit-notes",
								className: cn(field, "min-h-24"),
								rows: 4,
								value: notes,
								onChange: (e) => setNotes(e.target.value),
								placeholder: "Live demo only. No real health information."
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, {
								onClick: () => setStep("profile"),
								children: "Back"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LimeButton, {
								disabled: !name.trim() || !email.trim() || !goal,
								onClick: () => setStep("schedule"),
								children: ["Pick a time", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							})]
						})
					]
				}) : null,
				step === "schedule" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-sesame-card p-6 ring-1 ring-sesame-ink/8 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-sans text-3xl font-semibold tracking-tight",
							children: "Choose a time"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sesame-muted",
							children: "Live, these would be the openings Nick published on Sesame for locums weeks and days off."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-6 grid gap-2 sm:grid-cols-2",
							children: lifestyleSlots.map((s) => {
								const value = `${s.when} · ${s.note}`;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setSlot(value),
									className: cn("rounded-2xl px-4 py-4 text-left", slot === value ? "bg-sesame-lime text-sesame-lime-ink" : "bg-sesame-paper ring-1 ring-sesame-ink/10 hover:bg-sesame-ink/5"),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "block font-semibold",
										children: s.when
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "mt-1 block text-sm opacity-80",
										children: [s.note, " · video"]
									})]
								}, s.id);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, {
								onClick: () => setStep("intake"),
								children: "Back"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LimeButton, {
								disabled: !slot,
								onClick: () => setStep("pay"),
								children: ["Continue to pay", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							})]
						})
					]
				}) : null,
				step === "pay" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-sesame-card p-6 ring-1 ring-sesame-ink/8 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-widest text-sesame-muted uppercase",
							children: "Sesame checkout · cash · no insurance"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "mt-2 font-sans text-3xl font-semibold tracking-tight",
							children: ["$", 150]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-sesame-muted",
							children: [45, " min video with Nick Holwey, PA-C"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 text-sm text-sesame-muted",
							children: [
								name,
								" · ",
								goal,
								" · ",
								slot
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm leading-relaxed text-sesame-muted",
							children: "Live, Sesame would charge the card and pay the provider. This demo does not charge anyone."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								htmlFor: "card",
								className: "text-sm font-medium",
								children: "Card number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "card",
								className: field,
								inputMode: "numeric",
								autoComplete: "off",
								placeholder: "4242 4242 4242 4242",
								value: card,
								onChange: (e) => setCard(e.target.value)
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-4 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "exp",
									className: "text-sm font-medium",
									children: "Exp"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "exp",
									className: field,
									placeholder: "MM / YY",
									value: exp,
									onChange: (e) => setExp(e.target.value)
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									htmlFor: "cvc",
									className: "text-sm font-medium",
									children: "CVC"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "cvc",
									className: field,
									placeholder: "123",
									value: cvc,
									onChange: (e) => setCvc(e.target.value)
								})] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, {
								onClick: () => setStep("schedule"),
								children: "Back"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(LimeButton, {
								disabled: card.replace(/\s/g, "").length < 12,
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
								children: [
									"Pay $",
									150,
									" — demo, no charge"
								]
							})]
						})
					]
				}) : null,
				step === "waiting" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
					className: "overflow-hidden rounded-2xl bg-sesame-card text-center ring-1 ring-sesame-ink/8",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "px-6 py-16 sm:px-10 sm:py-24",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SesameMark, { className: "mx-auto inline-flex text-sesame-ink" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-xs font-semibold tracking-widest text-sesame-muted uppercase",
								children: "Sesame waiting room"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-3 font-sans text-3xl font-semibold tracking-tight sm:text-4xl",
								children: "You’re booked"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mx-auto mt-4 max-w-md text-sesame-muted",
								children: [slot, ". Live, Sesame would text and email a join link. Nick joins from the provider app. Camera off until you are ready."]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LimeButton, {
								className: "mt-10",
								onClick: () => setStep("room"),
								children: "Join video visit"
							})
						]
					})
				}) : null,
				step === "room" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "overflow-hidden rounded-2xl bg-[#111] text-sesame-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-3 px-4 py-3 text-sesame-card",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SesameMark, { className: "text-sesame-lime" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm font-semibold lowercase",
										children: "sesame"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "hidden text-xs text-white/50 sm:inline",
										children: [
											"Lifestyle counseling · ",
											45,
											":00"
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-white/50",
								children: "Live demo · not a real visit"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-px bg-white/10 sm:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-video bg-black sm:aspect-auto sm:min-h-72",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: "/images/nick.jpg",
									alt: "",
									className: cn("no-outline size-full object-cover object-top", joined ? "opacity-100" : "opacity-40")
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs",
									children: clinician ? "You · Nick" : joined ? "Nick Holwey, PA-C" : "Connecting…"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative flex aspect-video items-center justify-center bg-[#1a1a1a] sm:aspect-auto sm:min-h-72",
								children: [cameraOff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm text-white/50",
									children: "Camera off"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-sans text-2xl font-semibold",
									children: clientName
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "absolute bottom-3 left-3 rounded-full bg-black/70 px-3 py-1 text-xs",
									children: [
										clinician ? clientName : "You",
										" ",
										muted ? "· muted" : ""
									]
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-center gap-3 px-4 py-5",
							children: [
								!joined && !clinician ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LimeButton, {
									onClick: () => setJoined(true),
									children: "Join video"
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": muted ? "Unmute" : "Mute",
									onClick: () => setMuted((v) => !v),
									className: "flex size-12 items-center justify-center rounded-full bg-white/10 text-sesame-card hover:bg-white/20",
									children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									"aria-label": cameraOff ? "Camera on" : "Camera off",
									onClick: () => setCameraOff((v) => !v),
									className: "flex size-12 items-center justify-center rounded-full bg-white/10 text-sesame-card hover:bg-white/20",
									children: cameraOff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, { className: "size-5" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => {
										if (clinician) navigate({ to: "/provider" });
										else setStep("done");
									},
									className: "flex min-h-12 items-center gap-2 rounded-full bg-danger px-5 text-sm font-semibold text-fg hover:bg-danger/90",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, { className: "size-4" }), "Leave"]
								})
							]
						})
					]
				}) : null,
				step === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-2xl bg-sesame-card p-6 ring-1 ring-sesame-ink/8 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-semibold tracking-widest text-sesame-muted uppercase",
							children: "After the Sesame visit · demo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-sans text-3xl font-semibold tracking-tight",
							children: "If this had been real"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 space-y-4 leading-relaxed text-sesame-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
								"Sesame would have taken the $",
								150,
								", run the video, and emailed a receipt. Nick would have picked two or three moves you can actually do this week — protein first, a walking default, a hotel/shift food rule. Not a diagnosis. Not labs. Not a prescription."
							] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Until a live Sesame listing exists, the Health Hacks are the same 80/20, free." })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/hacks",
								className: "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-sesame-lime px-6 text-sm font-semibold text-sesame-lime-ink hover:brightness-95",
								children: ["Open the hacks", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GhostButton, {
								onClick: restart,
								children: "Run the live demo again"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/provider",
								className: "text-sm font-medium text-sesame-ink underline underline-offset-4",
								children: "I’m Nick — open the provider inbox"
							})
						})
					]
				}) : null
			]
		})]
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
