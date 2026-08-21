import Link from "next/link";
import { stack } from "@/content/home";
import { Reveal } from "@/components/motion/Reveal";
import { ChromaticCascade } from "@/components/motion/ChromaticCascade";
import { ChevronDown, Plus } from "@/components/ui/icons";

function SourceGlyph({ glyph, color }: { glyph: string; color: string }) {
  const paths: Record<string, React.ReactNode> = {
    waveform: <path d="M5 12v2m3-6v10m4-13v16m4-12v8m3-5v2" />,
    triangle: <path d="M12 4 21 19H3Z" fill={color} stroke="none" />,
    swirl: <path d="M12 4a8 8 0 1 1-8 8 5 5 0 1 0 5-5" />,
    clover: (
      <path d="M12 3a3 3 0 0 1 0 6 3 3 0 0 1 0-6ZM12 15a3 3 0 0 1 0 6 3 3 0 0 1 0-6ZM3 12a3 3 0 0 1 6 0 3 3 0 0 1-6 0ZM15 12a3 3 0 0 1 6 0 3 3 0 0 1-6 0Z" />
    ),
  };
  return (
    <svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.8}
      strokeLinecap="round"
    >
      {paths[glyph] ?? paths.swirl}
    </svg>
  );
}

/* Dim grid of integration tiles beside the sources list. */
function TileGrid() {
  const glyphs = ["≋", "◫", "✣", "▤", "◍", "↯", "◔", "▨", "◎", "❋", "﹩", "☁"];
  return (
    <div className="hidden grid-cols-3 gap-2 lg:grid">
      {glyphs.map((g, i) => (
        <div
          key={i}
          className="flex h-[88px] w-[88px] items-center justify-center rounded-card border border-border text-xl text-fg-disabled/60"
        >
          {g}
        </div>
      ))}
    </div>
  );
}

export function StackSection() {
  return (
    <section className="relative">
      <div className="grid items-center gap-14 px-6 py-24 md:grid-cols-[1fr_1.2fr] md:px-10 md:py-36">
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

        <Reveal className="flex items-start justify-center gap-6 md:justify-end">
          <div className="w-full max-w-[320px]">
            <p className="pb-3 text-[13px] text-fg-faint">Connected sources</p>
            <div className="border-y border-border">
              {stack.sources.map((s, i) => (
                <div
                  key={s.name}
                  className={`flex items-center gap-3.5 py-3.5 ${i > 0 ? "border-t border-border" : ""}`}
                >
                  <SourceGlyph glyph={s.glyph} color={s.color} />
                  <div>
                    <p className="text-[15px] font-medium text-fg-soft">{s.name}</p>
                    <p className="mt-0.5 font-mono text-xs">
                      <span className="text-brand">{s.a}</span>
                      <span className="text-fg-disabled"> • {s.b}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between whitespace-nowrap py-3.5 font-mono text-[11px] text-fg-faint">
              <span>
                {stack.totals[0].value} {stack.totals[0].label} &nbsp; {stack.totals[1].value}{" "}
                {stack.totals[1].label}
              </span>
              <span className="flex items-center gap-1.5 text-fg-disabled">
                Add integration <Plus width={12} height={12} />
              </span>
            </div>
          </div>
          <TileGrid />
        </Reveal>
      </div>
    </section>
  );
}
