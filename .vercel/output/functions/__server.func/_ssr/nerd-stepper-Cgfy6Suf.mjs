import { i as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as ZoomOut, t as ZoomIn, v as ChevronRight, y as ChevronLeft } from "../_libs/lucide-react.mjs";
import { i as cn } from "./site-shell-CxZxN4Pk.mjs";
import { t as NerdParagraph } from "./nerd-paragraph-yTlgbarp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nerd-stepper-Cgfy6Suf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function EnlargeableImage({ src, alt, className }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const scrollerRef = (0, import_react.useRef)(null);
	const dragRef = (0, import_react.useRef)({
		id: -1,
		moved: false,
		x: 0,
		y: 0,
		sl: 0,
		st: 0
	});
	(0, import_react.useEffect)(() => {
		if (!open) return;
		function onKey(e) {
			if (e.key === "Escape") setOpen(false);
		}
		document.addEventListener("keydown", onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = prev;
		};
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const scroller = scrollerRef.current;
		if (!scroller) return;
		const drag = dragRef.current;
		const down = (event) => {
			if (event.pointerType === "touch") return;
			if (event.button !== 0) return;
			drag.id = event.pointerId;
			drag.moved = false;
			drag.x = event.clientX;
			drag.y = event.clientY;
			drag.sl = scroller.scrollLeft;
			drag.st = scroller.scrollTop;
			scroller.setPointerCapture(event.pointerId);
		};
		const move = (event) => {
			if (event.pointerId !== drag.id) return;
			const dx = event.clientX - drag.x;
			const dy = event.clientY - drag.y;
			if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 8) return;
			drag.moved = true;
			scroller.scrollLeft = drag.sl - dx;
			scroller.scrollTop = drag.st - dy;
		};
		const up = (event) => {
			if (event.pointerId !== drag.id) return;
			drag.id = -1;
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
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: () => setOpen(true),
		className: "group relative block w-full cursor-zoom-in rounded-xl text-left",
		"aria-label": `Enlarge: ${alt}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
			src,
			alt,
			className: cn("w-full rounded-xl bg-steel", className)
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-sm bg-ink/80 text-ink-fg",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "size-5" })
		})]
	}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: scrollerRef,
		className: "fixed inset-0 z-[80] cursor-grab overflow-auto bg-black/85 p-3 select-none sm:p-6 active:cursor-grabbing",
		onClick: () => {
			if (dragRef.current.moved) return;
			setOpen(false);
		},
		role: "dialog",
		"aria-modal": "true",
		"aria-label": alt,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mx-auto my-8 w-fit max-w-none",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt,
				draggable: false,
				className: "pointer-events-none block h-auto w-auto max-w-none rounded-sm bg-steel"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "pointer-events-none fixed right-4 bottom-6 flex size-11 items-center justify-center rounded-sm bg-ink text-ink-fg shadow-ink-ring",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomOut, { className: "size-5" })
		})]
	}) : null] });
}
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
//#endregion
export { NerdStepper as n, EnlargeableImage as t };
