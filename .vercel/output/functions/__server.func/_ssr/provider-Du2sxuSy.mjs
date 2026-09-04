import { i as __toESM } from "../_runtime.mjs";
import { a as readDemoChart, o as sampleCharts } from "./visits-BPR-9BBc.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { S as ArrowRight } from "../_libs/lucide-react.mjs";
import { r as SiteShell, t as Button } from "./site-shell-DHj3ZVbe.mjs";
import { t as PlaygroundBanner } from "./playground-banner-CTrUT8xW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/provider-Du2sxuSy.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProviderHome() {
	const [in_, setIn] = (0, import_react.useState)(false);
	const live = (0, import_react.useMemo)(() => typeof window === "undefined" ? null : readDemoChart(), [in_]);
	const queue = live ? [live, ...sampleCharts] : sampleCharts;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaygroundBanner, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-5 py-16 pb-28 sm:px-8 lg:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-muted uppercase",
				children: "Sesame · provider · live demo"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl font-semibold tracking-wide sm:text-5xl",
				children: "Today’s visits"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-lg leading-relaxed text-muted",
				children: "This is your side of Sesame. Clients never see this. Live, it would be the Sesame provider app — a list of cash-pay counseling sessions, not a medical chart."
			}),
			!in_ ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 max-w-lg rounded-xl bg-surface p-6 shadow-border sm:p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-muted",
					children: "Live: you sign in. MFA. Nobody else gets the queue. This button is a stand-in."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					className: "mt-6",
					size: "lg",
					onClick: () => setIn(true),
					children: ["Enter as Nick", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 space-y-3",
				children: queue.map((visit, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/provider/$id",
					params: { id: i === 0 && live ? "live" : visit.name.toLowerCase().replace(/\s+/g, "-") },
					className: "flex flex-col rounded-xl bg-surface p-5 shadow-border transition-colors hover:bg-fg/5 sm:flex-row sm:items-center sm:justify-between sm:p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium tracking-widest text-accent uppercase",
							children: visit.kind === "lifestyle" ? "Counseling · 45 min · Sesame cash" : "Not this demo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-2xl font-semibold tracking-wide",
							children: visit.name
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-muted",
							children: visit.reason
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 text-sm text-muted sm:mt-0",
						children: visit.slot
					})]
				}, `${visit.name}-${visit.at}-${i}`))
			})
		]
	})] });
}
//#endregion
export { ProviderHome as component };
