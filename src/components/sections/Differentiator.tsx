"use client";

import { ChromaticCascade } from "@/components/motion/ChromaticCascade";
import { Reveal } from "@/components/motion/Reveal";
import { REVIEW_EASE, useReviewTick } from "@/components/sections/ReviewFlow";
import { motion } from "framer-motion";

/**
 * Them-versus-us table. A brand marker walks the rows so the comparison reads
 * itself while the visitor scans, instead of sitting as a static block.
 */
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
  const active = useReviewTick(1900, rows.length, 1);

  return (
    <section className="px-6 pt-24 pb-24 md:px-10 md:pt-32 md:pb-32">
      <ChromaticCascade
        blocks={[
          ...(eyebrow
            ? [
                {
                  kind: "text" as const,
                  tag: "p" as const,
                  className: "font-mono text-xs uppercase tracking-widest text-brand",
                  segments: [{ text: eyebrow }],
                },
              ]
            : []),
          {
            kind: "text",
            tag: "h2",
            className: "mt-5 max-w-[620px] text-h2-statement",
            segments: [
              ...(titleMuted ? [{ text: `${titleMuted} `, className: "text-fg-faint" }] : []),
              { text: title, className: "text-fg" },
            ],
          },
        ]}
      />

      <Reveal className="mt-14 overflow-x-auto md:mt-16">
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
              <motion.tr
                key={row.feature}
                className="border-b border-border"
                animate={{
                  backgroundColor:
                    i === active ? "rgba(16,236,144,0.06)" : "rgba(16,236,144,0)",
                }}
                transition={{ duration: 0.4, ease: REVIEW_EASE }}
              >
                <td className="py-5 pr-6 text-[15px] text-fg-dim">{row.feature}</td>
                <td className="py-5 pr-6 text-[15px] text-fg-faint">{row.theirs}</td>
                <td className="py-5 text-[15px]">
                  <span className="flex items-center gap-2.5">
                    <motion.span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      animate={{
                        backgroundColor: i === active ? "rgb(16,236,144)" : "rgb(68,64,60)",
                        boxShadow: i === active ? "0 0 10px #10ec90" : "0 0 0 transparent",
                      }}
                      transition={{ duration: 0.4, ease: REVIEW_EASE }}
                    />
                    <motion.span
                      animate={{ color: i === active ? "rgb(16,236,144)" : "rgb(250,250,249)" }}
                      transition={{ duration: 0.4, ease: REVIEW_EASE }}
                    >
                      {row.ours}
                    </motion.span>
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </Reveal>
    </section>
  );
}
