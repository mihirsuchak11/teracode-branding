import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { MilestoneTimeline } from "@/components/sections/MilestoneTimeline";
import { PageShell, PageHero, Eyebrow } from "@/components/sections/PageShell";
import { Reveal } from "@/components/motion/Reveal";
import { Marquee } from "@/components/motion/Marquee";
import { buildMetadata } from "@/lib/metadata";
import { aboutHero, origins, milestones, teamSection } from "@/content/about";
import { tickerBrands } from "@/content/home";

export const metadata = buildMetadata({
  title: "About us",
  description:
    "We built Strand to close the distance between your data and the people who need it. One graph. Every source. Answers in seconds.",
  path: "/about-us",
});

const dots = {
  backgroundImage: "radial-gradient(#1c1917 0.75px, transparent 0.75px)",
  backgroundSize: "8px 8px",
  backgroundPosition: "4px 4px",
} as const;

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

function TeamCell({
  image,
  name,
  sub,
  href,
}: {
  image: string;
  name: string;
  sub: string;
  href?: string;
}) {
  const body = (
    <>
      <div style={dots} className="pt-4">
        <Image
          src={image}
          alt={href ? "" : `Headshot of ${name}, transparent background.`}
          width={1210}
          height={1210}
          className="aspect-square w-full rounded-lg object-cover"
        />
      </div>
      <div className="mt-2.5 text-center">
        <p className="text-base leading-6 text-fg">{name}</p>
        <p className="mt-0.5 text-xs font-medium leading-4 text-fg-faint">{sub}</p>
      </div>
    </>
  );
  if (href) {
    return (
      <Link href={href} className="group block transition-opacity hover:opacity-90">
        {body}
      </Link>
    );
  }
  return <div>{body}</div>;
}

export default function AboutPage() {
  return (
    <>
      <PageShell narrow>
        <PageHero title={aboutHero.title} />

        {/* Origins */}
        <section className="border-b border-border pt-10">
          <Eyebrow>{origins.eyebrow}</Eyebrow>
          <Reveal className="px-6 pt-10 md:px-10">
            <div className="flex max-w-[560px] flex-col gap-5">
              {origins.paragraphs.map((paragraph) => (
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

        {/* Trusted by */}
        <section className="border-b border-border pt-10">
          <Eyebrow>{origins.trustedBy}</Eyebrow>
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

        {/* Milestones */}
        <section className="border-b border-border pt-10">
          <Eyebrow>{milestones.eyebrow}</Eyebrow>
          <div className="mt-10 pb-10">
            <MilestoneTimeline items={milestones.items} />
          </div>
        </section>

        {/* The team */}
        <section className="pt-10">
          <Eyebrow>{teamSection.eyebrow}</Eyebrow>
          <Reveal className="px-6 pt-10 md:px-10">
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 pb-20 md:grid-cols-4">
              {teamSection.members.map((member) => (
                <TeamCell
                  key={member.name}
                  image={member.image}
                  name={member.name}
                  sub={member.role}
                />
              ))}
              <TeamCell
                image={teamSection.openSpot.image}
                name={teamSection.openSpot.name}
                sub={teamSection.openSpot.cta.label}
                href={teamSection.openSpot.cta.href}
              />
            </div>
          </Reveal>
        </section>
      </PageShell>

      <CtaBand />
    </>
  );
}
