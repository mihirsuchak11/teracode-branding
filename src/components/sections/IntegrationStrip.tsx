import Link from "next/link";
import { ChromaticLines } from "@/components/motion/ChromaticLines";
import { Reveal } from "@/components/motion/Reveal";
import { ChevronDown } from "@/components/ui/icons";

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
    <section className="border-b border-border">
      <div className="grid gap-10 px-6 py-16 md:grid-cols-[2fr_3fr] md:px-10 md:py-20">
        <div>
          {eyebrow && (
            <p className="font-mono text-xs uppercase tracking-widest text-brand">{eyebrow}</p>
          )}
          <ChromaticLines
            as="h2"
            className="mt-4 text-h2-section"
            segments={[{ text: title, className: "text-fg" }]}
          />
          <p className="mt-5 max-w-[420px] text-base leading-6 text-fg-muted">{body}</p>
          <Link href={href} className="group mt-8 inline-flex items-center gap-3 text-[15px] text-fg-dim">
            {cta}
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 transition-colors group-hover:bg-border-strong">
              <ChevronDown width={13} height={13} className="-rotate-90 text-fg-muted" />
            </span>
          </Link>
        </div>
        <Reveal>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-4">
            {items.map((item) => (
              <li key={item.name} className="bg-bg px-4 py-5">
                <p className="text-[15px] font-medium text-fg">{item.name}</p>
                <p className="mt-1 font-mono text-[11px] text-fg-faint">{item.meta}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
