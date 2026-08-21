import type { ReactNode } from "react";

const tones = {
  neutral: "bg-surface text-fg-muted border-border",
  brand: "bg-brand-soft text-brand border-brand/30",
  info: "bg-info-soft text-info border-info/30",
  warn: "bg-warn-soft text-warn border-warn/30",
  danger: "bg-danger-soft text-danger border-danger/30",
} as const;

export function Badge({
  tone = "neutral",
  className = "",
  children,
}: {
  tone?: keyof typeof tones;
  className?: string;
  children: ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-mono uppercase tracking-wider ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
