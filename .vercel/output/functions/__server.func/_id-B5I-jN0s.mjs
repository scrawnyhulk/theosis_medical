import { i as __toESM } from "./_runtime.mjs";
import { r as require_react } from "./_libs/@hookform/resolvers+[...].mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "./_libs/@radix-ui/react-label+[...].mjs";
import { b as ArrowRight, x as ArrowLeft } from "./_libs/lucide-react.mjs";
import { G as sampleCharts, U as readDemoChart, i as Route$5 } from "./_ssr/router-B-HKWIc8.mjs";
import { r as SiteShell, t as Button } from "./_ssr/site-shell-ByYPgQOt.mjs";
import { t as Textarea } from "./_ssr/textarea-KSYp_v9I.mjs";
import { t as PlaygroundBanner } from "./_ssr/playground-banner-C-Ew33f2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_id-B5I-jN0s.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function findChart(id) {
	if (id === "live") return readDemoChart();
	return sampleCharts.find((c) => c.name.toLowerCase().replace(/\s+/g, "-") === id) ?? sampleCharts[0];
}
function ProviderChart() {
	const { id } = Route$5.useParams();
	const visit = (0, import_react.useMemo)(() => findChart(id), [id]);
	const [note, setNote] = (0, import_react.useState)("");
	const [signed, setSigned] = (0, import_react.useState)(false);
	const [rx, setRx] = (0, import_react.useState)(false);
	if (!visit) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaygroundBanner, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "px-5 py-16 text-muted",
		children: "No chart in this playground session."
	})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SiteShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaygroundBanner, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-6xl px-5 py-16 pb-28 sm:px-8 lg:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/provider",
				className: "inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "Board"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-accent uppercase",
						children: visit.kind === "lifestyle" ? "Lifestyle consult" : "Acute video"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-4xl font-semibold tracking-wide",
						children: visit.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-muted",
						children: [
							visit.state,
							" · ",
							visit.reason,
							" · ",
							visit.slot
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/visits/$kind",
						params: { kind: visit.kind },
						search: {
							view: "clinician",
							who: visit.name
						},
						children: ["Join video", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, {})]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-4 rounded-xl bg-surface p-6 shadow-border",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-semibold tracking-wide",
							children: "Chart"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartBlock, {
							label: "Allergies",
							value: visit.allergies
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartBlock, {
							label: "Medications",
							value: visit.meds
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartBlock, {
							label: "Past medical history",
							value: visit.pmh
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartBlock, {
							label: "Surgeries",
							value: visit.surgeries
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChartBlock, {
							label: "Their words",
							value: visit.notes
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-4 rounded-xl bg-surface p-6 shadow-border sm:p-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-semibold tracking-wide",
							children: "Note"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Live this would write to a real EHR (Elation, Athena, Healthie — not this website database). SOAP, sign, lock."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							className: "min-h-48",
							value: note,
							onChange: (e) => setNote(e.target.value),
							placeholder: `S: ${visit.reason}.\nO: Video exam, playground.\nA: \nP: `
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								onClick: () => setSigned(true),
								disabled: signed,
								children: signed ? "Signed (demo)" : "Sign note"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "outline",
								onClick: () => setRx(true),
								disabled: rx,
								children: rx ? "Sent to pharmacy (demo)" : "ePrescribe"
							})]
						}),
						rx ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Live, this would open DoseSpot / the EHR eRx module — identity-proofed, EPCS if controlled, pharmacy routing. Not a form on theosis medical.com."
						}) : null
					]
				})]
			})
		]
	})] });
}
function ChartBlock({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-xs font-medium tracking-widest text-muted uppercase",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-1 whitespace-pre-wrap text-fg",
		children: value.trim() || "—"
	})] });
}
//#endregion
export { ProviderChart as component };
