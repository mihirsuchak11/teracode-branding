"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Oversized footer wordmark, ported from the reference site's footer.
 *
 * Two things are carried across from the source:
 *
 * 1. THE DOT DISSOLVE. A grid of background-coloured dots is painted over the
 *    mark and gradient-masked so it is absent at the top and solid at the
 *    bottom, making the wordmark break up into a halftone toward the page edge.
 *    Source: `.framer-19wjreq-container` carries
 *    `mask: linear-gradient(#0000 50%, #000 100%)` and wraps a child whose fill
 *    is the band colour, masked by a 6px repeating dot.
 *
 * 2. THE APPEAR ANIMATION. Only the wordmark animates — the dot overlay is
 *    static, which is why the overlay sits outside the animated element here.
 *    The source's inline initial state is `opacity:0; transform:translateY(24px)`,
 *    and its `__framer__appearAnimationsContent` config resolves that to a
 *    spring (`bounce: 0.2, duration: 1`) animating to `opacity:1, y:0`. That
 *    variant is used by 18 of the config's 27 entries, so it is the site's
 *    house reveal — deliberately NOT our `Reveal` component, which is a tween
 *    with a different offset and an extra blur the source does not have.
 *
 * The source dims its wordmark by colouring the type just off the band
 * (`rgb(36,36,36)` on orange). Ours is an image, so the equivalent dimming is a
 * static opacity on the wrapper, leaving the animation free to run 0 -> 1.
 */
export function FooterWordmark() {
  const reduced = useReducedMotion();

  return (
    <div className="relative py-16 md:py-24">
      {/* Static dimming, so the animation below matches the source's 0 -> 1. */}
      <div className="opacity-[0.07]">
        <motion.img
          src="/teracode-logo-horizontal-white.svg"
          alt=""
          aria-hidden
          width={1322}
          height={352}
          className="h-auto w-full select-none"
          initial={reduced ? false : { opacity: 0.001, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "0px 0px -10% 0px" }}
          transition={{ type: "spring", bounce: 0.2, duration: 1 }}
        />
      </div>

      {/* Dot dissolve. Two nested masks, as in the source: the outer layer
          fades the effect in across the lower half, the inner one punches the
          background-coloured fill into a 6px dot grid. Sits outside the dimmed
          wrapper so the dots read at full strength. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          WebkitMaskImage: "linear-gradient(#0000 50%, #000 100%)",
          maskImage: "linear-gradient(#0000 50%, #000 100%)",
        }}
      >
        <div
          className="h-full w-full bg-bg"
          style={{
            WebkitMaskImage: "radial-gradient(circle, #000 45%, #0000 47%)",
            maskImage: "radial-gradient(circle, #000 45%, #0000 47%)",
            WebkitMaskSize: "6px 6px",
            maskSize: "6px 6px",
            WebkitMaskRepeat: "repeat",
            maskRepeat: "repeat",
          }}
        />
      </div>
    </div>
  );
}
