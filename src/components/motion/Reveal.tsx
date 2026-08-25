"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { INSTANT_S, useScrollReveal } from "@/components/motion/scroll-reveal";

/**
 * Scroll-into-view reveal matching the original Framer appear effect:
 * blur(3px) + opacity + a small rise that sharpen as the element enters view.
 * Timing/easing taken from the site's appearAnimations config
 * (duration 0.4, ease [0.12, 0.23, 0.5, 1]).
 *
 * Driven by <scroll-reveal> rather than framer's own `whileInView`, which is an
 * IntersectionObserver underneath and so shares its blind spot: scroll a
 * viewport in less time than the 0.4s tween and every block on screen is caught
 * mid-fade, which reads as content struggling to keep up with the page. When
 * the engine reports the arrival as already missed, the block is put in place
 * with a short fade instead of animating in behind the reader.
 */
export function Reveal({
  children,
  delay = 0,
  className,
  style,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}) {
  const reduced = useReducedMotion();
  const { ref, visible, instant } = useScrollReveal({ enabled: !reduced });

  if (reduced)
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  return (
    <motion.div
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0.001, y: 10, filter: "blur(3px)" }}
      animate={visible ? { opacity: 1, y: 0, filter: "blur(0px)" } : undefined}
      transition={{
        duration: instant ? INSTANT_S : 0.4,
        delay: instant ? 0 : delay,
        ease: [0.12, 0.23, 0.5, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
