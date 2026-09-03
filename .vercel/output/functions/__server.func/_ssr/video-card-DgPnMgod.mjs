import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { _ as ExternalLink, u as Play } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/video-card-DgPnMgod.js
var import_jsx_runtime = require_jsx_runtime();
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
export { VideoCard as t };
