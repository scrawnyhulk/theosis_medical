import { l as getMinute, v as minutesIntro } from "./_ssr/minutes-DY1gg7Wr.mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "./_libs/@radix-ui/react-label+[...].mjs";
import { C as ArrowLeft } from "./_libs/lucide-react.mjs";
import { a as Route$7 } from "./_ssr/router-B8QEekz9.mjs";
import { r as SiteShell, t as Button } from "./_ssr/site-shell-CxZxN4Pk.mjs";
import { n as NerdStepper, t as EnlargeableImage } from "./_ssr/nerd-stepper-Cgfy6Suf.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-Vi3-CyYX.js
var import_jsx_runtime = require_jsx_runtime();
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
			minute.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlargeableImage, {
					src: minute.image,
					alt: minute.imageAlt ?? minute.title
				}), minute.imageCredit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: minute.imageCredit
				}) : null]
			}) : null,
			minute.extraImages && minute.extraImages.length > 0 ? minute.extraImages.map((img) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "mt-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlargeableImage, {
					src: img.src,
					alt: img.alt
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: img.credit
				})]
			}, img.src)) : null,
			minute.extraParagraphs && minute.extraParagraphs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 space-y-5 text-lg leading-relaxed text-muted",
				children: minute.extraParagraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 36)))
			}) : null,
			minute.steps && minute.steps.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NerdStepper, {
				steps: minute.steps,
				topicId: minute.slug
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-12 text-sm text-muted",
				children: minutesIntro.disclaimer
			})
		]
	}) });
}
//#endregion
export { MinutePage as component };
