"use client";

import {
  createElement,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { observeReveal } from "@/components/motion/scroll-reveal";

/**
 * ChromaticLines — per-visual-line reveal.
 *
 * Splits text into the lines it actually wraps to (measured in the DOM), then
 * reveals each line individually, staggered top-to-bottom. The MOTION uses the
 * original Framer appear values verbatim (from __framer__appearAnimationsContent):
 *   opacity 0.001 -> 1, translateY 10px -> 0, duration 0.4s,
 *   ease cubic-bezier(0.12, 0.23, 0.5, 1), tween.
 * The chromatic split + slight blur are our addition (the original doesn't
 * split channels on text). It is the SAME split ChromaticReveal uses — each
 * line rendered three times, channel-isolated with feColorMatrix and
 * recombined with `mix-blend-mode: screen` — so the colour matches the hero
 * step blocks exactly. The three copies are dropped again once the line has
 * finished revealing, so resting text is plain unfiltered text.
 *
 * `segments` keeps mixed inline colours (e.g. faint + solid) intact across the
 * split. Falls back to plain text under reduced-motion or before measurement.
 */
type Segment = { text: string; className?: string };
type Word = { text: string; className?: string };

/**
 * The three channel copies of one line. Identical markup to ChromaticReveal's
 * layers: r and b are decorative (hidden from AT, not focusable), g carries the
 * real content. `mix-blend-mode: screen` recombines them into the original
 * colour, so this is exactly the hero-step split, per line.
 */
export function channelLayers(content: ReactNode, className = "") {
  const cls = className ? ` ${className}` : "";
  return [
    createElement(
      "span",
      { key: "r", className: `cl-layer cl-layer--r${cls}`, "aria-hidden": true, inert: true },
      content,
    ),
    createElement("span", { key: "g", className: `cl-layer cl-layer--g${cls}` }, content),
    createElement(
      "span",
      { key: "b", className: `cl-layer cl-layer--b${cls}`, "aria-hidden": true, inert: true },
      content,
    ),
  ];
}

export function ChromaticLines({
  segments,
  className,
  as = "h2",
  slideX = 0,
  riseY = 10,
  shift = 0,
  blur = 0,
  stagger = 0.1,
  delay = 0,
}: {
  segments: Segment[];
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  /**
   * left->right slide-in distance (px) while split. DEFAULT 0 — the original
   * has no horizontal travel on text at all; the sideways smear comes from
   * <ChromaticGlareBand />, the fixed strip at the bottom of the viewport.
   */
  slideX?: number;
  /** upward rise (px) while split — the original's `y: 10` appear offset */
  riseY?: number;
  /**
   * chromatic channel offset (px) while split. DEFAULT 0 — set it only to
   * deliberately fake the glare on an element the real band cannot reach.
   */
  shift?: number;
  /** blur (px) while split. DEFAULT 0, for the same reason as `shift`. */
  blur?: number;
  /** seconds of delay added per line (the original staggers siblings by 0.1s) */
  stagger?: number;
  /** seconds before the first line starts */
  delay?: number;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const [lines, setLines] = useState<Word[][] | null>(null);
  // false while the channel copies are mounted, true once the reveal has played
  const [resolved, setResolved] = useState(false);

  // re-measure only when the text content changes, not on parent re-renders
  const signature = segments.map((s) => s.text).join("");
  const words = useMemo<Word[]>(
    () =>
      segments.flatMap((seg) =>
        seg.text
          .split(/(\s+)/)
          .filter((t) => t.length > 0)
          .map((t) => ({ text: t, className: seg.className })),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [signature],
  );

  // Measure which words share a line (same offsetTop) and group them.
  //
  // This runs after EVERY commit, and bails unless `lines` is null — i.e. it
  // only ever reads the flat, unsplit render. That is the whole point: kicking
  // a re-measure is just `setLines(null)`, and the measurement then happens on
  // the commit that follows, with no requestAnimationFrame racing React.
  useLayoutEffect(() => {
    if (reduced || lines !== null) return;
    const el = ref.current;
    if (!el) return;
    const spans = el.querySelectorAll<HTMLElement>("[data-cl-word]");
    if (!spans.length) return;
    const grouped: Word[][] = [];
    let lineTop: number | null = null;
    spans.forEach((span) => {
      const top = span.offsetTop;
      if (lineTop === null || top - lineTop > 4) {
        grouped.push([]);
        lineTop = top;
      }
      grouped[grouped.length - 1].push(words[Number(span.dataset.clWord)]);
    });
    setLines(grouped);
  }, [reduced, lines, words]);

  // Drop back to flat (which re-measures, above) when the text changes, when
  // the width changes, or once webfonts land — all three can move line breaks.
  // The ref guard matters: without it this fires on mount too, in the same
  // commit as the measurement above, and wipes it out.
  const measuredSignature = useRef(signature);
  useLayoutEffect(() => {
    if (measuredSignature.current === signature) return;
    measuredSignature.current = signature;
    setLines(null);
  }, [signature]);

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let cancelled = false;
    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver !== "undefined") {
      // only WIDTH can move a line break — height changes are our own split /
      // resolve swaps, and re-measuring on those would loop forever
      let lastWidth = el.getBoundingClientRect().width;
      ro = new ResizeObserver((entries) => {
        const width = entries[0]?.contentRect.width ?? lastWidth;
        if (Math.abs(width - lastWidth) < 1) return;
        lastWidth = width;
        setLines(null);
      });
      ro.observe(el);
    }
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) setLines(null);
      });
    }
    return () => {
      cancelled = true;
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, signature]);

  // Trigger the staggered reveal when the block enters view.
  useEffect(() => {
    if (reduced || !lines) return;
    const el = ref.current;
    if (!el) return;
    // when the last line has finished: delay + every stagger step + the tween
    const settle = (delay + (lines.length - 1) * stagger + 0.4) * 1000 + 120;
    let timer: number | undefined;
    // Fires at the viewport's bottom edge, with no inset, so the first line is
    // still inside <ChromaticGlareBand /> (the fixed bottom 69px strip) when it
    // starts -- inset the trigger and the smear only ever shows on the way up.
    // The cascade is the entrance most easily outrun: n lines take
    // 0.4s + n * stagger, so on a fast scroll every line on screen is caught
    // mid-fade. `instant` drops the stagger and shortens the tween (see
    // .is-catchup in globals.css) so the text is simply there.
    const dispose = observeReveal(el, (visible, instant) => {
      el.classList.toggle("is-catchup", visible && instant);
      // re-trigger every time it enters view (and reset when it leaves)
      el.classList.toggle("is-visible", visible);
      window.clearTimeout(timer);
      if (visible) {
        timer = window.setTimeout(() => setResolved(true), instant ? 280 : settle);
      } else {
        setResolved(false);
      }
    });
    return () => {
      dispose();
      window.clearTimeout(timer);
    };
  }, [reduced, lines, delay, stagger]);

  // Reduced motion: plain text.
  if (reduced) {
    return createElement(
      as,
      { className },
      segments.map((s, i) =>
        createElement("span", { key: i, className: s.className }, s.text),
      ),
    );
  }

  // Only pay for the three channel copies when a per-element split is asked
  // for. With the defaults the reveal is opacity + rise, exactly as in the
  // original, and the glare comes from the viewport band instead.
  const split = shift > 0 || blur > 0;

  const vars = {
    "--cl-x": `${slideX}px`,
    "--cl-y": `${riseY}px`,
    "--cl-shift": `${shift}px`,
    "--cl-blur": `${blur}px`,
  } as CSSProperties;

  // Before measurement: render flat words (also the SSR / hydration output).
  if (!lines) {
    return createElement(
      as,
      { ref, className, "data-chromatic-lines": "", style: vars },
      words.map((w, i) =>
        createElement(
          "span",
          { key: i, className: w.className, "data-cl-word": i },
          w.text,
        ),
      ),
    );
  }

  // Measured: one animated block per visual line, staggered.
  return createElement(
    as,
    { ref, className, "data-chromatic-lines": "", style: vars },
    lines.map((line, li) => {
      const content = line.map((w, wi) =>
        createElement("span", { key: wi, className: w.className }, w.text),
      );
      return createElement(
        "span",
        {
          key: li,
          className: "cl-line",
          ...(resolved || !split ? {} : { "data-split": "" }),
          style: { transitionDelay: `${delay + li * stagger}s` } as CSSProperties,
        },
        resolved || !split ? content : channelLayers(content),
      );
    }),
  );
}

/**
 * Convenience wrapper for a single-colour heading string — the common case for
 * the per-line cascade: <ChromaticHeading as="h2" className="…" text="…" />.
 */
export function ChromaticHeading({
  text,
  className,
  as = "h2",
  stagger,
  delay,
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "div";
  stagger?: number;
  delay?: number;
}) {
  return (
    <ChromaticLines
      as={as}
      className={className}
      segments={[{ text }]}
      {...(stagger != null ? { stagger } : {})}
      {...(delay != null ? { delay } : {})}
    />
  );
}
