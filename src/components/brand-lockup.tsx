import { cn } from "@/lib/utils";

export function BrandLockup({ className }: { className?: string }) {
  return (
    <img
      src="/images/header-lockup.png"
      alt="Theosis Medical"
      className={cn(
        "no-outline block h-12 w-auto object-contain object-left sm:h-14",
        className,
      )}
    />
  );
}
