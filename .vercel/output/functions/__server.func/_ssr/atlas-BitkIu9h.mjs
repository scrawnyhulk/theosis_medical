import { i as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { a as VideoOff, b as ArrowRight, d as Mic, f as MicOff, i as Video, u as PhoneOff } from "../_libs/lucide-react.mjs";
import { W as redFlags } from "./router-B-HKWIc8.mjs";
import { i as cn, r as SiteShell, t as Button } from "./site-shell-ByYPgQOt.mjs";
import { t as PlaygroundBanner } from "./playground-banner-C-Ew33f2.mjs";
import { t as Input } from "./input-BxK92cCY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/atlas-BitkIu9h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var plans = [
	{
		id: "lifestyle",
		title: "Lifestyle consult",
		time: "30–45 min",
		note: "Nutrition, labs, cholesterol, diabetes, busy-life health. One visit. Paid in Atlas."
	},
	{
		id: "acute",
		title: "Acute video visit",
		time: "15 min",
		note: "Sore throat, rash, sinus, mild aches. Appropriate concerns only."
	},
	{
		id: "member",
		title: "Membership (DPC-style)",
		time: "Monthly",
		note: "Atlas is built for this. Messaging, follow-ups, visits inside the Patient Hub. Example only — not a real plan."
	}
];
function AtlasHandoff() {
	const [step, setStep] = (0, import_react.useState)("why");
	const [noneApply, setNoneApply] = (0, import_react.useState)(false);
	const [email, setEmail] = (0, import_react.useState)("");
	const [plan, setPlan] = (0, import_react.useState)("");
	const [muted, setMuted] = (0, import_react.useState)(false);
	const [cameraOff, setCameraOff] = (0, import_react.useState)(false);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-5 py-16 pb-28 sm:px-8 lg:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-muted uppercase",
				children: "Playground · Atlas.md handoff"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl font-semibold tracking-wide sm:text-5xl",
				children: "Theosis stays the front door"
			}),
			step === "why" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-8 space-y-5 text-lg leading-relaxed text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This site keeps brand, hacks, red flags, and “are you in IL / WI / MI / IN.” Atlas keeps the chart, payment, Patient Hub, HIPAA video, and ePrescribe (DrFirst). Nothing medical lives on this website." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Click through a fake booking. There is no real Atlas clinic on the other end. Do not enter a real card or real health information." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-4",
						size: "lg",
						onClick: () => setStep("gate"),
						children: ["Start the handoff", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
					})
				]
			}) : null,
			step === "gate" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-accent uppercase",
						children: "On this site"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-2xl font-semibold tracking-wide",
						children: "This is not an emergency department"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 leading-relaxed text-muted",
						children: "Same wall as the other demo. Atlas never sees a chest-pain click."
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
						className: "mt-8",
						size: "lg",
						disabled: !noneApply,
						onClick: () => setStep("hub"),
						children: ["Continue to Atlas Patient Hub", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
					})
				]
			}) : null,
			step === "hub" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 overflow-hidden rounded-xl shadow-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#1a2330] px-6 py-4 text-ink-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-medium tracking-[0.2em] text-[#8aa4c4] uppercase",
						children: "Atlas.md · Patient Hub · mock"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-xl font-semibold tracking-wide",
						children: "Sign in"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 bg-surface p-6 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: "Live, this screen is Atlas — their login, their encryption. We would drop you here with a link, not rebuild their portal."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							htmlFor: "atlas-email",
							className: "text-sm font-medium text-fg",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "atlas-email",
							className: "mt-2",
							type: "email",
							value: email,
							onChange: (e) => setEmail(e.target.value),
							placeholder: "you@example.com — playground only"
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							disabled: !email.includes("@"),
							onClick: () => setStep("pick"),
							children: ["Magic link (demo)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
						})
					]
				})]
			}) : null,
			step === "pick" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 overflow-hidden rounded-xl shadow-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#1a2330] px-6 py-4 text-ink-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-medium tracking-[0.2em] text-[#8aa4c4] uppercase",
						children: "Atlas.md · Patient Hub · mock"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-xl font-semibold tracking-wide",
						children: "What do you need?"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-3 bg-surface p-6 sm:p-8",
					children: [plans.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setPlan(p.id),
						className: cn("w-full rounded-sm px-4 py-4 text-left shadow-border", plan === p.id ? "bg-accent text-accent-fg" : "bg-ink hover:bg-fg/5"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-display text-lg font-semibold tracking-wide",
								children: p.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-1 block text-sm opacity-80",
								children: p.time
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mt-2 block text-sm opacity-90",
								children: p.note
							})
						]
					}, p.id)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						className: "mt-4",
						size: "lg",
						disabled: !plan,
						onClick: () => setStep("pay"),
						children: ["Continue to payment", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
					})]
				})]
			}) : null,
			step === "pay" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 overflow-hidden rounded-xl shadow-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#1a2330] px-6 py-4 text-ink-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-medium tracking-[0.2em] text-[#8aa4c4] uppercase",
						children: "Atlas.md · billing · mock"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-xl font-semibold tracking-wide",
						children: "Pay in Atlas"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 bg-surface p-6 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: "Card or ACH, logged to the chart. This playground does not charge anyone. Do not type a real card."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Name on card",
							autoComplete: "off"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "•••• •••• •••• ••••",
							autoComplete: "off"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							onClick: () => setStep("ready"),
							children: ["Pay (demo)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
						})
					]
				})]
			}) : null,
			step === "ready" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 overflow-hidden rounded-xl shadow-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "bg-[#1a2330] px-6 py-4 text-ink-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] font-medium tracking-[0.2em] text-[#8aa4c4] uppercase",
						children: "Atlas.md · Patient Hub · mock"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 font-display text-xl font-semibold tracking-wide",
						children: "You’re on the board"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-5 bg-surface p-6 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-lg text-fg",
							children: [plans.find((p) => p.id === plan)?.title ?? "Visit", " · Nick Holwey, PA-C"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-muted",
							children: "Intake, allergies, meds, and the note live here. You join video from this same Hub — on your phone in the Atlas patient app, or in the browser. I join from the Atlas clinician app."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							size: "lg",
							onClick: () => setStep("room"),
							children: ["Join Atlas video", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
						})
					]
				})]
			}) : null,
			step === "room" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 overflow-hidden rounded-xl bg-ink shadow-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-4 py-3 text-[10px] font-medium tracking-[0.2em] text-[#8aa4c4] uppercase",
						children: "Atlas.md · HIPAA video · mock"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-px bg-border sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative aspect-video bg-black sm:min-h-72",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: "/images/nick.jpg",
								alt: "",
								className: "no-outline size-full object-cover object-top"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "absolute bottom-3 left-3 rounded-sm bg-black/70 px-2 py-1 text-xs tracking-wide text-ink-fg uppercase",
								children: "Nick Holwey, PA-C"
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "relative flex aspect-video items-center justify-center bg-[#0a121c] sm:min-h-72",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-semibold tracking-wide text-steel",
								children: cameraOff ? "Camera off" : "You"
							})
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-center gap-3 px-4 py-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								"aria-label": "Mute",
								onClick: () => setMuted((v) => !v),
								children: muted ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MicOff, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mic, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "icon",
								"aria-label": "Camera",
								onClick: () => setCameraOff((v) => !v),
								children: cameraOff ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoOff, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Video, {})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "bg-danger text-fg hover:bg-danger/90",
								onClick: () => setStep("done"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneOff, {}), "End visit"]
							})
						]
					})
				]
			}) : null,
			step === "done" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mt-10 rounded-xl bg-surface p-6 shadow-border sm:p-8",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-accent uppercase",
						children: "Back on this site"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-3xl font-semibold tracking-wide",
						children: "If this had been real"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 text-lg leading-relaxed text-muted",
						children: "The note, Rx, and receipt would stay in Atlas. We would have gone over your goals and personalized a treatment plan. Until then, check out some of the hacks that can get you started."
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
							onClick: () => setStep("why"),
							children: "Run it again"
						})]
					})
				]
			}) : null
		]
	});
}
function AtlasPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaygroundBanner, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AtlasHandoff, {})] });
}
//#endregion
export { AtlasPage as component };
