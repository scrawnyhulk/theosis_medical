import { i as __toESM } from "../_runtime.mjs";
import { c as nav, d as site, f as whyParagraphs, o as minutes, t as aboutParagraphs } from "./minutes-Da8RSnvs.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { b as Link, p as useRouterState } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, n as require_react_dom, r as Slot } from "../_libs/@radix-ui/react-label+[...].mjs";
import { C as ClipboardList, O as ChevronDown, S as Clock, T as CirclePlay, _ as Map, c as Star, g as MessageCircle, o as User, r as X, u as Search, v as Mail, w as CircleUser, y as Heart } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region ../../workspace/wt-lbfix/node_modules/.nitro/vite/services/ssr/assets/site-shell-Bw68PF2z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom());
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]", {
	variants: {
		variant: {
			default: "bg-accent text-accent-fg hover:bg-accent/90",
			invert: "bg-steel text-ink hover:bg-steel/90",
			outline: "bg-transparent text-fg shadow-border hover:bg-fg/5",
			ghost: "bg-transparent text-fg hover:bg-fg/8",
			onInk: "bg-steel text-ink hover:bg-steel/90",
			onInkOutline: "bg-transparent text-ink-fg shadow-ink-ring hover:bg-ink-fg/8"
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
var data = {
	"@context": "https://schema.org",
	"@graph": [
		{
			"@type": "MedicalBusiness",
			"@id": `${site.url}/#business`,
			name: "Theosis Medical LLC",
			url: site.url,
			email: site.email,
			telephone: "+1-765-487-0777",
			description: site.description,
			image: `${site.url}/images/logo.jpg`,
			founder: { "@id": `${site.url}/#nick` },
			areaServed: [
				"Illinois",
				"Wisconsin",
				"Michigan",
				"Indiana"
			]
		},
		{
			"@type": "Person",
			"@id": `${site.url}/#nick`,
			name: "Nick Holwey",
			honorificSuffix: "PA-C",
			jobTitle: "Emergency Medicine Physician Assistant (PA-C)",
			description: site.description,
			image: `${site.url}/images/nick.jpg`,
			url: `${site.url}/#about`,
			worksFor: { "@id": `${site.url}/#business` },
			alumniOf: [{
				"@type": "CollegeOrUniversity",
				name: "Wichita State University"
			}, {
				"@type": "CollegeOrUniversity",
				name: "University of Illinois"
			}]
		},
		{
			"@type": "WebSite",
			name: site.name,
			url: site.url,
			description: site.description,
			publisher: { "@id": `${site.url}/#business` }
		}
	]
};
function JsonLd() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
		type: "application/ld+json",
		dangerouslySetInnerHTML: { __html: JSON.stringify(data) }
	});
}
function LogoLockup({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
		src: "/images/header-lockup.png",
		alt: "Theosis Medical",
		className: cn("no-outline block h-12 w-auto object-contain object-left sm:h-14", className)
	});
}
function SiteFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
		className: "bg-ink text-ink-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-6xl flex-col gap-8 border-t border-border px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoLockup, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-ink-muted",
						children: site.founderLine
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/minutes",
						className: "text-sm text-ink-muted hover:text-ink-fg",
						children: "Medical Minutes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/install",
						className: "text-sm text-ink-muted hover:text-ink-fg",
						children: "Add to Home Screen"
					}),
					null
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-2 text-sm text-ink-muted md:items-end",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: site.phoneHref,
						className: "hover:text-ink-fg",
						children: site.phoneDisplay
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: site.emailHref,
						className: "hover:text-ink-fg",
						children: site.email
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/privacy",
						className: "text-sm text-ink-muted hover:text-ink-fg",
						children: "Privacy"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"© ",
						site.year,
						" Theosis Medical LLC · Danville, Illinois"
					] })
				]
			})]
		})
	});
}
function pack(title, ...parts) {
	return [title, ...parts.flatMap((p) => Array.isArray(p) ? p : p ? [p] : [])].join(" ").toLowerCase();
}
var index = [
	...nav.map((item) => ({
		id: `page-${item.hash}`,
		section: "Page",
		title: item.label,
		blurb: item.hash === "about" ? aboutParagraphs[0] : item.hash === "why" ? whyParagraphs[0] : item.label,
		hrefKind: "hash",
		hash: item.hash,
		haystack: pack(item.label, item.hash === "about" ? aboutParagraphs : item.hash === "why" ? whyParagraphs : item.label)
	})),
	{
		id: "minutes-hub",
		section: "Medical Minutes",
		title: "Medical Minutes",
		blurb: "The ER talk, written down.",
		hrefKind: "minutes",
		haystack: pack("medical minutes", "ear fever cough cold uri bronchitis back sprain ct pneumonia sepsis antibiotic resistance amoxicillin leftover", "interactive physiology create a diabetic personal fat threshold")
	},
	...minutes.map((m) => ({
		id: `minute-${m.slug}`,
		section: "Medical Minutes",
		title: m.title,
		blurb: m.lede,
		hrefKind: "minute",
		slug: m.slug,
		haystack: pack(m.title, m.lede, m.paragraphs)
	}))
];
function searchSite(query, limit = 12) {
	const q = query.trim().toLowerCase();
	if (!q) return [];
	const tokens = q.split(/\s+/).filter(Boolean);
	return index.map((item) => {
		let score = 0;
		const title = item.title.toLowerCase();
		if (title === q) score = 100;
		else if (title.startsWith(q)) score = 80;
		else if (title.includes(q)) score = 60;
		else if (tokens.every((t) => item.haystack.includes(t))) score = item.haystack.includes(q) ? 45 : 30;
		return {
			item,
			score
		};
	}).filter((row) => row.score > 0).sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title)).slice(0, limit).map((row) => {
		const { haystack: _h, ...hit } = row.item;
		return hit;
	});
}
function QuickFind() {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [section, setSection] = (0, import_react.useState)(null);
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const inputRef = (0, import_react.useRef)(null);
	function close() {
		setOpen(false);
		setSection(null);
		setQuery("");
	}
	(0, import_react.useEffect)(() => {
		setMounted(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const t = window.setTimeout(() => inputRef.current?.focus(), 50);
		function onKey(e) {
			if (e.key === "Escape") close();
		}
		document.addEventListener("keydown", onKey);
		return () => {
			window.clearTimeout(t);
			document.removeEventListener("keydown", onKey);
		};
	}, [open]);
	const hits = searchSite(query);
	const searching = query.trim().length > 0;
	const panel = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		className: "fixed inset-0 z-40 bg-ink/40",
		"aria-label": "Close quick find",
		onClick: close
	}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
		id: "quick-find-panel",
		"aria-label": "Quick find",
		className: cn("fixed inset-y-0 left-0 z-50 flex w-80 flex-col border-r border-border bg-ink shadow-ink-ring transition-transform duration-200 ease-out", open ? "translate-x-0" : "-translate-x-full"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-border px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-2 font-display text-2xl font-semibold tracking-wide uppercase",
					children: "Quick Find"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					"aria-label": "Close quick find",
					onClick: close,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border px-3 py-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "relative block",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: inputRef,
						type: "search",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search the site…",
						className: "h-11 w-full rounded-sm bg-fg/8 pr-3 pl-10 text-sm text-ink-fg placeholder:text-muted focus-visible:ring-2 focus-visible:ring-accent/40 focus-visible:outline-none"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto p-2",
				children: searching ? hits.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "px-3 py-6 text-sm text-muted",
					children: [
						"Nothing matches “",
						query.trim(),
						"”."
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", { children: hits.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HitLink, {
					hit,
					onPick: close
				}) }, hit.id)) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					hash: item.hash,
					onClick: close,
					className: "flex min-h-11 items-center rounded-sm px-3 text-sm font-medium tracking-wide text-ink-fg uppercase hover:bg-fg/10",
					children: item.label
				}, item.hash)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionBlock, {
					open: section === "minutes",
					label: "Medical Minutes",
					onToggle: () => setSection((v) => v === "minutes" ? null : "minutes"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/minutes",
						onClick: close,
						className: "flex min-h-11 items-center px-3 text-sm text-accent",
						children: "All Medical Minutes"
					}), minutes.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/minutes/$slug",
						params: { slug: m.slug },
						onClick: close,
						className: "flex min-h-11 items-center gap-3 px-3 text-sm leading-snug text-fg hover:bg-fg/10",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg font-semibold text-accent",
							children: m.n
						}), m.title]
					}, m.slug))]
				})] })
			})
		]
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		variant: "ghost",
		size: "icon",
		className: "shrink-0",
		"aria-expanded": open,
		"aria-controls": "quick-find-panel",
		"aria-label": open ? "Close quick find" : "Quick find",
		onClick: () => setOpen((v) => !v),
		children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-6" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
			viewBox: "0 0 28 20",
			className: "size-6",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M2 4h24M2 10h24M2 16h24",
				fill: "none",
				stroke: "currentColor",
				strokeWidth: "2.2",
				strokeLinecap: "round"
			})
		})
	}), mounted ? (0, import_react_dom.createPortal)(panel, document.body) : null] });
}
function HitLink({ hit, onPick }) {
	const className = "flex min-h-11 flex-col justify-center rounded-sm px-3 py-2 hover:bg-fg/10";
	const inner = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-[10px] font-medium tracking-widest text-accent uppercase",
		children: hit.section
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-sm leading-snug text-fg",
		children: hit.title
	})] });
	if (hit.hrefKind === "hash") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/",
		hash: hit.hash,
		onClick: onPick,
		className,
		children: inner
	});
	if (hit.hrefKind === "minutes") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/minutes",
		onClick: onPick,
		className,
		children: inner
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/minutes/$slug",
		params: { slug: hit.slug },
		onClick: onPick,
		className,
		children: inner
	});
}
function SectionBlock({ open, label, onToggle, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onToggle,
			className: "flex min-h-11 w-full items-center justify-between rounded-sm px-3 text-left text-sm font-medium tracking-wide text-ink-fg uppercase hover:bg-fg/10",
			"aria-expanded": open,
			children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: cn("size-4 text-accent transition-transform", open && "rotate-180") })]
		}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pb-2",
			children
		}) : null]
	});
}
function tabClass(active, style = "C") {
	return cn("flex min-h-12 min-w-11 flex-1 flex-col items-center justify-center rounded-sm px-0.5 text-fg/85", style === "D" ? "gap-0" : "gap-0.5", style !== "B" && style !== "D" && "hover:bg-fg/8", active && "text-accent");
}
function TabFace({ icons, label, active, style = "C" }) {
	if (style === "A") {
		const I = icons.A;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, { className: "size-5 shrink-0 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { text: label })] });
	}
	if (style === "B") {
		const I = icons.B;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("flex h-7 w-11 items-center justify-center rounded-full", active ? "bg-accent/30" : "bg-accent/12"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, {
				className: "size-[18px] text-accent",
				strokeWidth: 2.4,
				fill: "currentColor",
				fillOpacity: .35
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { text: label })] });
	}
	if (style === "C") {
		const I = icons.C;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, {
			className: "size-5 shrink-0 text-accent",
			strokeWidth: 2
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { text: label })] });
	}
	const I = icons.C;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		title: label,
		className: cn("flex size-11 items-center justify-center rounded-full border bg-fg/5", active ? "border-accent bg-accent/15" : "border-accent/35"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(I, {
			className: "size-6 text-accent",
			strokeWidth: 1.9
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: label
		})]
	});
}
function Label({ text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "text-[10px] leading-none font-medium tracking-wide whitespace-nowrap",
		children: text
	});
}
/** Option A hand-drawn icons (24px line style shared with theosishealth.com). */
var lp = {
	viewBox: "0 0 24 24",
	fill: "none",
	stroke: "currentColor",
	strokeWidth: 2.2,
	strokeLinecap: "round",
	strokeLinejoin: "round",
	"aria-hidden": true
};
var A = {
	user: ({ className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		...lp,
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "8",
			r: "4"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M4 21c0-4 3.6-7 8-7s8 3 8 7" })]
	}),
	heart: ({ className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		...lp,
		className,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" })
	}),
	clock: ({ className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		...lp,
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
			cx: "12",
			cy: "12",
			r: "9"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M12 7v5l3 2" })]
	}),
	map: ({ className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		...lp,
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M9 4v14M15 6v14" })]
	}),
	mail: ({ className }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		...lp,
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "3",
			y: "5",
			width: "18",
			height: "14",
			rx: "2"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m3 7 9 6 9-6" })]
	})
};
var phoneNav = [
	{
		to: "/",
		hash: "about",
		short: "About",
		icons: {
			A: A.user,
			B: CircleUser,
			C: User
		}
	},
	{
		to: "/",
		hash: "why",
		short: "Why Theosis",
		icons: {
			A: A.heart,
			B: Heart,
			C: Star
		}
	},
	{
		to: "/minutes",
		short: "Minutes",
		icons: {
			A: A.clock,
			B: Clock,
			C: CirclePlay
		}
	},
	{
		to: "/",
		hash: "plans",
		short: "Plans",
		icons: {
			A: A.map,
			B: Map,
			C: ClipboardList
		}
	},
	{
		to: "/",
		hash: "contact",
		short: "Contact",
		icons: {
			A: A.mail,
			B: Mail,
			C: MessageCircle
		}
	}
];
function SiteHeader() {
	function close() {}
	const path = useRouterState({ select: (s) => s.location.pathname });
	const active = (n) => !n.hash && path.startsWith(n.to);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 sm:gap-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickFind, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							className: "group hidden min-h-11 shrink-0 items-center xl:flex",
							onClick: close,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogoLockup, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "hidden items-center gap-4 whitespace-nowrap xl:flex",
							"aria-label": "Primary",
							children: [
								nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									hash: item.hash,
									className: "shrink-0 text-sm font-medium tracking-wide text-muted uppercase transition-colors duration-150 hover:text-fg",
									children: item.label
								}, item.hash)),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/minutes",
									className: "shrink-0 text-sm font-medium tracking-wide text-muted uppercase transition-colors duration-150 hover:text-fg",
									activeProps: { className: "text-fg" },
									children: "Medical Minutes"
								}),
								null
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
					className: "flex flex-1 items-stretch justify-around gap-0.5 xl:hidden",
					"aria-label": "Pages",
					children: phoneNav.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: n.to,
						hash: n.hash,
						"aria-current": active(n) ? "page" : void 0,
						"aria-label": void 0,
						className: tabClass(active(n)),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabFace, {
							icons: n.icons,
							label: n.short,
							active: active(n)
						})
					}, n.short))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "hidden items-center gap-2 xl:flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "invert",
						size: "sm",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/",
							hash: "contact",
							children: "How to contact"
						})
					})
				})
			]
		})
	});
}
function SiteShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "top",
		className: "min-h-svh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "#main",
				className: "sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-fg",
				children: "Skip to content"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(JsonLd, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				id: "main",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteFooter, {})
		]
	});
}
//#endregion
export { SiteShell as n, cn as r, Button as t };
