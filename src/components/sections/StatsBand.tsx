import type { Stat } from "@/lib/types";
import { ChromaticLines } from "@/components/motion/ChromaticLines";
import { ChromaticCascade } from "@/components/motion/ChromaticCascade";
import { Lottie } from "@/components/motion/Lottie";
import { ChromaticBorder } from "@/components/motion/ChromaticBorder";

/**
 * Four stat cells across the frame. On the home page each cell is topped by the
 * original's 64px looping Lottie mark; other pages pass no `icons` and get the
 * plain value/label pair.
 */
export function StatsBand({
  titleMuted,
  title,
  stats,
  icons,
  divider = "bottom",
}: {
  titleMuted?: string;
  title: string;
  stats: Stat[];
  /** One Lottie JSON path per stat, in order. */
  icons?: string[];
  /**
   * Where the original draws its chromatic divider: along the bottom on the
   * home page, along the top (before the cells) on the feature pages.
   */
  divider?: "top" | "bottom";
}) {
  return (
    <section className="px-6 md:px-0">
      <div className="relative mx-auto max-w-[1400px]">
        <ChromaticBorder edge={divider} />
        <div className="pt-20 pb-10 md:px-10">
          <ChromaticLines
            as="h2"
            className="text-h2-statement max-w-[660px]"
            segments={[
              ...(titleMuted ? [{ text: `${titleMuted} `, className: "text-fg-faint" }] : []),
              { text: title, className: "text-fg" },
            ]}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-start gap-10 py-10 md:px-10 md:py-[60px]"
            >
              {icons?.[i] && <Lottie src={icons[i]} className="h-16 w-16" />}
              <ChromaticCascade
                blocks={[
                  {
                    kind: "text",
                    tag: "p",
                    className: "text-display-stat text-fg",
                    segments: [{ text: stat.value }],
                  },
                  {
                    kind: "text",
                    tag: "p",
                    className: "mt-3 text-[15px] text-fg-muted",
                    segments: [{ text: stat.label }],
                  },
                ]}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
