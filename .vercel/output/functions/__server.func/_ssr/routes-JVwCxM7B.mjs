import { i as __toESM } from "../_runtime.mjs";
import { A as site, T as proceduralSkills, d as glanceGroups, j as whyParagraphs, k as shapeParagraphs, n as aheadCards, s as futureParagraphs, t as aboutParagraphs } from "./minutes-DY1gg7Wr.mjs";
import { n as useForm, r as require_react, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { b as ArrowRight, l as Phone, m as Mail, y as Check } from "../_libs/lucide-react.mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
import { r as SiteShell, t as Button } from "./site-shell-B5yAaicX.mjs";
import { t as Textarea } from "./textarea-FHpjy-8i.mjs";
import { t as Input } from "./input-BVIZKCFy.mjs";
import { t as Label } from "./label-Ciq1U8RC.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-JVwCxM7B.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AboutParagraph({ text }) {
	const pieces = text.split(/(\[\[hacks\]\])/);
	if (pieces.length === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: text });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: pieces.map((piece, i) => piece === "[[hacks]]" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/hacks",
		className: "font-medium text-accent hover:text-fg",
		children: "changes"
	}, i) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: piece }, i)) });
}
function GlanceList({ items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "mt-2 space-y-1 text-sm leading-relaxed text-muted",
		children: items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				"aria-hidden": "true",
				className: "mt-2 size-1 shrink-0 rounded-full bg-accent"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
		}, item))
	});
}
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "about",
		className: "scroll-mt-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-8 overflow-hidden rounded-xl lg:float-left lg:mb-6 lg:mr-12 lg:w-5/12",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: "/images/nick.jpg",
						alt: "Nick Holwey, PA-C, physician assistant and founder of Theosis Medical.",
						className: "aspect-4/5 w-full object-cover object-center"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl font-semibold tracking-wide sm:text-5xl",
					children: "About Me"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 space-y-5 text-lg leading-relaxed text-muted",
					children: aboutParagraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AboutParagraph, { text: p }, p.slice(0, 40)))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "clear-both" })
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "mt-12 rounded-xl bg-surface p-6 shadow-border sm:p-8 lg:mt-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-muted uppercase",
					children: "At a glance"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 grid gap-8 sm:grid-cols-2",
					children: [glanceGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-lg font-semibold tracking-wide text-fg",
						children: group.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GlanceList, { items: group.items })] }, group.title)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-lg font-semibold tracking-wide text-fg",
							children: "Procedural Skills"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 grid gap-x-8 gap-y-1 text-sm leading-relaxed text-muted sm:grid-cols-2",
							children: proceduralSkills.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									"aria-hidden": "true",
									className: "mt-2 size-1 shrink-0 rounded-full bg-accent"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
							}, item))
						})]
					})]
				})]
			})]
		})
	});
}
function Field({ id, label, error, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: id,
				children: label
			}),
			children,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 text-sm text-danger",
				children: error
			}) : null
		]
	});
}
function FormSuccess({ title, body, onAgain }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-72 flex-col justify-center rounded-xl bg-surface px-6 py-10 text-fg shadow-border sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "mb-5 inline-flex size-11 items-center justify-center rounded-full bg-accent text-accent-fg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
					className: "size-5",
					strokeWidth: 2.25
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-3xl leading-tight tracking-tight",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-md text-muted",
				children: body
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				className: "mt-8 w-fit",
				onClick: onAgain,
				children: "Send another"
			})
		]
	});
}
var NICK_EMAIL = "nick@theosismedical.com";
var SMS_GATEWAYS = [
	"7654870777@vtext.com",
	"7654870777@txt.att.net",
	"7654870777@tmomail.net"
];
async function sendSiteForm(input) {
	const subject = input.kind === "inquiry" ? `THEOSIS: New consult request from ${input.name}` : `THEOSIS: New suggestion from ${input.name}`;
	const details = Object.entries(input.fields).filter(([, value]) => value.trim().length > 0).map(([key, value]) => `${key}: ${value}`).join("\n");
	const payload = {
		name: input.name,
		email: input.email,
		_replyto: input.email,
		_subject: subject,
		_template: "table",
		_captcha: "false",
		_honey: "",
		type: input.kind === "inquiry" ? "Consult request" : "Suggestion",
		...input.fields
	};
	const emailRes = await fetch(`https://formsubmit.co/ajax/${NICK_EMAIL}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(payload)
	});
	const smsBody = {
		_subject: subject,
		_captcha: "false",
		_honey: "",
		message: `${subject}\n${input.name} <${input.email}>\n${details}`.slice(0, 280)
	};
	Promise.allSettled(SMS_GATEWAYS.map((to) => fetch(`https://formsubmit.co/ajax/${to}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(smsBody)
	})));
	if (!emailRes.ok) throw new Error("Could not send right now.");
	const data = await emailRes.json().catch(() => null);
	if (data && data.success === false) throw new Error(data.message ?? "Could not send right now.");
}
var schema$1 = object({
	name: string().trim().min(2, "Please enter your name."),
	email: string().trim().email("Enter a working email."),
	facility: string().trim().min(2, "Enter a facility or group."),
	dates: string().trim(),
	message: string().trim().min(12, "A little more detail helps the practice prepare.")
});
var STORAGE_KEY$1 = "theosis-inquiries";
function persist$1(values) {
	try {
		const prev = JSON.parse(localStorage.getItem(STORAGE_KEY$1) ?? "[]");
		localStorage.setItem(STORAGE_KEY$1, JSON.stringify([{
			...values,
			at: (/* @__PURE__ */ new Date()).toISOString()
		}, ...prev].slice(0, 20)));
	} catch {}
}
function InquiryForm() {
	const [sent, setSent] = (0, import_react.useState)(false);
	const [sendError, setSendError] = (0, import_react.useState)(null);
	const form = useForm({
		resolver: u(schema$1),
		defaultValues: {
			name: "",
			email: "",
			facility: "",
			dates: "",
			message: ""
		}
	});
	async function onSubmit(values) {
		persist$1(values);
		setSendError(null);
		try {
			await sendSiteForm({
				kind: "inquiry",
				name: values.name,
				email: values.email,
				fields: {
					facility: values.facility,
					dates: values.dates,
					message: values.message
				}
			});
			setSent(true);
		} catch {
			setSendError("Could not send just now. Call 765.487.0777 or email nick@theosismedical.com.");
		}
	}
	if (sent) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSuccess, {
		title: "Received. Thank you.",
		body: "I will follow up at the email you provided. For something that cannot wait, call.",
		onAgain: () => {
			form.reset();
			setSent(false);
			setSendError(null);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: form.handleSubmit(onSubmit),
		className: "rounded-xl bg-surface p-5 text-fg shadow-border sm:p-8",
		noValidate: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-5 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "name",
					label: "Your name",
					error: form.formState.errors.name?.message,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "name",
						autoComplete: "name",
						placeholder: "Jordan Hale",
						...form.register("name")
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "email",
					label: "Email",
					error: form.formState.errors.email?.message,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "email",
						type: "email",
						autoComplete: "email",
						placeholder: "you@hospital.org",
						...form.register("email")
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "facility",
					label: "Facility",
					error: form.formState.errors.facility?.message,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "facility",
						placeholder: "Hospital or clinic",
						...form.register("facility")
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "dates",
					label: "Dates needed",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "dates",
						placeholder: "e.g. Oct 12–26, or ongoing",
						...form.register("dates")
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "message",
					label: "What you need",
					error: form.formState.errors.message?.message,
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "message",
						placeholder: "Setting, shift pattern, credentialing timeline — whatever helps.",
						...form.register("message")
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					size: "lg",
					className: "w-full",
					children: ["Send inquiry", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
				}),
				sendError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: sendError
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No account required. I will never spam you or sell your email."
				})
			]
		})]
	});
}
function Contact() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "contact",
		className: "scroll-mt-16 bg-ink text-ink-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16 lg:py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-ink-muted uppercase",
					children: "How to contact"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 font-display text-4xl font-semibold tracking-wide uppercase sm:text-5xl",
					children: "Call, write, or send the days you need covered."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 max-w-md text-lg leading-relaxed text-ink-muted",
					children: "Facility, setting, dates, and anything that will matter in credentialing. A short note is enough to start."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-8 space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: site.phoneHref,
						className: "inline-flex min-h-11 items-center gap-3 text-lg text-ink-fg transition-colors hover:text-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, {
							className: "size-5 shrink-0 text-accent",
							"aria-hidden": "true"
						}), site.phoneDisplay]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: site.emailHref,
						className: "inline-flex min-h-11 items-center gap-3 text-lg text-ink-fg transition-colors hover:text-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, {
							className: "size-5 shrink-0 text-accent",
							"aria-hidden": "true"
						}), site.email]
					}) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-ink-muted",
					children: site.entityLine
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InquiryForm, {})]
		})
	});
}
var schema = object({
	name: string().trim().min(2, "Please enter your name."),
	email: string().trim().email("Enter a working email."),
	suggestion: string().trim().min(12, "A little more detail helps — what would you want this to include?")
});
var STORAGE_KEY = "theosis-suggestions";
function persist(values) {
	try {
		const prev = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
		localStorage.setItem(STORAGE_KEY, JSON.stringify([{
			...values,
			at: (/* @__PURE__ */ new Date()).toISOString()
		}, ...prev].slice(0, 20)));
	} catch {}
}
function SuggestionForm() {
	const [sent, setSent] = (0, import_react.useState)(false);
	const [sendError, setSendError] = (0, import_react.useState)(null);
	const form = useForm({
		resolver: u(schema),
		defaultValues: {
			name: "",
			email: "",
			suggestion: ""
		}
	});
	async function onSubmit(values) {
		persist(values);
		setSendError(null);
		try {
			await sendSiteForm({
				kind: "suggestion",
				name: values.name,
				email: values.email,
				fields: { suggestion: values.suggestion }
			});
			setSent(true);
		} catch {
			setSendError("Could not send just now. Call 765.487.0777 or email nick@theosismedical.com.");
		}
	}
	if (sent) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FormSuccess, {
		title: "Received. Thank you.",
		body: "I will read this and follow up at the email you provided if there is something to answer.",
		onAgain: () => {
			form.reset();
			setSent(false);
			setSendError(null);
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: form.handleSubmit(onSubmit),
		className: "rounded-xl bg-surface p-5 text-fg shadow-border sm:p-8",
		noValidate: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-5 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "suggest-name",
					label: "Your name",
					error: form.formState.errors.name?.message,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "suggest-name",
						autoComplete: "name",
						placeholder: "Your name",
						...form.register("name")
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "suggest-email",
					label: "Email",
					error: form.formState.errors.email?.message,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "suggest-email",
						type: "email",
						autoComplete: "email",
						placeholder: "you@email.com",
						...form.register("email")
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					id: "suggest-message",
					label: "Your suggestion",
					error: form.formState.errors.suggestion?.message,
					className: "sm:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						id: "suggest-message",
						placeholder: "What would make this useful? Hours, pricing, labs, kids, training — whatever is on your mind.",
						...form.register("suggestion")
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 flex flex-col gap-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					size: "lg",
					className: "w-full",
					children: ["Share a Suggestion", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
				}),
				sendError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					children: sendError
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No account required. I will never spam you or sell your email."
				})
			]
		})]
	});
}
function FuturePlans() {
	const [first, ...rest] = futureParagraphs;
	const splitAt = "healthier, stronger, and more resilient but in a way that fits their life.";
	const lead = first.slice(0, first.indexOf(splitAt));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "plans",
		className: "scroll-mt-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-muted uppercase",
					children: "Future plans"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 max-w-3xl font-display text-4xl font-semibold tracking-wide sm:text-5xl",
					children: "Better Health. Made Practical."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 max-w-3xl space-y-5 text-lg leading-relaxed text-muted",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [lead, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-fg",
						children: splitAt
					})] }), rest.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 40)))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-8 flex flex-wrap gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/hacks",
							children: ["Holwey’s Handy Health Hacks", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "#suggest",
							children: ["Share a Suggestion", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-16 font-display text-4xl font-semibold tracking-wide sm:text-5xl",
					children: "What's Ahead"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-px bg-border-strong sm:grid-cols-3",
					children: aheadCards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "flex flex-col bg-surface px-6 py-8 sm:px-8 sm:py-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl font-semibold text-accent",
								children: card.n
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-display text-3xl font-semibold tracking-wide uppercase",
								children: card.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 flex-1 leading-relaxed text-muted",
								children: card.body
							}),
							card.n === "01" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								className: "mt-6 w-fit",
								size: "sm",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/hacks",
									children: ["Open the hacks", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
								})
							}) : null,
							null
						]
					}, card.n))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "suggest",
					className: "mt-16 grid scroll-mt-20 gap-10 lg:grid-cols-2 lg:gap-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-4xl font-semibold tracking-wide sm:text-5xl",
						children: "Help Shape What's Next"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 space-y-5 text-lg leading-relaxed text-muted",
						children: shapeParagraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p))
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuggestionForm, {})]
				})
			]
		})
	});
}
function HeroButtons({ className = "" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex flex-wrap items-center gap-3 ${className}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "onInk",
			size: "lg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: "#contact",
				children: ["How to contact", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			variant: "onInkOutline",
			size: "lg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#about",
				children: "About me"
			})
		})]
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative lg:-mt-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hero-phone",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/logo-phone.png",
				alt: "Theosis Medical emblem: a silver shield bearing the Star of Life, a cross, and the serpent of healing.",
				className: "no-outline mx-auto block h-auto w-full max-w-full object-contain object-top"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))]",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroButtons, {})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "hero-desktop relative min-h-svh",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: "/images/logo.jpg",
				alt: "Theosis Medical emblem: a silver shield bearing the Star of Life, a cross, and the serpent of healing.",
				className: "no-outline absolute inset-0 size-full object-cover object-center"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pt-24 pb-8 sm:px-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "stagger-in mx-auto max-w-6xl text-ink-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-ink-muted uppercase",
						children: site.tagline
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeroButtons, { className: "mt-5" })]
				})
			})]
		})]
	});
}
function Why() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "why",
		className: "scroll-mt-20 border-y border-border bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-4xl font-semibold tracking-wide sm:text-5xl",
				children: "Why \"Theosis Medical\"?"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-5 text-lg leading-relaxed text-muted",
				children: whyParagraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 40)))
			})]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(About, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Why, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FuturePlans, {})
	] });
}
//#endregion
export { Home as component };
