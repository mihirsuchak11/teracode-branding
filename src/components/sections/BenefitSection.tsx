import type { FeatureBenefit } from "@/lib/types";
import type { FeatureMidSection } from "@/content/features";

import { Reveal } from "@/components/motion/Reveal";
import { ChromaticLines } from "@/components/motion/ChromaticLines";
import { ChromaticCascade } from "@/components/motion/ChromaticCascade";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { FeatureAccordion } from "@/components/sections/FeatureAccordion";
import { AskChatAnim } from "@/components/sections/AskChatAnim";

/* Dotted-grid backdrop behind every demo mock, as in the original panels. */
const dots =
  "[background-image:radial-gradient(#221e1b_1px,transparent_1px)] [background-size:9px_9px]";

/* ---------------------------------------------------------------- glyphs */

function SourceGlyph({ glyph, color, size = 18 }: { glyph: string; color: string; size?: number }) {
  const paths: Record<string, React.ReactNode> = {
    waveform: <path d="M5 12v2m3-6v10m4-13v16m4-12v8m3-5v2" />,
    triangle: <path d="M12 4 21 19H3Z" fill={color} stroke="none" />,
    swirl: <path d="M12 4a8 8 0 1 1-8 8 5 5 0 1 0 5-5" />,
    clover: (
      <path d="M12 3a3 3 0 0 1 0 6 3 3 0 0 1 0-6ZM12 15a3 3 0 0 1 0 6 3 3 0 0 1 0-6ZM3 12a3 3 0 0 1 6 0 3 3 0 0 1-6 0ZM15 12a3 3 0 0 1 6 0 3 3 0 0 1-6 0Z" />
    ),
  };
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    >
      {paths[glyph] ?? paths.swirl}
    </svg>
  );
}

function NodeIcon({ d }: { d: string }) {
  return (
    <svg
      width={15}
      height={15}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={d} />
    </svg>
  );
}

const icons = {
  person: "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 10a7 7 0 0 1 14 0",
  users:
    "M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-6 9a6 6 0 0 1 12 0m2-9a4 4 0 0 0 0-8m6 17a6 6 0 0 0-4-5.7",
  doc: "M7 3h7l5 5v13H7Zm7 0v5h5",
  card: "M3 7h18v11H3Zm0 4h18",
  sync: "M20 12a8 8 0 1 1-2.3-5.7M20 3v4h-4",
};

/* --------------------------------------------------------------- cortex */

/* Both mocks below are laid out at the original's exact pixel geometry:
   a 320x428 assembly on the left panel, a 301x362 stack on the right. */
function EntityResolutionMock() {
  const sources = [
    { name: "Pipecloud", value: "John Smith", color: "#3e63dd", glyph: "swirl" },
    { name: "Gridwork", value: "J. Smith", color: "#10b981", glyph: "clover" },
    { name: "VaultDB", value: "jsmith@co.com", color: "#e5484d", glyph: "triangle" },
  ];
  const chip =
    "flex h-[19px] items-center rounded-full bg-[#1c1917] px-2 text-[11px] font-medium leading-[15px] text-fg";
  return (
    <div className="relative h-[428px] w-[320px] shrink-0">
      <span className={`absolute left-0 top-0 ${chip}`}>Records found</span>

      {sources.map((s, i) => (
        <div
          key={s.name}
          className="absolute left-0 h-[68px] w-[189px] rounded-xl border border-border bg-[#141210] p-3"
          style={{ top: 24 + i * 80 }}
        >
          <p className="flex h-5 items-center gap-2 text-xs leading-4 text-fg-faint">
            <SourceGlyph glyph={s.glyph} color={s.color} size={14} />
            {s.name}
          </p>
          <p className="mt-1 text-sm leading-5 text-fg">{s.value}</p>
        </div>
      ))}

      {/* elbows from each card's right edge converging onto one drop line */}
      <svg
        className="absolute"
        style={{ left: 189, top: 58, width: 26, height: 222 }}
        viewBox="0 0 26 222"
        fill="none"
        aria-hidden
      >
        {[0, 80, 160].map((o) => (
          <path
            key={o}
            d={`M0 ${o + 2} H14 A12 12 0 0 1 26 ${o + 14} V222`}
            stroke="#292524"
            strokeWidth={1}
          />
        ))}
      </svg>

      <span className={`absolute right-0 ${chip}`} style={{ top: 256 }}>
        Synced
      </span>
      <div
        className="absolute h-[148px] w-[211px] rounded-xl border border-border bg-[#141210] p-3"
        style={{ left: 109, top: 280 }}
      >
        <p className="text-base leading-6 text-fg">J. Smith</p>
        <p className="text-sm leading-5 text-fg-faint">john.smith@company.com</p>
        <p className="mt-6 font-mono text-xs font-medium leading-4 text-fg-faint">Synced from:</p>
        <div className="mt-1 flex gap-1">
          {sources.map((s) => (
            <span
              key={s.name}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-[#1c1917]"
            >
              <SourceGlyph glyph={s.glyph} color={s.color} size={20} />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LiveFeedMock() {
  const rows = [
    { title: "Account updated", sub: "Pipecloud", time: "just now" },
    { title: "New payment linked", sub: "Stride", time: "12s ago" },
    { title: "Record created", sub: "VaultDB", time: "28s ago" },
    { title: "Entity resolved", sub: "Pipecloud", time: "1m ago" },
    { title: "Subscription changed", sub: "Stride", time: "2m ago" },
  ];
  return (
    <div className="flex w-[301px] shrink-0 flex-col gap-2">
      {rows.map((r) => (
        <div
          key={r.title}
          className="relative flex h-[66px] items-center gap-3 rounded-xl border border-border bg-[#141210] p-3"
        >
          <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-md bg-[#1c1917] text-fg-faint">
            <NodeIcon d={icons.sync} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-sm font-medium leading-5 text-fg">{r.title}</p>
            <p className="mt-0 text-xs leading-4 text-fg-muted">{r.sub}</p>
          </div>
          <span className="self-end text-xs font-medium leading-4 text-fg-faint">{r.time}</span>
          <span className="absolute right-3 top-3 h-1.5 w-1.5 rounded-full bg-brand" />
        </div>
      ))}
    </div>
  );
}

function GraphExplorerMock() {
  const chain: { icon: keyof typeof icons; active?: boolean }[] = [
    { icon: "person" },
    { icon: "users" },
    { icon: "sync", active: true },
    { icon: "doc" },
    { icon: "card" },
  ];
  return (
    <div className="relative h-[372px] w-[366px] shrink-0">
      {/* the node chain is centred on x=194 of this box; 50px nodes, 32px links */}
      <div className="absolute left-[46px] top-0 flex w-[50px] flex-col items-center gap-8">
        {chain.map((n, i) =>
          n.active ? (
            <span
              key={i}
              className="flex h-11 items-center gap-2 rounded-xl bg-[#1c1917] px-2 font-mono text-xs font-medium leading-4 text-fg"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-border text-fg-faint">
                <NodeIcon d={icons.sync} />
              </span>
              Subscription
            </span>
          ) : (
            <span
              key={i}
              className="flex h-[50px] w-[50px] items-center justify-center rounded-xl border border-border bg-[#141210] text-fg-faint"
            >
              <NodeIcon d={icons[n.icon]} />
            </span>
          ),
        )}
      </div>
      {/* hairlines sitting in the 32px gaps */}
      {[50, 132, 208, 290].map((t) => (
        <span key={t} className="absolute left-[71px] h-8 w-px bg-border" style={{ top: t }} />
      ))}

      <div
        className="absolute h-[140px] w-[211px] rounded-xl border border-border bg-[#141210] p-3"
        style={{ left: 154, top: 116 }}
      >
        <div className="flex h-4 items-center justify-between">
          <SourceGlyph glyph="swirl" color="#6e56cf" size={16} />
          <span className="flex items-center gap-1.5 text-xs font-medium leading-4 text-fg">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            Active
          </span>
        </div>
        <div className="mt-3">
          {[
            ["Plan", "Enterprise"],
            ["Renewal", "Dec 14, 2025"],
            ["MRR", "$1,240"],
          ].map(([k, v]) => (
            <p key={k} className="flex h-7 items-center justify-between text-sm leading-5">
              <span className="font-medium text-fg-muted">{k}</span>
              <span className="font-medium text-fg">{v}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ ask */

function Token({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-md border border-border-strong/70 bg-surface-2 px-1.5 py-0.5 text-fg-soft">
      {children}
    </span>
  );
}

function SchemaMock() {
  const rows = [
    { label: "id", value: "uuid" },
    { label: "name", value: "string" },
    { label: "tier", value: "string", tone: "text-brand", chip: "Pipercloud" },
    { label: "owner_id", value: "uuid" },
    { label: "last_session", value: "timestamp", tone: "text-warn", chip: "database" },
    { label: "created_at", value: "timestamp", tone: "text-brand", chip: "auto-resolved" },
    { label: "mrr", value: "float" },
  ];
  return (
    <div className="flex flex-col items-center">
      <p className="flex flex-wrap items-center gap-1.5 text-sm text-fg-muted">
        Which <Token>accounts</Token> haven&rsquo;t <Token>logged in today</Token> ?
      </p>
      <span className="h-8 w-px bg-border-strong" />
      <div className="w-[290px] rounded-lg border border-border bg-bg-deep font-mono text-[11px]">
        <div className="flex items-center justify-between border-b border-border px-3 py-2 text-fg-faint">
          <span>accounts</span>
          <span>14,203 records</span>
        </div>
        {rows.map((r) => (
          <div
            key={r.label}
            className={`flex items-center justify-between border-b border-border/60 px-3 py-[7px] last:border-b-0 ${r.chip ? "bg-surface" : ""}`}
          >
            <span className={r.tone ?? "text-fg-muted"}>{r.label}</span>
            <span className="flex items-center gap-2 text-fg-faint">
              {r.value}
              {r.chip && (
                <span className="rounded border border-border-strong/60 bg-surface-2 px-1.5 py-px text-fg-dim">
                  {r.chip}
                </span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FollowUpsMock() {
  const followUps = [
    "How has their usage trended?",
    "Who is the account owner for each?",
    "Ask a different question",
  ];
  return (
    <div className="flex w-full max-w-[330px] flex-col">
      <div className="max-w-[210px] self-end rounded-xl rounded-br-sm border border-border-strong/60 bg-surface-2 px-4 py-3 text-[13px] leading-snug text-fg-dim">
        Which accounts are at risk this quarter?
      </div>
      <div className="mt-4 max-w-[270px] self-start rounded-xl rounded-bl-sm border border-border bg-bg-deep px-4 py-3 text-[13px] leading-snug text-fg-muted">
        4 enterprise accounts with no session activity in the current calendar month.
      </div>
      <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-bg-deep">
        {followUps.map((q, i) => {
          const last = i === followUps.length - 1;
          return (
            <div key={q} className="flex items-center gap-3 px-3.5 py-3 text-[13px] text-fg-dim">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded border border-border font-mono text-[10px] text-fg-faint">
                {i + 1}
              </span>
              <span className="flex-1">{q}</span>
              {last ? (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 text-fg-muted">
                  <ArrowRight width={12} height={12} />
                </span>
              ) : (
                <ArrowUpRight width={13} height={13} className="text-fg-faint" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ShareMock() {
  const rows = [
    { title: "Send to Threadbase", sub: "Post to any channel", icon: "clover", color: "#36c5f0" },
    { title: "Export CSV", sub: "Download as spreadsheet", icon: "doc" },
    { title: "Export JSON", sub: "Structured data output", icon: "code" },
  ];
  return (
    <div className="flex flex-col items-center">
      <span className="rounded-lg border border-border-strong/70 bg-surface-2 px-4 py-2 text-[13px] font-medium text-fg">
        Share results
      </span>
      <span className="h-7 w-px bg-border-strong" />
      <div className="w-[290px] divide-y divide-border rounded-xl border border-border bg-bg-deep">
        {rows.map((r) => (
          <div key={r.title} className="flex items-center gap-3 px-3.5 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
              {r.icon === "clover" ? (
                <SourceGlyph glyph="clover" color={r.color!} size={15} />
              ) : r.icon === "doc" ? (
                <span className="text-fg-faint">
                  <NodeIcon d={icons.doc} />
                </span>
              ) : (
                <svg
                  width={15}
                  height={15}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.7}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-fg-faint"
                >
                  <path d="m8 7-5 5 5 5m8-10 5 5-5 5" />
                </svg>
              )}
            </span>
            <div>
              <p className="text-[13px] font-medium text-fg-soft">{r.title}</p>
              <p className="mt-0.5 text-xs text-fg-faint">{r.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Full-width query band over the wave art, as on the original Ask page. */
function AskWavesPanel() {
  /* The original runs the same particle-grid + chat loop as the home page's
     Statement section here, in a 500px full-width band. */
  return (
    <div className="h-[500px] overflow-hidden border-t border-border">
      <AskChatAnim />
    </div>
  );
}

/* ---------------------------------------------------------------- pulse */

function PulseAlertMock() {
  return (
    <div className="relative">
      <div className="w-[300px] rounded-xl border border-border-strong/50 bg-surface">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <span className="rounded-md bg-surface-2 px-2.5 py-1 text-xs font-medium text-fg-dim">
              High severity
            </span>
            <span className="text-xs text-fg-faint">2 min ago</span>
          </div>
          <p className="mt-3.5 text-[15px] font-medium text-fg-soft">Active sessions</p>
          <p className="mt-1.5 text-[13px] leading-snug text-fg-muted">
            Activation in EU markets fell from 34% to 22% over the past 6 hours.
          </p>
          <svg viewBox="0 0 260 70" className="mt-4 w-full">
            <polyline
              points="0,28 40,25 80,29 120,24 160,27 200,26 260,22"
              fill="none"
              stroke="#57534e"
              strokeWidth="1.5"
            />
            <polyline
              points="160,27 190,30 210,55 235,38 260,42"
              fill="none"
              stroke="#e5484d"
              strokeWidth="1.5"
            />
            <circle cx="210" cy="55" r="3" fill="#e5484d" />
            <text x="200" y="14" fill="#79716b" fontSize="10">
              Baseline
            </text>
            <text x="160" y="68" fill="#e5484d" fontSize="10">
              Anomaly
            </text>
          </svg>
          <div className="mt-3 flex justify-between font-mono text-[10px] text-fg-disabled">
            <span>Oct 1</span>
            <span>Oct 8</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs">
          <span className="flex items-center gap-2 text-fg-muted">
            <span className="flex h-4 w-4 items-center justify-center rounded bg-surface-2 font-mono text-[9px] text-fg-faint">
              #
            </span>
            Sent to <span className="font-medium text-fg-dim">#product-alerts</span>
          </span>
        </div>
      </div>
      <div className="absolute -right-24 bottom-4 w-[195px] rounded-lg border border-border-strong/60 bg-surface-2 p-3 font-mono text-[11px] shadow-xl shadow-black/50">
        {[
          ["metric", "active_sessions", "text-fg"],
          ["current", "1,840", "text-fg"],
          ["expected", "3,200–3,800", "text-fg"],
          ["deviation", "-42%", "text-danger"],
        ].map(([k, v, tone]) => (
          <p key={k} className="flex items-center justify-between py-0.5">
            <span className="text-fg-faint">{k}</span>
            <span className={tone}>{v}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

function SeverityScoreMock() {
  const rows = [
    { label: "Deviation from baseline", value: "-34% · high", bar: "bg-danger", w: "w-[72%]" },
    { label: "Timing context", value: "peak traffic window", bar: "bg-warn", w: "w-[46%]" },
    { label: "Business impact", value: "revenue-critical metric", bar: "bg-danger", w: "w-[82%]" },
    { label: "Historical recurrence", value: "first occurrence", bar: "bg-brand", w: "w-[38%]" },
  ];
  return (
    <div className="w-[320px] rounded-xl border border-border-strong/50 bg-surface p-5">
      <div className="flex items-center justify-between">
        <p className="text-[15px] font-medium text-fg-soft">Active sessions</p>
        <p className="font-mono text-xs text-fg-faint">
          <span className="text-fg-dim">87</span> / 100
        </p>
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-xs text-fg-faint">
        Source:
        <SourceGlyph glyph="swirl" color="#79716b" size={12} />
        <span className="text-fg-muted">Stride</span> /
        <SourceGlyph glyph="waveform" color="#79716b" size={12} />
        <span className="text-fg-muted">Mixboard</span>
      </p>
      <p className="mt-5 font-mono text-[10px] uppercase tracking-wider text-fg-disabled">
        Score breakdown
      </p>
      <div className="mt-2">
        {rows.map((r) => (
          <div key={r.label} className="py-2">
            <p className="flex items-center justify-between gap-3">
              <span className="text-[13px] text-fg-dim">{r.label}</span>
              <span className="whitespace-nowrap font-mono text-[11px] text-fg-faint">
                {r.value}
              </span>
            </p>
            <div className="mt-1.5 h-px w-full bg-border">
              <div className={`h-[2px] -translate-y-px rounded ${r.bar} ${r.w}`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- showcase */

const mocksBySlug: Record<string, React.ReactNode[]> = {
  review: [<EntityResolutionMock key="0" />, <LiveFeedMock key="1" />, <GraphExplorerMock key="2" />],
  agents: [<SchemaMock key="0" />, <FollowUpsMock key="1" />, <ShareMock key="2" />],
  checks: [<PulseAlertMock key="0" />, <SeverityScoreMock key="1" />],
};

function PanelText({ benefit }: { benefit: FeatureBenefit }) {
  return (
    <ChromaticCascade
      blocks={[
        {
          kind: "text",
          tag: "h3",
          className: "text-[18px] font-semibold leading-6 text-fg",
          segments: [{ text: benefit.title }],
        },
        {
          kind: "text",
          tag: "p",
          className: "mt-2 text-base leading-6 text-fg-muted",
          segments: [{ text: benefit.body }],
        },
      ]}
    />
  );
}

function Panel({
  benefit,
  mock,
  dense = false,
  stage = 480,
}: {
  benefit: FeatureBenefit;
  mock: React.ReactNode;
  dense?: boolean;
  /** Height of the dotted stage — 480 on cortex, 440 on pulse. */
  stage?: number;
}) {
  /* Two-up panels (cortex, pulse) are 40px-padded with a 480px stage; the
     three-up ask panels inset the stage 20px and the copy 36px. */
  if (dense) {
    return (
      <div className="flex flex-col px-9 pb-9 pt-5">
        <Reveal
          className={`-mx-4 flex h-[422px] items-center justify-center overflow-hidden ${dots}`}
        >
          {mock}
        </Reveal>
        <div className="mt-14">
          <PanelText benefit={benefit} />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col p-10">
      <Reveal
        className={`flex items-center justify-center overflow-hidden ${dots}`}
        style={{ height: stage }}
      >
        {mock}
      </Reveal>
      <div className="mt-10">
        <PanelText benefit={benefit} />
      </div>
    </div>
  );
}

/**
 * Hairline-divided demo panel grid under each feature hero:
 * cortex = 2 panels + full-width panel, ask = 3 panels + wave band, pulse = 2 panels.
 */
export function FeatureShowcase({ slug, benefits }: { slug: string; benefits: FeatureBenefit[] }) {
  const mocks = mocksBySlug[slug] ?? [];
  const across = slug === "agents" ? benefits.length : Math.min(benefits.length, 2);
  const inGrid = benefits.slice(0, across);
  const fullWidth = benefits[across];

  return (
      <section className="border-y border-border">
        <div
          className={`grid divide-y divide-border md:divide-x md:divide-y-0 ${
            across === 3 ? "md:grid-cols-3" : "md:grid-cols-2"
          }`}
        >
          {inGrid.map((benefit, i) => (
            <Panel
              key={benefit.title}
              benefit={benefit}
              mock={mocks[i]}
              dense={across === 3}
              stage={slug === "checks" ? 440 : 480}
            />
          ))}
        </div>
        {fullWidth && (
          <div className="grid border-t border-border md:grid-cols-2">
            <div className="flex flex-col justify-end p-10">
              <PanelText benefit={fullWidth} />
            </div>
            <Reveal
              className={`m-10 flex h-[446px] items-center justify-center overflow-hidden ${dots}`}
            >
              {mocks[across]}
            </Reveal>
          </div>
        )}
        {slug === "agents" && <AskWavesPanel />}
      </section>
  );
}

/* --------------------------------------------------------- mid sections */



/** Cortex mid: two-tone headline + accordion copy beside the connected-sources card. */

/* Small decorative marks on the right edge of pulse accordion rows. */

function BaselineChartCard() {
  return (
    <div className="w-full max-w-[480px] rounded-xl border border-border bg-bg-deep p-5">
      <div className="flex items-center justify-between font-mono text-[11px] text-fg-faint">
        <span>MRR · 90D</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-fg-disabled" />
          Learning
        </span>
      </div>
      <p className="mt-3 text-[15px] text-fg-soft">Baseline adjusting as business grows</p>
      <svg viewBox="0 0 440 150" className="mt-5 w-full">
        <polygon
          points="0,96 70,90 140,84 210,70 280,52 350,36 440,28 440,58 350,64 280,80 210,98 140,112 70,116 0,120"
          fill="#10ec90"
          opacity="0.08"
        />
        <polyline
          points="0,96 70,90 140,84 210,70 280,52 350,36 440,28"
          fill="none"
          stroke="#10ec90"
          strokeWidth="1.3"
          opacity="0.75"
        />
        <polyline
          points="0,120 70,116 140,112 210,98 280,80 350,64 440,58"
          fill="none"
          stroke="#10ec90"
          strokeWidth="1.3"
          opacity="0.75"
        />
        <polyline
          points="0,110 70,104 140,100 210,86 280,64 350,48"
          fill="none"
          stroke="#e7e5e4"
          strokeWidth="1.4"
        />
        <polyline
          points="350,48 395,44 440,40"
          fill="none"
          stroke="#e7e5e4"
          strokeWidth="1.4"
          strokeDasharray="4 4"
        />
      </svg>
      <div className="mt-3 flex justify-between font-mono text-[11px] text-fg-disabled">
        {["Day 1", "Day 20", "Day 40", "Day 60", "Day 80"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
}

/** Pulse mid: centered two-tone headline band, then chart + accordion tiles. */
export function PulseMidSection({ mid }: { mid: FeatureMidSection }) {
  const [first, ...rest] = mid.title.split("\n");
  return (
    <>
      {/* 390px band with the two-tone line centred in it */}
      <section className="flex h-[390px] items-center justify-center px-6">
        <ChromaticLines
          as="h2"
          className="max-w-[560px] text-center text-[28px] font-semibold tracking-tight md:text-[32px] md:leading-[34px]"
          segments={[
            { text: `${first} `, className: "text-fg-muted" },
            { text: rest.join(" "), className: "text-fg" },
          ]}
        />
      </section>
      <section className="grid items-center gap-12 border-t border-border px-6 py-16 md:grid-cols-[668fr_588fr] md:px-10">
        <Reveal className={`flex h-[450px] items-center justify-center overflow-hidden ${dots}`}>
          <BaselineChartCard />
        </Reveal>
        <Reveal>
          <FeatureAccordion items={mid.items} muteClosed bodyGap="mt-4" dividers="all" marks />
        </Reveal>
      </section>
    </>
  );
}
