import { i as __toESM } from "./_runtime.mjs";
import { r as require_react } from "./_libs/@hookform/resolvers+[...].mjs";
import { _ as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { i as require_jsx_runtime } from "./_libs/@radix-ui/react-label+[...].mjs";
import { _ as ChevronLeft, b as ArrowRight, g as ChevronRight, x as ArrowLeft } from "./_libs/lucide-react.mjs";
import { A as peTone, M as proteinPercent, N as readingList, P as referenceVideos, S as hormoziRecipes, b as hacksIntro, d as fastFoodChains, f as fastFoodNotes, k as peRatio, l as creditKicker, m as getHack, o as Route$10, u as drinkSwaps, x as hormoziRecipeNotes, y as hacks } from "./_ssr/router-B-HKWIc8.mjs";
import { i as cn, r as SiteShell, t as Button } from "./_ssr/site-shell-ByYPgQOt.mjs";
import { t as Input } from "./_ssr/input-BxK92cCY.mjs";
import { t as EnlargeableImage } from "./_ssr/enlargeable-image-B_oMciuv.mjs";
import { t as NerdParagraph } from "./_ssr/nerd-paragraph-yTlgbarp.mjs";
import { n as VideoCard, t as NerdStepper } from "./_ssr/video-card-CXDUvIE6.mjs";
import { t as Label } from "./_ssr/label-CgLs1Oh8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_slug-DCTz5OW7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function sourceLabel(source) {
	if (source === "official") return "Their nutrition page";
	if (source === "built") return "Built from their ingredient numbers";
	return "Common tracker listing";
}
function peClass(tone) {
	if (tone === "best") return "bg-ok/20 text-ok";
	if (tone === "good") return "bg-ok/10 text-ok";
	if (tone === "mid") return "bg-warn/20 text-warn";
	return "bg-danger/20 text-danger";
}
function FastFoodStepper({ chains }) {
	const [index, setIndex] = (0, import_react.useState)(0);
	const last = chains.length - 1;
	const chain = chains[Math.min(index, last)];
	if (!chain) return null;
	function go(next) {
		setIndex(Math.max(0, Math.min(last, next)));
	}
	const items = [...chain.items].sort((a, b) => peRatio(b) - peRatio(a));
	const n = String(index + 1).padStart(2, "0");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-end justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-display text-sm font-semibold tracking-widest text-accent uppercase",
					children: [
						n,
						" of ",
						String(chains.length).padStart(2, "0")
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-1 font-display text-3xl font-semibold tracking-wide sm:text-4xl",
					children: chain.place
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-11 items-center justify-center rounded-sm text-fg shadow-border hover:bg-fg/8 disabled:opacity-30",
						"aria-label": "Previous restaurant",
						disabled: index === 0,
						onClick: () => go(index - 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "flex size-11 items-center justify-center rounded-sm text-fg shadow-border hover:bg-fg/8 disabled:opacity-30",
						"aria-label": "Next restaurant",
						disabled: index === last,
						onClick: () => go(index + 1),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-5" })
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-3xl leading-relaxed text-muted",
				children: chain.blurb
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[36rem] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs font-medium tracking-widest text-muted uppercase",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 font-medium",
								children: "Order"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 font-medium",
								children: "Cal"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 font-medium",
								children: "P / C / F"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 pr-3 font-medium",
								children: "% protein"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2 font-medium",
								children: "P:E"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: items.map((item) => {
						const pe = peRatio(item);
						const tone = peTone(pe);
						const pct = Math.round(proteinPercent(item));
						const peLabel = Number.isFinite(pe) ? pe.toFixed(1) : "∞";
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-t border-border align-top",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3 pr-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-fg",
											children: item.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-muted",
											children: item.how
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-1 text-xs tracking-wide text-muted uppercase",
											children: sourceLabel(item.source)
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3 pr-3 tabular-nums text-fg",
									children: item.calories
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3 pr-3 tabular-nums text-muted",
									children: [
										item.protein,
										" / ",
										item.carbs,
										" / ",
										item.fat
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "py-3 pr-3 tabular-nums text-fg",
									children: [pct, "%"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: cn("inline-block rounded-md px-2.5 py-1 font-medium tabular-nums", peClass(tone)),
										children: peLabel
									})
								})
							]
						}, item.name);
					}) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "mt-8 flex flex-wrap gap-2",
				children: chains.map((entry, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => go(i),
					className: cn("rounded-sm px-3 py-2 text-left text-xs font-medium tracking-wide uppercase", i === index ? "bg-accent text-accent-fg" : "text-muted shadow-border hover:text-fg"),
					"aria-current": i === index ? "step" : void 0,
					children: [
						String(i + 1).padStart(2, "0"),
						" — ",
						entry.place
					]
				}) }, entry.place))
			})
		]
	});
}
function ProteinLabelTool() {
	const [calories, setCalories] = (0, import_react.useState)("");
	const [protein, setProtein] = (0, import_react.useState)("");
	const result = (0, import_react.useMemo)(() => {
		const cal = Number(calories);
		const pro = Number(protein);
		if (!Number.isFinite(cal) || !Number.isFinite(pro) || calories === "" || protein === "") return null;
		const timesTen = pro * 10;
		const pct = cal > 0 ? pro * 4 * 100 / cal : 0;
		return {
			cal,
			pro,
			timesTen,
			pct,
			band: timesTen >= cal && cal >= 0 && pro >= 0 || pct >= 40 ? "ideal" : pct >= 30 ? "fine" : pct >= 25 ? "mid" : pct >= 20 ? "c" : pct >= 10 ? "soap" : "balloon"
		};
	}, [calories, protein]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface p-5 shadow-border sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-muted uppercase",
				children: "Try a label"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-2 font-display text-3xl font-semibold tracking-wide",
				children: "Protein × 10 vs calories"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-muted",
				children: "Pull two numbers off the panel. Hitting × 10 (40% protein) is the ideal. 30% or more is still fine."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-5 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "hack-calories",
					children: "Calories per serving"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "hack-calories",
					inputMode: "decimal",
					value: calories,
					onChange: (e) => setCalories(e.target.value)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "hack-protein",
					children: "Protein grams per serving"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "hack-protein",
					inputMode: "decimal",
					value: protein,
					onChange: (e) => setProtein(e.target.value)
				})] })]
			}),
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: cn("mt-6 rounded-md px-5 py-5", {
					ideal: "bg-ok/15 text-fg",
					fine: "bg-accent/15 text-fg",
					mid: "bg-warn/15 text-fg",
					c: "bg-warn/20 text-fg",
					soap: "bg-danger/15 text-fg",
					balloon: "bg-danger/25 text-fg"
				}[result.band]),
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-2xl font-semibold tracking-wide",
						children: [
							"Protein × 10 = ",
							result.timesTen,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "mx-3 text-muted",
								children: result.band === "ideal" ? "≥" : result.band === "fine" ? "close to" : "<"
							}),
							result.cal,
							" calories"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-lg",
						children: {
							ideal: "Ideal. At least 40% of calories from protein.",
							fine: "Good. 30% or more — still a solid pick.",
							mid: "Fair. Not a protein food, but not junk.",
							c: "Mediocre. More fuel than building material.",
							soap: "Poor. The calories are doing most of the work.",
							balloon: "Very poor. Almost no protein for the energy."
						}[result.band]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted",
						children: [
							"Roughly ",
							Math.round(result.pct),
							"% of calories from protein (protein grams × 4 ÷ calories)."
						]
					})
				]
			}) : null
		]
	});
}
var goals = [
	{
		id: "extreme-loss",
		label: "Extreme weight loss",
		multiplier: 8,
		band: "7–9",
		hint: "Bottom of the spectrum. Body weight × 7, 8, or 9. Using 8 here. If it drops too fast, step up."
	},
	{
		id: "moderate-loss",
		label: "Moderate weight loss",
		multiplier: 10,
		band: "10–12",
		hint: "The 10× walkthrough in the video. 10, 11, or 12. Using 10 because the math is clean. Lose too fast? Bump to 11 or 12."
	},
	{
		id: "maintenance",
		label: "Maintenance",
		multiplier: 14,
		band: "13–15",
		hint: "Hold the line. Body weight × 13, 14, or 15. Using 14, the middle of the band."
	},
	{
		id: "moderate-gain",
		label: "Moderate weight gain",
		multiplier: 17,
		band: "16–18",
		hint: "A modest surplus. Body weight × 16, 17, or 18. Using 17."
	},
	{
		id: "extreme-gain",
		label: "Extreme weight gain",
		multiplier: 20,
		band: "19–21",
		hint: "Top of the spectrum. Body weight × 19, 20, or 21. Using 20."
	}
];
function StartCalculator() {
	const [pounds, setPounds] = (0, import_react.useState)("180");
	const [goalId, setGoalId] = (0, import_react.useState)("moderate-loss");
	const goal = goals.find((g) => g.id === goalId) ?? goals[1];
	const result = (0, import_react.useMemo)(() => {
		const n = Number(pounds);
		if (!Number.isFinite(n) || n <= 0 || pounds === "") return null;
		const protein = Math.round(n);
		const calories = Math.round(n * goal.multiplier);
		const proteinCals = protein * 4;
		return {
			protein,
			calories,
			proteinCals,
			remaining: Math.max(0, calories - proteinCals)
		};
	}, [pounds, goal.multiplier]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl bg-surface p-5 shadow-border sm:p-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-widest text-muted uppercase",
				children: "Your numbers"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-2 font-display text-3xl font-semibold tracking-wide",
				children: "Goal → calories → protein"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-muted",
				children: "Same math as the video: body weight × a number from 7 to 21, then 1 g of protein per pound. Every three steps on that scale is a different goal. Leftover calories are ordinary food."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 max-w-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "start-pounds",
					children: "Body weight (pounds)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					id: "start-pounds",
					inputMode: "decimal",
					value: pounds,
					onChange: (e) => setPounds(e.target.value)
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-medium tracking-widest text-muted uppercase",
						children: "The goal"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex flex-wrap gap-2",
						children: goals.map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: g.id === goalId ? "default" : "outline",
							onClick: () => setGoalId(g.id),
							children: g.label
						}, g.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm text-muted",
						children: goal.hint
					})
				]
			}),
			result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
				className: "mt-8 grid gap-4 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Calories / day",
						value: String(result.calories),
						note: `${goal.multiplier} × body weight (× ${goal.band} in the video)`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Protein",
						value: `${result.protein} g`,
						note: "1 g per pound"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Leftover after protein",
						value: `${result.remaining} cal`,
						note: `${result.proteinCals} cal from protein at 4 cal/g. Real meat brings some fat with it.`
					})
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-muted",
				children: "Enter a weight to see the targets."
			})
		]
	});
}
function Stat({ label, value, note }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("rounded-md bg-ink px-4 py-4 text-ink-fg"),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
				className: "text-xs font-medium tracking-widest text-ink-muted uppercase",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
				className: "mt-2 font-display text-3xl font-semibold tracking-wide",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-ink-muted",
				children: note
			})
		]
	});
}
function HackPage() {
	const { slug } = Route$10.useParams();
	const hack = getHack(slug);
	const index = hacks.findIndex((h) => h.slug === slug);
	const prev = index > 0 ? hacks[index - 1] : void 0;
	const next = index >= 0 && index < hacks.length - 1 ? hacks[index + 1] : void 0;
	if (!hack) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-5 py-24 sm:px-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl font-semibold tracking-wide",
				children: "That hack is not here."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-lg text-muted",
				children: "It may have moved. The full list is still short on purpose."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/hacks",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {}), "All Holwey’s Handy Health Hacks"]
				})
			})
		]
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SiteShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/hacks",
				className: "inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), "All Holwey’s Handy Health Hacks"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 font-display text-3xl font-semibold text-accent",
				children: hack.n
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-4xl font-semibold tracking-wide sm:text-5xl",
				children: hack.title
			}),
			hack.stolenFrom ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-xs font-medium tracking-widest text-accent uppercase",
				children: creditKicker(hack.stolenFrom, hack.jokeSteal)
			}) : null,
			hack.lede && hack.slug !== "exercise" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-5 text-xl leading-relaxed text-fg",
				children: hack.lede
			}) : null,
			hack.slug === "where-to-start" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, {
					videoId: "fxyhIXZ6Yog",
					title: "The Alex Hormozi Diet (REVEALED)",
					credit: "Alex Hormozi",
					summary: "Five minutes. Calories from body weight and your goal, a gram of protein per pound, leftover calories spent however you want.",
					anchor: "hormozi"
				})
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 space-y-5 text-lg leading-relaxed text-muted",
				children: hack.slug === "dont-drink-calories" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					hack.paragraphs.slice(0, 2).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NerdParagraph, { text: p }, p.slice(0, 36))),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FakeSugarLink, {}),
					hack.paragraphs.slice(2).map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NerdParagraph, { text: p }, p.slice(0, 36)))
				] }) : hack.paragraphs.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NerdParagraph, { text: p }, p.slice(0, 36)))
			}),
			hack.slug === "protein-per-pound" || hack.slug === "protein-label" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhyProteinLink, {}) : null,
			hack.slug === "protein-label" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhyEnergyLink, {}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HackExtras, { slug: hack.slug }),
			hack.slug === "where-to-start" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WhyProteinLink, {}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-12 text-sm text-muted",
				children: hacksIntro.disclaimer
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "mt-12 flex flex-col gap-3 border-t border-border pt-8 sm:flex-row sm:justify-between",
				children: [prev ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/hacks/$slug",
					params: { slug: prev.slug },
					className: "inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }),
						prev.n,
						" ",
						prev.title
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {}), next ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/hacks/$slug",
					params: { slug: next.slug },
					className: "inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-fg sm:ml-auto",
					children: [
						next.n,
						" ",
						next.title,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
					]
				}) : null]
			})
		]
	}) });
}
function HackExtras({ slug }) {
	if (slug === "where-to-start") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StartCalculator, {})
	});
	if (slug === "protein-per-pound") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10 space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, {
			videoId: "-BcGPN2nXs0",
			title: "How Much Protein Is Too Much for Your Kidneys?",
			credit: "Dr. Layne Norton",
			summary: "Human trials: higher protein does not harm healthy kidneys. The 1980s myth does not match the data.",
			anchor: "protein-kidneys"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlargeableImage, {
			src: "/images/protein-kidney.png",
			alt: "Infographic: high protein does not equal kidney damage when your kidneys are healthy. More filtration is adaptation, not injury. Established CKD is the exception — personalize protein with a clinician."
		}) })]
	});
	if (slug === "dont-drink-calories") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-10 space-y-8",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-hidden rounded-xl shadow-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-left text-sm sm:text-base",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
					className: "bg-surface text-xs font-medium tracking-widest text-muted uppercase",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-5 py-3 font-medium",
						children: "Instead of"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "px-5 py-3 font-medium",
						children: "Do this"
					})] })
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: drinkSwaps.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-t border-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-5 py-4 text-muted",
						children: row.from
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "px-5 py-4 text-fg",
						children: row.to
					})]
				}, row.from)) })]
			})
		})
	});
	if (slug === "protein-label") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10 space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlargeableImage, {
			src: "/images/naiman-protein-40.png",
			alt: "The add-a-zero protein test: multiply protein grams by 10 and compare to calories. If it meets or beats calories, the food is at least 40% protein."
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProteinLabelTool, {})]
	});
	if (slug === "fast-food") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10 space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md bg-ok/20 px-3 py-1.5 text-ok",
						children: "P:E ≥ 2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md bg-ok/10 px-3 py-1.5 text-ok",
						children: "P:E ≥ 1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md bg-warn/20 px-3 py-1.5 text-warn",
						children: "P:E ≥ 0.5"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "rounded-md bg-danger/20 px-3 py-1.5 text-danger",
						children: "P:E < 0.5"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "max-w-3xl text-lg leading-relaxed text-muted",
				children: [
					"P:E is protein grams divided by carb grams plus fat grams. Green is more parts than fuel. Red is the opposite.",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/hacks/nerd-out/$topic",
						params: { topic: "energy" },
						className: "font-medium text-accent hover:text-fg",
						children: "What do we mean by “energy”?"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FastFoodStepper, { chains: fastFoodChains }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-ink p-6 text-ink-fg shadow-border sm:p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold tracking-wide",
					children: "Fine print"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3 text-ink-muted",
					children: fastFoodNotes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: "mt-2 size-1 shrink-0 rounded-full bg-accent"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: note })]
					}, note))
				})]
			})
		]
	});
	if (slug === "exercise") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NerdStepper, {
		topicId: "exercise",
		steps: [
			{
				title: "Resistance",
				image: "/images/med-resistance.png",
				imageAlt: "Infographic: minimum effective dose of resistance training. The 20% that delivers most of the results: two times a week, hard sets, compound lifts, full range, progress over time.",
				imageCredit: "The 20% of lifting most of us will actually do. Educational only."
			},
			{
				title: "Cardio",
				image: "/images/med-cardio.png",
				imageAlt: "Infographic: the minimum effective dose of cardio. Three lanes — HIIT, steady state, and walking. 80% of the return, 20% of the complexity. The best dose is the smallest one you will repeat.",
				imageCredit: "The smallest dose you will actually repeat. Educational only."
			},
			{
				title: "The workout",
				image: "/images/muscle-growth.png",
				imageAlt: "Infographic: muscle grows when you challenge it with resistance training, eat enough protein, and recover. A simple push, pull, and legs workout using one set to failure plus rest-pause.",
				imageCredit: "One set to failure. Push, pull, legs. Educational only."
			},
			{
				title: "Sleep",
				paragraphs: ["Lift to create the signal. Eat to supply the material. Sleep to protect the result. You do not build muscle from sleep alone — but poor sleep can weaken the response to good training."],
				image: "/images/med-sleep.png",
				imageAlt: "Infographic: sleep builds what training starts. The overnight rebuild shift for muscle growth and recovery. Training, protein, and sleep are the three gears. Poor sleep can blunt adaptations and shift a deficit toward muscle loss.",
				imageCredit: "Sleep is part of the program. Educational only. AASM · Lamon et al. 2021 · Saner et al. 2020 · Nedeltcheva et al. 2010."
			}
		]
	});
	if (slug === "staples") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-10 space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnlargeableImage, {
				src: "/images/staples-poster.png",
				alt: "Staples of good foods: protein you can grab, drinks that do not count, produce, PB2, sweet-tooth options, and low-carb bread hacks."
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-3xl font-semibold tracking-wide sm:text-4xl",
				children: "Holwey stolen Hormozi High Protein Hacks"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-3xl text-lg leading-relaxed text-muted",
				children: "Yup...I once again stole from business bro. He has hacked his health heavily...you can too! See below..."
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, {
				videoId: "hGX_z5rXRlU",
				title: "The Alex Hormozi Cookbook [REVEALED]",
				credit: "Alex Hormozi",
				summary: "Zero-prep high-protein assemblies. The recipes below are the grocery-aisle version of that video.",
				anchor: "hormozi-cookbook"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-4",
				children: hormoziRecipes.map((recipe, i) => {
					const pct = Math.round(proteinPercent(recipe));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "rounded-xl bg-surface p-6 shadow-border sm:p-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl font-semibold text-accent",
								children: String(i + 1).padStart(2, "0")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-2 font-display text-3xl font-semibold tracking-wide",
								children: recipe.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 leading-relaxed text-muted",
								children: recipe.how
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 space-y-2 text-fg",
								children: recipe.ingredients.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										"aria-hidden": "true",
										className: "mt-2 size-1 shrink-0 rounded-full bg-accent"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item })]
								}, item))
							}),
							recipe.swap ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 leading-relaxed text-muted",
								children: recipe.swap
							}) : null,
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
								className: "mt-5 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md bg-ink px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs tracking-widest text-ink-muted uppercase",
											children: "Calories"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
											className: "mt-1 font-medium tabular-nums text-ink-fg",
											children: recipe.calories
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md bg-ink px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs tracking-widest text-ink-muted uppercase",
											children: "Protein"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
											className: "mt-1 font-medium tabular-nums text-ink-fg",
											children: [recipe.protein, " g"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md bg-ink px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs tracking-widest text-ink-muted uppercase",
											children: "Carbs / Fat"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
											className: "mt-1 font-medium tabular-nums text-ink-fg",
											children: [
												recipe.carbs,
												" g / ",
												recipe.fat,
												" g"
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-md bg-ink px-3 py-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
											className: "text-xs tracking-widest text-ink-muted uppercase",
											children: "% protein"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
											className: "mt-1 font-medium tabular-nums text-ink-fg",
											children: [pct, "%"]
										})]
									})
								]
							})
						]
					}, recipe.name);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl bg-ink p-6 text-ink-fg shadow-border sm:p-8",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold tracking-wide",
					children: "Fine print"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-4 space-y-3 text-ink-muted",
					children: hormoziRecipeNotes.map((note) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							"aria-hidden": "true",
							className: "mt-2 size-1 shrink-0 rounded-full bg-accent"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: note })]
					}, note))
				})]
			})
		]
	});
	if (slug === "nerd-out") return null;
	if (slug === "helpful-videos") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-10 space-y-8",
		children: referenceVideos.map((video) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VideoCard, {
			videoId: video.videoId,
			title: video.title,
			credit: video.credit,
			summary: video.summary,
			anchor: video.anchor
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
			className: "mt-3 text-sm text-muted",
			children: [
				"Also on",
				" ",
				video.usedOn.slug === "nerd-out" && "hash" in video.usedOn && video.usedOn.hash ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/hacks/nerd-out/$topic",
					params: { topic: video.usedOn.hash },
					className: "font-medium text-accent hover:text-fg",
					children: video.usedOn.label
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/hacks/$slug",
					params: { slug: video.usedOn.slug },
					hash: "hash" in video.usedOn ? video.usedOn.hash : void 0,
					className: "font-medium text-accent hover:text-fg",
					children: video.usedOn.label
				})
			]
		})] }, video.videoId))
	});
	if (slug === "reading-list") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-10 space-y-4",
		children: readingList.map((book, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "rounded-xl bg-surface p-6 shadow-border sm:p-8",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-2xl font-semibold text-accent",
					children: String(i + 1).padStart(2, "0")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-2 font-display text-3xl font-semibold tracking-wide",
					children: book.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm font-medium tracking-wide text-muted uppercase",
					children: book.authors
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 leading-relaxed text-muted",
					children: book.why
				})
			]
		}, book.title))
	});
	return null;
}
function WhyProteinLink() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-8 text-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/hacks/nerd-out/$topic",
			params: { topic: "protein" },
			className: "font-medium text-accent hover:text-fg",
			children: "Why do we care about protein?"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: " It is not a gym-bro thing."
		})]
	});
}
function WhyEnergyLink() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "mt-4 text-lg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/hacks/nerd-out/$topic",
			params: { topic: "energy" },
			className: "font-medium text-accent hover:text-fg",
			children: "What do we mean by “energy”?"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-muted",
			children: " Parts, fuel, and what the P:E numbers actually are."
		})]
	});
}
function FakeSugarLink() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/hacks/$slug",
		params: { slug: "helpful-videos" },
		hash: "fake-sugar",
		className: "font-medium text-accent hover:text-fg",
		children: "But it’s fake sugar — bad?"
	}) });
}
//#endregion
export { HackPage as component };
