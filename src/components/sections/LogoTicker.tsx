import { statement, tickerBrands } from "@/content/home";
import { Marquee } from "@/components/motion/Marquee";
import { ChromaticBorder } from "@/components/motion/ChromaticBorder";

/* Simple geometric glyphs standing in for the fictional brand marks. */
function BrandGlyph({ i }: { i: number }) {
  const shapes = [
    <path key="0" d="M12 3 21 12 12 21 3 12Z" />,
    <circle key="1" cx="12" cy="12" r="8" />,
    <path key="2" d="M4 18 12 4l8 14Z" />,
    <rect key="3" x="5" y="5" width="14" height="14" rx="3" />,
    <path key="4" d="M12 3v18M3 12h18" strokeWidth={2.4} />,
    <path key="5" d="m12 3 2.6 6.4L21 12l-6.4 2.6L12 21l-2.6-6.4L3 12l6.4-2.6Z" />,
  ];
  return (
    <svg width={17} height={17} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      {shapes[i % shapes.length]}
    </svg>
  );
}

export function LogoTicker() {
  return (
    <section className="relative border-y border-border py-12">
      <p className="px-6 pb-9 text-center text-sm font-medium text-fg-muted md:px-10">
        {statement.eyebrow}
      </p>
      <Marquee>
        {tickerBrands.map((name, i) => (
          <span
            key={name}
            className="mx-9 flex shrink-0 items-center gap-2.5 text-[17px] font-semibold text-fg-dim/90"
          >
            <BrandGlyph i={i} />
            {name}
          </span>
        ))}
      </Marquee>
      {/* the original draws its chromatic divider along the bottom edge */}
      <ChromaticBorder edge="bottom" />
    </section>
  );
}
