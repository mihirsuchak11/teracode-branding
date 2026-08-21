"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Scroll-into-view reveal matching the original Framer appear effect:
 * blur(3px) + opacity + a small rise that sharpen as the element enters view.
 * Timing/easing taken from the site's appearAnimations config
 * (duration 0.4, ease [0.12, 0.23, 0.5, 1]).
 */
export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.001, y: 10, filter: "blur(3px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.4, delay, ease: [0.12, 0.23, 0.5, 1] }}
    >
      {children}
    </motion.div>
  );
}
