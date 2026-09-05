import { v as minutes, y as minutesIntro } from "./minutes-CTL0zzDu.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { C as ArrowRight } from "../_libs/lucide-react.mjs";
import { r as SiteShell } from "./site-shell-CtXFxL8f.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/minutes-DKAALk5k.js
var import_jsx_runtime = require_jsx_runtime();
function MinuteCard({ minute }) {
	if (minute.cover) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/minutes/$slug",
		params: { slug: minute.slug },
		className: "group block overflow-hidden rounded-xl bg-ink shadow-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative block aspect-[3/2] overflow-hidden rounded-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: minute.cover,
					alt: minute.coverAlt ?? minute.title,
					className: "absolute inset-0 size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "relative z-10 flex h-full min-h-11 flex-col justify-end p-6 sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-3xl font-semibold text-accent",
							children: minute.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-2 font-display text-3xl font-semibold tracking-wide text-white uppercase",
							children: minute.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-2 block text-sm leading-relaxed text-white/85 sm:text-base",
							children: minute.lede
						}),
						minute.cardNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-3 block text-[10px] leading-snug tracking-[0.18em] text-white/55 uppercase",
							children: minute.cardNote
						}) : null
					]
				})
			]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/minutes/$slug",
		params: { slug: minute.slug },
		className: "group flex flex-col rounded-xl bg-surface p-6 shadow-border transition-colors duration-150 hover:bg-fg/5 sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-display text-3xl font-semibold text-accent",
				children: minute.n
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-4 font-display text-3xl font-semibold tracking-wide uppercase",
				children: minute.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 flex-1 leading-relaxed text-muted",
				children: minute.lede
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent",
				children: ["Open this minute", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform duration-150 group-hover:translate-x-0.5" })]
			})
		]
	});
}
function MinutesHub() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
		className: "border-b border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-muted uppercase",
					children: minutesIntro.kicker
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-4xl font-semibold tracking-wide sm:text-6xl",
					children: minutesIntro.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 max-w-3xl space-y-5 text-lg leading-relaxed text-muted",
					children: minutesIntro.paragraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 32)))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-6 max-w-3xl text-sm text-muted",
					children: minutesIntro.disclaimer
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-widest text-muted uppercase",
			children: "Minutes"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-8 grid gap-4 md:grid-cols-2",
			children: [[...minutes].sort((a, b) => a.n.localeCompare(b.n)).map((minute) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MinuteCard, { minute }, minute.slug)), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/#suggest",
				className: "group block overflow-hidden rounded-xl bg-ink shadow-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "relative block aspect-[3/2] overflow-hidden rounded-xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: "/images/minutes-more-cover.png",
							alt: "Laptop on a desk with organs and medical symbols rising off the screen — more Medical Minutes to come.",
							className: "absolute inset-0 size-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "relative z-10 flex h-full min-h-11 flex-col justify-end p-6 sm:p-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-3xl font-semibold text-accent",
									children: "10+"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-2 font-display text-3xl font-semibold tracking-wide text-white uppercase",
									children: "More to come"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-2 block text-sm leading-relaxed text-white/85 sm:text-base",
									children: "More conditions, explained the same way. Have something you keep Googling at 2 a.m., or a topic you wish someone had walked you through in the ER? Tell me what you would find useful."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-3 inline-flex items-center gap-2 text-sm font-medium text-accent",
									children: ["Suggest a topic", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform duration-150 group-hover:translate-x-0.5" })]
								})
							]
						})
					]
				})
			})]
		})]
	})] });
}
//#endregion
export { MinutesHub as component };
