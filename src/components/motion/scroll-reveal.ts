"use client";

import { useEffect, useRef, useState } from "react";

/**
 * One scroll-driven engine behind every entrance on the page.
 *
 * IntersectionObserver was the obvious tool and it is the wrong one here. It
 * reports threshold *crossings*, computed from whatever frames the compositor
 * happens to produce. Fling past a 1px chromatic divider and the page can go
 * from "that line is 40px below the fold" to "it is 900px above it" between two
 * frames: no threshold was ever crossed, so the callback never runs, so the
 * divider that only draws once never draws at all. Reading positions instead of
 * transitions cannot miss, because there is no transition to miss — every pass
 * asks where things are right now.
 *
 * The other half of the job is catching up. An entrance takes 0.4s, and the
 * per-line cascades take longer than that again; scroll a viewport in less time
 * and every element on screen is caught mid-fade, which is the "content fades
 * in from the bottom" you get when you scroll quickly. So each pass measures
 * how fast the page is moving and how late we already are, and hands the
 * caller an `instant` flag meaning: you missed this arrival, don't perform it.
 *
 * Scrolling is not the only thing that can bring an element into view, though,
 * and this is the one place an observer was doing real work for us: content
 * above a target can grow or shrink -- a panel cycling, a Lottie landing, a
 * font reflowing a paragraph -- and carry it over the fold with no scroll event
 * to notice. A ResizeObserver over the document and every target covers that.
 *
 * Cost is one `getBoundingClientRect()` per target per scrolled frame. All the
 * reads happen before any of the writes, so a page of targets is one layout
 * pass, not one per element.
 */

/** The base entrance tween, shared with globals.css. */
const ENTRANCE_S = 0.4;

/**
 * Scrolling faster than "this much of a viewport per entrance" means an element
 * would still be fading when it left the screen. Below it the reveal reads as
 * motion; above it, as content that cannot keep up.
 */
const OUTRUN = 0.55;

/**
 * How far past the fold a target may be the first time we see it before its
 * arrival counts as already missed — a scrollbar drag, a restored position or
 * an anchor jump lands things here. It only applies once the page has actually
 * been scrolled: on first paint everything above the fold is where it was
 * always going to be, and none of it has an arrival to miss.
 */
const TOO_LATE = 0.5;

type Target = {
  el: HTMLElement;
  /** re-fire on every entry, or settle on the first one and stop looking */
  once: boolean;
  onChange: (visible: boolean, instant: boolean) => void;
  visible: boolean;
  seen: boolean;
  done: boolean;
};

const targets = new Set<Target>();
let frame = 0;
let listening = false;
let lastY = 0;
let lastT = 0;
/** px per second, sampled between passes */
let velocity = 0;
/** whether the reader has scrolled at all yet — see TOO_LATE */
let sawScroll = false;

function pass() {
  frame = 0;
  const vh = window.innerHeight || document.documentElement.clientHeight;
  const y = window.scrollY;
  const now = performance.now();
  const dt = (now - lastT) / 1000;
  // A pass only ever runs off a scroll, a resize or a registration, so dt is a
  // frame or two during movement. Anything longer means the page sat still and
  // the sample would say nothing about how fast the reader is going.
  velocity = dt > 0 && dt < 0.2 ? Math.abs(y - lastY) / dt : 0;
  lastY = y;
  lastT = now;

  const outrunning = velocity * ENTRANCE_S > vh * OUTRUN;

  // Read every position first; only then touch the DOM, so one pass costs one
  // layout instead of one per target.
  const writes: (() => void)[] = [];
  for (const t of targets) {
    if (t.done) continue;
    const r = t.el.getBoundingClientRect();
    const visible = r.top < vh && r.bottom > 0;

    if (!visible && !t.seen && r.bottom <= 0 && t.once) {
      // Scrolled clean past a once-only entrance without a single frame of it
      // on screen. It has nothing left to animate into, but it still has to be
      // there when the reader turns around.
      t.seen = true;
      t.done = true;
      const cb = t.onChange;
      writes.push(() => cb(true, true));
      continue;
    }

    if (visible === t.visible) continue;
    t.visible = visible;

    if (!visible) {
      const cb = t.onChange;
      writes.push(() => cb(false, false));
      continue;
    }

    // How far the element is already past the fold the first time we catch it.
    const late = sawScroll && vh - r.top > vh * TOO_LATE;
    const instant = outrunning || late;
    t.seen = true;
    if (t.once) t.done = true;
    const cb = t.onChange;
    writes.push(() => cb(true, instant));
  }

  for (const w of writes) w();
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(pass);
}

function onScroll() {
  sawScroll = true;
  schedule();
}

/**
 * Layout moved something. Targets are observed individually as well as through
 * the document, because an element can be carried over the fold either by its
 * own size changing or by the height of everything above it changing.
 *
 * This cannot feed itself: a pass only writes when a target's visibility
 * actually flips, so the reflow our own class change causes settles on the
 * next pass with nothing to do.
 */
let resizeObserver: ResizeObserver | undefined;

function layoutObserver() {
  if (!resizeObserver && typeof ResizeObserver !== "undefined") {
    resizeObserver = new ResizeObserver(schedule);
    resizeObserver.observe(document.documentElement);
  }
  return resizeObserver;
}

function start() {
  if (listening) return;
  listening = true;
  lastY = window.scrollY;
  lastT = performance.now();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", schedule);
}

function stop() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", schedule);
  resizeObserver?.disconnect();
  resizeObserver = undefined;
  if (frame) {
    cancelAnimationFrame(frame);
    frame = 0;
  }
}

/**
 * Watch `el` and call `onChange(visible, instant)` when it enters or leaves the
 * viewport. `instant` means the arrival was already missed — the reader is
 * moving faster than the entrance can play, or the element was somewhere else
 * entirely a frame ago — so the caller should put it in place rather than
 * animate it there.
 *
 * `once` settles on the first entry and stops watching, and it is the mode that
 * needs the engine most: it is the one that cannot recover from a missed frame.
 */
export function observeReveal(
  el: HTMLElement,
  onChange: (visible: boolean, instant: boolean) => void,
  { once = false }: { once?: boolean } = {},
): () => void {
  const target: Target = { el, once, onChange, visible: false, seen: false, done: false };
  targets.add(target);
  start();
  layoutObserver()?.observe(el);
  schedule();
  return () => {
    targets.delete(target);
    resizeObserver?.unobserve(el);
    if (targets.size === 0) stop();
  };
}

/**
 * Hook form, for the entrances that animate in React rather than in CSS.
 * `enabled` is how a component opts out under reduced motion without breaking
 * the rules of hooks.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>({
  once = true,
  enabled = true,
} = {}) {
  const ref = useRef<T>(null);
  const [state, setState] = useState({ visible: false, instant: false });

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    return observeReveal(
      el,
      (visible, instant) => setState((prev) =>
        prev.visible === visible && prev.instant === instant ? prev : { visible, instant },
      ),
      { once },
    );
  }, [once, enabled]);

  return { ref, ...state };
}

/**
 * The transition a caught-up entrance should use: short enough to read as
 * "already there", long enough not to flash.
 */
export const INSTANT_S = 0.15;
