import Link from "next/link";
import type { ReactNode } from "react";

const variants = {
  /* Original site: white buttons with near-black text */
  primary: "bg-fg-soft text-bg hover:bg-fg font-medium",
  secondary: "bg-[#1c1917] text-fg-soft hover:bg-border-strong font-medium",
  ghost: "bg-transparent text-fg-muted hover:text-fg",
} as const;

const sizes = {
  sm: "h-9 px-4 text-sm",
  md: "h-10 px-4 text-sm leading-5",
  lg: "h-11 px-5 text-[15px]",
} as const;

export function Button({
  href,
  variant = "primary",
  size = "md",
  className = "",
  children,
  type,
  disabled,
}: {
  href?: string;
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
  className?: string;
  children: ReactNode;
  type?: "submit" | "button";
  disabled?: boolean;
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-btn transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`;
  if (href) {
    return (
      <Link href={href} className={cls}>
        {children}
      </Link>
    );
  }
  return (
    <button type={type ?? "button"} disabled={disabled} className={cls}>
      {children}
    </button>
  );
}
