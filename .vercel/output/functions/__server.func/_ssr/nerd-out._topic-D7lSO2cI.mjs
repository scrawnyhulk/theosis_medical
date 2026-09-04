import { i as __toESM } from "../_runtime.mjs";
import { C as nerdTopics, d as getNerdTopic, h as hacksIntro, r as creditKicker } from "./minutes-PhFWXEos.mjs";
import { r as require_react } from "../_libs/@hookform/resolvers+[...].mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "../_libs/@radix-ui/react-label+[...].mjs";
import { C as ArrowLeft, S as ArrowRight } from "../_libs/lucide-react.mjs";
import { n as Route } from "./router-BnbxP_CZ.mjs";
import { r as SiteShell, t as Button } from "./site-shell-DHj3ZVbe.mjs";
import { t as Input } from "./input-BQ6RNFRg.mjs";
import { t as NerdParagraph } from "./nerd-paragraph-yTlgbarp.mjs";
import { n as NerdStepper, t as EnlargeableImage } from "./nerd-stepper-DhavoUxO.mjs";
import { t as Label } from "./label-B0lYPMwR.mjs";
import { t as VideoCard } from "./video-card-DgPnMgod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/nerd-out._topic-D7lSO2cI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var CAL_PER_LB = 31;
function parse(value) {
	const n = Number(value);
	if (value.trim() === "" || !Number.isFinite(n) || n <= 0) return null;
	return n;
}
function format(n) {
	return String(Math.round(n * 10) / 10);
}
function FatBurnCalculator() {
	const [weight, setWeight] = (0, import_react.useState)("");
	const [bf, setBf] = (0, import_react.useState)("");
	const [fat, setFat] = (0, import_react.useState)("");
	function onWeight(value) {
		setWeight(value);
		const w = parse(value);
		const b = parse(bf);
		const f = parse(fat);
		if (w && b && b < 100) setFat(format(w * b / 100));
		else if (w && f && f < w) setBf(format(f / w * 100));
	}
	function onBf(value) {
		setBf(value);
		const b = parse(value);
		const w = parse(weight);
		const f = parse(fat);
		if (!b || b >= 100) return;
		if (w) setFat(format(w * b / 100));
		else if (f) setWeight(format(f / (b / 100)));
	}
	function onFat(value) {
		setFat(value);
		const f = parse(value);
		const w = parse(weight);
		const b = parse(bf);
		if (!f) return;
		if (w && f < w) setBf(format(f / w * 100));
		else if (b && b < 100) setWeight(format(f / (b / 100)));
	}
	const result = (0, import_react.useMemo)(() => {
		const w = parse(weight);
		const b = parse(bf);
		const fatLbs = parse(fat) ?? (w && b && b < 100 ? w * b / 100 : null);
		if (!fatLbs) return null;
		if (w && fatLbs >= w) return {
			ok: false,
			error: "Pounds of fat has to be less than body weight."
		};
		if (b && b >= 100) return {
			ok: false,
			error: "Body-fat percent has to be under 100."
		};
		return {
			ok: true,
			fatLbs,
			calories: Math.round(fatLbs * CAL_PER_LB)
		};
	}, [
		weight,
		bf,
		fat
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10 rounded-xl bg-surface p-5 shadow-border sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-muted uppercase",
				children: "Your numbers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-2 font-display text-3xl font-semibold tracking-wide",
				children: "Fat-burn ceiling"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-muted",
				children: "Fill in any two. The third fills itself. Then you get the ~31 calories per day per pound of fat ceiling — a rule of thumb, not a lab result."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "fat-weight",
						children: "Body weight (lb)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "fat-weight",
						inputMode: "decimal",
						value: weight,
						onChange: (e) => onWeight(e.target.value),
						placeholder: "180"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "fat-bf",
						children: "Body fat (%)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "fat-bf",
						inputMode: "decimal",
						value: bf,
						onChange: (e) => onBf(e.target.value),
						placeholder: "25"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "fat-lbs",
						children: "Fat on the body (lb)"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "fat-lbs",
						inputMode: "decimal",
						value: fat,
						onChange: (e) => onFat(e.target.value),
						placeholder: "45"
					})] })
				]
			}),
			result && !result.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-danger",
				children: result.error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-lg bg-ink p-5 text-ink-fg sm:p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-widest text-ink-muted uppercase",
						children: "The math"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 font-display text-2xl font-semibold tracking-wide sm:text-4xl",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums",
								children: [result?.ok ? format(result.fatLbs) : "—", " lb fat"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mx-2 text-accent",
								children: "×"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: "31"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mx-2 text-ink-muted",
								children: "="
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "tabular-nums",
								children: result?.ok ? `${result.calories.toLocaleString()} cal/day` : "—"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-ink-muted",
						children: "31 calories per day for every pound of fat on the body. That is the ceiling."
					}),
					result?.ok ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-4 text-lg font-medium leading-relaxed text-ink-fg",
						children: [
							"Do not run a deficit larger than ",
							result.calories.toLocaleString(),
							" calories per day. Past that, fat may not cover the gap — and muscle starts paying."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-ink-muted",
						children: "As you get leaner, this number falls. Recalculate. Keep protein high and lift."
					})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-ink-muted",
						children: "Enter any two numbers above and this fills in."
					})
				]
			})
		]
	});
}
function NerdTopicPage() {
	const { topic: topicId } = Route.useParams();
	const topic = getNerdTopic(topicId);
	const index = nerdTopics.findIndex((item) => item.id === topicId);
	const n = index >= 0 ? String(index + 1).padStart(2, "0") : void 0;
	const prev = index > 0 ? nerdTopics[index - 1] : void 0;
	const next = index >= 0 && index < nerdTopics.length - 1 ? nerdTopics[index + 1] : void 0;
	if (!topic) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-5 py-24 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl font-semibold tracking-wide",
				children: "That topic is not here."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-lg text-muted",
				children: "Pick another from the list."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/hacks/nerd-out",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {}), "All Nutritional Nerd Out topics"]
				})
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/hacks/nerd-out",
				className: "inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "All Nutritional Nerd Out topics"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 font-display text-3xl font-semibold text-accent",
				children: n
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl font-semibold tracking-wide sm:text-5xl",
				children: topic.title
			}),
			"stolenFrom" in topic && topic.stolenFrom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs font-medium tracking-widest text-accent uppercase",
				children: creditKicker(topic.stolenFrom, "jokeSteal" in topic ? Boolean(topic.jokeSteal) : false)
			}) : null,
			topic.lede ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 space-y-5 text-xl leading-relaxed text-fg",
				children: topic.lede.split("\n\n").map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, p.slice(0, 32)))
			}) : null,
			"steps" in topic && Array.isArray(topic.steps) && topic.steps.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [topic.paragraphs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-5 text-lg leading-relaxed text-muted",
				children: topic.paragraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NerdParagraph, { text: p }, p.slice(0, 36)))
			}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NerdStepper, {
				steps: topic.steps,
				topicId: topic.id
			})] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				"tldrImage" in topic && topic.tldrImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: "mt-8",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 font-display text-2xl font-semibold tracking-wide",
							children: "TL;DR version"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlargeableImage, {
							src: topic.tldrImage,
							alt: topic.tldrImageAlt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "mt-3 text-sm leading-relaxed text-muted",
							children: topic.tldrImageCredit
						})
					]
				}) : null,
				topic.paragraphs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 space-y-5 text-lg leading-relaxed text-muted",
					children: topic.paragraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NerdParagraph, { text: p }, p.slice(0, 36)))
				}) : null,
				"image" in topic && topic.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
					className: topic.paragraphs.length > 0 || "tldrImage" in topic && topic.tldrImage ? "mt-10" : "mt-8",
					children: [
						"tldrImage" in topic && topic.tldrImage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 font-display text-2xl font-semibold tracking-wide",
							children: "The full nerdy nerd version for nerds like me"
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlargeableImage, {
							src: topic.image,
							alt: topic.imageAlt
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
							className: "mt-3 text-sm leading-relaxed text-muted",
							children: topic.imageCredit
						})
					]
				}) : null
			] }),
			"extraParagraphs" in topic && Array.isArray(topic.extraParagraphs) && topic.extraParagraphs.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 space-y-5 text-lg leading-relaxed text-muted",
				children: topic.extraParagraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NerdParagraph, { text: p }, p.slice(0, 36)))
			}) : null,
			"extraImage" in topic && typeof topic.extraImage === "string" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "mt-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlargeableImage, {
					src: topic.extraImage,
					alt: "extraImageAlt" in topic ? String(topic.extraImageAlt) : ""
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
					className: "mt-3 text-sm leading-relaxed text-muted",
					children: "extraImageCredit" in topic ? String(topic.extraImageCredit) : ""
				})]
			}) : null,
			"extraImages" in topic && Array.isArray(topic.extraImages) ? topic.extraImages.map((img) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "mt-10",
				children: [
					"title" in img && img.title ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-3 font-display text-2xl font-semibold tracking-wide",
						children: img.title
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlargeableImage, {
						src: img.src,
						alt: img.alt
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figcaption", {
						className: "mt-3 text-sm leading-relaxed text-muted",
						children: img.credit
					})
				]
			}, img.src)) : null,
			topic.id === "fat-burn-limit" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FatBurnCalculator, {}) : null,
			"seeAlso" in topic && topic.seeAlso ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-8 text-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/hacks/nerd-out/$topic",
					params: { topic: topic.seeAlso.hash },
					className: "font-medium text-accent hover:text-fg",
					children: topic.seeAlso.label
				}), topic.seeAlso.note ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-muted",
					children: [" ", topic.seeAlso.note]
				}) : null]
			}) : null,
			"videoId" in topic && topic.videoId ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, {
					videoId: topic.videoId,
					title: topic.videoTitle,
					credit: topic.videoCredit,
					summary: topic.videoSummary
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-12 text-sm text-muted",
				children: hacksIntro.disclaimer
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mt-12 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between",
				children: [prev ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/hacks/nerd-out/$topic",
					params: { topic: prev.id },
					className: "inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), prev.title]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/hacks/nerd-out/$topic",
					params: { topic: next.id },
					className: "inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg sm:ml-auto",
					children: [next.title, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
				}) : null]
			})
		]
	}) });
}
//#endregion
export { NerdTopicPage as component };
