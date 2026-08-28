import { cn } from "@/lib/utils";

export function HolweyHacksMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "relative inline-flex -rotate-2 flex-col items-start justify-center overflow-hidden rounded-[3px] border border-white/10 px-2.5 py-1.5 leading-none",
        "shadow-[2px_3px_0_0_rgb(0_0_0_/_0.55),inset_0_1px_0_rgb(255_255_255_/_0.16)]",
        "transition-[transform,box-shadow,background-color,border-color] duration-150",
        "group-hover:rotate-0 group-hover:border-accent group-hover:bg-accent group-hover:shadow-[2px_3px_0_0_rgb(0_0_0_/_0.3)]",
        className,
      )}
      style={{
        backgroundColor: "rgb(8 13 20 / 0.72)",
        backgroundImage: "url(/images/navy-grain.jpg)",
        backgroundSize: "420px",
      }}
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
