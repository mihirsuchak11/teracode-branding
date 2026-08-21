import type { ReactNode } from "react";

/**
 * Shared shell for subpages, matching the original Framer layout:
 * a centered hairline-bordered content column sitting on dotted-pattern
 * gutters (8px grid, 1.5px stone dots), inside the global page frame.
 */
export function PageShell({
  narrow = false,
  children,
}: {
  /** About page uses a 920px column; every other subpage uses 1120px. */
  narrow?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        backgroundImage: "radial-gradient(#1c1917 0.75px, transparent 0.75px)",
        backgroundSize: "8px 8px",
        backgroundPosition: "4px 4px",
      }}
    >
      <div
        className={`mx-auto border-border bg-bg md:border-x ${
          narrow ? "max-w-[920px]" : "max-w-[1120px]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

/** Standard subpage hero row: h1 left, optional widget right, hairline below. */
export function PageHero({
  title,
  right,
}: {
  title: string;
  right?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-6 py-8 md:px-10 md:py-10">
      <h1 className="text-3xl font-semibold tracking-tight text-fg md:text-[40px] md:leading-none">
        {title}
      </h1>
      {right}
    </div>
  );
}

/** Mono-style section eyebrow with the short hairline underline. */
export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <div className="max-w-[368px] border-b border-border px-6 py-4 md:px-10">
      <p className="text-sm font-medium text-fg-muted">{children}</p>
    </div>
  );
}
