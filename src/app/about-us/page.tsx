import { CtaBand } from "@/components/sections/CtaBand";
import { MilestoneTimeline } from "@/components/sections/MilestoneTimeline";
import { PageShell, PageHero, Eyebrow } from "@/components/sections/PageShell";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { buildMetadata } from "@/lib/metadata";
import { aboutHero, mission, principles, origins, milestones } from "@/content/about";
import { tickerBrands } from "@/content/home";

export const metadata = buildMetadata({
  title: "About TeraSoft",
  description:
    "TeraSoft's goal is to empower developers to ship software quickly and securely, using AI to streamline the work. We build TeraCode — starting with TeraCode Review, on your own API keys.",
  path: "/about-us",
});

/* Geometric glyphs standing in for provider and language marks. */
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

export default function AboutPage() {
  return (
    <>
      <PageShell narrow>
        <PageHero title={aboutHero.title} />

        <section className="border-b border-border pt-10">
          <Eyebrow>{mission.eyebrow}</Eyebrow>
          <Reveal className="px-6 pt-10 md:px-10">
            <h2 className="max-w-[640px] text-h2-section text-fg">{mission.title}</h2>
            <div className="mt-8 flex max-w-[560px] flex-col gap-5">
              {mission.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-xl leading-7 text-fg">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal className="mt-10 border-t border-border px-6 pb-10 pt-10 md:px-10">
            <div className="flex flex-wrap items-start justify-between gap-8">
              <div>
                <h3 className="text-5xl font-bold leading-none tracking-tight text-fg">
                  {origins.funding.value}
                </h3>
                <p className="mt-2 text-base leading-6 text-fg">{origins.funding.label}</p>
              </div>
              <dl className="flex flex-col items-end gap-2">
                {origins.facts.map((fact) => (
                  <div key={fact.label} className="flex gap-2 font-mono text-xs font-medium leading-4">
                    <dt className="text-fg-muted">{fact.label}</dt>
                    <dd className="text-fg">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </section>

        <section className="border-b border-border pt-10">
          <Eyebrow>{principles.eyebrow}</Eyebrow>
          <div className="divide-y divide-border">
            {principles.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05} className="px-6 py-10 md:px-10">
                <h3 className="text-xl font-semibold leading-7 text-fg">{item.title}</h3>
                <p className="mt-3 max-w-[560px] text-base leading-6 text-fg-muted">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <section className="border-b border-border pt-10">
          <Eyebrow>{origins.eyebrow}</Eyebrow>
          <Reveal className="px-6 py-10 md:px-10">
            <div className="flex max-w-[560px] flex-col gap-5">
              {origins.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-xl leading-7 text-fg">
                  {paragraph}
                </p>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="border-b border-border pt-10">
          <Eyebrow>{origins.stacks}</Eyebrow>
          <div className="py-10">
            <Marquee>
              {tickerBrands.map((name, i) => (
                <span
                  key={name}
                  className="mx-[23px] flex shrink-0 items-center gap-2.5 text-[17px] font-semibold text-fg-soft"
                >
                  <BrandGlyph i={i} />
                  {name}
                </span>
              ))}
            </Marquee>
          </div>
        </section>

        <section className="border-b border-border pt-10">
          <Eyebrow>{milestones.eyebrow}</Eyebrow>
          <div className="mt-10 pb-10">
            <MilestoneTimeline items={milestones.items} />
          </div>
        </section>
      </PageShell>

      <CtaBand />
    </>
  );
}
