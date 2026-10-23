import { i as __toESM } from "./_runtime.mjs";
import { i as getMinute } from "./_ssr/minutes-BeP4gneU.mjs";
import { r as require_react } from "./_libs/@hookform/resolvers+[...].mjs";
import { y as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "./_libs/@radix-ui/react-label+[...].mjs";
import { _ as ExternalLink, b as ChevronLeft, n as ZoomOut, t as ZoomIn, u as Play, v as Download, w as ArrowLeft, y as ChevronRight } from "./_libs/lucide-react.mjs";
import { i as Route$5 } from "./_ssr/router-tExI3E2d.mjs";
import { n as SiteShell, r as cn, t as Button } from "./_ssr/site-shell-Bmdk9QAJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-C1zcQ1-g.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function fileNameFromSrc(src) {
	const last = src.split("/").pop();
	return last && last.length > 0 ? last : "image.png";
}
function EnlargeableImage({ src, alt, className }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const scrollerRef = (0, import_react.useRef)(null);
	const dragRef = (0, import_react.useRef)({
		id: -1,
		moved: false,
		x: 0,
		y: 0,
		sl: 0,
		st: 0
	});
	const fileName = fileNameFromSrc(src);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		function onKey(e) {
			if (e.key === "Escape") setOpen(false);
		}
		document.addEventListener("keydown", onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = prev;
		};
	}, [open]);
	(0, import_react.useEffect)(() => {
		if (!open) return;
		const scroller = scrollerRef.current;
		if (!scroller) return;
		const drag = dragRef.current;
		const down = (event) => {
			if (event.pointerType === "touch") return;
			if (event.button !== 0) return;
			drag.id = event.pointerId;
			drag.moved = false;
			drag.x = event.clientX;
			drag.y = event.clientY;
			drag.sl = scroller.scrollLeft;
			drag.st = scroller.scrollTop;
			scroller.setPointerCapture(event.pointerId);
		};
		const move = (event) => {
			if (event.pointerId !== drag.id) return;
			const dx = event.clientX - drag.x;
			const dy = event.clientY - drag.y;
			if (!drag.moved && Math.abs(dx) + Math.abs(dy) < 8) return;
			drag.moved = true;
			scroller.scrollLeft = drag.sl - dx;
			scroller.scrollTop = drag.st - dy;
		};
		const up = (event) => {
			if (event.pointerId !== drag.id) return;
			drag.id = -1;
		};
		scroller.addEventListener("pointerdown", down);
		scroller.addEventListener("pointermove", move);
		scroller.addEventListener("pointerup", up);
		scroller.addEventListener("pointercancel", up);
		return () => {
			scroller.removeEventListener("pointerdown", down);
			scroller.removeEventListener("pointermove", move);
			scroller.removeEventListener("pointerup", up);
			scroller.removeEventListener("pointercancel", up);
		};
	}, [open]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => setOpen(true),
			className: "group relative block w-full cursor-zoom-in rounded-xl text-left",
			"aria-label": `Enlarge: ${alt}`,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt,
				className: cn("w-full rounded-xl bg-steel", className)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute right-3 bottom-3 flex size-10 items-center justify-center rounded-sm bg-ink/80 text-ink-fg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, { className: "size-5" })
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: src,
			download: fileName,
			className: "absolute right-14 bottom-3 flex size-10 items-center justify-center rounded-sm bg-ink/80 text-ink-fg",
			"aria-label": `Download full-size: ${alt}`,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-5" })
		})]
	}), open ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: scrollerRef,
		className: "fixed inset-0 z-[80] cursor-grab overflow-auto bg-black/85 p-3 select-none sm:p-6 active:cursor-grabbing",
		onClick: () => {
			if (dragRef.current.moved) return;
			setOpen(false);
		},
		role: "dialog",
		"aria-modal": "true",
		"aria-label": alt,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto my-8 w-fit max-w-none",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src,
					alt,
					draggable: false,
					className: "pointer-events-none block h-auto w-auto max-w-none rounded-sm bg-steel"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
				href: src,
				download: fileName,
				onClick: (event) => event.stopPropagation(),
				className: "fixed bottom-6 left-4 z-[81] inline-flex min-h-11 items-center gap-2 rounded-sm bg-ink px-4 text-sm font-medium text-ink-fg shadow-ink-ring",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), "Download full-size"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "pointer-events-none fixed right-4 bottom-6 flex size-11 items-center justify-center rounded-sm bg-ink text-ink-fg shadow-ink-ring",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomOut, { className: "size-5" })
			})
		]
	}) : null] });
}
var HEALTH = "https://theosishealth.com/hacks";
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
	flex: {
		kind: "hack",
		slug: "fasting",
		hash: "metabolic-flexibility",
		label: "metabolic flexibility"
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
		if (token.kind === "nerd") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: `${HEALTH}/nerd-out/${token.topic}`,
			className: "font-medium text-accent hover:text-fg",
			children: token.label
		}, i);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: `${HEALTH}/${token.slug}${token.hash ? `#${token.hash}` : ""}`,
			className: "font-medium text-accent hover:text-fg",
			children: token.label
		}, i);
	}) });
}
function NerdStepper({ steps, topicId }) {
	const [index, setIndex] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		setIndex(0);
	}, [topicId]);
	const last = steps.length - 1;
	const step = steps[Math.min(index, last)];
	if (!step) return null;
	function go(next) {
		setIndex(Math.max(0, Math.min(last, next)));
	}
	(0, import_react.useEffect)(() => {
		function onKey(e) {
			if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
			if (e.key === "ArrowRight") {
				e.preventDefault();
				go(index + 1);
			}
			if (e.key === "ArrowLeft") {
				e.preventDefault();
				go(index - 1);
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [index, last]);
	const n = String(index + 1).padStart(2, "0");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-sm font-semibold tracking-widest text-accent uppercase",
					children: [
						n,
						" of ",
						String(steps.length).padStart(2, "0")
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-3xl font-semibold tracking-wide sm:text-4xl",
					children: step.title
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-11 items-center justify-center rounded-sm text-fg shadow-border hover:bg-fg/8 disabled:opacity-30",
						"aria-label": "Previous graphic",
						disabled: index === 0,
						onClick: () => go(index - 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-11 items-center justify-center rounded-sm text-fg shadow-border hover:bg-fg/8 disabled:opacity-30",
						"aria-label": "Next graphic",
						disabled: index === last,
						onClick: () => go(index + 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
					})]
				})]
			}),
			step.kicker ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 font-display text-2xl font-semibold tracking-wide",
				children: step.kicker
			}) : null,
			step.paragraphs && step.paragraphs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-5 text-lg leading-relaxed text-muted",
				children: step.paragraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NerdParagraph, { text: p }, p.slice(0, 36)))
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "mt-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlargeableImage, {
					src: step.image,
					alt: step.imageAlt
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: step.imageCredit
				})]
			}),
			step.extraImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlargeableImage, {
					src: step.extraImage,
					alt: step.extraImageAlt ?? ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: step.extraImageCredit
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-8 flex flex-wrap gap-2",
				children: steps.map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => go(i),
					className: cn("rounded-sm px-3 py-2 text-left text-xs font-medium tracking-wide uppercase", i === index ? "bg-accent text-accent-fg" : "text-muted shadow-border hover:text-fg"),
					"aria-current": i === index ? "step" : void 0,
					children: [
						String(i + 1).padStart(2, "0"),
						" — ",
						item.title
					]
				}) }, item.title))
			})
		]
	});
}
function VideoCard({ videoId, title, credit, summary, anchor }) {
	const href = `https://www.youtube.com/watch?v=${videoId}`;
	const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		id: anchor,
		className: "scroll-mt-24 overflow-hidden rounded-xl bg-surface shadow-border",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
			href,
			target: "_blank",
			rel: "noreferrer",
			className: "group relative block aspect-video bg-ink",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: thumb,
				alt: "",
				className: "h-full w-full object-cover opacity-90 transition-opacity duration-150 group-hover:opacity-100"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "absolute inset-0 flex items-center justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "flex size-14 items-center justify-center rounded-full bg-accent text-accent-fg shadow-border",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Play, { className: "size-6 fill-current" })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "sr-only",
					children: ["Watch on YouTube: ", title]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "p-5 sm:p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-xs font-medium tracking-widest text-muted uppercase",
					children: ["Watch · ", credit]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "mt-2 font-display text-2xl font-semibold tracking-wide",
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 leading-relaxed text-muted",
					children: summary
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href,
					target: "_blank",
					rel: "noreferrer",
					className: "mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-accent hover:text-fg",
					children: ["Watch on YouTube", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-4" })]
				})
			]
		})]
	});
}
function MinutePage() {
	const { slug } = Route$5.useParams();
	const minute = getMinute(slug);
	(0, import_react.useEffect)(() => {
		if (minute?.slug === "create-diabetic") window.location.replace("https://theosishealth.com/simulator/pft-inside/");
	}, [minute?.slug]);
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
		className: `mx-auto px-5 py-16 sm:px-8 lg:py-24 ${minute.slug === "create-diabetic" ? "max-w-6xl" : "max-w-3xl"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/minutes",
				className: "inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "All Medical Minutes"]
			}),
			minute.slug !== "create-diabetic" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 font-display text-3xl font-semibold text-accent",
					children: minute.group === "interactive" ? "Interactive physiology" : minute.n
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 font-display text-4xl font-semibold tracking-wide sm:text-5xl",
					children: minute.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-5 text-xl leading-relaxed text-fg",
					children: minute.lede
				}),
				minute.cardNote ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-[10px] leading-snug tracking-[0.18em] text-muted uppercase",
					children: minute.cardNote
				}) : null,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 space-y-5 text-lg leading-relaxed text-muted",
					children: minute.paragraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 36)))
				})
			] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "sr-only",
				children: minute.title
			}),
			minute.slug === "create-diabetic" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-lg text-muted",
					children: "The interactive is its own page so it can actually run."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "https://theosishealth.com/simulator/pft-inside/",
					className: "mt-6 inline-flex min-h-11 items-center rounded-sm bg-accent px-5 text-sm font-medium text-accent-fg",
					children: "Open Create a Diabetic"
				})]
			}) : null,
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
			minute.videoId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, {
					videoId: minute.videoId,
					title: minute.videoTitle ?? minute.title,
					credit: minute.videoCredit ?? "Watch",
					summary: minute.videoSummary ?? ""
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "mt-12 border-t border-border pt-6 text-sm text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "General education only, not medical advice. Reading this doesn't create a provider-patient relationship." })
			})
		]
	}) });
}
//#endregion
export { MinutePage as component };
