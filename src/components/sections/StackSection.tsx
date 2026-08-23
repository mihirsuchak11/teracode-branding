import Link from "next/link";
import { stack } from "@/content/home";
import { SlideInFromRight } from "@/components/motion/SlideInFromRight";
import { ChromaticBorder } from "@/components/motion/ChromaticBorder";
import { ChromaticCascade } from "@/components/motion/ChromaticCascade";
import { ChevronDown, Plus } from "@/components/ui/icons";

/**
 * The "Connected sources" board — 642×474 in the original: a header strip, a
 * body split into a clipped list of 72px source rows (masked so it fades in at
 * the top) and a dim 3-wide grid of integration tiles that runs off the bottom
 * edge, then a stats footer. Sizes, type and colours are the original's.
 */
function StackPanel() {
  return (
    <div className="flex h-[474px] w-[642px] flex-col overflow-hidden">
      <div className="flex h-[47px] shrink-0 items-center px-5 py-4">
        <p className="text-[11px] leading-[15px] font-medium text-fg-disabled">{stack.label}</p>
      </div>

      <div className="flex h-[383px] shrink-0">
        {/* Source list — clipped, fading in at the top */}
        <div
          // Bottom-aligned: 383px fits 5.3 rows, and the original puts the
          // partial row at the top where the mask hides it.
          className="flex w-[316px] shrink-0 flex-col justify-end overflow-hidden"
          style={{
            maskImage: "linear-gradient(rgba(0,0,0,0) 0%, rgb(0,0,0) 22%)",
            WebkitMaskImage: "linear-gradient(rgba(0,0,0,0) 0%, rgb(0,0,0) 22%)",
          }}
        >
          {/* Listed twice: 5 rows is 360px, one short of filling the 383px
              window, so the original repeats the set and clips. */}
          {[...stack.sources, ...stack.sources].map((s, i) => (
            <div
              key={`${s.name}-${i}`}
              className="flex h-[72px] shrink-0 items-center gap-3 border-t border-[#262626] bg-[rgb(20,18,16)] p-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.logo} alt="" aria-hidden width={32} height={32} />
              </span>
              <span className="flex min-w-0 flex-col">
                <span className="text-[16px] leading-6 text-fg">{s.name}</span>
                <span className="font-mono text-[11px] leading-[15px] font-medium">
                  <span className="text-brand">{s.a}</span>
                  <span className="text-fg-disabled"> • {s.b}</span>
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Tile grid — taller than the body, so it runs off the bottom edge */}
        <div className="grid w-[326px] shrink-0 grid-cols-3 content-start gap-2 pl-2.5">
          {stack.tiles.map((src) => (
            <div
              key={src}
              className="flex h-[90px] w-[90px] items-center justify-center rounded-2xl border border-[#262626]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                aria-hidden
                width={32}
                height={32}
                className="opacity-50 grayscale"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex h-[44px] shrink-0 items-center gap-4 px-5 py-3 font-mono text-[11px] leading-[15px] font-medium">
        {stack.totals.map((t) => (
          <span key={t.label} className="whitespace-pre">
            <span className="text-fg-faint">{t.value}</span>{" "}
            <span className="text-fg-disabled">{t.label}</span>
          </span>
        ))}
        <span className="ml-auto flex items-center gap-1.5 whitespace-pre text-fg-disabled">
          {stack.addLabel}
          <Plus width={12} height={12} />
        </span>
      </div>
    </div>
  );
}

export function StackSection() {
  return (
    <section className="relative">
      <div className="relative mx-auto grid max-w-[1400px] grid-cols-1 md:grid-cols-5">
        {/* the original overlays its chromatic divider on the top edge */}
        <ChromaticBorder edge="top" />
        {/* Text — 2 of 5 columns */}
        <div className="flex flex-col justify-center px-6 py-16 md:col-span-2 md:p-10">
          <ChromaticCascade
            blocks={[
              {
                kind: "text",
                tag: "h2",
                className: "text-h2-section text-fg",
                segments: [{ text: stack.title }],
              },
              {
                kind: "text",
                tag: "p",
                className: "mt-5 max-w-[420px] text-base leading-relaxed text-fg-muted",
                segments: [{ text: stack.body }],
              },
              {
                kind: "node",
                children: (
                  <Link
                    href={stack.cta.href}
                    className="group mt-9 inline-flex items-center gap-3 text-[15px] text-fg-dim"
                  >
                    {stack.cta.label}
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-2 transition-colors group-hover:bg-border-strong">
                      <ChevronDown width={13} height={13} className="-rotate-90 text-fg-muted" />
                    </span>
                  </Link>
                ),
              },
            ]}
          />
        </div>

        {/* Panel — 3 of 5 columns, fading out toward the left edge */}
        <div
          className="overflow-hidden px-6 pb-16 md:col-span-3 md:flex md:h-[723px] md:flex-col md:items-start md:justify-center md:self-start md:p-10"
          style={{
            maskImage: "linear-gradient(270deg, rgba(0,0,0,0) 12%, rgb(0,0,0) 61%)",
            WebkitMaskImage: "linear-gradient(270deg, rgba(0,0,0,0) 12%, rgb(0,0,0) 61%)",
          }}
        >
          <SlideInFromRight>
            <StackPanel />
          </SlideInFromRight>
        </div>
      </div>
    </section>
  );
}
