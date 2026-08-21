import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-sans text-sm font-medium transition-[color,background-color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:not-disabled:scale-[0.96]",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-fg hover:bg-accent/90",
        invert: "bg-steel text-ink hover:bg-steel/90",
        outline:
          "bg-transparent text-fg shadow-[var(--shadow-border)] hover:bg-fg/5",
        ghost: "bg-transparent text-fg hover:bg-fg/8",
        onInk:
          "bg-steel text-ink hover:bg-steel/90",
        onInkOutline:
          "bg-transparent text-ink-fg shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-ink-fg)_28%,transparent)] hover:bg-ink-fg/8",
      },
      size: {
        default: "h-11 rounded-sm px-5",
        lg: "h-12 rounded-sm px-6",
        sm: "h-9 rounded-sm px-3.5",
        icon: "size-11 rounded-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
