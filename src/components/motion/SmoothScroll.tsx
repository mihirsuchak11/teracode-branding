"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scrolling, configured exactly like the original Framer site's
 * smooth-scroll wrapper: smooth=true, intensity=12 → duration 12/10 = 1.2.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      smoothWheel: true,
      duration: 1.2,
      infinite: false,
      orientation: "vertical",
      gestureOrientation: "vertical",
      autoRaf: true,
      anchors: true,
      allowNestedScroll: true,
      syncTouch: false,
    });

    return () => lenis.destroy();
  }, []);

  return null;
}
