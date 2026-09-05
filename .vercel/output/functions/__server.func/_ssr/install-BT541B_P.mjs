import { i as __toESM } from "../_runtime.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { c as Share } from "../_libs/lucide-react.mjs";
import { r as SiteShell, t as Button } from "./site-shell-CtXFxL8f.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/install-BT541B_P.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InstallButton() {
	const [promptEvent, setPromptEvent] = (0, import_react.useState)(null);
	const [installed, setInstalled] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (window.matchMedia("(display-mode: standalone)").matches || "standalone" in navigator && Boolean(navigator.standalone)) setInstalled(true);
		function onPrompt(e) {
			e.preventDefault();
			setPromptEvent(e);
		}
		function onInstalled() {
			setInstalled(true);
			setPromptEvent(null);
		}
		window.addEventListener("beforeinstallprompt", onPrompt);
		window.addEventListener("appinstalled", onInstalled);
		return () => {
			window.removeEventListener("beforeinstallprompt", onPrompt);
			window.removeEventListener("appinstalled", onInstalled);
		};
	}, []);
	if (installed) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-ok",
		children: "This is already on your home screen."
	});
	if (!promptEvent) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		size: "lg",
		onClick: async () => {
			await promptEvent.prompt();
			setPromptEvent(null);
		},
		children: "Install Theosis"
	});
}
function InstallPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-muted uppercase",
				children: "On your phone"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-4 font-display text-4xl font-semibold tracking-wide sm:text-6xl",
				children: "Add Theosis to your Home Screen"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-lg leading-relaxed text-muted",
				children: "This is still the website — it does not go through the App Store. Once it is on your home screen, it opens full-screen like an app: the Theosis shield, no browser chrome."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InstallButton, {})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
				className: "mt-12 space-y-10",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-accent uppercase",
						children: "iPhone · Safari"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl font-semibold tracking-wide",
						children: "iOS"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "mt-4 space-y-3 text-lg leading-relaxed text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"1. Open this site in ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Safari"
								}),
								" (not Chrome, not the in-app browser)."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex flex-wrap items-center gap-2",
								children: [
									"2. Tap Share",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "inline-flex size-9 items-center justify-center rounded-md bg-surface text-fg shadow-border",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Share, { className: "size-4" })
									}),
									"at the bottom of the screen."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"3. Scroll and tap ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Add to Home Screen"
								}),
								"."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"4. Tap ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Add"
								}),
								". The shield lands on your home screen."
							] })
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-accent uppercase",
						children: "Android · Chrome"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-2 font-display text-3xl font-semibold tracking-wide",
						children: "Android"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ol", {
						className: "mt-4 space-y-3 text-lg leading-relaxed text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "1. Open this site in Chrome." }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"2. Tap the three dots, then ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Install app"
								}),
								" or",
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Add to Home screen"
								}),
								"."
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
								"3. Confirm. If a banner says ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-fg",
									children: "Install"
								}),
								" at the bottom, that is the same thing — use that."
							] })
						]
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-12 text-sm text-muted",
				children: "After that it launches like any other icon. It is still this site underneath — just without the address bar."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "text-sm font-medium text-accent hover:text-fg",
					children: "Back to Theosis Medical"
				})
			})
		]
	}) }) });
}
//#endregion
export { InstallPage as component };
