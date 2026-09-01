import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "./_libs/@radix-ui/react-label+[...].mjs";
import { x as ArrowLeft } from "./_libs/lucide-react.mjs";
import { a as Route$7, h as getMinute, w as minutesIntro } from "./_ssr/router-B-HKWIc8.mjs";
import { r as SiteShell, t as Button } from "./_ssr/site-shell-ByYPgQOt.mjs";
import { t as EnlargeableImage } from "./_ssr/enlargeable-image-B_oMciuv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-V0KNaUYE.js
var import_jsx_runtime = require_jsx_runtime();
var cards = [
	{
		n: "01",
		tone: "text-accent",
		title: "The myth",
		body: "You do not become resistant. The germs do. They learn tricks and pass them on."
	},
	{
		n: "02",
		tone: "text-ok",
		title: "How they learn",
		body: "A pump that spits the drug out. An enzyme that cuts it. A lock that no longer fits the key."
	},
	{
		n: "03",
		tone: "text-warn",
		title: "What feeds it",
		body: "Leftover pills. Antibiotics for a virus. Sharing medicine. “Just in case” prescriptions."
	},
	{
		n: "04",
		tone: "text-accent",
		title: "When you still need them",
		body: "Bacterial pneumonia. Kidney infection. Confirmed strep. Cellulitis. Abscess. Sepsis."
	},
	{
		n: "05",
		tone: "text-ok",
		title: "What actually helps",
		body: "Take exactly as prescribed. Don’t save leftovers. Don’t pressure for a Z-pack for a cold."
	},
	{
		n: "06",
		tone: "text-danger",
		title: "Get seen now",
		body: "Spreading redness or streaking. Fever with shaking chills. Back pain with UTI symptoms. Looking seriously unwell."
	}
];
function ResistancePoster() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "overflow-hidden rounded-xl bg-ink p-6 shadow-border sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-warn uppercase",
				children: "Medical Minute 08"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-2 font-display text-3xl font-semibold tracking-wide text-ink-fg uppercase sm:text-4xl",
				children: "What Is Antibiotic Resistance"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-lg leading-snug text-ink-muted",
				children: "You don't become immune to the medicine. The bacteria do."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-3 sm:grid-cols-2",
				children: cards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg bg-fg/5 p-4 shadow-border sm:p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: `font-display text-2xl font-semibold ${card.tone}`,
							children: card.n
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 font-display text-xl font-semibold tracking-wide text-ink-fg uppercase",
							children: card.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-ink-muted",
							children: card.body
						})
					]
				}, card.n))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-xs tracking-widest text-ink-muted uppercase",
				children: "Theosis Medical · General education — not a diagnosis"
			})
		]
	});
}
function MinutePage() {
	const { slug } = Route$7.useParams();
	const minute = getMinute(slug);
	if (!minute) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-5 py-24 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl font-semibold tracking-wide",
				children: "That minute is not here."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-lg text-muted",
				children: "More will be added as they exist."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/minutes",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {}), "All Medical Minutes"]
				})
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/minutes",
				className: "inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "All Medical Minutes"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 font-display text-3xl font-semibold text-accent",
				children: minute.n
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl font-semibold tracking-wide sm:text-5xl",
				children: minute.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-xl leading-relaxed text-fg",
				children: minute.lede
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-5 text-lg leading-relaxed text-muted",
				children: minute.paragraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 36)))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
				className: "mt-10",
				children: minute.graphic === "antibiotic-resistance" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResistancePoster, {}) : minute.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlargeableImage, {
					src: minute.image,
					alt: minute.imageAlt ?? minute.title
				}) : null
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-12 text-sm text-muted",
				children: minutesIntro.disclaimer
			})
		]
	}) });
}
//#endregion
export { MinutePage as component };
