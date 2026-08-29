import { cn } from "@/lib/utils";

const plaqueShell =
  "relative inline-flex -rotate-2 flex-col items-start justify-center overflow-hidden rounded-[3px] border border-white/10 leading-none shadow-[2px_3px_0_0_rgb(0_0_0_/_0.55),inset_0_1px_0_rgb(255_255_255_/_0.16)]";

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
        "px-2.5 py-1.5 transition-[transform,box-shadow,background-color,border-color] duration-150",
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
  line1,
  line2,
  className,
}: {
  line1: string;
  line2?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(plaqueShell, "-rotate-1 px-4 py-3 sm:px-5 sm:py-3.5", className)}
      style={plaqueBg}
    >
      <span className="relative font-display text-[28px] font-semibold tracking-[0.12em] uppercase sm:text-[36px]">
        <span className="hh-metal-blue">{line1.slice(0, 1)}</span>
        <span className="hh-metal">{line1.slice(1)}</span>
      </span>
      {line2 ? (
        <span className="hh-metal relative mt-1 font-display text-[28px] font-semibold tracking-[0.12em] uppercase sm:text-[36px]">
          {line2}
        </span>
      ) : null}
    </span>
  );
}
