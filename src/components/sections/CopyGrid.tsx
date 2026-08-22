import type { ReactNode } from "react";
import { ChromaticCascade } from "@/components/motion/ChromaticCascade";
import { ChromaticReveal } from "@/components/motion/ChromaticReveal";

type Item = { title: string; body: string };

function Heading({
  eyebrow,
  titleMuted,
  title,
  className = "max-w-[620px]",
}: {
  eyebrow?: string;
  titleMuted?: string;
  title: string;
  className?: string;
}) {
  return (
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
          className: `mt-5 text-h2-statement ${className}`,
          segments: [
            ...(titleMuted ? [{ text: `${titleMuted} `, className: "text-fg-faint" }] : []),
            { text: title, className: "text-fg" },
          ],
        },
      ]}
    />
  );
}

/**
 * Two arrangements of the same copy cells, so consecutive sections do not read
 * as one long stack:
 *
 * - `band` (default): headline, optional live mark, then a divided row.
 * - `split`: headline held in a left column beside the cells, on the home
 *   page's StackSection proportions.
 *
 * Vertical space separates these sections; only the cells carry rules.
 */
export function CopyGrid({
  eyebrow,
  titleMuted,
  title,
  items,
  columns = 3,
  graphic,
  layout = "band",
}: {
  eyebrow?: string;
  titleMuted?: string;
  title: string;
  items: Item[];
  columns?: 3 | 4;
  /** Optional live mark between the headline and the cells. */
  graphic?: ReactNode;
  layout?: "band" | "split";
}) {
  if (layout === "split") {
    return (
      <section className="grid gap-12 px-6 py-16 md:grid-cols-5 md:gap-14 md:px-10 md:py-24">
        <div className="md:col-span-2">
          <Heading
            eyebrow={eyebrow}
            titleMuted={titleMuted}
            title={title}
            className="max-w-[380px]"
          />
        </div>
        <div className="md:col-span-3 md:pt-2">
          {items.map((item, i) => (
            <ChromaticReveal
              key={item.title}
              delay={0.06 * i}
              className="border-t border-border py-8 first:border-t-0 first:pt-0 md:py-9"
            >
              <h3 className="text-[18px] font-semibold leading-6 text-fg">{item.title}</h3>
              <p className="mt-3 max-w-[520px] text-[15px] leading-6 text-fg-muted">{item.body}</p>
            </ChromaticReveal>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24">
      <div className="px-6 md:px-10">
        <Heading eyebrow={eyebrow} titleMuted={titleMuted} title={title} />
      </div>

      {graphic && <div className="px-6 pt-12 md:px-10 md:pt-14">{graphic}</div>}

      <div
        className={`mt-14 grid border-t border-border md:mt-16 md:divide-x md:divide-border ${
          columns === 4 ? "md:grid-cols-4" : "md:grid-cols-3"
        }`}
      >
        {items.map((item, i) => (
          <ChromaticReveal
            key={item.title}
            delay={0.06 * i}
            className="border-t border-border px-6 py-12 first:border-t-0 md:border-t-0 md:px-10 md:py-14"
          >
            <h3 className="text-[18px] font-semibold leading-6 text-fg">{item.title}</h3>
            <p className="mt-3 text-[15px] leading-6 text-fg-muted">{item.body}</p>
          </ChromaticReveal>
        ))}
      </div>
    </section>
  );
}
