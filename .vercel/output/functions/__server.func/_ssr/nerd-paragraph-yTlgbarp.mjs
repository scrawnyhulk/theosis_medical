import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nerd-paragraph-yTlgbarp.js
var import_jsx_runtime = require_jsx_runtime();
var tokens = {
	hormozi: {
		kind: "hack",
		slug: "where-to-start",
		hash: "hormozi",
		label: "Go back here"
	},
	a1c: {
		kind: "nerd",
		topic: "a1c",
		label: "hemoglobin A1c"
	},
	takeout: {
		kind: "hack",
		slug: "fast-food",
		label: "takeout splurges"
	},
	energy: {
		kind: "nerd",
		topic: "energy",
		label: "energy"
	},
	sweeteners: {
		kind: "nerd",
		topic: "sweeteners",
		label: "What are they, exactly?"
	},
	diabetes: {
		kind: "nerd",
		topic: "personal-fat-threshold",
		label: "causes type 2 diabetes"
	},
	reverse: {
		kind: "nerd",
		topic: "reverse-diabetes",
		label: "can I reverse it?"
	},
	grow: {
		kind: "nerd",
		topic: "muscle",
		label: "How do we grow muscle?"
	},
	whymuscle: {
		kind: "nerd",
		topic: "why-muscle",
		label: "Why you should care about growing muscle"
	}
};
function NerdParagraph({ text }) {
	const pieces = text.split(/(\[\[\w+\]\])/);
	if (pieces.length === 1) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: text });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: pieces.map((piece, i) => {
		const key = piece.match(/^\[\[(\w+)\]\]$/)?.[1];
		const token = key ? tokens[key] : void 0;
		if (!token) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: piece }, i);
		if (token.kind === "nerd") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/hacks/nerd-out/$topic",
			params: { topic: token.topic },
			className: "font-medium text-accent hover:text-fg",
			children: token.label
		}, i);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/hacks/$slug",
			params: { slug: token.slug },
			hash: token.hash,
			className: "font-medium text-accent hover:text-fg",
			children: token.label
		}, i);
	}) });
}
//#endregion
export { NerdParagraph as t };
