import { hero, steps } from "@/content/home";
import { Reveal } from "@/components/motion/Reveal";
import { ChromaticReveal } from "@/components/motion/ChromaticReveal";
import { HeroStrands } from "@/components/three/HeroStrands";

/* Geometry below is measured off the original page at a 1512px viewport:
   announcement block 692x64 from the frame edge, hairline at y=132, the text
   stack 612 wide at y=283 (h1 -> 20px -> body -> 40px -> buttons), and the
   three steps on a 235px/32px-gutter grid at y=750. */
export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Announcement row — 20px above and below a 24px-tall line */}
      <div className="px-6 py-5 md:px-10">
        <Reveal>
          <a
            href={hero.announcement.href}
            className="group flex h-6 w-fit items-center gap-2 text-sm"
          >
            <span className="rounded-full bg-[#1c1917] px-2 py-1 text-xs font-medium leading-4 text-fg">
              {hero.announcement.badge}
            </span>
            <span className="flex w-4 justify-center font-mono text-xs text-fg-faint">∴</span>
            <span className="leading-5 text-white transition-colors group-hover:text-fg-dim">
              {hero.announcement.text}
            </span>
          </a>
        </Reveal>
      </div>
      <div className="h-px w-full max-w-[692px] bg-border" />

      {/* Live 3D strand graphic (ported from the original HeroThreeJSV2) */}
      <div className="absolute right-16 top-0 hidden h-[643px] w-[562px] md:block">
        <HeroStrands className="h-full w-full" />
      </div>

      {/* Headline stack */}
      <div className="relative px-6 pt-[150px] md:px-10">
        <div className="max-w-[612px]">
          <Reveal delay={0.1}>
            <h1 className="text-display-hero text-fg">{hero.title}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-5 text-base leading-6 text-fg-muted">{hero.body}</p>
          </Reveal>
        </div>
        <Reveal delay={0.3} className="mt-10 flex flex-wrap items-center gap-3">
          <a
            href={hero.primary.href}
            className="inline-flex h-10 items-center rounded-lg bg-fg-soft px-4 text-sm font-medium leading-5 text-[#1c1917] transition-colors hover:bg-fg"
          >
            {hero.primary.label}
          </a>
          <a
            href={hero.secondary.href}
            className="inline-flex h-10 items-center rounded-lg bg-[#1c1917] px-4 text-sm font-medium leading-5 text-fg-soft transition-colors hover:bg-border-strong"
          >
            {hero.secondary.label}
          </a>
        </Reveal>
      </div>

      {/* Steps row — 3 columns of 235px with a 32px gutter, left half of the frame */}
      <div className="relative px-6 pb-[120px] pt-[191px] md:px-10">
        <div className="grid max-w-[769px] grid-cols-1 gap-8 md:grid-cols-3">
          {/* the original staggers the three step blocks at 0.5 / 0.6 / 0.7s */}
          {steps.map((step, i) => (
            <ChromaticReveal key={step.title} delay={0.5 + i * 0.1}>
              <h3 className="text-base font-semibold leading-5 text-fg">
                <span className="mr-1 text-fg-faint">{step.n}</span>
                {step.title}
              </h3>
              <p className="mt-2 text-sm leading-5 text-fg-muted">{step.body}</p>
            </ChromaticReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
