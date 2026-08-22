"use client";

import { useState } from "react";
import { FeatureAccordion, type AccordionItem } from "@/components/sections/FeatureAccordion";
import { ChromaticLines } from "@/components/motion/ChromaticLines";
import { Reveal } from "@/components/motion/Reveal";
import { stack } from "@/content/home";

/* Dotted-grid backdrop, same as the demo panels above. */
const dots =
  "[background-image:radial-gradient(#221e1b_1px,transparent_1px)] [background-size:9px_9px]";

/* Every offset below is measured off the original's 612x520 stage, which sits
   at x=796,y=2236 on the scraped page; local coords subtract that origin. */

/* ------------------------------------------------ panel 1: connected sources */

function ConnectedSourcesPanel() {
  const rows = [...stack.sources, ...stack.sources];
  return (
    <div className="flex h-[370px] w-[307px] flex-col overflow-hidden rounded-2xl border border-border bg-[#141210]">
      <p className="flex h-[47px] shrink-0 items-center px-4 text-[11px] font-medium leading-[15px] text-fg-disabled">
        {stack.label}
      </p>
      <div className="relative h-[279px] shrink-0 overflow-hidden">
        {/* bottom-aligned so the partial row clips at the top, as in the original */}
        <div className="absolute inset-x-0 bottom-0 [mask-image:linear-gradient(#0000_0%,#000_22%)]">
          {rows.map((s, i) => (
            <div key={`${s.name}-${i}`} className="flex h-[72px] items-center gap-3 px-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.logo} alt="" aria-hidden width={40} height={40} className="shrink-0" />
              <div className="min-w-0">
                <p className="text-base leading-6 text-fg">{s.name}</p>
                <p className="font-mono text-[11px] font-medium leading-[15px]">
                  <span className="text-brand">{s.a}</span>{" "}
                  <span className="text-fg-disabled">{s.b}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <p className="flex h-11 shrink-0 items-center gap-4 px-4 font-mono text-[11px] font-medium leading-[15px]">
        {stack.totals.map((t) => (
          <span key={t.label}>
            <span className="text-fg-faint">{t.value}</span>{" "}
            <span className="text-fg-disabled">{t.label}</span>
          </span>
        ))}
      </p>
    </div>
  );
}

/* ------------------------------------------------- panel 2: relationship map */

const NODES = [
  { label: "Security", x: 288, y: 63, w: 135, dim: true },
  { label: "Team Lead", x: 164, y: 139, w: 166, dim: false },
  { label: "Senior Eng", x: 153, y: 329, w: 167, dim: false },
  { label: "PR #482", x: 275, y: 405, w: 149, dim: true },
];

function NodeGlyph() {
  return (
    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="9" />
    </svg>
  );
}

function RelationshipMapPanel() {
  return (
    <div className="relative h-[520px] w-[612px]">
      <svg className="absolute inset-0" width={612} height={520} fill="none" aria-hidden>
        <path d="M423 91 H468" stroke="#292524" strokeWidth={1} />
        <path d="M288 91 H248 A12 12 0 0 0 236 103 V139" stroke="#292524" strokeWidth={1} />
        <path d="M300 355 H347 A12 12 0 0 1 359 367 V405" stroke="#292524" strokeWidth={1} />
        <path d="M155 431 H275" stroke="#292524" strokeWidth={1} />
      </svg>

      {NODES.map((n) => (
        <div
          key={n.label}
          className="absolute flex h-[52px] items-center gap-3 rounded-xl border border-border bg-[#141210] p-3"
          style={{ left: n.x, top: n.y, width: n.w }}
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-border text-fg-faint">
            <NodeGlyph />
          </span>
          <span
            className={`font-mono text-sm font-medium leading-5 ${n.dim ? "text-fg-faint" : "text-fg"}`}
          >
            {n.label}
          </span>
        </div>
      ))}

      <div className="absolute" style={{ left: 255, top: 250 }}>
        <p className="font-mono text-[11px] font-medium leading-[15px] text-brand">
          FINDINGS MERGED
        </p>
        <p className="mt-1 text-xs leading-4 text-fg-muted">
          Four agents, one review on the thread
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------ panel 3: query result */

const FLAGGED = [
  { name: "auth/session.ts", reason: "Token logged in plaintext", score: "High", tone: "text-[#e5484d]" },
  { name: "db/migrate.sql", reason: "Missing rollback path", score: "High", tone: "text-[#e5484d]" },
  { name: "api/orders.ts", reason: "Unhandled promise rejection", score: "Med", tone: "text-[#f9ab00]" },
];

function ActionButton({ label }: { label: string }) {
  return (
    <span className="flex h-8 items-center gap-1 rounded-lg border border-border bg-[#141210] pl-3 pr-1.5 text-xs font-medium leading-4 text-fg-muted">
      <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M12 3v12m0 0 4-4m-4 4-4-4M4 17v3h16v-3" />
      </svg>
      {label}
    </span>
  );
}

function QueryResultPanel() {
  return (
    <div className="relative h-[520px] w-[612px]">
      {/* query bar */}
      <div
        className="absolute flex h-[54px] items-center justify-between rounded-[15px] border border-border bg-[#141210] px-5"
        style={{ left: 113, top: 86, width: 386 }}
      >
        <span className="truncate text-sm leading-5 text-fg">
          Findings on PR #482 after merge
        </span>
        <span className="ml-3 flex h-6 shrink-0 items-center rounded-lg border border-border bg-[#141210] px-2 text-xs font-medium leading-4 text-fg-muted">
          3 issues
        </span>
      </div>

      {/* results card */}
      <div
        className="absolute overflow-hidden rounded-2xl border border-border bg-[#141210]"
        style={{ left: 112, top: 149, width: 388, height: 246 }}
      >
        <p className="px-5 pt-5 font-mono text-xs font-medium leading-4 text-fg-muted">
          3 findings posted
        </p>
        {FLAGGED.map((r) => (
          <div key={r.name} className="flex h-[69px] items-center gap-2.5 px-5">
            <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg border border-border text-fg-faint">
              <NodeGlyph />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium leading-5 text-fg">{r.name}</p>
              <p className={`text-xs font-medium leading-4 ${r.tone}`}>{r.reason}</p>
            </div>
            <div className="shrink-0 text-right">
              <p className="font-mono text-[11px] font-medium leading-[15px]">
                <span className={r.tone}>{r.score}</span>
                <span className="text-fg-faint"> / 100</span>
              </p>
              <p className="text-xs font-medium leading-4 text-fg-disabled">severity</p>
            </div>
          </div>
        ))}
      </div>

      {/* actions */}
      <div className="absolute flex gap-1" style={{ left: 188, top: 403 }}>
        <ActionButton label="Post review" />
        <ActionButton label="Open in GitHub" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ section */

export function CortexMidPanels({ title, items }: { title: string; items: AccordionItem[] }) {
  const [active, setActive] = useState(0);
  const [first, ...rest] = title.split("\n");
  const panels = [
    <ConnectedSourcesPanel key="sources" />,
    <RelationshipMapPanel key="map" />,
    <QueryResultPanel key="query" />,
  ];

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
        {panels[active] ?? panels[0]}
      </Reveal>
    </section>
  );
}
