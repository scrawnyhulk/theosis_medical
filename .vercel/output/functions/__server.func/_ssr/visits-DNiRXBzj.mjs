import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { b as ArrowRight } from "../_libs/lucide-react.mjs";
import { q as visitMeta } from "./router-B-HKWIc8.mjs";
import { r as SiteShell, t as Button } from "./site-shell-ByYPgQOt.mjs";
import { t as PlaygroundBanner } from "./playground-banner-C-Ew33f2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/visits-DNiRXBzj.js
var import_jsx_runtime = require_jsx_runtime();
function VisitsHub() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaygroundBanner, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-5 py-16 sm:px-8 lg:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-muted uppercase",
				children: "Playground"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 max-w-3xl font-display text-4xl font-semibold tracking-wide sm:text-6xl",
				children: "Request a visit"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 max-w-3xl text-lg leading-relaxed text-muted",
				children: "This is what it would look like if Theosis Medical took consults and appropriate acute video visits. Two doors. Same grain. Nick on the other end — not a call center."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-3xl text-lg leading-relaxed text-muted",
				children: "Licensed in Illinois, Wisconsin, Michigan, and Indiana. If this were real, you would still need to be in a state where I can see you."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/provider",
					className: "text-sm font-medium text-accent hover:text-fg",
					children: "I’m the clinician — open the board"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-muted",
					children: " (your side, not the public site)"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid gap-px bg-border-strong sm:grid-cols-2",
				children: [{
					kind: "lifestyle",
					meta: visitMeta.lifestyle
				}, {
					kind: "acute",
					meta: visitMeta.acute
				}].map(({ kind, meta }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "flex flex-col bg-surface px-6 py-8 sm:px-10 sm:py-12",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-3xl font-semibold text-accent",
							children: meta.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-xs font-medium tracking-widest text-muted uppercase",
							children: meta.time
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-2 font-display text-3xl font-semibold tracking-wide uppercase sm:text-4xl",
							children: meta.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 flex-1 text-lg leading-relaxed text-muted",
							children: meta.body
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							className: "mt-8 w-fit",
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/visits/$kind",
								params: { kind },
								children: [kind === "lifestyle" ? "Book a consult" : "Start a video visit", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
							})
						})
					]
				}, kind))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "mt-px bg-surface px-6 py-8 sm:px-10 sm:py-12",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-accent uppercase",
						children: "If we used Atlas.md"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-3 font-display text-3xl font-semibold tracking-wide uppercase sm:text-4xl",
						children: "This site books. Atlas runs the visit."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 max-w-3xl text-lg leading-relaxed text-muted",
						children: "Red flags and licensed states stay here. Chart, card, HIPAA video, and eRx live in Atlas Patient Hub. This walkthrough is a mock — no real clinic on the other end."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						className: "mt-8 w-fit",
						size: "lg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/visits/atlas",
							children: ["Show me the Atlas handoff", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
						})
					})
				]
			})
		]
	}) })] });
}
//#endregion
export { VisitsHub as component };
