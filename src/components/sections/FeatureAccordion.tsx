"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type AccordionItem = { title: string; body: string };

/**
 * The original's mid-section accordion: headings with one item open at a time,
 * auto-advancing on a timer with a rule that fills as it goes. Titles are
 * 18/24 semibold, bodies 14/20 muted.
 *
 * The two pages differ in trim, so both are measured off the scrape:
 *  - cortex draws a rule under the OPEN item only, and no row marks.
 *  - pulse draws a rule under every item but the last, dims closed headings,
 *    and right-aligns a five-dot mark that arches on the open row.
 * The fill is a CSS animation and the advance a timeout, so nothing
 * re-renders per frame.
 */
const DURATION = 6000;

/** Five 2px dots on a 4px pitch, inset 6px from the column edge as in the
 *  original; they lift into a shallow arc when open. */
function RowMark({ open }: { open: boolean }) {
  const arc = [0, -2, -3.8, -1.9, 0];
  return (
    <span aria-hidden className="relative ml-6 block h-2 w-6 shrink-0">
      {arc.map((dy, i) => (
        <span
          key={i}
          className="absolute h-[2px] w-[2px] rounded-[1px] bg-fg-muted transition-transform duration-300 ease-out"
          style={{ left: i * 4, top: 3, transform: `translateY(${open ? dy : 0}px)` }}
        />
      ))}
    </span>
  );
}

export function FeatureAccordion({
  items,
  muteClosed = false,
  bodyGap = "mt-2",
  dividers = "open",
  marks = false,
  active: activeProp,
  onChange,
}: {
  items: AccordionItem[];
  /** pulse dims the headings of closed items; cortex keeps them all white */
  muteClosed?: boolean;
  bodyGap?: string;
  /** "open" = rule under the active item only; "all" = under every item but the last */
  dividers?: "open" | "all";
  marks?: boolean;
  /** Controlled mode — cortex lifts the index so its side panel can swap too. */
  active?: number;
  onChange?: (i: number) => void;
}) {
  const [uncontrolled, setUncontrolled] = useState(0);
  const controlled = activeProp !== undefined;
  const active = controlled ? activeProp : uncontrolled;
  const setActive = useCallback(
    (next: number | ((a: number) => number)) => {
      const resolve = (a: number) => (typeof next === "function" ? next(a) : next);
      if (controlled) onChange?.(resolve(active));
      else setUncontrolled((a) => resolve(a));
    },
    [controlled, onChange, active],
  );
  const [running, setRunning] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  // Only advance while the section is on screen.
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setRunning(e.isIntersecting), {
      threshold: 0.2,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % items.length), DURATION);
    return () => clearTimeout(t);
  }, [running, active, items.length, setActive]);

  return (
    <div ref={wrap} className="max-w-[610px]">
      {items.map((item, i) => {
        const open = i === active;
        const last = i === items.length - 1;
        const showRule = dividers === "all" ? !last : open;
        return (
          <div key={item.title} className={i === 0 ? "" : "pt-6"}>
            <button
              type="button"
              onClick={() => setActive(i)}
              className="flex w-full cursor-pointer items-center justify-between text-left"
            >
              <span
                className={`text-[18px] font-semibold leading-6 transition-colors ${
                  muteClosed && !open ? "text-fg-muted" : "text-fg"
                }`}
              >
                {item.title}
              </span>
              {marks && <RowMark open={open} />}
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className={`${bodyGap} text-sm leading-5 text-fg-muted`}>{item.body}</p>
              </div>
            </div>
            {showRule && (
              <div className="relative mt-6 h-px w-full bg-border">
                {open && running && (
                  <span
                    key={active}
                    className="accordion-fill absolute left-0 top-0 h-px bg-fg"
                    style={{ animationDuration: `${DURATION}ms` }}
                  />
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
