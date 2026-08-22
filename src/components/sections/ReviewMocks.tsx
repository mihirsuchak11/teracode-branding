"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import type { FeatureMock } from "@/content/features";
import { REVIEW_EASE, useOnScreen, useReviewTick } from "@/components/sections/ReviewFlow";

/**
 * The Review page's three showcase cards. Same copy source as every other
 * product (`featureMocks`) and the same card silhouette as `FeatureMockCard`,
 * but they play: the board resolves agent by agent, the risk list reveals under
 * a scan, and the posted review settles. Launch page, so it earns the motion.
 */

const dotClass = {
  brand: "bg-brand",
  warn: "bg-warn",
  danger: "bg-danger",
  faint: "bg-fg-faint",
} as const;

const valueTone = {
  brand: "text-brand",
  warn: "text-warn",
  danger: "text-danger",
  faint: "text-fg-faint",
} as const;

type Row = NonNullable<FeatureMock["rows"]>[number];

const shell =
  "w-[320px] overflow-hidden rounded-xl border border-border-strong/50 bg-surface shadow-xl shadow-black/40";

function statusOf(doneThrough: number, i: number): "Done" | "Running" | "Queued" {
  if (i < doneThrough) return "Done";
  if (i === doneThrough) return "Running";
  return "Queued";
}

const statusDot: Record<string, string> = {
  Done: "bg-brand",
  Running: "bg-info",
  Queued: "bg-warn",
};

export function ReviewBoardMock({ mock }: { mock?: FeatureMock }) {
  const rows: Row[] = mock?.rows ?? [];
  const { ref, on } = useOnScreen<HTMLDivElement>();
  const doneThrough = useReviewTick(900, rows.length + 1, 2, !on);
  const allDone = doneThrough >= rows.length;

  return (
    <div ref={ref} className={shell}>
      {mock?.callout && (
        <div className="border-b border-border bg-brand-soft/25 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[15px] font-medium text-fg-soft">{mock.callout.title}</p>
            <motion.span
              className="ml-auto font-mono text-[11px]"
              animate={{ color: allDone ? "rgb(16,236,144)" : "rgb(121,113,107)" }}
              transition={{ duration: 0.3, ease: REVIEW_EASE }}
            >
              {allDone ? mock.callout.meta : "Reviewing"}
            </motion.span>
          </div>
          {mock.callout.body && (
            <p className="mt-1.5 text-[13px] leading-snug text-fg-muted">{mock.callout.body}</p>
          )}
        </div>
      )}
      {mock?.label && (
        <p className="px-4 pt-3 font-mono text-[10px] uppercase tracking-wider text-fg-disabled">
          {mock.label}
        </p>
      )}
      <div className="px-4 py-2">
        {rows.map((row, i) => {
          const status = statusOf(doneThrough, i);
          return (
            <motion.div
              key={row.label}
              className="flex items-center justify-between gap-3 py-2"
              animate={{ opacity: status === "Queued" ? 0.4 : 1 }}
              transition={{ duration: 0.25, ease: REVIEW_EASE }}
            >
              <span className="flex min-w-0 items-center gap-2 text-[13px] text-fg-dim">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDot[status]} ${
                    status === "Running" ? "animate-pulse" : ""
                  }`}
                />
                <span className="truncate">{row.label}</span>
              </span>
              <span className="shrink-0 font-mono text-[12px] text-fg-faint">
                {status === "Done" ? row.value : status === "Running" ? "reading diff…" : "queued"}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export function ReviewRiskMock({ mock }: { mock?: FeatureMock }) {
  const rows: Row[] = mock?.rows ?? [];
  const { ref, on } = useOnScreen<HTMLDivElement>();
  const visible = useReviewTick(700, rows.length, 2, !on) + 1;

  return (
    <div ref={ref} className={`relative ${shell}`}>
      <p className="px-4 pt-4 font-mono text-[10px] uppercase tracking-wider text-fg-disabled">
        Ranked by risk
      </p>
      <span className="review-scan pointer-events-none absolute inset-x-0 top-0 h-px bg-brand/70" />
      <div className="px-4 py-2">
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            className="flex items-center justify-between gap-3 py-2"
            initial={false}
            animate={{ opacity: i < visible ? 1 : 0.15, x: i < visible ? 0 : 8 }}
            transition={{ duration: 0.25, ease: REVIEW_EASE }}
          >
            <span className="flex min-w-0 items-center gap-2 text-[13px] text-fg-dim">
              {row.dot && (
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass[row.dot]}`} />
              )}
              <span className="truncate">{row.label}</span>
            </span>
            <span
              className={`shrink-0 font-mono text-[11px] font-medium ${
                row.dot ? valueTone[row.dot] : "text-fg-faint"
              }`}
            >
              {row.value}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ReviewPostedMock({ mock }: { mock?: FeatureMock }) {
  const rows: Row[] = mock?.rows ?? [];
  const reduced = useReducedMotion();
  const { ref, on } = useOnScreen<HTMLDivElement>();
  const [settled, setSettled] = useState(true);

  useEffect(() => {
    if (reduced || !on) return;
    const t = setInterval(() => setSettled((v) => !v), 2400);
    return () => clearInterval(t);
  }, [reduced, on]);

  return (
    <div ref={ref} className={shell}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <p className="text-[15px] font-medium text-fg-soft">Posted to the pull request</p>
        <motion.span
          className="rounded-full bg-brand-soft px-2 py-0.5 font-mono text-[11px] font-medium text-brand"
          animate={{ opacity: settled ? 1 : 0.55 }}
          transition={{ duration: 0.3 }}
        >
          {settled ? "Reviewed" : "Reconciling"}
        </motion.span>
      </div>
      <div className="px-4 py-2">
        {rows.map((row, i) => (
          <motion.div
            key={row.label}
            className="flex items-center justify-between gap-3 py-2"
            initial={false}
            animate={{ opacity: settled ? 1 : 0.35, y: settled ? 0 : 4 }}
            transition={{ duration: 0.25, delay: i * 0.04, ease: REVIEW_EASE }}
          >
            <span className="flex min-w-0 items-center gap-2 text-[13px] text-fg-dim">
              {row.dot && (
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass[row.dot]}`} />
              )}
              <span className="truncate">{row.label}</span>
            </span>
            <span className="shrink-0 font-mono text-[12px] text-fg">{row.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
