import { i as __toESM } from "../_runtime.mjs";
import { C as nerdTopics, M as whyParagraphs, S as nerdGroups, b as nav, j as site, m as hacks, t as aboutParagraphs, v as minutes } from "./minutes-CTL0zzDu.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime, n as require_react_dom, r as Slot } from "../_libs/@radix-ui/react-label+[...].mjs";
import { h as Menu, l as Search, r as X, x as ChevronDown } from "../_libs/lucide-react.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/site-shell-CtXFxL8f.js
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
			name: "Theosis Medical, LLC",
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
			jobTitle: "Emergency Medicine Physician Assistant",
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
						to: "/hacks",
						className: "text-sm text-ink-muted hover:text-ink-fg",
						children: "Holwey’s Handy Health Hacks"
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						"© ",
						site.year,
						" Theosis Medical, LLC"
					] })
				]
			})]
		})
	});
}
var plaqueShell = "relative inline-flex items-center overflow-hidden rounded-[3px] border border-white/10 leading-none shadow-[2px_3px_0_0_rgb(0_0_0_/_0.55),inset_0_1px_0_rgb(255_255_255_/_0.16)]";
var plaqueBg = {
	backgroundColor: "rgb(8 13 20 / 0.72)",
	backgroundImage: "url(/images/navy-grain.jpg)",
	backgroundSize: "420px"
};
function HolweyHacksMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn(plaqueShell, "-rotate-2 items-center justify-center px-2.5 py-1.5 transition-[transform,box-shadow,background-color,border-color] duration-150", "group-hover:rotate-0 group-hover:border-accent group-hover:bg-accent group-hover:shadow-[2px_3px_0_0_rgb(0_0_0_/_0.3)]", className),
		style: plaqueBg,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100",
			style: { backgroundColor: "#2a7ae0" },
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative font-display text-[16px] font-semibold tracking-[0.16em] uppercase sm:text-[18px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hh-metal-blue",
				children: "H"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hh-metal",
				children: "ealth Hacks"
			})]
		})]
	});
}
function HacksPlaque({ title, className, compact, inline }) {
	const mark = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn(plaqueShell, compact ? "gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2" : "gap-3 px-4 py-2.5 sm:px-5 sm:py-3", className),
		style: plaqueBg,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: cn("shrink-0 rounded-full bg-accent", compact ? "h-4 w-[2px] sm:h-5" : "h-6 w-[3px] sm:h-8"),
			"aria-hidden": true
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: cn("relative whitespace-nowrap font-display font-semibold tracking-[0.16em] uppercase", compact ? "text-[15px] sm:text-[18px]" : "text-[22px] sm:text-[32px] lg:text-[36px]"),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hh-metal-blue",
				children: title.slice(0, 1)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hh-metal",
				children: title.slice(1)
			})]
		})]
	});
	if (compact || inline) return mark;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: "flex w-full items-center gap-4",
		children: [mark, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "hidden h-px min-w-8 flex-1 bg-border sm:block",
			"aria-hidden": true
		})]
	});
}
function pack(title, ...parts) {
	return [title, ...parts.flatMap((p) => Array.isArray(p) ? p : p ? [p] : [])].join(" ").toLowerCase();
}
function topicText(topic) {
	const extra = [];
	if ("steps" in topic && topic.steps) for (const step of topic.steps) {
		extra.push(step.title);
		if ("kicker" in step && typeof step.kicker === "string") extra.push(step.kicker);
		if ("paragraphs" in step && Array.isArray(step.paragraphs)) extra.push(...step.paragraphs);
	}
	if ("extraImages" in topic && Array.isArray(topic.extraImages)) for (const img of topic.extraImages) {
		if ("title" in img && typeof img.title === "string") extra.push(img.title);
		if ("alt" in img && typeof img.alt === "string") extra.push(img.alt);
	}
	return pack(topic.title, topic.lede, topic.paragraphs, extra);
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
		haystack: pack("medical minutes", "ear fever cough back sprain ct pneumonia sepsis antibiotic resistance amoxicillin leftover")
	},
	...minutes.map((m) => ({
		id: `minute-${m.slug}`,
		section: "Medical Minutes",
		title: m.title,
		blurb: m.lede,
		hrefKind: "minute",
		slug: m.slug,
		haystack: pack(m.title, m.lede, m.paragraphs)
	})),
	{
		id: "hacks-hub",
		section: "Health Hacks",
		title: "Holwey Health Hacks",
		blurb: "The 20% that actually moves the needle.",
		hrefKind: "hacks",
		haystack: pack("holwey health hacks", "protein calories food exercise")
	},
	...hacks.flatMap((h) => h.slug === "nerd-out" ? [] : [{
		id: `hack-${h.slug}`,
		section: "Health Hacks",
		title: h.title,
		blurb: h.lede,
		hrefKind: "hack",
		slug: h.slug,
		haystack: pack(h.title, h.lede, h.paragraphs)
	}]),
	{
		id: "nerd-hub",
		section: "Nutritional Nerd Out",
		title: "Nutritional Nerd Out",
		blurb: "Mechanisms. How stuff actually works.",
		hrefKind: "nerd-hub",
		haystack: pack("nutritional nerd out", "nerd out", "atp protein diabetes cholesterol")
	},
	...nerdTopics.map((topic) => {
		const group = nerdGroups.find((g) => g.topicIds.includes(topic.id));
		return {
			id: `nerd-${topic.id}`,
			section: group?.title ?? "Nutritional Nerd Out",
			title: topic.title,
			blurb: topic.lede.split("\n")[0],
			hrefKind: "nerd",
			topic: topic.id,
			haystack: pack(topic.title, topic.lede, group?.title, topicText(topic))
		};
	})
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
				}) }, hit.id)) }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						hash: item.hash,
						onClick: close,
						className: "flex min-h-11 items-center rounded-sm px-3 text-sm font-medium tracking-wide text-ink-fg uppercase hover:bg-fg/10",
						children: item.label
					}, item.hash)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionBlock, {
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
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionBlock, {
						open: section === "hacks",
						label: "Holwey Health Hacks",
						onToggle: () => setSection((v) => v === "hacks" ? null : "hacks"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/hacks",
							onClick: close,
							className: "flex min-h-11 items-center px-3 text-sm text-accent",
							children: "All Health Hacks"
						}), hacks.map((h) => h.slug === "nerd-out" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/hacks/nerd-out",
							onClick: close,
							className: "flex min-h-11 items-center gap-3 px-3 text-sm leading-snug text-fg hover:bg-fg/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg font-semibold text-accent",
								children: h.n
							}), h.title]
						}, h.slug) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/hacks/$slug",
							params: { slug: h.slug },
							onClick: close,
							className: "flex min-h-11 items-center gap-3 px-3 text-sm leading-snug text-fg hover:bg-fg/10",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-display text-lg font-semibold text-accent",
								children: h.n
							}), h.title]
						}, h.slug))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SectionBlock, {
						open: section === "nerd",
						label: "Nutritional Nerd Out",
						onToggle: () => setSection((v) => v === "nerd" ? null : "nerd"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/hacks/nerd-out",
							onClick: close,
							className: "flex min-h-11 items-center px-3 text-sm text-accent",
							children: "All Nutritional Nerd Out"
						}), nerdGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "px-3 py-2 text-xs font-medium tracking-widest text-accent uppercase",
								children: group.title
							}), group.topicIds.map((id) => {
								const topic = nerdTopics.find((t) => t.id === id);
								if (!topic) return null;
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/hacks/nerd-out/$topic",
									params: { topic: id },
									onClick: close,
									className: "flex min-h-11 items-center px-3 text-sm leading-snug text-fg hover:bg-fg/10",
									children: topic.title
								}, id);
							})]
						}, group.id))]
					})
				] })
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
	if (hit.hrefKind === "minute") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/minutes/$slug",
		params: { slug: hit.slug },
		onClick: onPick,
		className,
		children: inner
	});
	if (hit.hrefKind === "hacks") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/hacks",
		onClick: onPick,
		className,
		children: inner
	});
	if (hit.hrefKind === "hack") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/hacks/$slug",
		params: { slug: hit.slug },
		onClick: onPick,
		className,
		children: inner
	});
	if (hit.hrefKind === "nerd-hub") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/hacks/nerd-out",
		onClick: onPick,
		className,
		children: inner
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/hacks/nerd-out/$topic",
		params: { topic: hit.topic },
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
function SiteHeader() {
	const [open, setOpen] = (0, import_react.useState)(false);
	function close() {
		setOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
		className: "sticky top-0 z-40 border-b border-border bg-bg/80 backdrop-blur-md",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 sm:gap-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuickFind, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "group flex min-h-11 shrink-0 items-center",
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/hacks",
								className: "group shrink-0",
								activeProps: { className: "group" },
								"aria-label": "Health Hacks",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HolweyHacksMark, {})
							}),
							null
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "invert",
					size: "sm",
					className: "hidden md:inline-flex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						hash: "contact",
						children: "How to contact"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "icon",
					className: "xl:hidden",
					"aria-expanded": open,
					"aria-controls": "mobile-nav",
					"aria-label": open ? "Close menu" : "Open menu",
					onClick: () => setOpen((v) => !v),
					children: open ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			id: "mobile-nav",
			hidden: !open,
			className: cn("border-t border-border bg-bg/90 backdrop-blur-md xl:hidden", open ? "block" : "hidden"),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mx-auto flex max-w-6xl flex-col px-5 py-3",
				"aria-label": "Mobile",
				children: [
					nav.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						hash: item.hash,
						className: "flex min-h-12 items-center border-b border-border text-base font-medium text-fg",
						onClick: close,
						children: item.label
					}, item.hash)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/minutes",
						className: "flex min-h-12 items-center border-b border-border text-base font-medium tracking-wide text-fg uppercase",
						onClick: close,
						children: "Medical Minutes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/hacks",
						className: "group flex min-h-12 items-center border-b border-border py-2",
						onClick: close,
						"aria-label": "Holwey Health Hacks",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HolweyHacksMark, {})
					}),
					null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						hash: "contact",
						className: "flex min-h-12 items-center text-base font-medium text-accent",
						onClick: close,
						children: "How to contact"
					})
				]
			})
		})]
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
export { cn as i, HacksPlaque as n, SiteShell as r, Button as t };
