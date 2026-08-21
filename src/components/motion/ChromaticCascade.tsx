"use client";

import {
  createElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useReducedMotion } from "framer-motion";
import { channelLayers } from "@/components/motion/ChromaticLines";

/**
 * ChromaticCascade — per-visual-line reveal across a GROUP of text blocks.
 *
 * Unlike ChromaticLines (single element), this measures the wrapped lines of
 * every block (heading, body, …) plus any atomic node blocks (a CTA), then
 * hands out ONE continuous, increasing transition-delay across all of them and
 * fires from a single IntersectionObserver. Result: heading line 1 → heading
 * line 2 → body line 1 → … → CTA, each following the previous instead of all
 * arriving together.
 *
 * Motion values are Framer's real appear numbers (opacity 0.001→1,
 * translateY 10px, 0.4s, ease cubic-bezier(0.12,0.23,0.5,1)) — and by default
 * that is ALL this does. The original has no horizontal travel and no blur on
 * text; its sideways chromatic smear is <ChromaticGlareBand />, a fixed strip
 * across the bottom of the viewport that content scrolls up through.
 *
 * The per-line channel split is still here behind `shift` / `blur` (both
 * default 0) for anything the band cannot reach; see the
 * [data-chromatic-lines] rules in globals.css and `channelLayers`.
 */
type Segment = { text: string; className?: string };
type Word = { text: string; className?: string };
type Block =
  | { kind: "text"; tag: "h1" | "h2" | "h3" | "p" | "div"; className?: string; segments: Segment[] }
  | { kind: "node"; className?: string; children: ReactNode };

type BlockLayout = { startIndex: number; lines: Word[][] | null };

function splitWords(segments: Segment[]): Word[] {
  return segments.flatMap((s) =>
    s.text
      .split(/(\s+)/)
      .filter((t) => t.length > 0)
      .map((t) => ({ text: t, className: s.className })),
  );
}

export function ChromaticCascade({
  blocks,
  className,
  stagger = 0.1,
  delay = 0,
  slideX = 0,
  riseY = 10,
  shift = 0,
  blur = 0,
  margin = "0px 0px 0px 0px",
}: {
  blocks: Block[];
  className?: string;
  stagger?: number;
  /** seconds before the first line starts */
  delay?: number;
  /** left->right slide-in distance (px). DEFAULT 0 — see the note above. */
  slideX?: number;
  /** upward rise (px) while split — the original's `y: 10` appear offset */
  riseY?: number;
  /** chromatic channel offset (px) while split. DEFAULT 0. */
  shift?: number;
  /** blur (px) while split. DEFAULT 0. */
  blur?: number;
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
  const containerRef = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLElement | null)[]>([]);
  const [layout, setLayout] = useState<BlockLayout[] | null>(null);
  // false while the channel copies are mounted, true once the reveal has played
  const [resolved, setResolved] = useState(false);

  // re-measure only when the text content actually changes, not on every render
  const signature = blocks
    .map((b) =>
      b.kind === "text"
        ? `t:${b.tag}:${b.segments.map((s) => s.text).join("")}`
        : "n",
    )
    .join("");

  const wordsPerBlock = blocks.map((b) => (b.kind === "text" ? splitWords(b.segments) : null));

  // Measure each text block's wrapped lines. Runs after EVERY commit and bails
  // unless `layout` is null, so it only ever reads the flat, unsplit render —
  // kicking a re-measure is just `setLayout(null)`, no rAF racing React.
  useLayoutEffect(() => {
    if (reduced || layout !== null) return;
    if (!containerRef.current) return;
    if (!containerRef.current.querySelector("[data-cl-word]")) return;
    let idx = 0;
    const out: BlockLayout[] = blocks.map((b, bi) => {
      if (b.kind === "node") {
        const s = idx;
        idx += 1;
        return { startIndex: s, lines: null };
      }
      const el = blockRefs.current[bi];
      const words = wordsPerBlock[bi]!;
      const grouped: Word[][] = [];
      if (el) {
        const spans = el.querySelectorAll<HTMLElement>("[data-cl-word]");
        let lineTop: number | null = null;
        spans.forEach((span) => {
          const top = span.offsetTop;
          if (lineTop === null || top - lineTop > 4) {
            grouped.push([]);
            lineTop = top;
          }
          grouped[grouped.length - 1].push(words[Number(span.dataset.clWord)]);
        });
      }
      const s = idx;
      idx += grouped.length || 1;
      return { startIndex: s, lines: grouped };
    });
    setLayout(out);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, layout, signature]);

  // Drop back to flat (which re-measures, above) when the text changes, when
  // the width changes, or once webfonts land — all three can move line breaks.
  // The ref guard matters: without it this fires on mount too, in the same
  // commit as the measurement above, and wipes it out.
  const measuredSignature = useRef(signature);
  useLayoutEffect(() => {
    if (measuredSignature.current === signature) return;
    measuredSignature.current = signature;
    setLayout(null);
  }, [signature]);

  useEffect(() => {
    if (reduced) return;
    const el = containerRef.current;
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
        setLayout(null);
      });
      ro.observe(el);
    }
    if (typeof document !== "undefined" && document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!cancelled) setLayout(null);
      });
    }
    return () => {
      cancelled = true;
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, signature]);

  useEffect(() => {
    if (reduced || !layout) return;
    const el = containerRef.current;
    if (!el) return;
    // when the last line of the last block has finished
    const steps = layout.reduce((n, b) => Math.max(n, b.startIndex + (b.lines?.length ?? 1)), 0);
    const settle = (delay + Math.max(0, steps - 1) * stagger + 0.4) * 1000 + 120;
    let timer: number | undefined;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // re-trigger every time it enters view (and reset when it leaves)
          el.classList.toggle("is-visible", entry.isIntersecting);
          window.clearTimeout(timer);
          if (entry.isIntersecting) {
            // drop the channel copies once the cascade has played out
            timer = window.setTimeout(() => setResolved(true), settle);
          } else {
            setResolved(false);
          }
        }
      },
      { rootMargin: margin, threshold: 0.01 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, [reduced, layout, margin, delay, stagger]);

  if (reduced) {
    return (
      <div className={className}>
        {blocks.map((b, i) =>
          b.kind === "text"
            ? createElement(
                b.tag,
                { key: i, className: b.className },
                b.segments.map((s, si) =>
                  createElement("span", { key: si, className: s.className }, s.text),
                ),
              )
            : (
                <div key={i} className={b.className}>
                  {b.children}
                </div>
              ),
        )}
      </div>
    );
  }

  // Only mount the three channel copies when a per-element split is asked for.
  const split = shift > 0 || blur > 0;

  const vars = {
    "--cl-x": `${slideX}px`,
    "--cl-y": `${riseY}px`,
    "--cl-shift": `${shift}px`,
    "--cl-blur": `${blur}px`,
  } as CSSProperties;

  // Measuring pass (also SSR/hydration output): flat words + node children.
  if (!layout) {
    return (
      <div ref={containerRef} data-chromatic-lines="" className={className} style={vars}>
        {blocks.map((b, bi) =>
          b.kind === "text"
            ? createElement(
                b.tag,
                {
                  key: bi,
                  className: b.className,
                  ref: (el: HTMLElement | null) => {
                    blockRefs.current[bi] = el;
                  },
                },
                wordsPerBlock[bi]!.map((w, i) =>
                  createElement(
                    "span",
                    { key: i, className: w.className, "data-cl-word": i },
                    w.text,
                  ),
                ),
              )
            : (
                <div
                  key={bi}
                  className={b.className}
                  ref={(el) => {
                    blockRefs.current[bi] = el;
                  }}
                >
                  {b.children}
                </div>
              ),
        )}
      </div>
    );
  }

  // Measured: per-line cascade with a single continuous delay across blocks.
  return (
    <div ref={containerRef} data-chromatic-lines="" className={className} style={vars}>
      {blocks.map((b, bi) => {
        const info = layout[bi];
        if (b.kind === "node") {
          // the block's own className goes on the channel layers, not on the
          // wrapper — the wrapper becomes a grid while split
          return (
            <div
              key={bi}
              className={
                resolved || !split ? `cl-line ${b.className ?? ""}`.trim() : "cl-line"
              }
              {...(resolved || !split ? {} : { "data-split": "" })}
              style={{ transitionDelay: `${delay + info.startIndex * stagger}s` } as CSSProperties}
            >
              {resolved || !split ? b.children : channelLayers(b.children, b.className)}
            </div>
          );
        }
        const lines = info.lines ?? [];
        return createElement(
          b.tag,
          { key: bi, className: b.className },
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
                style: { transitionDelay: `${delay + (info.startIndex + li) * stagger}s` } as CSSProperties,
              },
              resolved || !split ? content : channelLayers(content),
            );
          }),
        );
      })}
    </div>
  );
}
