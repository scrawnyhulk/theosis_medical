import { i as __toESM } from "../_runtime.mjs";
import { S as nerdTopics, b as nerdCovers, c as getHack, m as hacksIntro, p as hacks, x as nerdGroups } from "./minutes-DY1gg7Wr.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { _ as ChevronLeft, b as ArrowRight, g as ChevronRight, x as ArrowLeft } from "../_libs/lucide-react.mjs";
import { n as HacksPlaque, r as SiteShell } from "./site-shell-B5yAaicX.mjs";
import { t as NerdParagraph } from "./nerd-paragraph-yTlgbarp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nerd-out.index-Cc36sLUz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var slides = nerdGroups.flatMap((group) => group.topicIds.map((id) => {
	const topic = nerdTopics.find((t) => t.id === id);
	if (!topic) return null;
	return {
		topic,
		group,
		n: String(nerdTopics.findIndex((t) => t.id === id) + 1).padStart(2, "0"),
		cover: nerdCovers[topic.id]
	};
})).filter((s) => s !== null);
var fadeMask = "linear-gradient(90deg, transparent 0%, #000 4%, #000 96%, transparent 100%)";
function NerdOutCarousel() {
	const scrollerRef = (0, import_react.useRef)(null);
	const [index, setIndex] = (0, import_react.useState)(0);
	const scrollingRef = (0, import_react.useRef)(false);
	const draggedRef = (0, import_react.useRef)(false);
	const goTo = (0, import_react.useCallback)((i) => {
		const next = Math.max(0, Math.min(slides.length - 1, i));
		const scroller = scrollerRef.current;
		const slide = scroller?.children[next];
		if (!scroller || !slide) return;
		scrollingRef.current = true;
		setIndex(next);
		const left = slide.offsetLeft - (scroller.clientWidth - slide.clientWidth) / 2;
		scroller.scrollTo({
			left,
			behavior: "smooth"
		});
		window.setTimeout(() => {
			scrollingRef.current = false;
		}, 420);
	}, []);
	(0, import_react.useEffect)(() => {
		const scroller = scrollerRef.current;
		if (!scroller) return;
		const onScroll = () => {
			const center = scroller.scrollLeft + scroller.clientWidth / 2;
			let best = 0;
			let bestDist = Infinity;
			for (let i = 0; i < scroller.children.length; i++) {
				const slide = scroller.children[i];
				const mid = slide.offsetLeft + slide.clientWidth / 2;
				const dist = Math.abs(mid - center);
				if (dist < bestDist) {
					bestDist = dist;
					best = i;
				}
			}
			setIndex(best);
		};
		scroller.addEventListener("scroll", onScroll, { passive: true });
		return () => scroller.removeEventListener("scroll", onScroll);
	}, []);
	(0, import_react.useEffect)(() => {
		const scroller = scrollerRef.current;
		if (!scroller) return;
		const drag = {
			id: -1,
			x: 0,
			scroll: 0,
			moved: false
		};
		const nearest = () => {
			const center = scroller.scrollLeft + scroller.clientWidth / 2;
			let best = 0;
			let bestDist = Infinity;
			for (let i = 0; i < scroller.children.length; i++) {
				const slide = scroller.children[i];
				const dist = Math.abs(slide.offsetLeft + slide.clientWidth / 2 - center);
				if (dist < bestDist) {
					bestDist = dist;
					best = i;
				}
			}
			return best;
		};
		const down = (event) => {
			if (event.pointerType === "touch") return;
			if (event.button !== 0) return;
			drag.id = event.pointerId;
			drag.x = event.clientX;
			drag.scroll = scroller.scrollLeft;
			drag.moved = false;
		};
		const move = (event) => {
			if (event.pointerId !== drag.id) return;
			const dx = event.clientX - drag.x;
			if (!drag.moved && Math.abs(dx) < 12) return;
			if (!drag.moved) {
				drag.moved = true;
				draggedRef.current = true;
				scroller.setPointerCapture(event.pointerId);
				scroller.style.scrollSnapType = "none";
			}
			event.preventDefault();
			scroller.scrollLeft = drag.scroll - dx;
		};
		const up = (event) => {
			if (event.pointerId !== drag.id) return;
			drag.id = -1;
			scroller.style.scrollSnapType = "";
			if (drag.moved) {
				goTo(nearest());
				window.setTimeout(() => {
					draggedRef.current = false;
				}, 250);
			}
		};
		scroller.addEventListener("pointerdown", down);
		scroller.addEventListener("pointermove", move);
		scroller.addEventListener("pointerup", up);
		scroller.addEventListener("pointercancel", up);
		return () => {
			scroller.removeEventListener("pointerdown", down);
			scroller.removeEventListener("pointermove", move);
			scroller.removeEventListener("pointerup", up);
			scroller.removeEventListener("pointercancel", up);
		};
	}, [goTo]);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) return;
			if (event.key === "ArrowRight") {
				event.preventDefault();
				goTo(index + 1);
			}
			if (event.key === "ArrowLeft") {
				event.preventDefault();
				goTo(index - 1);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [goTo, index]);
	const current = slides[index];
	const upcoming = slides[index + 1];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2",
			style: {
				"--card-h": "min(calc(70vw * 10 / 16), calc(100svh - 22rem))",
				"--card-w": "calc(var(--card-h) * 16 / 10)",
				"--card-inset": "max(0.75rem, calc((100% - var(--card-w)) / 2))"
			},
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "mb-3 flex flex-wrap items-center gap-x-5 gap-y-2",
				style: { paddingInline: "var(--card-inset)" },
				"aria-label": "Nutritional Nerd Out groups",
				children: nerdGroups.map((group) => {
					const first = slides.findIndex((s) => s.group.id === group.id);
					if (current?.group.id === group.id) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "m-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HacksPlaque, {
							title: group.title,
							inline: true
						})
					}, group.id);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => goTo(first),
						className: "min-h-11 font-display text-sm font-semibold tracking-[0.16em] text-muted uppercase hover:text-fg",
						children: group.title
					}, group.id);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						ref: scrollerRef,
						className: "flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto pb-2 select-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden active:cursor-grabbing",
						style: {
							WebkitMaskImage: fadeMask,
							maskImage: fadeMask,
							paddingInline: "var(--card-inset)"
						},
						"aria-label": "Nutritional Nerd Out topics",
						children: slides.map((slide, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/hacks/nerd-out/$topic",
							params: { topic: slide.topic.id },
							className: "group relative isolate h-[var(--card-h)] w-[var(--card-w)] shrink-0 snap-center overflow-hidden rounded-xl bg-ink shadow-border",
							draggable: false,
							onClick: (event) => {
								if (draggedRef.current) event.preventDefault();
							},
							children: [
								slide.cover ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: slide.cover.src,
									alt: slide.cover.alt,
									draggable: false,
									className: "pointer-events-none absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105",
									loading: i < 2 ? "eager" : "lazy"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-0",
									style: {
										backgroundColor: "rgb(8 13 20)",
										backgroundImage: "url(/images/navy-grain.jpg)",
										backgroundSize: "420px"
									},
									"aria-hidden": true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative flex h-full flex-col justify-end p-5 sm:p-7 lg:p-8",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-display text-3xl font-semibold text-accent sm:text-4xl",
										children: slide.n
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-1 font-display text-2xl font-semibold tracking-wide text-white uppercase sm:text-4xl",
										children: slide.topic.title
									})]
								})
							]
						}, slide.topic.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => goTo(index - 1),
						disabled: index === 0,
						className: "absolute top-1/2 left-2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm disabled:opacity-30 sm:left-4 sm:size-12",
						"aria-label": "Previous topic",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-6" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => goTo(index + 1),
						disabled: index === slides.length - 1,
						className: "absolute top-1/2 right-2 z-10 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/45 text-white backdrop-blur-sm disabled:opacity-30 sm:right-4 sm:size-12",
						"aria-label": "Next topic",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-6" })
					})
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto mt-4 max-w-xl px-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "sr-only",
					htmlFor: "nerd-out-slider",
					children: "Scrub through Nutritional Nerd Out topics"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					id: "nerd-out-slider",
					type: "range",
					min: 0,
					max: slides.length - 1,
					step: 1,
					value: index,
					onChange: (event) => goTo(Number(event.target.value)),
					"aria-valuetext": `${current?.n} ${current?.topic.title}`,
					className: "nerd-out-slider w-full"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-baseline justify-between gap-4 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-medium text-fg",
						children: [
							current?.n,
							" / ",
							String(slides.length).padStart(2, "0")
						]
					}), upcoming ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => goTo(index + 1),
						className: "truncate text-right text-muted hover:text-fg",
						children: ["Next: ", upcoming.topic.title]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: "Last topic"
					})]
				})
			]
		})]
	});
}
function NerdOutHub() {
	const hack = getHack("nerd-out");
	const index = hacks.findIndex((h) => h.slug === "nerd-out");
	const prev = index > 0 ? hacks[index - 1] : void 0;
	const next = index >= 0 && index < hacks.length - 1 ? hacks[index + 1] : void 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-6xl px-5 pt-8 pb-16 sm:px-8 lg:pt-10 lg:pb-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/hacks",
				className: "inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "All Holwey’s Handy Health Hacks"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 font-display text-3xl font-semibold text-accent",
				children: hack?.n ?? "08"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl font-semibold tracking-wide sm:text-5xl",
				children: hack?.title ?? "Nutritional Nerd Out"
			}),
			hack?.lede ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 max-w-3xl text-xl leading-relaxed text-fg",
				children: hack.lede
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 max-w-3xl space-y-5 text-lg leading-relaxed text-muted",
				children: hack?.paragraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NerdParagraph, { text: p }, p.slice(0, 36)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NerdOutCarousel, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-12 text-sm text-muted",
				children: hacksIntro.disclaimer
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mt-12 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between",
				children: [prev ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/hacks/$slug",
					params: { slug: prev.slug },
					className: "inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }),
						prev.n,
						" ",
						prev.title
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/hacks/$slug",
					params: { slug: next.slug },
					className: "inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg sm:ml-auto",
					children: [
						next.n,
						" ",
						next.title,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
					]
				}) : null]
			})
		]
	}) });
}
//#endregion
export { NerdOutHub as component };
