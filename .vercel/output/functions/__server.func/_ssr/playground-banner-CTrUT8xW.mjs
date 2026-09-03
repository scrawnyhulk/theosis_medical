import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/playground-banner-CTrUT8xW.js
var import_jsx_runtime = require_jsx_runtime();
function PlaygroundBanner() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "border-b border-border bg-ink px-5 py-2.5 text-center text-xs leading-relaxed text-ink-muted sm:px-8",
		children: [
			"Live demo. How this would look if counseling were booked on Sesame — not a real Sesame account, not a medical visit, not a patient relationship. Do not send real health information.",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				hash: "contact",
				className: "text-accent hover:text-ink-fg",
				children: "How to contact"
			}),
			" · ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/hacks",
				className: "text-accent hover:text-ink-fg",
				children: "Health Hacks"
			})
		]
	});
}
//#endregion
export { PlaygroundBanner as t };
