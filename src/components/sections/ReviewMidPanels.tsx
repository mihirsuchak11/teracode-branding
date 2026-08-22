"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FeatureAccordion, type AccordionItem } from "@/components/sections/FeatureAccordion";
import { ChromaticLines } from "@/components/motion/ChromaticLines";
import { Reveal } from "@/components/motion/Reveal";

const dots =
  "[background-image:radial-gradient(#221e1b_1px,transparent_1px)] [background-size:9px_9px]";

const PATHS = [
  { path: "auth/session.ts", skill: "Security", reason: "auth · tokens" },
  { path: "api/orders.ts", skill: "Performance", reason: "hot path" },
  { path: "db/migrate.sql", skill: "Tests", reason: "schema change" },
  { path: "ui/Button.tsx", skill: "Style", reason: "surface" },
];

const KEY_FLOW = [
  { label: "Your key", value: "Anthropic · sk-…c91" },
  { label: "Runtime", value: "Sandboxed, this diff only" },
  { label: "Provider bill", value: "Anthropic, at Anthropic's price" },
  { label: "Our bill", value: "$0 markup" },
];

const KEPT = [
  { finding: "Token logged in plaintext", fate: "Kept", tone: "text-brand" },
  { finding: "Missing rollback path", fate: "Kept", tone: "text-brand" },
  { finding: "N+1 query in list view", fate: "Kept", tone: "text-brand" },
  { finding: "Unused import", fate: "Deleted", tone: "text-fg-faint" },
];

function PathSkillsPanel() {
  return (
    <div className="w-[340px] overflow-hidden rounded-2xl border border-[#262626] bg-[rgb(20,18,16)]">
      <p className="px-4 pt-4 font-mono text-[11px] font-medium text-fg-disabled">
        Skills attach to paths
      </p>
      <div className="mt-2 pb-2">
        {PATHS.map((row) => (
          <div key={row.path} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="min-w-0">
              <p className="truncate font-mono text-[13px] text-fg">{row.path}</p>
              <p className="text-[11px] text-fg-faint">{row.reason}</p>
            </div>
            <span className="shrink-0 rounded-full bg-brand-soft px-2 py-0.5 font-mono text-[11px] text-brand">
              {row.skill}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ByokPanel() {
  return (
    <div className="w-[340px] rounded-2xl border border-[#262626] bg-[rgb(20,18,16)] p-4">
      <p className="font-mono text-[11px] font-medium text-fg-disabled">Inference path</p>
      <div className="mt-3">
        {KEY_FLOW.map((row, i) => (
          <div key={row.label} className="flex gap-3">
            <div className="flex w-4 flex-col items-center">
              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
              {i < KEY_FLOW.length - 1 && <span className="w-px flex-1 bg-[#262626]" />}
            </div>
            <div className="pb-4">
              <p className="text-[13px] leading-5 text-fg-muted">{row.label}</p>
              <p className="text-[14px] leading-5 text-fg">{row.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KeepRatePanel() {
  return (
    <div className="w-[340px] overflow-hidden rounded-2xl border border-[#262626] bg-[rgb(20,18,16)]">
      <div className="flex items-end justify-between px-4 pt-4">
        <p className="font-mono text-[11px] font-medium text-fg-disabled">Keep rate</p>
        <p className="text-[20px] font-semibold leading-none text-fg">75%</p>
      </div>
      <p className="px-4 pt-1 text-[12px] text-fg-faint">3 of 4 findings resolved, not deleted</p>
      <div className="mt-3 pb-2">
        {KEPT.map((row) => (
          <div key={row.finding} className="flex items-center justify-between gap-3 px-4 py-2.5">
            <span className="truncate text-[13px] text-fg">{row.finding}</span>
            <span className={`shrink-0 font-mono text-[11px] font-medium ${row.tone}`}>{row.fate}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ReviewMidPanels({ title, items }: { title: string; items: AccordionItem[] }) {
  const [active, setActive] = useState(0);
  const [first, ...rest] = title.split("\n");
  const panels = [<PathSkillsPanel key="paths" />, <ByokPanel key="byok" />, <KeepRatePanel key="keep" />];

  return (
    <section className="grid gap-10 px-6 py-[60px] md:grid-cols-[652fr_612fr] md:px-10">
      <div className="flex flex-col">
        <ChromaticLines
          as="h2"
          className="mt-4 text-3xl font-semibold tracking-tight md:text-[36px] md:leading-10"
          segments={[
            { text: `${first} `, className: "text-fg-muted" },
            { text: rest.join(" "), className: "text-fg" },
          ]}
        />
        <Reveal className="mt-auto pt-16">
          <FeatureAccordion items={items} active={active} onChange={setActive} />
        </Reveal>
      </div>
      <Reveal className={`flex h-[520px] items-center justify-center overflow-hidden ${dots}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0.001, y: 12, filter: "blur(3px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0.001, y: -8, filter: "blur(3px)" }}
            transition={{ duration: 0.35, ease: [0.12, 0.23, 0.5, 1] }}
          >
            {panels[active] ?? panels[0]}
          </motion.div>
        </AnimatePresence>
      </Reveal>
    </section>
  );
}
