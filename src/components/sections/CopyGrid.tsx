import type { ReactNode } from "react";
import { ChromaticLines } from "@/components/motion/ChromaticLines";
import { ChromaticReveal } from "@/components/motion/ChromaticReveal";

export function CopyGrid({
  eyebrow,
  titleMuted,
  title,
  items,
  columns = 3,
  graphic,
}: {
  eyebrow?: string;
  titleMuted?: string;
  title: string;
  items: { title: string; body: string }[];
  columns?: 3 | 4;
  graphic?: ReactNode;
}) {
  return (
    <section className="border-b border-border">
      <div className="px-6 pt-16 md:px-10 md:pt-20">
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
      </div>
      {graphic && <div className="px-6 pt-10 md:px-10">{graphic}</div>}
      <div
        className={`mt-10 grid border-t border-border md:divide-x md:divide-border ${
          columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3"
        }`}
      >
        {items.map((item, i) => (
          <ChromaticReveal
            key={item.title}
            delay={0.06 * i}
            className="border-t border-border px-6 py-10 md:border-t-0 md:px-10"
          >
            <h3 className="text-[18px] font-semibold leading-6 text-fg">{item.title}</h3>
            <p className="mt-3 text-sm leading-6 text-fg-muted">{item.body}</p>
          </ChromaticReveal>
        ))}
      </div>
    </section>
  );
}
