import { i as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { i as cn } from "./site-shell-C4mQJBZr.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/input-BXT1KNpr.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-11 w-full rounded-sm bg-ink px-3.5 font-sans text-base text-fg shadow-[var(--shadow-border)] transition-[box-shadow,background-color] duration-150 ease-out placeholder:text-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
//#endregion
export { Input as t };
