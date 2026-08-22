"use client";

import { motion } from "framer-motion";

const EASE = [0.44, 0, 0.56, 1] as const;

const specialists = [
  { name: "Security", detail: "2 findings", status: "Done" },
  { name: "Performance", detail: "1 regression", status: "Done" },
  { name: "Tests", detail: "coverage -3%", status: "Running" },
  { name: "Style", detail: "awaiting diff", status: "Queued" },
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

const statusDot: Record<string, string> = {
  Done: "bg-brand",
  Running: "bg-info",
  Queued: "bg-warn",
};

export function ReviewBoardMock() {
  return (
    <div className="flex w-[289px] flex-col items-center gap-2">
      {specialists.map((s, i) => (
        <motion.div
          key={s.name}
          className="flex w-full items-center gap-4 rounded-2xl border border-[#262626] bg-[rgb(20,18,16)] p-4"
          initial={{ opacity: 0.001, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: i * 0.05, ease: EASE }}
        >
          <div className="flex flex-1 flex-col gap-1.5">
            <p className="text-[16px] leading-6 text-fg">{s.name}</p>
            <p className="font-mono text-[12px] leading-4 font-medium text-[rgb(115,115,115)]">
              {s.detail}
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-2 text-[12px] leading-4 text-fg">
            <span className={`h-2 w-2 rounded-full ${statusDot[s.status]}`} />
            {s.status}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

export function ReviewRiskMock() {
  return (
    <div className="w-[320px] overflow-hidden rounded-2xl border border-[#262626] bg-[rgb(20,18,16)]">
      <p className="px-4 pt-4 font-mono text-[11px] font-medium leading-[15px] text-fg-disabled">
        Ranked by risk
      </p>
      <div className="mt-1 pb-2">
        {findings.map((f, i) => (
          <motion.div
            key={f.label}
            className="flex items-center justify-between gap-3 px-4 py-2.5"
            initial={{ opacity: 0.001, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.05, ease: EASE }}
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
  return (
    <div className="w-[300px] rounded-2xl border border-[#262626] bg-[rgb(20,18,16)] p-4">
      <div className="flex items-center justify-between">
        <p className="text-[16px] leading-6 text-fg">PR #482</p>
        <span className="rounded-full bg-brand-soft px-2 py-0.5 font-mono text-[11px] font-medium text-brand">
          Reviewed
        </span>
      </div>
      <p className="mt-1 text-[12px] leading-4 text-fg-faint">Reconciled from 4 specialists</p>
      <div className="mt-4 border-t border-[#262626] pt-2">
        {posted.map((r, i) => (
          <motion.div
            key={r.label}
            className="flex items-center justify-between py-2"
            initial={{ opacity: 0.001, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 + i * 0.05, ease: EASE }}
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
