"use client";

/**
 * Review-page signature graphics.
 *
 * Same motion family as the homepage Statement: a live WebGL wave with a
 * looping product scene in front of it. One loop tells the whole story —
 * Connect → Review → Ship — so the section teaches without the user scrolling.
 * Only one GPGPU field on this page (here); the specialist mark below is SVG.
 */

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ParticleGrid } from "@/components/three/ParticleGrid";

export const REVIEW_EASE = [0.12, 0.23, 0.5, 1] as const;
export const REVIEW_DWELL = [2600, 4400, 3200] as const;

const NODES = [
  { n: "1", label: "Connect" },
  { n: "2", label: "Review" },
  { n: "3", label: "Ship" },
];

/* Facts here mirror content/integrations.ts and content/features.ts: GitHub
   App or GitLab token, Anthropic or OpenRouter, agents the team names. */
const CONNECT_ROWS = [
  { k: "Repository", v: "teracodeai/api" },
  { k: "Forge", v: "GitHub App" },
  { k: "Provider", v: "Anthropic · sk-…c91" },
];

const SPECIALISTS = [
  { name: "Security", detail: "2 findings", tone: "text-danger" },
  { name: "Team Lead", detail: "1 regression", tone: "text-warn" },
  { name: "Senior Eng", detail: "coverage -3%", tone: "text-warn" },
  { name: "Compliance", detail: "clean", tone: "text-fg-faint" },
];

const SHIP_ROWS = [
  { k: "Comments posted", v: "1 review" },
  { k: "Duplicates merged", v: "12 → 5" },
  { k: "Checks posted", v: "4" },
];

const MARK = [
  { name: "Security", x: 50, y: 14 },
  { name: "Team Lead", x: 17, y: 50 },
  { name: "Senior Eng", x: 83, y: 50 },
  { name: "Compliance", x: 50, y: 86 },
] as const;

/**
 * Every loop on this page is paused while its section is off screen. Lenis
 * drives the scroll from rAF, so a timer that re-renders a table the visitor
 * cannot see is paid for in scroll smoothness. `FeatureAccordion` gates its
 * own advance the same way.
 */
export function useOnScreen<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), {
      rootMargin: "120px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, on };
}

export function useReviewTick(ms: number, steps: number, pauseAtEnd = 0, paused = false) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(reduced ? steps - 1 : 0);
  useEffect(() => {
    if (reduced || paused) return;
    const t = setTimeout(() => setI((n) => (n + 1) % (steps + pauseAtEnd)), ms);
    return () => clearTimeout(t);
  }, [i, ms, reduced, steps, pauseAtEnd, paused]);
  return Math.min(i, steps - 1);
}

export function useReviewCycle(paused = false) {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced || paused) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % REVIEW_DWELL.length), REVIEW_DWELL[active]);
    return () => clearTimeout(t);
  }, [active, reduced, paused]);

  return reduced ? 2 : active;
}

function Row({ k, v, tone }: { k: string; v: string; tone?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2">
      <span className="text-[13px] leading-5 text-fg-muted">{k}</span>
      <span className={`font-mono text-[12px] leading-5 ${tone ?? "text-fg"}`}>{v}</span>
    </div>
  );
}

function ConnectScene() {
  return (
    <div className="w-full">
      {CONNECT_ROWS.map((r, i) => (
        <motion.div
          key={r.k}
          initial={{ opacity: 0, transform: "translateY(8px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.35, delay: 0.06 * i, ease: REVIEW_EASE }}
        >
          <Row k={r.k} v={r.v} />
        </motion.div>
      ))}
      <p className="mt-3 font-mono text-[11px] leading-4 text-fg-disabled">
        Keys stay yours. TeraCodeAI never resells inference.
      </p>
    </div>
  );
}

function ReviewScene() {
  /* Four specialists resolve one after another, then the scan settles. Only
     mounted while the stage is on screen, so it needs no gate of its own. */
  const done = useReviewTick(700, SPECIALISTS.length + 1);

  return (
    <div className="relative w-full">
      <span className="review-scan pointer-events-none absolute inset-x-0 top-0 h-px bg-brand/70" />
      {SPECIALISTS.map((s, i) => {
        const running = i === done;
        const finished = i < done;
        return (
          <motion.div
            key={s.name}
            className="flex items-center justify-between gap-4 py-2"
            animate={{ opacity: finished || running ? 1 : 0.3 }}
            transition={{ duration: 0.25, ease: REVIEW_EASE }}
          >
            <span className="flex items-center gap-2.5 text-[13px] leading-5 text-fg">
              <motion.span
                className="h-1.5 w-1.5 rounded-full"
                animate={{
                  backgroundColor: finished
                    ? "rgb(16,236,144)"
                    : running
                      ? "rgb(54,197,240)"
                      : "rgb(87,83,78)",
                  boxShadow: running ? "0 0 10px #36c5f0" : "0 0 0 transparent",
                }}
                transition={{ duration: 0.25, ease: REVIEW_EASE }}
              />
              {s.name}
            </span>
            <span
              className={`font-mono text-[12px] leading-5 ${finished ? s.tone : "text-fg-disabled"}`}
            >
              {finished ? s.detail : running ? "reading diff…" : "queued"}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}

function ShipScene() {
  return (
    <div className="w-full">
      {SHIP_ROWS.map((r, i) => (
        <motion.div
          key={r.k}
          initial={{ opacity: 0, transform: "translateY(8px)" }}
          animate={{ opacity: 1, transform: "translateY(0px)" }}
          transition={{ duration: 0.35, delay: 0.06 * i, ease: REVIEW_EASE }}
        >
          <Row k={r.k} v={r.v} tone={r.k === "Blocking" ? "text-danger" : "text-fg"} />
        </motion.div>
      ))}
      <motion.p
        className="mt-3 font-mono text-[11px] leading-4 text-brand"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35, delay: 0.2, ease: REVIEW_EASE }}
      >
        One review, one check per agent. Merge stays yours.
      </motion.p>
    </div>
  );
}

const SCENES = [ConnectScene, ReviewScene, ShipScene];
const STATUS = ["Connected", "Reviewing", "Reviewed"];
const STATUS_TONE = ["text-fg-muted", "text-info", "text-brand"];

/**
 * The Connect → Review → Ship stage: a live wave, one PR card that plays the
 * whole loop, and the rail underneath that tracks where the loop is.
 */
export function ReviewFlow({ active }: { active: number }) {
  const reduced = useReducedMotion();
  const { ref, on } = useOnScreen<HTMLDivElement>();
  const Scene = SCENES[active] ?? SCENES[0];
  const working = active === 1;

  const grid = working
    ? { noiseFrequency: 3, timeScale: 0.34, waveHeightScale: 0.22, noiseLayerSpread: 0.012 }
    : { noiseFrequency: 2, timeScale: 0.14, waveHeightScale: 0.16, noiseLayerSpread: 0.006 };

  return (
    <div ref={ref} className="relative flex h-[460px] w-full items-center justify-center px-4">
      {/* Masked from the bottom only, as on the home page's chat stage. A centre
          mask would hide the wave exactly where the card already covers it. */}
      {!reduced && on && (
        <ParticleGrid
          className="absolute inset-0 h-full w-full opacity-70 [mask-image:linear-gradient(0deg,transparent_0%,#000_10%)]"
          {...grid}
        />
      )}

      <div className="relative z-10 flex w-full max-w-[440px] flex-col items-center">
        {/* PR card — the scene swaps inside it, the frame stays put */}
        <div
          className="w-full rounded-2xl p-px"
          style={{
            background:
              "linear-gradient(111deg, rgb(68,64,60) 0%, rgb(41,37,36) 35%, rgb(38,38,38) 73%, rgb(68,64,60) 100%)",
          }}
        >
          <div className="rounded-[15px] bg-[rgb(17,15,13)] p-5">
            <div className="flex items-center justify-between gap-4 border-b border-[#262626] pb-3">
              <p className="font-mono text-[13px] leading-5 text-fg">PR #482</p>
              <motion.span
                key={active}
                className={`font-mono text-[11px] leading-4 ${STATUS_TONE[active]}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, ease: REVIEW_EASE }}
              >
                {STATUS[active]}
              </motion.span>
            </div>

            {/* Fixed height so the frame never resizes between scenes */}
            <div className="relative mt-2 h-[164px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="absolute inset-0"
                  initial={reduced ? { opacity: 0 } : { opacity: 0, transform: "translateY(10px)" }}
                  animate={reduced ? { opacity: 1 } : { opacity: 1, transform: "translateY(0px)" }}
                  exit={reduced ? { opacity: 0 } : { opacity: 0, transform: "translateY(-8px)" }}
                  transition={{ duration: 0.3, ease: REVIEW_EASE }}
                >
                  <Scene />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Rail — where the loop currently is */}
        <div className="mt-10 flex w-full items-center px-1">
          {NODES.map((node, i) => (
            <div key={node.n} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center">
                <motion.span
                  className="flex h-10 w-10 items-center justify-center rounded-full border font-mono text-[13px]"
                  animate={{
                    borderColor: i === active ? "rgba(16,236,144,0.7)" : "rgb(41,37,36)",
                    backgroundColor: i === active ? "rgba(16,236,144,0.12)" : "rgb(20,18,16)",
                    color: i === active ? "rgb(16,236,144)" : "rgb(168,162,158)",
                  }}
                  transition={{ duration: 0.35, ease: REVIEW_EASE }}
                >
                  {node.n}
                </motion.span>
                <span
                  className={`mt-2.5 text-[12px] font-medium transition-colors duration-300 ${
                    i === active ? "text-fg" : "text-fg-faint"
                  }`}
                >
                  {node.label}
                </span>
              </div>
              {i < NODES.length - 1 && (
                <div className="relative mx-3 h-px flex-1 bg-border">
                  <motion.span
                    className="absolute top-1/2 left-0 h-px -translate-y-1/2 bg-brand"
                    animate={{ width: active > i ? "100%" : active === i ? "60%" : "0%" }}
                    transition={{ duration: 0.5, ease: REVIEW_EASE }}
                  />
                  {!reduced && active === i && (
                    <motion.span
                      className="absolute top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_12px_#10ec90]"
                      initial={{ left: "0%" }}
                      animate={{ left: "100%" }}
                      transition={{
                        duration: REVIEW_DWELL[i] / 1000,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * "What it looks for": four specialists on spokes that draw toward the middle,
 * then fold into one verdict. SVG, so it costs nothing next to the hero field.
 */
export function ReviewSpecialists() {
  const reduced = useReducedMotion();
  const { ref, on } = useOnScreen<HTMLDivElement>();
  /* Two extra ticks park the loop on the merged verdict — that resolution is
     the point of the mark, so it holds ~4.5s before the spokes light again. */
  const tick = useReviewTick(1500, 5, 2, !on);
  const merge = tick === 4;

  return (
    <div ref={ref} className="relative mx-auto h-[340px] w-full max-w-[520px]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
        {MARK.map((s, i) => {
          const lit = merge || tick === i;
          return (
            <motion.line
              key={s.name}
              x1={s.x}
              y1={s.y}
              x2="50"
              y2="50"
              strokeWidth="0.5"
              initial={false}
              animate={{
                stroke: lit ? "rgba(16,236,144,0.75)" : "rgb(41,37,36)",
                pathLength: on ? 1 : 0,
              }}
              transition={{ duration: 0.5, ease: REVIEW_EASE }}
            />
          );
        })}
      </svg>

      {MARK.map((s, i) => {
        const lit = merge || tick === i;
        return (
          <motion.span
            key={s.name}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 font-mono text-[12px] whitespace-nowrap"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            animate={{
              borderColor: lit ? "rgba(16,236,144,0.65)" : "rgb(41,37,36)",
              backgroundColor: lit ? "rgba(16,236,144,0.1)" : "rgb(20,18,16)",
              color: lit ? "rgb(16,236,144)" : "rgb(168,162,158)",
            }}
            transition={{ duration: 0.35, ease: REVIEW_EASE }}
          >
            {s.name}
          </motion.span>
        );
      })}

      <motion.span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border px-4 py-2 text-[13px] font-medium whitespace-nowrap"
        animate={{
          borderColor: merge ? "rgba(16,236,144,0.8)" : "rgb(41,37,36)",
          backgroundColor: merge ? "rgba(16,236,144,0.14)" : "rgb(17,15,13)",
          color: merge ? "rgb(16,236,144)" : "rgb(245,245,244)",
          transform: merge && !reduced ? "scale(1.06)" : "scale(1)",
        }}
        transition={{ duration: 0.4, ease: REVIEW_EASE }}
      >
        {merge ? "One reconciled review" : "The board"}
      </motion.span>
    </div>
  );
}
