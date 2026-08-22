"use client";

/**
 * Port of the original site's scroll "Progress" component — the film-strip
 * ruler on the right edge of the pinned Features section.
 *
 * The whole strip translates from y +50% to -50% as the tracked section
 * scrolls (spring: stiffness 300, damping 30) past a fixed 5px needle, and is
 * masked to fade at both ends. Each label and tick lights up as the progress
 * value passes within `fade` of its own position, and ticks widen from 40% to
 * 65% at the same time.
 */

import { useRef, type RefObject } from "react";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";

const FADE = 0.05;
const NUM_LINES = 8;
const LINE_GAP = 10;
const LINE_WEIGHT = 1;
const PRIMARY = "rgb(250, 250, 250)";
const SECONDARY = "rgb(115, 115, 115)";
const LINE_HEIGHT = 31;

const font = {
  fontFamily: "var(--font-mono), monospace",
  fontSize: "12px",
  fontWeight: 400,
  letterSpacing: "0em",
  lineHeight: `${LINE_HEIGHT}px`,
  textAlign: "left" as const,
};

function Tick({ progress, position }: { progress: MotionValue<number>; position: number }) {
  const range = [
    position - FADE * 2,
    position - FADE,
    position,
    position + FADE,
    position + FADE * 2,
  ];
  const color = useTransform(progress, range, [SECONDARY, PRIMARY, PRIMARY, PRIMARY, SECONDARY]);
  const width = useTransform(progress, range, ["40%", "65%", "65%", "65%", "40%"]);
  return (
    <motion.div style={{ width, height: LINE_WEIGHT, borderRadius: 9999, backgroundColor: color }} />
  );
}

function Section({
  index,
  range,
  progress,
  isLast,
}: {
  index: number;
  range: [number, number];
  progress: MotionValue<number>;
  isLast: boolean;
}) {
  const labelColor = useTransform(
    progress,
    [range[0] - FADE * 2, range[0] - FADE, range[0], range[0] + FADE, range[0] + FADE * 2],
    [SECONDARY, PRIMARY, PRIMARY, PRIMARY, SECONDARY],
  );
  return (
    <div style={{ position: isLast ? "absolute" : "relative", top: "100%" }}>
      <motion.p style={{ ...font, margin: 0, color: labelColor }}>
        {index.toString().padStart(2, "0")}
      </motion.p>
      <div
        style={{ display: "flex", flexDirection: "column", gap: LINE_GAP, alignItems: "flex-end" }}
      >
        {!isLast &&
          Array.from({ length: NUM_LINES }).map((_, i) => (
            <Tick
              key={i}
              progress={progress}
              position={((range[1] - range[0]) / (NUM_LINES + 1)) * (i + 1) + range[0]}
            />
          ))}
      </div>
    </div>
  );
}

export function ProgressRuler({
  target,
  sections = 3,
  className,
}: {
  /** The scrolling element whose progress drives the ruler. */
  target: RefObject<HTMLElement | null>;
  sections?: number;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "end start"] });
  // In the original the ruler tracks a container that spans only the first
  // N-1 panels, so progress reaches 1 as the LAST panel starts — which is what
  // makes label k light up exactly at k/(N-1). Our target is all N panels, so
  // rescale instead of splitting the DOM.
  const span = (sections - 1) / sections;
  const scaled = useTransform(scrollYProgress, (v) => v / span);
  const progress = useSpring(scaled, { stiffness: 300, damping: 30 });
  const y = useTransform(progress, [0, 1], ["50%", "-50%"]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        maskImage: "linear-gradient(0deg, #0000, #000 10%, #000 90%, #0000)",
        WebkitMaskImage: "linear-gradient(0deg, #0000, #000 10%, #000 90%, #0000)",
      }}
      aria-hidden
    >
      <motion.div
        style={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          marginBottom: LINE_HEIGHT,
          y,
        }}
      >
        {Array.from({ length: sections }).map((_, i) => (
          <Section
            key={i}
            index={i + 1}
            range={[i * (1 / (sections - 1)), (i + 1) * (1 / (sections - 1))]}
            progress={progress}
            isLast={i === sections - 1}
          />
        ))}
      </motion.div>
      {/* The needle the strip scrolls past. */}
      <div
        style={{
          width: 5,
          height: LINE_WEIGHT,
          marginLeft: 4,
          borderTopLeftRadius: 9999,
          borderBottomLeftRadius: 9999,
          backgroundColor: PRIMARY,
        }}
      />
    </div>
  );
}
