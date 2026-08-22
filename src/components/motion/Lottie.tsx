"use client";

/**
 * Minimal lottie-web wrapper matching how the original site embeds its icon
 * animations: SVG renderer, looping, autoplay, paused while off-screen or the
 * tab is hidden. Honours `prefers-reduced-motion` by rendering the first frame.
 */

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import type { AnimationItem } from "lottie-web";

export function Lottie({
  src,
  className,
  loop = true,
  speed = 1,
}: {
  src: string;
  className?: string;
  loop?: boolean;
  speed?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let anim: AnimationItem | null = null;
    let cancelled = false;
    let onScreen = false;
    let visible = document.visibilityState === "visible";

    const sync = () => {
      if (!anim) return;
      if (reduced) return anim.goToAndStop(0, true);
      if (onScreen && visible) anim.play();
      else anim.pause();
    };

    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting;
        sync();
      },
      { threshold: 0 },
    );
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
      sync();
    };

    import("lottie-web").then(({ default: lottie }) => {
      if (cancelled || !hostRef.current) return;
      anim = lottie.loadAnimation({
        container: hostRef.current,
        renderer: "svg",
        loop,
        autoplay: false,
        path: src,
      });
      anim.setSpeed(speed);
      anim.addEventListener("DOMLoaded", sync);
      io.observe(hostRef.current);
      document.addEventListener("visibilitychange", onVisibility);
    });

    return () => {
      cancelled = true;
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      anim?.destroy();
    };
  }, [src, loop, speed, reduced]);

  return <div ref={hostRef} className={className} aria-hidden />;
}
