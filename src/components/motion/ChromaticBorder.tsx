"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * ChromaticBorder — the original site's section divider ("Chromatic Border",
 * Framer module Z1shk5IlQ), ported 1:1.
 *
 * A 1px line split into Left/Right halves. Each half stacks three full-width
 * bars anchored at the centre: b (opaque), g and r (`mix-blend-mode: screen`).
 *   Start: every bar `width: 0%` in pure rgb(0,0,255) / (0,255,0) / (255,0,0)
 *   End:   `width: 100%`, dimmed to rgb(0,0,36) / (0,37,0) / (41,0,0)
 * which screen together to rgb(41,37,36) = #292524, the site's border colour.
 * So the resting divider IS the three channels; while it grows outward from
 * the middle the bars are offset by 20ms each (0.4s, ease .12/.23/.5/1) —
 * r leads on the left half and b on the right — which fringes the two moving
 * tips red and blue before they settle to grey.
 *
 * Trigger is the original's variant-appear effect: threshold 1 (fully in
 * view), plays once. Motion lives in globals.css under [data-chromatic-border].
 *
 * `edge` overlays it on the top or bottom edge of the nearest positioned
 * ancestor at the original's width (centred, max 1400px) without taking any
 * layout space — the same way the original drops it on top of a section edge.
 */
export function ChromaticBorder({
  edge,
  className = "",
}: {
  /** overlay on this edge of the nearest `relative` ancestor */
  edge?: "top" | "bottom";
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            io.disconnect();
          }
        }
      },
      { threshold: 1 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  const bars = (side: "l" | "r") => (
    <span className={`cb-half cb-half--${side}`}>
      <span className="cb-bar cb-bar--b" />
      <span className="cb-bar cb-bar--g" />
      <span className="cb-bar cb-bar--r" />
    </span>
  );

  return (
    <div
      ref={ref}
      aria-hidden
      data-chromatic-border
      className={[
        reduced ? "is-visible is-static" : "",
        edge ? `absolute inset-x-0 z-[1] mx-auto max-w-[1400px] ${edge === "top" ? "top-0" : "bottom-0"}` : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {bars("l")}
      {bars("r")}
    </div>
  );
}
