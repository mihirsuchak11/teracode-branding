"use client";

import { useState } from "react";
import Link from "next/link";
import type { IntegrationItem } from "@/content/integrations";
import { Reveal } from "@/components/motion/Reveal";

/* Per-integration mark color; first twelve tuned to the original grid. */
const colors: Record<string, string> = {
  pipecloud: "#3e63dd",
  scaleforce: "#10b981",
  closetrack: "#f9ab00",
  mixboard: "#3b82f6",
  metripanel: "#f97316",
  signalkit: "#e5484d",
  trackwise: "#22c55e",
  beamcast: "#eab308",
  polysql: "#6366f1",
  vaultdb: "#e5484d",
  cleardesk: "#f97316",
  driftline: "#0ea5e9",
  replystack: "#36c5f0",
  gridwork: "#10b981",
  fieldpoint: "#f9ab00",
  paystream: "#6e56cf",
  mintledger: "#22c55e",
  coreledger: "#3e63dd",
  cashline: "#eab308",
  openloop: "#e5484d",
  pushmark: "#f97316",
  arcline: "#0ea5e9",
  surfboard: "#6366f1",
  threadbase: "#36c5f0",
};

const shapes = [
  <path key="0" d="M12 3a9 9 0 0 1 0 18M12 3a9 9 0 0 0-4 17M12 3v18" />,
  <path key="1" d="M4 15c3-6 5-6 8 0s5 6 8 0M6 8h12" />,
  <path key="2" d="M12 3a3 3 0 0 1 0 6 3 3 0 0 1 0-6ZM12 15a3 3 0 0 1 0 6 3 3 0 0 1 0-6ZM3 12a3 3 0 0 1 6 0 3 3 0 0 1-6 0ZM15 12a3 3 0 0 1 6 0 3 3 0 0 1-6 0Z" />,
  <path key="3" d="m5 19 7-14 7 14H5Z" />,
  <path key="4" d="M12 4a8 8 0 1 1-8 8 5 5 0 1 0 5-5" />,
  <path key="5" d="M12 3v18M3 12h18m-3.6-6.4L5.6 18.4m0-12.8 12.8 12.8" />,
  <path key="6" d="M5 12a7 7 0 0 1 14 0M7 12v5m5-9v9m5-7v7" />,
  <path key="7" d="M12 12m-8 0a8 8 0 1 0 16 0 8 8 0 1 0-16 0M12 12m-3 0a3 3 0 1 0 6 0 3 3 0 1 0-6 0" />,
];

/** Colored glyph tile for an integration mark, shared with the detail page. */
export function IntegrationMark({
  slug,
  size = 64,
}: {
  slug: string;
  size?: number;
}) {
  const color = colors[slug] ?? "#a6a09b";
  const shape = shapes[Math.abs([...slug].reduce((a, c) => a + c.charCodeAt(0), 0)) % shapes.length];
  return (
    <span
      className="flex items-center justify-center rounded-xl bg-surface-2/70"
      style={{ width: size, height: size }}
    >
      <svg
        width={size * 0.44}
        height={size * 0.44}
        viewBox="0 0 24 24"
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {shape}
      </svg>
    </span>
  );
}

/** Full-bleed hairline grid of integration tiles with a LOAD MORE row, as in the original. */
export function IntegrationsGrid({ integrations }: { integrations: IntegrationItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? integrations : integrations.slice(0, 12);

  return (
    <section className="border-y border-border">
      <div className="grid md:grid-cols-3">
        {visible.map((integration, i) => (
          <div
            key={integration.slug}
            className={`border-border ${i % 3 > 0 ? "md:border-l" : ""} ${
              i >= 3 ? "md:border-t" : ""
            } ${i > 0 ? "border-t md:border-t-0" : ""} ${i >= 3 ? "md:border-t" : ""}`}
          >
            <Reveal className="h-full">
              <Link
                href={`/integrations/${integration.slug}`}
                className="block h-full min-h-[324px] p-10 pt-10 transition-colors hover:bg-bg-deep/60"
              >
                <IntegrationMark slug={integration.slug} />
                <h3 className="mt-9 text-[17px] font-semibold text-fg">{integration.name}</h3>
                <p className="mt-2 font-mono text-xs text-fg-faint">{integration.meta}</p>
                <p className="mt-5 max-w-[360px] text-[15px] leading-relaxed text-fg-muted">
                  {integration.description}
                </p>
              </Link>
            </Reveal>
          </div>
        ))}
      </div>
      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="w-full cursor-pointer border-t border-border py-5 text-center font-mono text-xs uppercase tracking-[0.18em] text-fg-muted transition-colors hover:text-fg"
        >
          Load more
        </button>
      )}
    </section>
  );
}
