"use client";

import { useEffect, useRef, type ReactNode, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * ChromaticReveal — the original Framer site's scroll reveal.
 *
 * By DEFAULT this is exactly what the original does and nothing more: opacity
 * 0.001 -> 1 with a 10px rise over 0.4s, ease cubic-bezier(0.12,0.23,0.5,1).
 * No horizontal travel, no blur, no channel split — the scrape has none of
 * those on any of its 39 appear-animated elements. The chromatic smear you see
 * on the real site is <ChromaticGlareBand />, a fixed strip across the bottom
 * of the viewport that content scrolls up through.
 *
 * The RGB-split machinery is still here behind `shift` / `blur` / `slide` (all
 * default 0) for anything the band cannot reach. When any of them is non-zero
 * the element resolves from a Red/Green/Blue split into a crisp image: the
 * three channels are isolated with SVG feColorMatrix filters (see
 * <ChromaticFilters/> in the root layout) and recombined with
 * `mix-blend-mode: screen`, which reconstructs the original image exactly.
 *
 * Model matches this site's <Reveal> (and Framer's appear): it plays ONCE when
 * the element scrolls into view — driven by a CSS transition off `--e`
 * (1 = split … 0 = resolved), toggled with the `is-visible` class.
 *
 * While split, the children render three times inside a CSS-grid stack so every
 * layer shares identical geometry (guarantees zero fringing once resolved).
 * Only the middle (green) layer stays interactive / accessible; the other two
 * are inert. With the defaults the children render exactly once.
 *
 * Drop-in replacement for <Reveal> — same `className` contract.
 */
export function ChromaticReveal({
  children,
  className,
  /** px of horizontal RGB channel separation while split. DEFAULT 0. */
  shift = 0,
  /** px of blur while split. DEFAULT 0. */
  blur = 0,
  /** px of whole-content left->right slide-in distance. DEFAULT 0. */
  slide = 0,
  /** px of upward rise — the original's `y: 10` appear offset */
  rise = 10,
  /** how much it fades while split (0–1) */
  fade = 0.999,
  /** seconds to wait before this block resolves (hero load sequencing) */
  delay = 0,
  /** IntersectionObserver rootMargin — when the reveal triggers */
  margin = "0px 0px 0px 0px",
}: {
  children: ReactNode;
  className?: string;
  shift?: number;
  blur?: number;
  slide?: number;
  rise?: number;
  fade?: number;
  delay?: number;
  /**
   * IntersectionObserver rootMargin. The bottom MUST stay 0 (not a negative
   * inset): the reveal has to fire at the viewport's bottom edge so the line
   * is still inside <ChromaticGlareBand /> (the fixed bottom 69px strip) while
   * it animates in. With the old "0px 0px -12% 0px" the trigger sat ~92px up,
   * above the band, so scrolling DOWN revealed text only after it had already
   * cleared the glare -- the smear showed on the way up but never on the way down.
   */
  margin?: string;
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
          // re-trigger every time it enters view (and reset when it leaves)
          el.classList.toggle("is-visible", entry.isIntersecting);
        }
      },
      { root: null, rootMargin: margin, threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, margin]);

  // Reduced motion: render content once, no effect.
  if (reduced) {
    return <div className={className}>{children}</div>;
  }

  // Only mount the three channel copies when a per-element split is asked for.
  const split = shift > 0 || blur > 0;

  const vars = {
    "--rgb-shift": `${shift}px`,
    "--rgb-blur": `${blur}px`,
    "--rgb-slide": `${slide}px`,
    "--rgb-rise": `${rise}px`,
    "--rgb-fade": String(fade),
    // transition-delay doesn't inherit, so it goes on the root AND each layer
    transitionDelay: `${delay}s`,
  } as CSSProperties;

  const layerClass = className ? ` ${className}` : "";
  const layerStyle = { transitionDelay: `${delay}s` } as CSSProperties;

  // Plain path: one copy, opacity + rise. This is the original's behaviour.
  if (!split) {
    return (
      <div ref={ref} data-chromatic style={vars}>
        <div className={`chromatic__layer${layerClass}`} style={layerStyle}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} data-chromatic style={vars}>
      <div
        className={`chromatic__layer chromatic__layer--r${layerClass}`}
        style={layerStyle}
        aria-hidden
        inert
      >
        {children}
      </div>
      <div className={`chromatic__layer chromatic__layer--g${layerClass}`} style={layerStyle}>
        {children}
      </div>
      <div
        className={`chromatic__layer chromatic__layer--b${layerClass}`}
        style={layerStyle}
        aria-hidden
        inert
      >
        {children}
      </div>
    </div>
  );
}

/**
 * SVG channel-isolation filters. Render ONCE near the root (layout body).
 * Each matrix keeps a single input channel and preserves alpha (last row),
 * so the effect works on text, cards and images alike.
 */
export function ChromaticFilters() {
  return (
    <svg
      width={0}
      height={0}
      aria-hidden
      focusable={false}
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <filter id="rgb-ch-r" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0" />
      </filter>
      <filter id="rgb-ch-g" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0" />
      </filter>
      <filter id="rgb-ch-b" colorInterpolationFilters="sRGB">
        <feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0" />
      </filter>
    </svg>
  );
}
