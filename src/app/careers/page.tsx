import Image from "next/image";
import Link from "next/link";
import { JobList } from "@/components/sections/JobList";
import { PageShell, PageHero } from "@/components/sections/PageShell";
import { Reveal } from "@/components/motion/Reveal";
import { ChevronDown } from "@/components/ui/icons";
import { buildMetadata } from "@/lib/metadata";
import { careersHero, peopleSection, jobsSection, jobs } from "@/content/careers";

export const metadata = buildMetadata({
  title: "Careers",
  description:
    "We are not running a slate of open roles. Introduce yourself if TeraCodeAI is the problem you want to work on.",
  path: "/careers",
});

function OpenPositionsPill() {
  return (
    <a
      href="#open-roles"
      className="flex h-[34px] items-center gap-2 rounded-full border border-border pl-4 pr-1 transition-colors hover:border-border-strong"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand" />
      </span>
      <span className="text-xs font-medium text-fg">
        {careersHero.openCount} {careersHero.openLabel}
      </span>
      <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-surface-2 text-fg-dim">
        <ChevronDown width={12} height={12} />
      </span>
    </a>
  );
}

export default function CareersPage() {
  const heroImage = careersHero.images[0];
  return (
    <PageShell>
      <PageHero title={careersHero.title} right={<OpenPositionsPill />} />

      {/* Office photo */}
      <Image
        src={heroImage.src}
        alt={heroImage.alt}
        width={heroImage.width}
        height={heroImage.height}
        priority
        className="aspect-[3/2] w-full border-b border-border object-cover"
      />

      {/* Manifesto */}
      <section className="grid gap-10 border-b border-border px-6 py-10 md:grid-cols-2 md:gap-8 md:px-10">
        <Reveal className="flex flex-col justify-between gap-16">
          <h2 className="max-w-[504px] text-2xl font-semibold leading-[1.07] tracking-tight text-fg md:text-[32px]">
            {careersHero.statement}
          </h2>
          <div>
            <p className="text-xs leading-4 text-fg">{peopleSection.eyebrow}</p>
            <p className="mt-0.5 text-xs leading-4 text-fg-muted">{peopleSection.title}</p>
          </div>
        </Reveal>
        <Reveal>
          <div className="flex max-w-[504px] flex-col gap-4">
            {peopleSection.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-6 text-fg-muted">
                {paragraph}
              </p>
            ))}
          </div>
          <Link
            href={peopleSection.cta.href}
            className="group mt-8 inline-flex items-center gap-2.5"
          >
            <span className="text-sm font-medium text-fg-muted transition-colors group-hover:text-fg">
              {peopleSection.cta.label}
            </span>
            <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-surface-2 text-fg-dim transition-transform group-hover:translate-x-0.5">
              <ChevronDown width={12} height={12} className="-rotate-90" />
            </span>
          </Link>
        </Reveal>
      </section>

      {/* Open roles */}
      <section id="open-roles">
        <Reveal className="px-6 pb-0 pt-14 md:px-10">
          <h2 className="text-2xl font-semibold leading-[1.07] tracking-tight text-fg md:text-[32px]">
            {jobsSection.title}
          </h2>
          <p className="mb-10 mt-4 text-base leading-6 text-fg-muted">{jobsSection.body}</p>
        </Reveal>
        <JobList jobs={jobs} />
      </section>
    </PageShell>
  );
}
