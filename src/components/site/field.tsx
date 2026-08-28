import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export function Field({
  id,
  label,
  error,
  className,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={className}>
      <Label htmlFor={id}>{label}</Label>
      {children}
      {error ? <p className="mt-1.5 text-sm text-danger">{error}</p> : null}
    </div>
  );
}
