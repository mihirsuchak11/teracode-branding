import type { FeatureMock } from "@/content/features";

const calloutTone = {
  brand: "border-brand/20 bg-brand-soft/25",
  danger: "border-danger/25 bg-danger-soft/20",
  neutral: "border-border bg-surface-2",
} as const;

const dots = {
  brand: "bg-brand",
  warn: "bg-warn",
  danger: "bg-danger",
  faint: "bg-fg-faint",
} as const;

/**
 * Decorative dashboard card used on product pages. Copy comes from
 * `featureMocks` so the panels describe TeraCodeAI, not the Strand template.
 */
export function FeatureMockCard({ mock }: { mock: FeatureMock }) {
  return (
    <div className="w-[320px] overflow-hidden rounded-xl border border-border-strong/50 bg-surface shadow-xl shadow-black/40">
      {mock.callout && (
        <div className={`border-b border-border p-4 ${calloutTone[mock.callout.tone ?? "neutral"]}`}>
          <div className="flex items-center justify-between gap-3">
            {mock.callout.badge && (
              <span className="rounded-md bg-danger-soft/60 px-2 py-1 text-[11px] font-medium text-danger">
                {mock.callout.badge}
              </span>
            )}
            {mock.callout.meta && (
              <span className="ml-auto text-[11px] text-fg-faint">{mock.callout.meta}</span>
            )}
          </div>
          {mock.callout.title && (
            <p className="mt-2 text-[15px] font-medium text-fg-soft">{mock.callout.title}</p>
          )}
          {mock.callout.body && (
            <p className="mt-1.5 text-[13px] leading-snug text-fg-muted">{mock.callout.body}</p>
          )}
        </div>
      )}
      {mock.label && (
        <p className="px-4 pt-3 font-mono text-[10px] uppercase tracking-wider text-fg-disabled">
          {mock.label}
        </p>
      )}
      {mock.rows && mock.rows.length > 0 && (
        <div className="px-4 py-2">
          {mock.rows.map((row) => (
            <div
              key={`${row.label}-${row.value ?? ""}`}
              className="flex items-center justify-between gap-3 py-2"
            >
              <span className="flex min-w-0 items-center gap-2 text-[13px] text-fg-dim">
                {row.dot && (
                  <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dots[row.dot]}`} />
                )}
                <span className="truncate">{row.label}</span>
              </span>
              {row.value && (
                <span
                  className={`shrink-0 text-[12px] text-fg-faint ${row.mono ? "font-mono" : ""}`}
                >
                  {row.value}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
      {mock.footer && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-fg-muted">
          <span>{mock.footer.left}</span>
          {mock.footer.right && <span>{mock.footer.right}</span>}
        </div>
      )}
    </div>
  );
}
