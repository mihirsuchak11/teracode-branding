"use client";

import { useRef } from "react";
import { ChevronDown } from "@/components/ui/icons";

/** Tick counts per milestone segment, mirroring the original ruler rhythm. */
const TICKS = [9, 16, 27, 42];

export function MilestoneTimeline({
  items,
}: {
  items: { date: string; event: string }[];
}) {
  const track = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) =>
    track.current?.scrollBy({ left: dir * 340, behavior: "smooth" });

  return (
    <div className="px-6 md:px-10">
      <div
        ref={track}
        className="overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex w-max">
          {items.map((milestone, i) => (
            <div
              key={milestone.event}
              className="shrink-0"
              style={{ width: (TICKS[i] ?? 12) * 23 }}
            >
              <div className="flex h-5 gap-[22px]">
                {Array.from({ length: TICKS[i] ?? 12 }).map((_, t) => (
                  <span
                    key={t}
                    className={`h-5 w-px shrink-0 ${t === 0 ? "bg-fg-soft" : "bg-border-strong"}`}
                  />
                ))}
              </div>
              <div className="mt-6 pr-6">
                <p className="text-xs leading-4 text-fg-muted">{milestone.date}</p>
                <p className="mt-0.5 text-sm leading-5 text-fg">{milestone.event}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-11 flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous milestones"
          onClick={() => scroll(-1)}
          className="flex h-[26px] w-[55px] cursor-pointer items-center justify-center rounded-full bg-surface-2 text-fg-dim transition-colors hover:text-fg"
        >
          <ChevronDown width={12} height={12} className="rotate-90" />
        </button>
        <button
          type="button"
          aria-label="Next milestones"
          onClick={() => scroll(1)}
          className="flex h-[26px] w-[55px] cursor-pointer items-center justify-center rounded-full bg-surface-2 text-fg-dim transition-colors hover:text-fg"
        >
          <ChevronDown width={12} height={12} className="-rotate-90" />
        </button>
      </div>
    </div>
  );
}
