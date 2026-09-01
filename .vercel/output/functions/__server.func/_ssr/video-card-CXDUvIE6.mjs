import { i as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { _ as ChevronLeft, c as Play, g as ChevronRight, h as ExternalLink } from "../_libs/lucide-react.mjs";
import { i as cn } from "./site-shell-ByYPgQOt.mjs";
import { t as EnlargeableImage } from "./enlargeable-image-B_oMciuv.mjs";
import { t as NerdParagraph } from "./nerd-paragraph-yTlgbarp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/video-card-CXDUvIE6.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function NerdStepper({ steps, topicId }) {
	const [index, setIndex] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		setIndex(0);
	}, [topicId]);
	const last = steps.length - 1;
	const step = steps[Math.min(index, last)];
	if (!step) return null;
	function go(next) {
		setIndex(Math.max(0, Math.min(last, next)));
	}
	(0, import_react.useEffect)(() => {
		function onKey(e) {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
			if (e.key === "ArrowRight") {
				e.preventDefault();
				go(index + 1);
			}
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				go(index - 1);
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [index, last]);
	const n = String(index + 1).padStart(2, "0");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-sm font-semibold tracking-widest text-accent uppercase",
					children: [
						n,
						" of ",
						String(steps.length).padStart(2, "0")
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-3xl font-semibold tracking-wide sm:text-4xl",
					children: step.title
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-11 items-center justify-center rounded-sm text-fg shadow-border hover:bg-fg/8 disabled:opacity-30",
						"aria-label": "Previous graphic",
						disabled: index === 0,
						onClick: () => go(index - 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-11 items-center justify-center rounded-sm text-fg shadow-border hover:bg-fg/8 disabled:opacity-30",
						"aria-label": "Next graphic",
						disabled: index === last,
						onClick: () => go(index + 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
					})]
				})]
			}),
			step.kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-display text-2xl font-semibold tracking-wide",
				children: step.kicker
			}) : null,
			step.paragraphs && step.paragraphs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-5 text-lg leading-relaxed text-muted",
				children: step.paragraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NerdParagraph, { text: p }, p.slice(0, 36)))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlargeableImage, {
					src: step.image,
					alt: step.imageAlt
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: step.imageCredit
				})]
			}),
			step.extraImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlargeableImage, {
					src: step.extraImage,
					alt: step.extraImageAlt ?? ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: step.extraImageCredit
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-8 flex flex-wrap gap-2",
				children: steps.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => go(i),
					className: cn("rounded-sm px-3 py-2 text-left text-xs font-medium tracking-wide uppercase", i === index ? "bg-accent text-accent-fg" : "text-muted shadow-border hover:text-fg"),
					"aria-current": i === index ? "step" : void 0,
					children: [
						String(i + 1).padStart(2, "0"),
						" — ",
						item.title
					]
				}) }, item.title))
			})
		]
	});
}
function VideoCard({ videoId, title, credit, summary, anchor }) {
	const href = `https://www.youtube.com/watch?v=${videoId}`;
	const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		id: anchor,
		className: "scroll-mt-24 overflow-hidden rounded-xl bg-surface shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href,
			target: "_blank",
			rel: "noreferrer",
			className: "group relative block aspect-video bg-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: thumb,
				alt: "",
				className: "h-full w-full object-cover opacity-90 transition-opacity duration-150 group-hover:opacity-100"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute inset-0 flex items-center justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-14 items-center justify-center rounded-full bg-accent text-accent-fg shadow-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-6 fill-current" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "sr-only",
					children: ["Watch on YouTube: ", title]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5 sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-medium tracking-widest text-muted uppercase",
					children: ["Watch · ", credit]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-2 font-display text-2xl font-semibold tracking-wide",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 leading-relaxed text-muted",
					children: summary
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href,
					target: "_blank",
					rel: "noreferrer",
					className: "mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent hover:text-fg",
					children: ["Watch on YouTube", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })]
				})
			]
		})]
	});
}
//#endregion
export { VideoCard as n, NerdStepper as t };
