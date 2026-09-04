import { i as __toESM } from "../_runtime.mjs";
import { c as visitMeta, n as isVisitKind } from "./visits-BPR-9BBc.mjs";
import { d as getNerdTopic, j as site, l as getHack, u as getMinute } from "./minutes-PhFWXEos.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { I as redirect, f as createRouter, g as createRootRoute, h as createFileRoute, l as Scripts, m as lazyRouteComponent, p as Outlet, u as HeadContent, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { o as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BnbxP_CZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: error.message || "An unexpected error occurred. Try reloading the page."
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	if (typeof window === "undefined") return () => {};
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	const parentOrigin = resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		if (envelope.data.type === "hello") {
			if (!HelloSchema.safeParse(event.data).success) return;
			announce();
			return;
		}
		if (envelope.data.type === "navigate") {
			const parsed = NavigateSchema.safeParse(event.data);
			if (!parsed.success) return;
			navigate(parsed.data.path);
			queueMicrotask(reportLocation);
			return;
		}
		if (envelope.data.type === "history") {
			const parsed = HistorySchema.safeParse(event.data);
			if (!parsed.success) return;
			if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
			window.history.go(parsed.data.delta);
		}
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
function PwaRegister() {
	(0, import_react.useEffect)(() => {
		if (!("serviceWorker" in navigator)) return;
		navigator.serviceWorker.register("/sw.js").catch(() => {});
	}, []);
	return null;
}
var styles_default = "/assets/styles-C2-9jdWc.css";
var APP_NAME = site.name;
var Route$14 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: site.title },
			{
				name: "description",
				content: site.description
			},
			{
				name: "theme-color",
				content: "#080d14"
			},
			{
				name: "mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-capable",
				content: "yes"
			},
			{
				name: "apple-mobile-web-app-title",
				content: APP_NAME
			},
			{
				name: "apple-mobile-web-app-status-bar-style",
				content: "black-translucent"
			},
			{
				property: "og:title",
				content: site.title
			},
			{
				property: "og:description",
				content: site.description
			},
			{
				property: "og:image",
				content: "/og.jpg"
			},
			{
				property: "og:image:width",
				content: "1200"
			},
			{
				property: "og:image:height",
				content: "630"
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			},
			{
				name: "twitter:image",
				content: "/og.jpg"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png"
			},
			{
				rel: "manifest",
				href: "/manifest.webmanifest"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700&family=Barlow:ital,wght@0,400;0,500;0,600;1,400&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preload",
				as: "image",
				href: "/images/header-lockup.png"
			},
			{
				rel: "preload",
				as: "image",
				href: "/images/nick.jpg"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "bg-bg text-fg",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PwaRegister, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	})
});
var $$splitComponentImporter$12 = () => import("./routes-NQaukPzB.mjs");
var Route$13 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./install-DnTBm7i6.mjs");
var Route$12 = createFileRoute("/install")({
	component: lazyRouteComponent($$splitComponentImporter$11, "component"),
	head: () => ({ meta: [{ title: "Add to Home Screen — Theosis Medical" }, {
		name: "description",
		content: "Add Theosis Medical to your phone’s home screen so it opens like an app — no App Store needed."
	}] })
});
var $$splitComponentImporter$10 = () => import("./hacks-CIayzjcE.mjs");
var Route$11 = createFileRoute("/hacks/")({
	component: lazyRouteComponent($$splitComponentImporter$10, "component"),
	head: () => ({ meta: [{ title: "Holwey’s Handy Health Hacks — Theosis Medical" }, {
		name: "description",
		content: "Holwey’s Handy Health Hacks: the 20% that does 80% of the work. Protein, calories, drinks, fast food, and the mechanisms behind them."
	}] })
});
var $$splitComponentImporter$9 = () => import("../_slug-DI3B0rZg.mjs");
var Route$10 = createFileRoute("/hacks/$slug")({
	component: lazyRouteComponent($$splitComponentImporter$9, "component"),
	head: ({ params }) => {
		const hack = getHack(params.slug);
		return { meta: [{ title: hack ? `${hack.title} — Holwey’s Handy Health Hacks` : "Holwey’s Handy Health Hacks — Theosis Medical" }, {
			name: "description",
			content: hack?.lede ?? "Easy, high-leverage health hacks from Theosis Medical."
		}] };
	}
});
var $$splitComponentImporter$8 = () => import("./nerd-out-Cxj0SBIt.mjs");
var Route$9 = createFileRoute("/hacks/nerd-out")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./minutes-BgjkVThD.mjs");
var Route$8 = createFileRoute("/minutes/")({
	component: lazyRouteComponent($$splitComponentImporter$7, "component"),
	head: () => ({ meta: [{ title: "Medical Minutes — Theosis Medical" }, {
		name: "description",
		content: "Medical Minutes: common conditions explained in plain language — the talks Nick Holwey, PA-C, gives in the emergency department."
	}] })
});
var $$splitComponentImporter$6 = () => import("../_slug-vXsxW9Wy.mjs");
var Route$7 = createFileRoute("/minutes/$slug")({
	component: lazyRouteComponent($$splitComponentImporter$6, "component"),
	head: ({ params }) => {
		const minute = getMinute(params.slug);
		return { meta: [{ title: minute ? `${minute.title} — Medical Minutes` : "Medical Minutes — Theosis Medical" }, {
			name: "description",
			content: minute?.lede ?? "Common conditions explained in plain language."
		}] };
	}
});
var $$splitComponentImporter$5 = () => import("./provider-Du2sxuSy.mjs");
var Route$6 = createFileRoute("/provider/")({
	beforeLoad: () => {
		throw redirect({ to: "/" });
	},
	component: lazyRouteComponent($$splitComponentImporter$5, "component"),
	head: () => ({ meta: [{ title: "Sesame provider inbox (live demo) — Theosis Medical" }, {
		name: "description",
		content: "Live demo of a Sesame-style provider inbox. Not a real EHR. No real PHI."
	}] })
});
var $$splitComponentImporter$4 = () => import("../_id-v-vZjN-n.mjs");
var Route$5 = createFileRoute("/provider/$id")({
	beforeLoad: () => {
		throw redirect({ to: "/" });
	},
	component: lazyRouteComponent($$splitComponentImporter$4, "component"),
	head: () => ({ meta: [{ title: "Chart (live demo) — Theosis Medical" }] })
});
var $$splitComponentImporter$3 = () => import("./visits-CFIiSq6k.mjs");
var Route$4 = createFileRoute("/visits/")({
	beforeLoad: () => {
		throw redirect({ to: "/" });
	},
	component: lazyRouteComponent($$splitComponentImporter$3, "component"),
	head: () => ({ meta: [{ title: "Live demo · Sesame counseling — Theosis Medical" }, {
		name: "description",
		content: "Live demo. How cash-pay lifestyle counseling would look if booked on Sesame. Not a real booking."
	}] })
});
var $$splitComponentImporter$2 = () => import("../_kind-03uxKTe5.mjs");
var Route$3 = createFileRoute("/visits/$kind")({
	beforeLoad: ({ params }) => {
		throw redirect({ to: "/" });
	},
	validateSearch: (search) => ({
		...search.view === "clinician" ? { view: "clinician" } : {},
		...typeof search.who === "string" && search.who ? { who: search.who } : {}
	}),
	component: lazyRouteComponent($$splitComponentImporter$2, "component"),
	head: ({ params }) => {
		const kind = params.kind;
		const meta = isVisitKind(kind) ? visitMeta[kind] : null;
		return { meta: [{ title: meta ? `${meta.title} (live demo) — Theosis Medical` : "Visit — Theosis Medical" }, {
			name: "description",
			content: "Live demo. How a Sesame cash-pay counseling visit would look. Not a real booking."
		}] };
	}
});
var Route$2 = createFileRoute("/visits/atlas")({ beforeLoad: () => {
	throw redirect({ to: "/" });
} });
var $$splitComponentImporter$1 = () => import("./nerd-out.index-CnGO5ZEX.mjs");
var Route$1 = createFileRoute("/hacks/nerd-out/")({
	component: lazyRouteComponent($$splitComponentImporter$1, "component"),
	head: () => ({ meta: [{ title: "Nutritional Nerd Out — Holwey’s Handy Health Hacks" }, {
		name: "description",
		content: "Mechanisms. How stuff actually works. Optional reading. Compulsory if you are me."
	}] })
});
var $$splitComponentImporter = () => import("./nerd-out._topic-D7lSO2cI.mjs");
var Route = createFileRoute("/hacks/nerd-out/$topic")({
	component: lazyRouteComponent($$splitComponentImporter, "component"),
	head: ({ params }) => {
		const topic = getNerdTopic(params.topic);
		return { meta: [{ title: topic ? `${topic.title} — Nutritional Nerd Out` : "Nutritional Nerd Out — Holwey’s Handy Health Hacks" }, {
			name: "description",
			content: topic?.lede ?? "Mechanisms. How stuff actually works."
		}] };
	}
});
var IndexRoute = Route$13.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$14
});
var InstallRoute = Route$12.update({
	id: "/install",
	path: "/install",
	getParentRoute: () => Route$14
});
var HacksIndexRoute = Route$11.update({
	id: "/hacks/",
	path: "/hacks/",
	getParentRoute: () => Route$14
});
var HacksSlugRoute = Route$10.update({
	id: "/hacks/$slug",
	path: "/hacks/$slug",
	getParentRoute: () => Route$14
});
var HacksNerdOutRoute = Route$9.update({
	id: "/hacks/nerd-out",
	path: "/hacks/nerd-out",
	getParentRoute: () => Route$14
});
var MinutesIndexRoute = Route$8.update({
	id: "/minutes/",
	path: "/minutes/",
	getParentRoute: () => Route$14
});
var MinutesSlugRoute = Route$7.update({
	id: "/minutes/$slug",
	path: "/minutes/$slug",
	getParentRoute: () => Route$14
});
var ProviderIndexRoute = Route$6.update({
	id: "/provider/",
	path: "/provider/",
	getParentRoute: () => Route$14
});
var ProviderIdRoute = Route$5.update({
	id: "/provider/$id",
	path: "/provider/$id",
	getParentRoute: () => Route$14
});
var VisitsIndexRoute = Route$4.update({
	id: "/visits/",
	path: "/visits/",
	getParentRoute: () => Route$14
});
var VisitsKindRoute = Route$3.update({
	id: "/visits/$kind",
	path: "/visits/$kind",
	getParentRoute: () => Route$14
});
var VisitsAtlasRoute = Route$2.update({
	id: "/visits/atlas",
	path: "/visits/atlas",
	getParentRoute: () => Route$14
});
var HacksNerdOutIndexRoute = Route$1.update({
	id: "/",
	path: "/",
	getParentRoute: () => HacksNerdOutRoute
});
var HacksNerdOutRouteChildren = {
	HacksNerdOutTopicRoute: Route.update({
		id: "/$topic",
		path: "/$topic",
		getParentRoute: () => HacksNerdOutRoute
	}),
	HacksNerdOutIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	InstallRoute,
	HacksSlugRoute,
	HacksNerdOutRoute: HacksNerdOutRoute._addFileChildren(HacksNerdOutRouteChildren),
	MinutesSlugRoute,
	ProviderIdRoute,
	VisitsKindRoute,
	VisitsAtlasRoute,
	HacksIndexRoute,
	MinutesIndexRoute,
	ProviderIndexRoute,
	VisitsIndexRoute
};
var routeTree = Route$14._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { Route$7 as a, Route$5 as i, Route as n, Route$10 as o, Route$3 as r, router_exports as t };
