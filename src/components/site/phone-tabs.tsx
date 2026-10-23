/**
 * Phone icon-row styles (header below 1280px). Pick one with PHONE_ICON_STYLE.
 * A = hand-drawn line icons + label (original mockup)
 * B = rounded, filled icons on a subtle blue pill + label
 * C = alternate metaphors (line) + label
 * D = larger icons in soft charcoal tiles with a blue ring, no labels (names via aria-label/title)
 * Icons for B/C/D: Lucide (https://lucide.dev), ISC License, Copyright (c) Lucide Contributors.
 */
import type { ComponentType, SVGProps } from "react";
import { cn } from "@/lib/utils";

export type PhoneIconStyle = "A" | "B" | "C" | "D";
export const PHONE_ICON_STYLE: PhoneIconStyle = "C";

type Icon = ComponentType<SVGProps<SVGSVGElement> & { strokeWidth?: number; className?: string }>;
export type TabIcons = { A: Icon; B: Icon; C: Icon };

export function tabClass(active: boolean, style: PhoneIconStyle = PHONE_ICON_STYLE) {
  return cn(
    "flex min-h-12 min-w-11 flex-1 flex-col items-center justify-center rounded-sm px-0.5 text-fg/85",
    style === "D" ? "gap-0" : "gap-0.5",
    style !== "B" && style !== "D" && "hover:bg-fg/8",
    active && "text-accent",
  );
}

export function TabFace({ icons, label, active, style = PHONE_ICON_STYLE }: { icons: TabIcons; label: string; active: boolean; style?: PhoneIconStyle }) {
  if (style === "A") {
    const I = icons.A;
    return (<><I className="size-5 shrink-0 text-accent" /><Label text={label} /></>);
  }
  if (style === "B") {
    const I = icons.B;
    return (
      <>
        <span className={cn("flex h-7 w-11 items-center justify-center rounded-full", active ? "bg-accent/30" : "bg-accent/12")}>
          <I className="size-[18px] text-accent" strokeWidth={2.4} fill="currentColor" fillOpacity={0.35} />
        </span>
        <Label text={label} />
      </>
    );
  }
  if (style === "C") {
    const I = icons.C;
    return (<><I className="size-5 shrink-0 text-accent" strokeWidth={2} /><Label text={label} /></>);
  }
  const I = icons.C;
  return (
    <span title={label} className={cn("flex size-11 items-center justify-center rounded-full border bg-fg/5",
      active ? "border-accent bg-accent/15" : "border-accent/35")}>
      <I className="size-6 text-accent" strokeWidth={1.9} />
      <span className="sr-only">{label}</span>
    </span>
  );
}

function Label({ text }: { text: string }) {
  return <span className="text-[10px] leading-none font-medium tracking-wide whitespace-nowrap">{text}</span>;
}
