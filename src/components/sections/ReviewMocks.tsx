"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { REVIEW_EASE, useReviewTick } from "@/components/sections/ReviewFlow";

const specialists = [
  { name: "Security", detail: "2 findings" },
  { name: "Performance", detail: "1 regression" },
  { name: "Tests", detail: "coverage -3%" },
  { name: "Style", detail: "house rules" },
];

const findings = [
  { label: "Token logged in plaintext", value: "High", tone: "text-danger", dot: "bg-danger" },
  { label: "Missing rollback path", value: "High", tone: "text-danger", dot: "bg-danger" },
  { label: "Unhandled promise rejection", value: "Medium", tone: "text-warn", dot: "bg-warn" },
  { label: "N+1 query in list view", value: "Medium", tone: "text-warn", dot: "bg-warn" },
  { label: "Unused import", value: "Low", tone: "text-fg-faint", dot: "bg-fg-disabled" },
];

const posted = [
  { label: "Comments posted", value: "1 review", dot: "bg-brand" },
  { label: "Findings merged", value: "12 → 5", dot: "bg-brand" },
  { label: "Duplicates removed", value: "7", dot: "bg-fg-disabled" },
  { label: "Blocking", value: "2", dot: "bg-danger" },
];

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

export function ReviewBoardMock() {
  const tick = useReviewTick(900, specialists.length + 1, 2);
  const doneThrough = tick;

  return (
    <div className="flex w-[289px] flex-col items-center gap-2">
      {specialists.map((s, i) => {
        const status = statusOf(doneThrough, i);
        return (
          <motion.div
            key={s.name}
            className="relative w-full overflow-hidden rounded-2xl border bg-[rgb(20,18,16)] p-4"
            animate={{
              borderColor: status === "Running" ? "rgba(54,197,240,0.45)" : "rgb(38,38,38)",
            }}
            transition={{ duration: 0.25, ease: REVIEW_EASE }}
          >
            {status === "Running" && (
              <span className="review-row-fill pointer-events-none absolute inset-x-0 bottom-0 h-px bg-info" />
            )}
            <div className="flex items-center gap-4">
              <div className="flex flex-1 flex-col gap-1.5">
                <p className="text-[16px] leading-6 text-fg">{s.name}</p>
                <p className="font-mono text-[12px] leading-4 font-medium text-[rgb(115,115,115)]">
                  {s.detail}
                </p>
              </div>
              <span className="flex shrink-0 items-center gap-2 text-[12px] leading-4 text-fg">
                <span
                  className={`h-2 w-2 rounded-full ${statusDot[status]} ${
                    status === "Running" ? "animate-pulse" : ""
                  }`}
                />
                {status}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export function ReviewRiskMock() {
  const visible = useReviewTick(700, findings.length, 2) + 1;

  return (
    <div className="relative w-[320px] overflow-hidden rounded-2xl border border-[#262626] bg-[rgb(20,18,16)]">
      <p className="px-4 pt-4 font-mono text-[11px] font-medium leading-[15px] text-fg-disabled">
        Ranked by risk
      </p>
      <span className="review-scan pointer-events-none absolute inset-x-0 top-0 h-px bg-brand/80" />
      <div className="mt-1 pb-2">
        {findings.map((f, i) => (
          <motion.div
            key={f.label}
            className="flex items-center justify-between gap-3 px-4 py-2.5"
            initial={false}
            animate={{ opacity: i < visible ? 1 : 0.15, x: i < visible ? 0 : 8 }}
            transition={{ duration: 0.25, ease: REVIEW_EASE }}
          >
            <span className="flex min-w-0 items-center gap-2.5 text-[13px] leading-5 text-fg">
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${f.dot}`} />
              <span className="truncate">{f.label}</span>
            </span>
            <span className={`shrink-0 font-mono text-[11px] font-medium ${f.tone}`}>{f.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export function ReviewPostedMock() {
  const reduced = useReducedMotion();
  const [on, setOn] = useState(true);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setOn((v) => !v), 2400);
    return () => clearInterval(t);
  }, [reduced]);

  return (
    <div className="w-[300px] rounded-2xl border border-[#262626] bg-[rgb(20,18,16)] p-4">
      <div className="flex items-center justify-between">
        <p className="text-[16px] leading-6 text-fg">PR #482</p>
        <motion.span
          className="rounded-full bg-brand-soft px-2 py-0.5 font-mono text-[11px] font-medium text-brand"
          animate={{ opacity: on ? 1 : 0.55 }}
          transition={{ duration: 0.3 }}
        >
          {on ? "Reviewed" : "Reconciling"}
        </motion.span>
      </div>
      <p className="mt-1 text-[12px] leading-4 text-fg-faint">Reconciled from 4 specialists</p>
      <div className="mt-4 border-t border-[#262626] pt-2">
        {posted.map((r, i) => (
          <motion.div
            key={r.label}
            className="flex items-center justify-between py-2"
            initial={false}
            animate={{ opacity: on ? 1 : 0.35, y: on ? 0 : 4 }}
            transition={{ duration: 0.25, delay: i * 0.04, ease: REVIEW_EASE }}
          >
            <span className="flex items-center gap-2 text-[13px] text-fg-dim">
              <span className={`h-1.5 w-1.5 rounded-full ${r.dot}`} />
              {r.label}
            </span>
            <span className="font-mono text-[12px] text-fg">{r.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
