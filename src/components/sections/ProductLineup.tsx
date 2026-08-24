import Link from "next/link";
import { platform, productGroups, productHref, productStatus } from "@/content/products";
import { Badge } from "@/components/ui/badge";
import { ChromaticReveal } from "@/components/motion/ChromaticReveal";
import { ChevronDown } from "@/components/ui/icons";

/**
 * The platform half of the lineup: four divided cells on the CopyGrid band
 * rhythm, one per product you build your own agents with. Sits directly under
 * the pinned application scroller so the two groups read as one catalog.
 */
export function ProductLineup() {
  return (
    <section className="pb-16 md:pb-24">
      <div className="px-6 md:px-10">
        <p className="border-t border-border pt-6 text-sm text-fg-muted">
          <span className="font-mono text-xs uppercase tracking-widest text-fg">
            {productGroups.platform.title}
          </span>
          <span className="mx-3 text-fg-faint">∴</span>
          {productGroups.platform.body}
        </p>
      </div>

      {/* One reveal for the whole band: the cells are plain grid items so the
          divider / first-row rules and the bottom-aligned stat block hold. */}
      <ChromaticReveal className="mt-10 grid border-y border-border md:grid-cols-2 md:divide-x md:divide-border xl:grid-cols-4">
        {platform.map((p, i) => {
          const status = productStatus[p.status];
          return (
            <div
              key={p.slug}
              className={`flex flex-col px-6 py-10 md:px-10 md:py-12 ${
                i > 0 ? "border-t border-border md:border-t-0" : ""
              } ${i >= 2 ? "md:border-t xl:border-t-0" : ""}`}
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-fg-faint">
                  {p.category}
                </span>
                <Badge tone={status.tone}>{status.label}</Badge>
              </div>
              <h3 className="mt-6 text-[22px] font-semibold leading-7 text-fg">{p.short}</h3>
              <p className="mt-1.5 text-[15px] leading-6 text-fg-dim">{p.tagline}</p>
              <p className="mt-4 text-[14px] leading-6 text-fg-muted">{p.body}</p>
              <div className="mt-auto pt-8">
                <div className="flex items-end justify-between gap-4 border-t border-border pt-5">
                  <div>
                    <p className="font-display text-[28px] leading-none text-fg">{p.stat.value}</p>
                    <p className="mt-1.5 text-[12px] leading-4 text-fg-faint">{p.stat.label}</p>
                  </div>
                  <Link
                    href={productHref(p)}
                    className="group inline-flex shrink-0 items-center gap-2 text-[14px] text-fg-dim"
                  >
                    Learn more
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-2 transition-colors group-hover:bg-border-strong">
                      <ChevronDown width={12} height={12} className="-rotate-90 text-fg-muted" />
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </ChromaticReveal>
    </section>
  );
}
