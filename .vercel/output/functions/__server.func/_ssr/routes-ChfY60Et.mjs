import { i as __toESM } from "../_runtime.mjs";
import { n as useForm, r as require_react, t as u } from "../_libs/@hookform/resolvers+[...].mjs";
import { i as require_jsx_runtime, r as Slot, t as Root } from "../_libs/@radix-ui/react-label+[...].mjs";
import { a as Mail, i as Menu, o as Check, r as Phone, s as ArrowRight, t as X } from "../_libs/lucide-react.mjs";
import { i as string, r as object } from "../_libs/zod.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-ChfY60Et.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function BrandLockup({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/images/header-lockup.png",
		alt: "Theosis Medical",
		className: cn("no-outline block h-12 w-auto object-contain object-left sm:h-14", className)
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			invert: "bg-steel text-ink hover:bg-steel/90",
			outline: "bg-transparent text-fg shadow-[var(--shadow-border)] hover:bg-fg/5",
			ghost: "bg-transparent text-fg hover:bg-fg/8",
			onInk: "bg-steel text-ink hover:bg-steel/90",
			onInkOutline: "bg-transparent text-ink-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-ink-fg)_28%,transparent)] hover:bg-ink-fg/8"
		},
		size: {
			default: "h-11 rounded-sm px-5",
			lg: "h-12 rounded-sm px-6",
			sm: "h-9 rounded-sm px-3.5",
			icon: "size-11 rounded-sm"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-sm bg-ink px-3.5 font-sans text-base text-fg shadow-[var(--shadow-border)] transition-[box-shadow,background-color] duration-150 ease-out placeholder:text-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var Label = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	className: cn("text-xs font-medium tracking-widest text-muted uppercase", className),
	...props
}));
Label.displayName = Root.displayName;
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-32 w-full rounded-md bg-ink px-3.5 py-3 font-sans text-base text-fg shadow-[var(--shadow-border)] transition-[box-shadow,background-color] duration-150 ease-out placeholder:text-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
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
var inquirySchema = object({
	name: string().trim().min(2, "Please enter your name."),
	email: string().trim().email("Enter a working email."),
	facility: string().trim().min(2, "Enter a facility or group."),
	dates: string().trim(),
	message: string().trim().min(12, "A little more detail helps the practice prepare.")
});
var STORAGE_KEY$1 = "theosis-inquiries";
function InquiryForm() {
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const [sendError, setSendError] = (0, import_react.useState)(null);
	const form = useForm({
		resolver: u(inquirySchema),
		defaultValues: {
			name: "",
			email: "",
			facility: "",
			dates: "",
			message: ""
		}
	});
	async function onSubmit(values) {
		setSendError(null);
		const entry = {
			...values,
			at: (/* @__PURE__ */ new Date()).toISOString()
		};
		try {
			const existing = JSON.parse(localStorage.getItem(STORAGE_KEY$1) ?? "[]");
			localStorage.setItem(STORAGE_KEY$1, JSON.stringify([entry, ...existing].slice(0, 20)));
		} catch {}
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
			setSubmitted(true);
		} catch {
			setSendError("Could not send just now. Call 765.487.0777 or email nick@theosismedical.com.");
		}
	}
	if (submitted) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-72 flex-col justify-center rounded-xl bg-surface px-6 py-10 text-fg shadow-[var(--shadow-border)] sm:px-8",
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
				children: "Received. Thank you."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-md text-muted",
				children: "I will follow up at the email you provided. For something that cannot wait, call."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				className: "mt-8 w-fit",
				onClick: () => {
					form.reset();
					setSubmitted(false);
					setSendError(null);
				},
				children: "Send another"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: form.handleSubmit(onSubmit),
		className: "rounded-xl bg-surface p-5 text-fg shadow-[var(--shadow-border)] sm:p-8",
		noValidate: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-5 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					id: "facility",
					label: "Facility",
					error: form.formState.errors.facility?.message,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "facility",
						placeholder: "Hospital or clinic",
						...form.register("facility")
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					id: "dates",
					label: "Dates needed",
					error: void 0,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "dates",
						placeholder: "e.g. Oct 12–26, or ongoing",
						...form.register("dates")
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
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
				sendError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					role: "alert",
					children: sendError
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					size: "lg",
					className: "w-full",
					disabled: form.formState.isSubmitting,
					children: [form.formState.isSubmitting ? "Sending…" : "Send inquiry", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No account required. Used only to answer this request."
				})
			]
		})]
	});
}
function Field$1({ id, label, error, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: id,
				className: "mb-2 block",
				children: label
			}),
			children,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 text-sm text-danger",
				role: "alert",
				children: error
			}) : null
		]
	});
}
var NAV = [
	{
		href: "#about",
		label: "About"
	},
	{
		href: "#why",
		label: "Why Theosis"
	},
	{
		href: "#contact",
		label: "Contact"
	},
	{
		href: "#plans",
		label: "Future plans"
	}
];
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		document.body.style.overflow = open ? "hidden" : "";
		return () => {
			document.body.style.overflow = "";
		};
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "#top",
					className: "group flex min-h-11 items-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, {})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "hidden items-center gap-7 md:flex",
					"aria-label": "Primary",
					children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: item.href,
						className: "text-sm font-medium tracking-wide text-muted uppercase transition-colors duration-150 hover:text-fg",
						children: item.label
					}, item.href))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "md:hidden",
					"aria-expanded": open,
					"aria-controls": "mobile-nav",
					"aria-label": open ? "Close menu" : "Open menu",
					onClick: () => setOpen((v) => !v),
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: "mobile-nav",
			hidden: !open,
			className: cn("border-t border-border bg-bg/90 backdrop-blur-md md:hidden", open ? "block" : "hidden"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mx-auto flex max-w-6xl flex-col px-5 py-3",
				"aria-label": "Mobile",
				children: NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: item.href,
					className: "flex min-h-12 items-center border-b border-border text-base font-medium text-fg last:border-b-0",
					onClick: () => setOpen(false),
					children: item.label
				}, item.href))
			})
		})]
	});
}
var suggestionSchema = object({
	name: string().trim().min(2, "Please enter your name."),
	email: string().trim().email("Enter a working email."),
	suggestion: string().trim().min(12, "A little more detail helps — what would you want this to include?")
});
var STORAGE_KEY = "theosis-suggestions";
function SuggestionForm() {
	const [submitted, setSubmitted] = (0, import_react.useState)(false);
	const [sendError, setSendError] = (0, import_react.useState)(null);
	const form = useForm({
		resolver: u(suggestionSchema),
		defaultValues: {
			name: "",
			email: "",
			suggestion: ""
		}
	});
	async function onSubmit(values) {
		setSendError(null);
		const entry = {
			...values,
			at: (/* @__PURE__ */ new Date()).toISOString()
		};
		try {
			const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
			localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...existing].slice(0, 20)));
		} catch {}
		try {
			await sendSiteForm({
				kind: "suggestion",
				name: values.name,
				email: values.email,
				fields: { suggestion: values.suggestion }
			});
			setSubmitted(true);
		} catch {
			setSendError("Could not send just now. Call 765.487.0777 or email nick@theosismedical.com.");
		}
	}
	if (submitted) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-72 flex-col justify-center rounded-xl bg-surface px-6 py-10 text-fg shadow-[var(--shadow-border)] sm:px-8",
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
				children: "Received. Thank you."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-md text-muted",
				children: "I will read this and follow up at the email you provided if there is something to answer."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				type: "button",
				variant: "outline",
				className: "mt-8 w-fit",
				onClick: () => {
					form.reset();
					setSubmitted(false);
					setSendError(null);
				},
				children: "Send another"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: form.handleSubmit(onSubmit),
		className: "rounded-xl bg-surface p-5 text-fg shadow-[var(--shadow-border)] sm:p-8",
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
				sendError ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-danger",
					role: "alert",
					children: sendError
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					type: "submit",
					size: "lg",
					className: "w-full",
					disabled: form.formState.isSubmitting,
					children: [form.formState.isSubmitting ? "Sending…" : "Share a Suggestion", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No account required. Used only to hear you and follow up."
				})
			]
		})]
	});
}
function Field({ id, label, error, className, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
				htmlFor: id,
				className: "mb-2 block",
				children: label
			}),
			children,
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 text-sm text-danger",
				role: "alert",
				children: error
			}) : null
		]
	});
}
var PHONE_DISPLAY = "765.487.0777";
var PHONE_HREF = "tel:+17654870777";
var EMAIL = "nick@theosismedical.com";
var PLANS = [
	{
		num: "01",
		title: "Lifestyle & Wellness",
		body: "Evidence-based lifestyle consultations drawing on my background in nutrition and medicine, with practical strategies designed to help you get leaner, get stronger, improve your health, and build habits you can actually maintain."
	},
	{
		num: "02",
		title: "Labs + Your Plan",
		body: "Targeted laboratory testing to better understand your current health, followed by an individualized, easy-to-follow plan. No unnecessary complexity—just actionable priorities built around the minimum effective dose and the changes most likely to move the needle."
	},
	{
		num: "03",
		title: "Urgent Care by Telemedicine",
		body: "Convenient virtual evaluation for appropriate acute medical concerns—the sore throat, rash, minor illness, or other problem that needs medical attention but may not need an emergency department."
	}
];
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "top",
		className: "min-h-svh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				id: "main",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hero, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(About, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhyTheosis, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Contact, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plans, {})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
function Hero() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative -mt-16 min-h-svh",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("picture", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("source", {
			media: "(min-width: 768px)",
			srcSet: "/images/logo.jpg"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src: "/images/logo-portrait.jpg",
			alt: "Theosis Medical emblem: a silver shield bearing the Star of Life, a cross, and the serpent of healing.",
			className: "no-outline absolute inset-0 size-full object-cover object-center"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-5 pb-8 pt-24 sm:px-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "stagger-in mx-auto max-w-6xl text-ink-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-ink-muted uppercase",
					children: "Nick Holwey, PA-C · Emergency medicine"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-wrap items-center gap-3",
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
				})]
			})
		})]
	});
}
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "about",
		className: "scroll-mt-20",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-6xl items-start gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-hidden rounded-xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: "/images/nick.jpg",
					alt: "Nick Holwey, PA-C, physician assistant and founder of Theosis Medical.",
					className: "aspect-4/5 w-full object-cover object-center"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl font-semibold tracking-wide sm:text-5xl",
				children: "About Me"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-5 text-lg leading-relaxed text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "My name is Nick Holwey, and I am an Emergency Medicine Physician Assistant with more than 13 years of clinical experience and the founder and owner of Theosis Medical. I earned my Master of Physician Assistant Studies from Wichita State University after completing my undergraduate degree in Food Science and Human Nutrition at the University of Illinois." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Emergency medicine has been the foundation of my career, though my experience has spanned Level I trauma centers and high-acuity emergency care to community and rural emergency departments, as well as urgent care, telemedicine, hospital medicine, and prehospital emergency care. Over the years, I've developed a broad clinical and procedural skill set, including critical care stabilization, bedside ultrasound, fracture and joint reductions, laceration repair, and numerous other emergency procedures. I am NCCPA-certified, hold the Certificate of Added Qualifications in Emergency Medicine (CAQ-EM), and maintain licensure across multiple states." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Today, I practice primarily as an independent contractor in emergency medicine through Theosis Medical, providing care in rural and community emergency departments where adaptability, sound clinical judgment, and the ability to work effectively with limited resources are especially important." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "While my experience and training shape me as a clinician, my faith and family shape who I am as a person. As a husband and father, I'm continually reminded that every patient is someone's loved one. My faith likewise calls me toward service, humility, compassion, and continual growth—principles that influence both the way I practice medicine and the kind of company I want Theosis Medical to be." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "After more than a decade in emergency medicine, my approach remains straightforward: practice excellent medicine, be dependable when people need you, and treat every patient with the dignity and compassion I would want shown to my own family." })
				]
			})] })]
		})
	});
}
function WhyTheosis() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		id: "why",
		className: "scroll-mt-20 border-y border-border bg-surface",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-4xl font-semibold tracking-wide sm:text-5xl",
				children: "Why \"Theosis Medical\"?"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 space-y-5 text-lg leading-relaxed text-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "I believe that healing extends beyond treating symptoms — it involves recognizing the full dignity of every person who walks through the door. At Theosis Medical, this conviction shapes how I approach every patient encounter." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The name Theosis draws from an ancient Christian concept describing the lifelong process of personal growth and transformation — becoming more fully who I was created to be through humility, compassion, wisdom, and service to others. At its heart, it reflects the idea of participating in something greater than myself: a continual journey toward excellence, integrity, and deeper connection with those around me." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "While this understanding is rooted in my faith, it is not something I expect of my patients. People come from many different backgrounds, beliefs, and life experiences, and that diversity is respected here. The principles behind the name are standards I set for myself as a clinician — not requirements for those I serve. Every individual who entrusts me with their care will receive the same high-quality treatment, compassion, and respect, regardless of background." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "In the fast-paced world of emergency and hospital medicine, I often meet people on some of their hardest days — amid pain, fear, uncertainty, or loss. I strive to meet those moments with patience, attentiveness, and genuine human connection. I view each patient not merely as a diagnosis or a chart, but as a person of inherent worth deserving of clear communication, thoughtful care, and dignity." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "As an independent locum tenens practice, Theosis Medical allows me to go where the need is greatest, providing experienced coverage to hospitals and communities across Wisconsin and Illinois. I approach this work as both a professional responsibility and a personal calling: to deliver excellent medicine while continuing to grow as a more compassionate, reliable, and effective clinician." }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "My goal is simple: that every patient leaves my care not only with better health, but also with the quiet assurance that they were truly seen, heard, and treated with kindness." })
				]
			})]
		})
	});
}
function Plans() {
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
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
							"Although Emergency Medicine is the bread and butter of Theosis Medical, my long-term vision extends beyond treating illness when it happens. I want to help people prevent the conditions that land them in the emergency department years later. My passion is to help people become",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-fg",
								children: "healthier, stronger, and more resilient but in a way that fits their life."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "With a background in Food Science and Human Nutrition in addition to more than 13 years of clinical experience, my goal is to develop a practical approach to lifestyle medicine that cuts through the noise. The world of nutrition and exercise has been overcomplicated by Men's Health and lifestyle magazines making it impossible to know what is truly beneficial." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Life is busy. Diets are difficult to sustain. Exercise can be time-consuming and expensive. And most people don't need another complicated program telling them to change everything at once." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Instead, I want to focus on the minimum effective dose: identifying the small number of evidence-based changes that can produce the greatest impact. Think of it as the 80/20 approach to better health—focus on the 20% that delivers 80% of the results." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Through individualized consultations and targeted laboratory testing, the goal will be to understand where you are today and build a realistic plan around your health, your goals, and your life. The approach is one I've applied in my own life: make the right things easier to do, eliminate unnecessary complexity, and focus effort where it matters most." }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Alongside preventive and lifestyle-focused care, I also plan to expand Theosis Medical to provide telemedicine for appropriate acute and urgent-care concerns—giving patients a convenient option when something needs attention without necessarily requiring a trip to an urgent care or emergency department." })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "mt-8",
					size: "lg",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: "#suggest",
						children: ["Share a Suggestion", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-16 font-display text-4xl font-semibold tracking-wide sm:text-5xl",
					children: "What's Ahead"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 grid gap-px bg-border-strong sm:grid-cols-3",
					children: PLANS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "bg-surface px-6 py-8 sm:px-8 sm:py-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl font-semibold text-accent",
								children: item.num
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-4 font-display text-3xl font-semibold tracking-wide uppercase",
								children: item.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 leading-relaxed text-muted",
								children: item.body
							})
						]
					}, item.num))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					id: "suggest",
					className: "mt-16 grid scroll-mt-20 gap-10 lg:grid-cols-2 lg:gap-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-4xl font-semibold tracking-wide sm:text-5xl",
						children: "Help Shape What's Next"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 space-y-5 text-lg leading-relaxed text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Theosis Medical is still growing, and I want its future services to solve real problems for real people." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Is there a service you'd find useful? Something about healthcare, nutrition, fitness, or accessing medical care that feels unnecessarily difficult?" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "I'd like to hear it." })
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SuggestionForm, {})]
				})
			]
		})
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
						href: PHONE_HREF,
						className: "inline-flex min-h-11 items-center gap-3 text-lg text-ink-fg transition-colors hover:text-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "size-5 shrink-0 text-accent" }), PHONE_DISPLAY]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
						href: `mailto:${EMAIL}`,
						className: "inline-flex min-h-11 items-center gap-3 text-lg text-ink-fg transition-colors hover:text-accent",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-5 shrink-0 text-accent" }), EMAIL]
					}) })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-ink-muted",
					children: "Theosis Medical, LLC · Illinois-based · Wisconsin locums"
				})
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InquiryForm, {})]
		})
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "bg-ink text-ink-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-8 border-t border-border px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandLockup, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-ink-muted",
					children: "Nick Holwey, PA-C · Illinois · Wisconsin"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 text-sm text-ink-muted md:items-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: PHONE_HREF,
						className: "hover:text-ink-fg",
						children: PHONE_DISPLAY
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: `mailto:${EMAIL}`,
						className: "hover:text-ink-fg",
						children: EMAIL
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"© ",
						(/* @__PURE__ */ new Date()).getFullYear(),
						" Theosis Medical, LLC"
					] })
				]
			})]
		})
	});
}
//#endregion
export { Home as component };
