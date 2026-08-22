"use client";

/**
 * Port of the original site's `Ask Chat Anim` Framer smart component — the
 * looping chat demo under the Statement heading.
 *
 * The original is a six-variant state machine driven by `useOnVariantChange`
 * delays. Reproduced verbatim:
 *
 *   Primary   2000ms -> Chat start
 *   Chat start 2000ms -> Thinking
 *   Thinking  4000ms -> Results
 *   Results   3500ms -> Loop Reset
 *   Loop Reset 500ms -> Primary        (12s round trip)
 *
 * Everything else is variant-driven: the placeholder swaps for a character-by-
 * character typed message, the quick-action chips and the composer buttons fade
 * out, a status pill slides up through a clipped 64px window, a results panel
 * opens with a colour-sweeping status ticker, then three result rows slide in
 * from the right. Behind it all, the WebGL particle grid speeds up and swells
 * while the assistant "works".
 */

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ParticleGrid } from "@/components/three/ParticleGrid";
import { askChat } from "@/content/home";
import {
  Activity,
  AlignHorizontalJustifyCenter,
  ChartPie,
  ChevronRight,
  ClipboardList,
  FileSpreadsheet,
  MessageSquareShare,
  Mic,
  Plus,
  Starburst,
} from "@/components/ui/icons";

type Step = "idle" | "typing" | "thinking" | "results" | "reset";

/** Variant name -> dwell time, straight from the original's delay calls. */
const SEQUENCE: { step: Step; ms: number }[] = [
  { step: "idle", ms: 2000 },
  { step: "typing", ms: 2000 },
  { step: "thinking", ms: 4000 },
  { step: "results", ms: 3500 },
  { step: "reset", ms: 500 },
];

/** The site's standard appear ease. */
const EASE = [0.12, 0.23, 0.5, 1] as const;
/** The ease the result rows use (animation8..13). */
const ROW_EASE = [0.44, 0, 0.56, 1] as const;
const SPRING = { type: "spring", bounce: 0.2, duration: 0.4 } as const;

const CHIP_ICONS = {
  analyze: ChartPie,
  compare: AlignHorizontalJustifyCenter,
  monitor: Activity,
  report: ClipboardList,
  export: FileSpreadsheet,
  share: MessageSquareShare,
} as const;

type ChipIcon = keyof typeof CHIP_ICONS;

function Chip({ icon, label }: { icon: ChipIcon; label: string }) {
  const Icon = CHIP_ICONS[icon];
  return (
    <span className="flex items-center gap-2 rounded-lg border border-[#262626] bg-[rgb(20,18,16)] p-2 text-[12px] leading-4 font-medium text-[rgb(161,161,161)]">
      <Icon width={14} height={14} />
      {label}
    </span>
  );
}

function StatusPill({ label, position }: { label: string; position: "below" | "in" | "above" }) {
  return (
    <motion.div
      className="absolute left-1/2 rounded-lg border border-[#262626] bg-[rgb(20,18,16)] px-2 py-1 text-[12px] leading-4 font-medium whitespace-pre text-[rgb(161,161,161)]"
      initial={false}
      animate={{
        opacity: position === "in" ? 1 : 0,
        y: position === "in" ? 0 : position === "below" ? 32 : -32,
      }}
      transition={{ duration: 0.4, delay: position === "in" ? 0.2 : 0, ease: EASE }}
      style={{ x: "-50%" }}
    >
      {label}
    </motion.div>
  );
}

/**
 * Port of `TextTransitionV2`: every character flips in on the X axis with a
 * 20ms per-character stagger, and — on every line but the last — a rainbow
 * band sweeps along the word once a second (`.chat-ticker-sweep` in
 * globals.css reproduces the original's colour ramp).
 */
function StatusTicker({ lines, play, cycle }: { lines: string[]; play: boolean; cycle: number }) {
  // The parent remounts this on every run, so index always starts at 0.
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!play) return;
    let i = 0;
    // playMode "once": advance every 2s and stop on the final line.
    const id = setInterval(() => {
      i += 1;
      if (i >= lines.length - 1) clearInterval(id);
      setIndex(Math.min(i, lines.length - 1));
    }, 2000);
    return () => clearInterval(id);
  }, [play, lines.length]);

  const text = lines[index] ?? "";
  const isLast = index === lines.length - 1;

  return (
    <p className="relative m-0 w-fit font-mono text-[12px] leading-5 font-medium text-[rgb(115,115,115)]">
      <AnimatePresence mode="popLayout" initial={false}>
        {Array.from(text).map((char, i) => (
          <motion.span
            key={`${cycle}-${index}-${i}-${char}`}
            className={play && !isLast ? "chat-ticker-sweep" : undefined}
            style={{
              display: "inline-block",
              whiteSpace: "pre",
              transformOrigin: "center center -5px",
              animationDelay: `${i * 0.02}s`,
            }}
            initial={{ rotateX: -90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            exit={{ rotateX: 90, opacity: 0 }}
            transition={{ duration: 0.2, delay: i * 0.02, ease: EASE }}
          >
            {char}
          </motion.span>
        ))}
      </AnimatePresence>
    </p>
  );
}

function ResultRow({ row, delay }: { row: (typeof askChat.rows)[number]; delay: number }) {
  return (
    <motion.div
      className="flex w-full items-center justify-between"
      initial={{ opacity: 0.001, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay, ease: ROW_EASE }}
    >
      <span className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[rgb(23,23,23)]">
          <Starburst width={16} height={16} className="text-[rgb(115,115,115)]" />
        </span>
        <span className="text-[14px] leading-5 font-medium whitespace-pre text-fg">{row.name}</span>
        <span
          className="flex items-center gap-1 text-[12px] leading-4 font-medium whitespace-pre"
          style={{ color: row.tint }}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: row.tint }} />
          {row.risk}
        </span>
      </span>
      <span
        className="rounded px-2 py-1 text-[12px] leading-4 font-medium whitespace-pre"
        style={{ background: row.tintSoft, color: row.tint }}
      >
        {row.reason}
      </span>
    </motion.div>
  );
}

function Divider({ delay }: { delay: number }) {
  return (
    <motion.div
      className="h-px w-full bg-[#262626]"
      initial={{ opacity: 0.001, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay, ease: ROW_EASE }}
    />
  );
}

export function AskChatAnim() {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => {
      const next = (i + 1) % SEQUENCE.length;
      if (next === 0) setCycle((c) => c + 1);
      setI(next);
    }, SEQUENCE[i].ms);
    return () => clearTimeout(t);
  }, [i, reduced]);

  // Reduced motion: park on the finished state, no loop, no WebGL.
  const step: Step = reduced ? "results" : SEQUENCE[i].step;

  const working = step === "thinking" || step === "results";
  const showMessage = step === "typing" || working;
  const showRows = step === "results" || step === "reset";
  const showActionRow = working || step === "reset";
  const composerVisible = !working;

  const thinkingPos = step === "thinking" ? "in" : working || step === "reset" ? "above" : "below";
  const resultsPos = step === "results" ? "in" : step === "reset" ? "above" : "below";

  const grid = working
    ? { noiseFrequency: 3, noiseLayerSpread: 0.01, timeScale: 0.31, waveHeightScale: 0.14 }
    : step === "typing"
      ? { noiseFrequency: 2, noiseLayerSpread: 0.005, timeScale: 0.25, waveHeightScale: 0.1 }
      : { noiseFrequency: 2, noiseLayerSpread: 0.005, timeScale: 0.05, waveHeightScale: 0.1 };

  return (
    <div
      // Fixed 517px stage, same as the original's Example row. The extra bottom
      // padding lifts the composer above centre so the results panel has room
      // to open below it (200px on small screens, 80px on desktop).
      className="relative flex h-[517px] w-full items-center justify-center px-4 pt-4 pb-[200px] md:pb-20"
    >
      {!reduced && (
        <ParticleGrid
          className="absolute inset-0 h-full w-full opacity-30 [mask-image:linear-gradient(0deg,transparent_0%,#000_22%)]"
          {...grid}
        />
      )}

      {/* Stack: composer + quick actions + results panel */}
      <div className="relative z-10 flex w-full max-w-[460px] flex-col items-center gap-2 select-none">
        {/* Composer — the gradient hairline is the original's 111deg border */}
        <div
          className="relative w-full rounded-2xl"
          style={{
            background:
              "linear-gradient(111deg, rgb(68,64,60) 0%, rgb(41,37,36) 35%, rgb(38,38,38) 73%, rgb(68,64,60) 100%)",
          }}
        >
          <div className="absolute inset-px rounded-[15px] bg-[rgb(17,15,13)]" />
          <div className="relative flex flex-col gap-4">
            <div className="flex items-center gap-2 pr-2 pl-5">
              <div className="flex flex-1 items-center py-5">
                {showMessage ? (
                  <p key={cycle} className="m-0 text-[16px] leading-6 text-fg">
                    {/* textEffect1: per-character appear, 25ms apart */}
                    {Array.from(askChat.message).map((char, n) => (
                      <motion.span
                        key={n}
                        initial={reduced ? false : { opacity: 0.001 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.01, delay: n * 0.025 }}
                        style={{ whiteSpace: "pre" }}
                      >
                        {char}
                      </motion.span>
                    ))}
                  </p>
                ) : (
                  <motion.p
                    className="m-0 text-[16px] leading-6 text-[rgb(115,115,115)]"
                    initial={{ opacity: 0.001 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: 0.3, ease: EASE }}
                  >
                    {askChat.placeholder}
                  </motion.p>
                )}
              </div>

              {/* Status window — pills slide through a clipped 64px column */}
              <div className="relative h-16 w-[91px] shrink-0 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <StatusPill label={askChat.thinkingLabel} position={thinkingPos} />
                  <StatusPill label={askChat.resultsLabel} position={resultsPos} />
                </div>
              </div>
            </div>

            {/* While the assistant works the original takes this row out of
                flow (absolute, bottom -48) so the composer collapses to one
                line and the results panel tucks up under it. */}
            <motion.div
              className={`flex items-center justify-between px-3 pb-3 ${
                composerVisible ? "relative" : "pointer-events-none absolute inset-x-0 -bottom-12"
              }`}
              animate={{ opacity: composerVisible ? 1 : 0 }}
              transition={SPRING}
            >
              <span className="p-2 text-[rgb(115,115,115)]">
                <Plus width={20} height={20} />
              </span>
              <motion.span
                className="rounded-xl p-2 text-fg"
                animate={{
                  backgroundColor:
                    step === "thinking"
                      ? "rgb(38,38,38)"
                      : step === "typing"
                        ? "rgb(28,25,23)"
                        : "rgba(38,38,38,0)",
                }}
                transition={SPRING}
              >
                {showMessage ? (
                  <ChevronRight width={20} height={20} />
                ) : (
                  <Mic width={20} height={20} />
                )}
              </motion.span>
            </motion.div>
          </div>
        </div>

        {/* Quick actions */}
        <motion.div
          className={`flex flex-wrap items-center justify-center gap-1 px-4 ${
            composerVisible
              ? "relative w-full"
              : "pointer-events-none absolute inset-x-0 top-8"
          }`}
          animate={{ opacity: composerVisible ? 1 : 0 }}
          transition={{ ...SPRING, delay: step === "reset" ? 0.2 : 0 }}
        >
          {askChat.chips.map((chip) => (
            <Chip key={chip.label} icon={chip.icon as ChipIcon} label={chip.label} />
          ))}
        </motion.div>

        {/* Results panel: in flow while the assistant works, tucked back under
            the composer otherwise. */}
        <motion.div
          className={`flex flex-col items-center justify-center gap-4 rounded-2xl border border-[#262626] bg-[rgb(20,18,16)] p-5 ${
            working ? "relative w-full" : "pointer-events-none absolute right-0 -bottom-[68px] left-0"
          }`}
          animate={{ opacity: working ? 1 : 0 }}
          transition={{ ...SPRING, delay: step === "thinking" ? 0.2 : 0 }}
        >
          <motion.div
            className="w-full"
            animate={{ opacity: working ? 1 : 0 }}
            transition={SPRING}
          >
            <StatusTicker
              key={cycle}
              lines={askChat.ticker}
              play={working || reduced === true}
              cycle={cycle}
            />
          </motion.div>

          {showRows && (
            <div className="flex w-full flex-col items-center justify-center gap-4">
              <ResultRow row={askChat.rows[0]} delay={0.1} />
              <Divider delay={0.15} />
              <ResultRow row={askChat.rows[1]} delay={0.2} />
              <Divider delay={0.25} />
              <ResultRow row={askChat.rows[2]} delay={0.3} />
            </div>
          )}
        </motion.div>

        {/* Post-answer actions, 44px below the stack */}
        {showActionRow && (
          <motion.div
            className="pointer-events-none absolute right-0 -bottom-11 left-0 flex flex-wrap items-center justify-center gap-1 px-4"
            animate={{ opacity: step === "results" ? 1 : 0 }}
            transition={SPRING}
          >
            {askChat.resultActions.map((action, n) => (
              <motion.span
                key={action.label}
                initial={{ opacity: 0.001, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: n * 0.1, ease: EASE }}
              >
                <Chip icon={action.icon as ChipIcon} label={action.label} />
              </motion.span>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

/**
 * The same component's `Standalone` variant, used as the Ask slot in the
 * pinned Features section: composer + N quick actions, no status pills, no
 * results, no loop, no particle grid. Everything appears on mount — the
 * placeholder character-by-character (the original's `textEffect`), the chips
 * staggered 0.1s apart.
 */
export function AskComposer({ chips = 3, className }: { chips?: number; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <div className={`flex flex-col items-center gap-2 p-4 select-none ${className ?? "w-full"}`}>
      <div
        className="relative w-full rounded-2xl"
        style={{
          background:
            "linear-gradient(111deg, rgb(68,64,60) 0%, rgb(41,37,36) 35%, rgb(38,38,38) 73%, rgb(68,64,60) 100%)",
        }}
      >
        <div className="absolute inset-px rounded-[15px] bg-[rgb(17,15,13)]" />
        <div className="relative flex flex-col gap-4">
          <div className="flex items-center gap-2 pr-2 pl-5">
            <p className="m-0 flex-1 py-5 text-[16px] leading-6 text-[rgb(115,115,115)]">
              {Array.from(askChat.placeholder).map((char, n) => (
                <motion.span
                  key={n}
                  initial={reduced ? false : { opacity: 0.001, y: 2, filter: "blur(3px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 0.1, delay: 0.1 + n * 0.025, ease: EASE }}
                  style={{ display: "inline-block", whiteSpace: "pre" }}
                >
                  {char}
                </motion.span>
              ))}
            </p>
          </div>
          <div className="flex items-center justify-between px-3 pb-3">
            <span className="p-2 text-[rgb(115,115,115)]">
              <Plus width={20} height={20} />
            </span>
            <span className="p-2 text-fg">
              <Mic width={20} height={20} />
            </span>
          </div>
        </div>
      </div>

      <div className="flex w-full flex-wrap items-center justify-center gap-1 px-4">
        {askChat.chips.slice(0, chips).map((chip, n) => (
          <motion.span
            key={chip.label}
            initial={reduced ? false : { opacity: 0.001, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: 0.1 + n * 0.1, ease: EASE }}
          >
            <Chip icon={chip.icon as ChipIcon} label={chip.label} />
          </motion.span>
        ))}
      </div>
    </div>
  );
}
