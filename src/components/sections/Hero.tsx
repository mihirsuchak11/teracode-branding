import Link from "next/link";
import { hero, steps } from "@/content/home";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { ChromaticReveal } from "@/components/motion/ChromaticReveal";
import { HeroStrands } from "@/components/three/HeroStrands";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Announcement row */}
      <div className="px-6 pt-8 md:px-10">
        <Reveal>
          <Link
            href={hero.announcement.href}
            className="group flex w-fit items-center gap-3.5 pb-8 text-sm text-fg-dim"
          >
            <span className="rounded-full border border-border-strong/60 px-3 py-1 text-[13px] text-fg-soft">
              {hero.announcement.badge}
            </span>
            <span className="font-mono text-xs text-fg-faint">∴</span>
            <span className="transition-colors group-hover:text-fg">{hero.announcement.text}</span>
          </Link>
        </Reveal>
        <div className="-ml-6 h-px w-full max-w-[655px] bg-border md:-ml-10" />
      </div>

      {/* Live 3D strand graphic (ported from the original HeroThreeJSV2) */}
      <div className="absolute -right-2 top-4 hidden h-[660px] w-[48%] max-w-[660px] md:block">
        <HeroStrands className="h-full w-full" />
      </div>

      {/* Headline */}
      <div className="relative px-6 pt-24 md:px-10 md:pt-36">
        <Reveal delay={0.1}>
          <h1 className="text-display-hero max-w-[640px] text-fg">
            The missing connection layer
          </h1>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-7 max-w-[520px] text-base leading-normal text-fg-muted">
            {hero.body}
          </p>
        </Reveal>
        <Reveal delay={0.3} className="mt-9 flex flex-wrap items-center gap-3.5">
          <Button href={hero.primary.href}>{hero.primary.label}</Button>
          <Button href={hero.secondary.href} variant="secondary">
            {hero.secondary.label}
          </Button>
        </Reveal>
      </div>

      {/* Steps row (left half of the frame, like the original) */}
      <div className="relative px-6 pb-16 pt-28 md:px-10 md:pt-40">
        <div className="grid max-w-[760px] grid-cols-1 gap-8 md:grid-cols-3">
          {/* the original staggers the three step blocks at 0.5 / 0.6 / 0.7s */}
          {steps.map((step, i) => (
            <ChromaticReveal key={step.title} delay={0.5 + i * 0.1}>
              <h3 className="text-base font-semibold leading-5 text-fg">
                <span className="mr-1.5 text-fg-faint">{step.n}</span>
                {step.title}
              </h3>
              <p className="mt-2.5 max-w-[220px] text-[15px] leading-snug text-fg-muted">
                {step.body}
              </p>
            </ChromaticReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
