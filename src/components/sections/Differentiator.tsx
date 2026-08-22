"use client";

import { ChromaticLines } from "@/components/motion/ChromaticLines";
import { Reveal } from "@/components/motion/Reveal";
import { useReviewTick } from "@/components/sections/ReviewFlow";

export function Differentiator({
  eyebrow,
  titleMuted,
  title,
  theirs,
  ours,
  rows,
}: {
  eyebrow?: string;
  titleMuted?: string;
  title: string;
  theirs: string;
  ours: string;
  rows: { feature: string; theirs: string; ours: string }[];
}) {
  const active = useReviewTick(1800, rows.length, 1);

  return (
    <section className="border-b border-border px-6 py-16 md:px-10 md:py-20">
      {eyebrow && (
        <p className="font-mono text-xs uppercase tracking-widest text-brand">{eyebrow}</p>
      )}
      <ChromaticLines
        as="h2"
        className="mt-4 max-w-[640px] text-h2-section"
        segments={[
          ...(titleMuted ? [{ text: `${titleMuted} `, className: "text-fg-faint" }] : []),
          { text: title, className: "text-fg" },
        ]}
      />
      <Reveal className="mt-12 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="w-1/3 pb-6 font-medium text-fg-muted" aria-label="Dimension" />
              <th className="w-1/3 pb-6 text-[15px] font-medium text-fg-muted">{theirs}</th>
              <th className="w-1/3 pb-6 text-[15px] font-medium text-fg">{ours}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.feature}
                className={`border-b border-border transition-colors duration-300 ${
                  i === active ? "bg-brand-soft/15" : ""
                }`}
              >
                <td className="py-[18px] pr-6 text-[15px] text-fg-dim">{row.feature}</td>
                <td className="py-[18px] pr-6 text-[15px] text-fg-faint">{row.theirs}</td>
                <td
                  className={`py-[18px] text-[15px] ${
                    i === active ? "text-brand" : "text-fg"
                  }`}
                >
                  {row.ours}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </section>
  );
}
