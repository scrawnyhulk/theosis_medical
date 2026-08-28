export const visitKinds = ["lifestyle", "acute"] as const;
export type VisitKind = (typeof visitKinds)[number];

export const licensedStates = [
  { code: "IL", name: "Illinois" },
  { code: "WI", name: "Wisconsin" },
  { code: "MI", name: "Michigan" },
  { code: "IN", name: "Indiana" },
] as const;

export const visitMeta: Record<
  VisitKind,
  { n: string; title: string; time: string; lede: string; body: string }
> = {
  lifestyle: {
    n: "01",
    title: "Lifestyle consult",
    time: "30–45 min",
    lede: "",
    body: "Evidence-based consult drawing on nutrition and emergency medicine. Minimum effective dose — the 20% that does 80% of the work. Not a 12-week program.",
  },
  acute: {
    n: "02",
    title: "Acute video visit",
    time: "15 min",
    lede: "Sore throat, rash, sinus, the thing that needs a look and maybe not an ED.",
    body: "Short virtual evaluation for appropriate acute concerns. If this belongs in an emergency department, the next screen will say so.",
  },
};

export const lifestyleGoals = [
  "Get leaner",
  "Build muscle",
  "Improve cholesterol",
  "Type 2 diabetes / blood sugar",
  "Overall health",
  "How to be healthy in a busy life",
  "Labs + a plan",
  "Something else",
] as const;

export const acuteConcerns = [
  "Sore throat",
  "Sinus / cold / cough",
  "Rash or skin",
  "Mild aches or pains",
  "Urinary symptoms",
  "Pink eye / ear",
  "Something else that is not an emergency",
] as const;

export const redFlags = [
  "Chest pain, pressure, or pain spreading to the jaw, neck, or arm",
  "Trouble breathing, lips or face turning blue",
  "Stroke signs — face droop, arm weakness, speech that is off",
  "Severe allergic reaction, swelling of the mouth or throat",
  "Uncontrolled bleeding, new seizure, or fainting you cannot explain",
  "Thoughts of suicide or of harming yourself or someone else",
] as const;

export const lifestyleSlots = [
  { id: "t1", when: "Tue · 4:30 p.m.", note: "After clinic" },
  { id: "t2", when: "Wed · 7:00 a.m.", note: "Before a shift" },
  { id: "t3", when: "Thu · 6:00 p.m.", note: "Evening" },
  { id: "t4", when: "Sat · 9:00 a.m.", note: "Weekend" },
] as const;

export function isVisitKind(value: string): value is VisitKind {
  return value === "lifestyle" || value === "acute";
}

export type DemoChart = {
  kind: VisitKind;
  name: string;
  state: string;
  reason: string;
  notes: string;
  allergies: string;
  meds: string;
  pmh: string;
  surgeries: string;
  slot: string;
  at: string;
};

const CHART_KEY = "theosis-demo-chart";

export function saveDemoChart(chart: DemoChart) {
  try {
    sessionStorage.setItem(CHART_KEY, JSON.stringify(chart));
  } catch {
    /* playground */
  }
}

export function readDemoChart(): DemoChart | null {
  try {
    const raw = sessionStorage.getItem(CHART_KEY);
    return raw ? (JSON.parse(raw) as DemoChart) : null;
  } catch {
    return null;
  }
}

export const sampleCharts: DemoChart[] = [
  {
    kind: "lifestyle",
    name: "Jordan Hale",
    state: "IL",
    reason: "Improve cholesterol",
    notes: "Wants a plan that survives a 12-hour shift. No chest pain.",
    allergies: "NKDA",
    meds: "Atorvastatin 20 mg nightly",
    pmh: "Hyperlipidemia. No CAD.",
    surgeries: "None",
    slot: "Tue · 4:30 p.m. · After clinic",
    at: "demo",
  },
  {
    kind: "acute",
    name: "Sam Ortiz",
    state: "WI",
    reason: "Sore throat",
    notes: "Three days. No drooling, no stridor, can drink.",
    allergies: "Penicillin — rash",
    meds: "None",
    pmh: "Otherwise healthy",
    surgeries: "Tonsils still in",
    slot: "Next available · today 4:20 p.m.",
    at: "demo",
  },
];

