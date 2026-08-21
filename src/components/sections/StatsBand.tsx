import type { Stat } from "@/lib/types";
import { ChromaticLines } from "@/components/motion/ChromaticLines";
import { ChromaticCascade } from "@/components/motion/ChromaticCascade";

export function StatsBand({
  titleMuted,
  title,
  stats,
}: {
  titleMuted?: string;
  title: string;
  stats: Stat[];
}) {
  return (
    <section className="px-6 py-20 md:px-10 md:pb-24 md:pt-20">
      <ChromaticLines
        as="h2"
        className="text-h2-statement max-w-[560px]"
        segments={[
          ...(titleMuted ? [{ text: `${titleMuted} `, className: "text-fg-faint" }] : []),
          { text: title, className: "text-fg" },
        ]}
      />
      <div className="mt-16 grid grid-cols-2 gap-y-14 md:grid-cols-4">
        {stats.map((stat) => (
          <ChromaticCascade
            key={stat.label}
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
        ))}
      </div>
    </section>
  );
}
