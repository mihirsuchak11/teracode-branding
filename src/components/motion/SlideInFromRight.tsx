"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

/**
 * Scroll-linked entrance matching the original Framer scroll transform on the
 * "Connect your stack" board: the wrapper fades 0→1 while the board itself
 * slides in from the right (translateX 120px→0). Both SSR'd at their start
 * values in the export (`opacity:0` on the Visual, `translateX(120px)` on the
 * 642×474 container) and driven by scroll progress rather than a one-shot
 * appear, so scrolling back up reverses it.
 */
export function SlideInFromRight({
  children,
  className,
  distance = 120,
}: {
  children: ReactNode;
  className?: string;
  /** Starting horizontal offset in px; the original uses 120. */
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  // 0 when the board's top meets the viewport bottom, 1 once its top has
  // reached 45% down the viewport — roughly where the original settles.
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 45%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 34, mass: 0.6 });
  const opacity = useTransform(progress, [0, 1], [0, 1]);
  const x = useTransform(progress, [0, 1], [distance, 0]);

  if (reduced) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ opacity, willChange: "opacity" }}>
      <motion.div style={{ x, willChange: "transform" }}>{children}</motion.div>
    </motion.div>
  );
}
