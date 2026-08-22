import Link from "next/link";
import { ChromaticCascade } from "@/components/motion/ChromaticCascade";
import { Reveal } from "@/components/motion/Reveal";
import { ChevronDown } from "@/components/ui/icons";

/**
 * Copy beside the platform grid, on the home page's StackSection proportions
 * (2 of 5 columns of text, 3 of 5 of panel) so the page stops reading as a
 * stack of equal full-width bands.
 */
export function IntegrationStrip({
  eyebrow,
  title,
  body,
  href,
  cta,
  items,
}: {
  eyebrow?: string;
  title: string;
  body: string;
  href: string;
  cta: string;
  items: { name: string; meta: string }[];
}) {
  return (
    <section className="relative border-y border-border">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-5">
        <div className="flex flex-col justify-center px-6 py-16 md:col-span-2 md:px-10 md:py-24">
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
                className: "mt-5 text-h2-section text-fg",
                segments: [{ text: title }],
              },
              {
                kind: "text",
                tag: "p",
                className: "mt-5 max-w-[420px] text-base leading-relaxed text-fg-muted",
                segments: [{ text: body }],
              },
              {
                kind: "node",
                children: (
                  <Link
                    href={href}
                    className="group mt-9 inline-flex items-center gap-3 text-[15px] text-fg-dim"
                  >
                    {cta}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 transition-colors group-hover:bg-border-strong">
                      <ChevronDown width={13} height={13} className="-rotate-90 text-fg-muted" />
                    </span>
                  </Link>
                ),
              },
            ]}
          />
        </div>

        <div className="px-6 pb-16 md:col-span-3 md:flex md:items-center md:px-10 md:py-24">
          <Reveal className="w-full">
            <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
              {items.map((item, i) => (
                <li
                  key={item.name}
                  className="group relative bg-bg px-4 py-7 transition-colors hover:bg-brand-soft/15"
                >
                  <span
                    aria-hidden
                    className="integ-cell pointer-events-none absolute inset-0 bg-brand-soft/25 ring-1 ring-inset ring-brand/50"
                    style={{ animationDelay: `${i * 1.2}s` }}
                  />
                  <p className="relative text-[15px] font-medium text-fg">{item.name}</p>
                  <p className="relative mt-1.5 font-mono text-[11px] text-fg-faint">{item.meta}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
