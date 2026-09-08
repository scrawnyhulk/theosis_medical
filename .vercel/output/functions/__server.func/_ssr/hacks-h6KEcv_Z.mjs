import { i as __toESM } from "../_runtime.mjs";
import { h as hacksIntro, m as hacks, p as hackCovers, r as creditKicker } from "./minutes-CTy9-_Ay.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { C as ArrowRight, r as X } from "../_libs/lucide-react.mjs";
import { i as cn, r as SiteShell, t as Button } from "./site-shell-BdMsnFSF.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hacks-h6KEcv_Z.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var KEY = "theosis-hacks-tldr-gate-v2";
function TldrGate() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	const [leaving, setLeaving] = (0, import_react.useState)(false);
	const cover = hackCovers.tldr;
	(0, import_react.useEffect)(() => {
		if (sessionStorage.getItem(KEY) === "1") return;
		setMounted(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!mounted) return;
		function onKey(e) {
			if (e.key === "Escape") dismiss();
		}
		document.addEventListener("keydown", onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = prev;
		};
	}, [mounted]);
	function dismiss() {
		sessionStorage.setItem(KEY, "1");
		setLeaving(true);
	}
	if (!mounted) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-ink/80 p-4 sm:p-8", leaving ? "tldr-scrim-out" : "tldr-scrim-in"),
		onClick: dismiss,
		role: "dialog",
		"aria-modal": "true",
		"aria-labelledby": "tldr-gate-title",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("relative w-full max-w-5xl overflow-hidden rounded-xl bg-ink shadow-ink-ring", leaving ? "tldr-swoop-out" : "tldr-swoop-in"),
			onClick: (e) => e.stopPropagation(),
			onAnimationEnd: (e) => {
				if (e.target !== e.currentTarget) return;
				if (leaving) setMounted(false);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative aspect-[16/10] max-h-[82vh] min-h-[20rem] w-full sm:min-h-[24rem]",
				children: [
					cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: cover.src,
						alt: "",
						className: "absolute inset-0 size-full object-cover"
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: dismiss,
						className: "absolute top-3 right-3 z-10 inline-flex size-11 items-center justify-center rounded-sm text-ink-fg hover:bg-ink-fg/10 sm:top-4 sm:right-4",
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative flex h-full flex-col justify-end p-6 sm:p-10",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-3xl font-semibold tracking-wide text-accent uppercase sm:text-5xl",
								children: "In a rush?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								id: "tldr-gate-title",
								className: "mt-2 font-display text-4xl font-semibold tracking-wide text-ink-fg uppercase sm:text-6xl",
								children: "Here’s the TL;DR"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 max-w-xl text-lg leading-relaxed text-ink-muted sm:text-xl",
								children: "If not, a plethora of info awaits ahead."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-8 flex flex-col gap-3 sm:flex-row sm:items-center",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									size: "lg",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/hacks/$slug",
										params: { slug: "tldr" },
										onClick: dismiss,
										children: "Show me the short list"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "onInkOutline",
									size: "lg",
									onClick: dismiss,
									children: "I’ll take the long way"
								})]
							})
						]
					})
				]
			})
		})
	});
}
function HackCoverCard({ hack, featured }) {
	const cover = hackCovers[hack.slug];
	if (!cover) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/hacks/$slug",
		params: { slug: hack.slug },
		className: `group block overflow-hidden rounded-xl bg-ink shadow-border ${featured ? "mt-8" : ""}`,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "relative block aspect-[3/2] overflow-hidden rounded-xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: cover.src,
					alt: cover.alt,
					className: `absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${cover.object ?? "object-center"}`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: `relative z-10 flex h-full min-h-11 flex-col justify-end p-6 sm:p-8 ${featured ? "sm:p-10" : ""}`,
					children: [
						featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs font-medium tracking-widest text-accent uppercase",
							children: hack.slug === "why-hard" ? "Read this first" : "Start here"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `font-display font-semibold text-accent ${featured ? "mt-3 text-4xl sm:text-5xl" : "text-3xl"}`,
							children: hack.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `mt-2 font-display font-semibold tracking-wide text-white uppercase ${featured ? "text-4xl sm:text-5xl" : "text-3xl"}`,
							children: hack.title
						}),
						hack.stolenFrom && hack.slug !== "where-to-start" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-3 block text-xs font-medium tracking-widest text-accent uppercase",
							children: creditKicker(hack.stolenFrom, hack.jokeSteal)
						}) : null,
						hack.byline ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `mt-2 block leading-relaxed text-white/85 ${featured ? "max-w-2xl text-lg" : "text-sm sm:text-base"}`,
							children: hack.byline
						}) : hack.slug !== "where-to-start" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: `mt-2 block leading-relaxed text-white/85 ${featured ? "max-w-2xl text-lg" : "text-sm sm:text-base"}`,
							children: hack.lede
						}) : null
					]
				})
			]
		})
	});
}
function HacksHub() {
	const featured = hacks.find((h) => h.featured);
	const rest = hacks.filter((h) => !h.featured && h.slug !== "tldr");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TldrGate, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-b border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-muted uppercase",
						children: hacksIntro.kicker
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 font-display text-4xl font-semibold tracking-wide sm:text-6xl",
						children: hacksIntro.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 max-w-3xl space-y-5 text-lg leading-relaxed text-muted",
						children: hacksIntro.paragraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 32)))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-3xl text-sm text-muted",
						children: hacksIntro.disclaimer
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-6 text-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/hacks/$slug",
							params: { slug: "tldr" },
							className: "font-medium text-accent hover:text-fg",
							children: "In a rush? TL;DR"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: " The short list."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-lg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/hacks/nerd-out/$topic",
							params: { topic: "protein" },
							className: "font-medium text-accent hover:text-fg",
							children: "Why do we care about protein?"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-muted",
							children: " The short nerd version."
						})]
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium tracking-widest text-muted uppercase",
					children: "Pick a hack"
				}),
				featured && hackCovers[featured.slug] ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HackCoverCard, {
					hack: featured,
					featured: true
				}) : featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/hacks/$slug",
					params: { slug: featured.slug },
					className: "group mt-8 flex flex-col rounded-xl bg-surface p-6 shadow-border transition-colors duration-150 hover:bg-fg/5 sm:p-10 md:flex-row md:items-end md:justify-between md:gap-10",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "max-w-2xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-medium tracking-widest text-accent uppercase",
								children: "Start here"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 font-display text-3xl font-semibold text-accent",
								children: featured.n
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-2 font-display text-4xl font-semibold tracking-wide uppercase sm:text-5xl",
								children: featured.title
							}),
							featured.stolenFrom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-xs font-medium tracking-widest text-muted uppercase",
								children: creditKicker(featured.stolenFrom, featured.jokeSteal)
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 text-lg leading-relaxed text-muted",
								children: featured.lede
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "mt-6 inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-medium text-accent md:mt-0",
						children: ["Open this hack", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform duration-150 group-hover:translate-x-0.5" })]
					})]
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 grid gap-4 md:grid-cols-2",
					children: rest.map((hack) => {
						if (hackCovers[hack.slug]) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HackCoverCard, { hack }, hack.slug);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/hacks/$slug",
							params: { slug: hack.slug },
							className: "group flex flex-col rounded-xl bg-surface p-6 shadow-border transition-colors duration-150 hover:bg-fg/5 sm:p-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-3xl font-semibold text-accent",
									children: hack.n
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "mt-4 font-display text-3xl font-semibold tracking-wide uppercase",
									children: hack.title
								}),
								hack.stolenFrom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-2 text-xs font-medium tracking-widest text-muted uppercase",
									children: creditKicker(hack.stolenFrom, hack.jokeSteal)
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 flex-1 leading-relaxed text-muted",
									children: hack.lede
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent",
									children: ["Open this hack", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 transition-transform duration-150 group-hover:translate-x-0.5" })]
								})
							]
						}, hack.slug);
					})
				})
			]
		})
	] });
}
//#endregion
export { HacksHub as component };
