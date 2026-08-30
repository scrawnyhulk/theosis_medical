import { cn } from "@/lib/utils";

const plaqueShell =
  "relative inline-flex items-center overflow-hidden rounded-[3px] border border-white/10 leading-none shadow-[2px_3px_0_0_rgb(0_0_0_/_0.55),inset_0_1px_0_rgb(255_255_255_/_0.16)]";

const plaqueBg = {
  backgroundColor: "rgb(8 13 20 / 0.72)",
  backgroundImage: "url(/images/navy-grain.jpg)",
  backgroundSize: "420px",
} as const;

export function HolweyHacksMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        plaqueShell,
        "-rotate-2 flex-col items-start justify-center px-2.5 py-1.5 transition-[transform,box-shadow,background-color,border-color] duration-150",
        "group-hover:rotate-0 group-hover:border-accent group-hover:bg-accent group-hover:shadow-[2px_3px_0_0_rgb(0_0_0_/_0.3)]",
        className,
      )}
      style={plaqueBg}
    >
      <span
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
        style={{ backgroundColor: "#2a7ae0" }}
        aria-hidden
      />
      <span className="relative font-display text-[18px] font-semibold tracking-[0.12em] uppercase">
        <span className="hh-metal-blue">H</span>
        <span className="hh-metal">olwey</span>
      </span>
      <span className="hh-metal relative mt-[3px] font-display text-[10px] font-semibold tracking-[0.28em] uppercase">
        Health Hacks
      </span>
    </span>
  );
}

export function HacksPlaque({
  title,
  className,
  compact,
  inline,
}: {
  title: string;
  className?: string;
  compact?: boolean;
  inline?: boolean;
}) {
  const mark = (
    <span className={cn(plaqueShell, compact ? "gap-2 px-3 py-1.5 sm:px-3.5 sm:py-2" : "gap-3 px-4 py-2.5 sm:px-5 sm:py-3", className)} style={plaqueBg}>
      <span className={cn("shrink-0 rounded-full bg-accent", compact ? "h-4 w-[2px] sm:h-5" : "h-6 w-[3px] sm:h-8")} aria-hidden />
      <span
        className={cn(
          "relative whitespace-nowrap font-display font-semibold tracking-[0.16em] uppercase",
          compact ? "text-[15px] sm:text-[18px]" : "text-[22px] sm:text-[32px] lg:text-[36px]",
        )}
      >
        <span className="hh-metal-blue">{title.slice(0, 1)}</span>
        <span className="hh-metal">{title.slice(1)}</span>
      </span>
    </span>
  );
  if (compact || inline) return mark;
  return (
    <span className="flex w-full items-center gap-4">
      {mark}
      <span className="hidden h-px min-w-8 flex-1 bg-border sm:block" aria-hidden />
    </span>
  );
}
