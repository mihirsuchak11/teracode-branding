import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-btn text-sm font-medium whitespace-nowrap transition-colors duration-200 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-fg/30 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-fg-soft text-bg hover:bg-fg",
        primary: "bg-fg-soft text-bg hover:bg-fg",
        secondary: "bg-[#1c1917] text-fg-soft hover:bg-border-strong",
        ghost: "bg-transparent text-fg-muted hover:text-fg",
        outline:
          "border border-border bg-transparent text-fg-soft hover:bg-surface-2",
        link: "text-fg-soft underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 leading-5",
        sm: "h-9 px-4",
        md: "h-10 px-4 leading-5",
        lg: "h-11 px-5 text-[15px]",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function isExternalHref(href: string) {
  return (
    href.startsWith("mailto:") ||
    href.startsWith("http://") ||
    href.startsWith("https://")
  );
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  href,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    href?: string;
  }) {
  const classes = cn(buttonVariants({ variant, size, className }));

  if (href) {
    if (isExternalHref(href)) {
      return (
        <a href={href} data-slot="button" className={classes}>
          {children}
        </a>
      );
    }
    return (
      <Link href={href} data-slot="button" className={classes}>
        {children}
      </Link>
    );
  }

  const Comp = asChild ? Slot.Root : "button";
  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={classes}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { Button, buttonVariants };
