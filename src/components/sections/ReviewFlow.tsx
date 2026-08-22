"use client";

/**
 * Review-page signature graphics. Same motion family as Strand's Framer
 * components: a live graphic per section, looping product state, ParticleGrid
 * swell while the board is working. One WebGL field on this page (How it works);
 * the specialists mark is SVG so we don't stack a second GPGPU next to the hero.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ParticleGrid } from "@/components/three/ParticleGrid";

export const REVIEW_EASE = [0.12, 0.23, 0.5, 1] as const;
export const REVIEW_DWELL = [2200, 3600, 2600] as const;

const NODES = [
  { n: "1", label: "Connect" },
  { n: "2", label: "Review" },
  { n: "3", label: "Ship" },
];

const SPECIALISTS = [
  { name: "Security", x: 50, y: 12 },
  { name: "Performance", x: 16, y: 50 },
  { name: "Tests", x: 84, y: 50 },
  { name: "Style", x: 50, y: 88 },
] as const;

export function useReviewTick(ms: number, steps: number, pauseAtEnd = 0) {
  const reduced = useReducedMotion();
  const [i, setI] = useState(reduced ? steps - 1 : 0);
  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setI((n) => (n + 1) % (steps + pauseAtEnd)), ms);
    return () => clearTimeout(t);
  }, [i, ms, reduced, steps, pauseAtEnd]);
  return Math.min(i, steps - 1);
}

export function useReviewCycle() {
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % REVIEW_DWELL.length), REVIEW_DWELL[active]);
    return () => clearTimeout(t);
  }, [active, reduced]);

  return reduced ? 2 : active;
}

function useOnScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setOn(e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, on };
}

export function ReviewFlow({ active }: { active: number }) {
  const reduced = useReducedMotion();
  const { ref, on } = useOnScreen();
  const working = active === 1;

  const grid = working
    ? { noiseFrequency: 3, timeScale: 0.31, waveHeightScale: 0.14, noiseLayerSpread: 0.01 }
    : { noiseFrequency: 2, timeScale: 0.08, waveHeightScale: 0.08, noiseLayerSpread: 0.005 };

  return (
    <div ref={ref} className="relative mx-auto h-[220px] w-full max-w-[720px]">
      {!reduced && on && (
        <ParticleGrid
          className="absolute inset-0 h-full w-full opacity-25 [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_78%)]"
          {...grid}
        />
      )}

      <div className="relative z-10 flex h-full items-center px-2">
        {NODES.map((node, i) => (
          <div key={node.n} className="flex flex-1 items-center">
            <div className="flex flex-col items-center">
              <motion.span
                className="flex h-11 w-11 items-center justify-center rounded-full border font-mono text-sm"
                animate={{
                  borderColor: i === active ? "rgba(16,236,144,0.7)" : "rgb(41,37,36)",
                  backgroundColor: i === active ? "rgba(16,236,144,0.12)" : "rgb(20,18,16)",
                  color: i === active ? "rgb(16,236,144)" : "rgb(168,162,158)",
                  scale: i === active ? 1.06 : 1,
                }}
                transition={{ duration: 0.35, ease: REVIEW_EASE }}
              >
                {node.n}
              </motion.span>
              <span
                className={`mt-2 text-[12px] font-medium ${
                  i === active ? "text-fg" : "text-fg-faint"
                }`}
              >
                {node.label}
              </span>
            </div>
            {i < NODES.length - 1 && (
              <div className="relative mx-3 h-px flex-1 bg-border">
                <motion.span
                  className="absolute top-1/2 h-px -translate-y-1/2 bg-brand"
                  animate={{ width: active > i ? "100%" : active === i ? "55%" : "0%" }}
                  transition={{ duration: 0.45, ease: REVIEW_EASE }}
                />
                {!reduced && active === i && (
                  <motion.span
                    className="absolute top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-brand shadow-[0_0_12px_#10ec90]"
                    initial={{ left: "0%" }}
                    animate={{ left: "100%" }}
                    transition={{ duration: REVIEW_DWELL[i] / 1000, ease: "linear", repeat: Infinity }}
                  />
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Four specialists folding into one verdict — the "What it looks for" mark. */
export function ReviewSpecialists() {
  const reduced = useReducedMotion();
  const tick = useReviewTick(1500, 5, 1);
  const merge = tick === 4;

  return (
    <div className="relative mx-auto h-[220px] w-full max-w-[360px]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" aria-hidden>
        {SPECIALISTS.map((s, i) => (
          <motion.line
            key={s.name}
            x1={s.x}
            y1={s.y}
            x2="50"
            y2="50"
            stroke="currentColor"
            strokeWidth="0.6"
            className="text-border"
            animate={{
              stroke: merge || tick === i ? "rgba(16,236,144,0.7)" : "rgb(41,37,36)",
            }}
            transition={{ duration: 0.35, ease: REVIEW_EASE }}
          />
        ))}
      </svg>

      {SPECIALISTS.map((s, i) => {
        const on = merge || tick === i;
        return (
          <motion.span
            key={s.name}
            className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full border px-2.5 py-1 font-mono text-[11px]"
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
            animate={{
              borderColor: on ? "rgba(16,236,144,0.65)" : "rgb(41,37,36)",
              backgroundColor: on ? "rgba(16,236,144,0.1)" : "rgb(20,18,16)",
              color: on ? "rgb(16,236,144)" : "rgb(168,162,158)",
            }}
            transition={{ duration: 0.35, ease: REVIEW_EASE }}
          >
            {s.name}
          </motion.span>
        );
      })}

      <motion.span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border px-3 py-1.5 text-[12px] font-medium"
        animate={{
          borderColor: merge ? "rgba(16,236,144,0.8)" : "rgb(41,37,36)",
          backgroundColor: merge ? "rgba(16,236,144,0.14)" : "rgb(17,15,13)",
          color: merge ? "rgb(16,236,144)" : "rgb(245,245,244)",
          scale: merge && !reduced ? 1.06 : 1,
        }}
        transition={{ duration: 0.4, ease: REVIEW_EASE }}
      >
        {merge ? "One review" : "Board"}
      </motion.span>
    </div>
  );
}
