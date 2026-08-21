import { cn } from "@/lib/utils";

export function BrandShield({
  className,
  alt = "",
}: {
  className?: string;
  alt?: string;
}) {
  return (
    <img
      src="/images/shield.jpg"
      alt={alt}
      className={cn("no-outline block object-contain", className)}
    />
  );
}
