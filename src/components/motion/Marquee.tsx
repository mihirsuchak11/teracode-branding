import type { ReactNode } from "react";

/** Infinite horizontal ticker. Children are rendered twice for a seamless loop. */
export function Marquee({ children }: { children: ReactNode }) {
  return (
    <div className="group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <div className="flex w-max animate-marquee gap-4 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
        {children}
        {children}
      </div>
    </div>
  );
}
