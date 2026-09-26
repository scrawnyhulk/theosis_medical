export type ProteinBand = "ideal" | "fine" | "mid" | "c" | "soap" | "balloon";

export function scoreProtein(calories: string, protein: string) {
  const cal = Number(calories);
  const pro = Number(protein);
  if (!Number.isFinite(cal) || !Number.isFinite(pro) || calories.trim() === "" || protein.trim() === "") {
    return null;
  }
  const timesTen = pro * 10;
  const pct = cal > 0 ? (pro * 4 * 100) / cal : 0;
  const pass = timesTen >= cal && cal >= 0 && pro >= 0;
  const band: ProteinBand =
    pass || pct >= 40
      ? "ideal"
      : pct >= 30
        ? "fine"
        : pct >= 25
          ? "mid"
          : pct >= 20
            ? "c"
            : pct >= 10
              ? "soap"
              : "balloon";
  return { cal, pro, timesTen, pct, pass, band };
}

export const proteinBandMeta: Record<
  ProteinBand,
  { grade: string; cutoff: string; line: string; tone: string; labelTone: string }
> = {
  ideal: {
    grade: "A",
    cutoff: "40%+",
    line: "Steal it. The front of the bag didn't even have to lie.",
    tone: "bg-ok/15 text-fg",
    labelTone: "bg-ok/30",
  },
  fine: {
    grade: "B",
    cutoff: "30%+",
    line: "Hunger still taps out. That's the whole point.",
    tone: "bg-accent/15 text-fg",
    labelTone: "bg-accent/25",
  },
  mid: {
    grade: "C+",
    cutoff: "25%+",
    line: "Fine for a Tuesday. Don't let the box call it high protein.",
    tone: "bg-warn/15 text-fg",
    labelTone: "bg-warn/35",
  },
  c: {
    grade: "C",
    cutoff: "20%+",
    line: "Protein made a cameo. The calories got top billing.",
    tone: "bg-warn/20 text-fg",
    labelTone: "bg-warn/40",
  },
  soap: {
    grade: "D",
    cutoff: "10%+",
    line: "The protein clocked in, saw the calories, and went home.",
    tone: "bg-danger/15 text-fg",
    labelTone: "bg-danger/25",
  },
  balloon: {
    grade: "F",
    cutoff: "<10%",
    line: "Calories in a costume. Protein called in sick.",
    tone: "bg-danger/25 text-fg",
    labelTone: "bg-danger/35",
  },
};
