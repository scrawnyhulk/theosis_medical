export const visitKinds = ["lifestyle", "acute"] as const;
export type VisitKind = (typeof visitKinds)[number];

export const sessionPrice = 150;
export const sessionMinutes = 45;

export const visitMeta: Record<
  VisitKind,
  { n: string; title: string; time: string; lede: string; body: string }
> = {
  lifestyle: {
    n: "01",
    title: "Lifestyle counseling",
    time: "45 min · $150 cash",
    lede: "Coaching, not a clinic. Habits, protein, walking, the 20% that actually fits a busy life.",
    body: "A cash-pay video session for lifestyle counseling: food environment, protein, training you will actually do, hotel and shift defaults. Education and accountability — not a medical visit, not labs, not a prescription.",
  },
  acute: {
    n: "02",
    title: "Acute video visit",
    time: "15 min",
    lede: "Not in this playground.",
    body: "Acute medical video visits are a different legal structure. This demo is lifestyle counseling only.",
  },
};

export const lifestyleGoals = [
  "Get leaner",
  "Get stronger",
  "Eat in a way that survives a 12-hour shift",
  "Protein, walking, the 80/20",
  "Hotel / locums / travel defaults",
  "Something else",
] as const;

export const coachingAgreement = [
  {
    id: "not-medical",
    label:
      "This is lifestyle counseling / coaching. It is not a medical visit, not a consult, not a diagnosis, not treatment, and not a lab review.",
  },
  {
    id: "not-patient",
    label:
      "I am not becoming Nick’s patient. He is not my clinician for this session, and this does not create a medical relationship.",
  },
  {
    id: "own-clinician",
    label:
      "This does not replace my own doctor, PA, or other clinician. I will not ask Nick to start, stop, or change a medication, or to interpret my labs.",
  },
  {
    id: "emergency",
    label:
      "If I have an emergency, new concerning symptoms, or a medical question, I will contact my own clinician or call 911 / go to the emergency department — not this session.",
  },
  {
    id: "cash",
    label: "I understand this is cash-pay. No insurance will be billed. No superbill for medical care.",
  },
  {
    id: "scope",
    label:
      "If the conversation turns medical, Nick will stop and send me back to my own clinician. That is a feature, not a failure.",
  },
] as const;

export const lifestyleSlots = [
  { id: "t1", when: "Tue · 4:30 p.m.", note: "After clinic" },
  { id: "t2", when: "Wed · 7:00 a.m.", note: "Before a shift" },
  { id: "t3", when: "Thu · 6:00 p.m.", note: "Evening" },
  { id: "t4", when: "Sat · 9:00 a.m.", note: "Weekend" },
] as const;

export const redFlags = [] as const;

export function isVisitKind(value: string): value is VisitKind {
  return value === "lifestyle" || value === "acute";
}

export type DemoChart = {
  kind: VisitKind;
  name: string;
  email: string;
  state: string;
  reason: string;
  notes: string;
  slot: string;
  at: string;
  paid: boolean;
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
    email: "jordan@example.com",
    state: "",
    reason: "Eat in a way that survives a 12-hour shift",
    notes: "Wants a plan that survives nights and a hotel breakfast. Not asking for labs.",
    slot: "Tue · 4:30 p.m. · After clinic",
    at: "demo",
    paid: true,
  },
];
