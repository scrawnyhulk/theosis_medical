import { i as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { n as ZoomOut, t as ZoomIn } from "../_libs/lucide-react.mjs";
import { i as cn } from "./site-shell-ByYPgQOt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/enlargeable-image-B_oMciuv.js
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
//#endregion
export { EnlargeableImage as t };
