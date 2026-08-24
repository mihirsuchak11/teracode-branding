import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1.5 rounded-full border px-3 py-1 font-mono text-xs uppercase tracking-wider whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "border-border bg-surface text-fg-muted",
        secondary: "border-border bg-surface text-fg-muted",
        outline: "border-border text-fg-muted",
        brand: "border-brand/30 bg-brand-soft text-brand",
        info: "border-info/30 bg-info-soft text-info",
        warn: "border-warn/30 bg-warn-soft text-warn",
        danger: "border-danger/30 bg-danger-soft text-danger",
        destructive: "border-danger/30 bg-danger-soft text-danger",
      },
      tone: {
        neutral: "border-border bg-surface text-fg-muted",
        brand: "border-brand/30 bg-brand-soft text-brand",
        info: "border-info/30 bg-info-soft text-info",
        warn: "border-warn/30 bg-warn-soft text-warn",
        danger: "border-danger/30 bg-danger-soft text-danger",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  tone,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";
  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, tone }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
