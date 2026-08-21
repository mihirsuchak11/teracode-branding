/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";
import { features, featureExtras, featureHero, getFeature } from "@/content/features";
import type { FeaturePage as Feature } from "@/lib/types";
import { buildMetadata } from "@/lib/metadata";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { ChevronDown } from "@/components/ui/icons";
import {
  FeatureShowcase,
  CortexMidSection,
  PulseMidSection,
} from "@/components/sections/BenefitSection";
import { CapabilityChips } from "@/components/sections/CapabilityChips";
import { StatsBand } from "@/components/sections/StatsBand";
import { CtaBand } from "@/components/sections/CtaBand";

export function generateStaticParams() {
  return features.map((feature) => ({ slug: feature.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) return {};
  return buildMetadata({
    title: feature.name,
    description: feature.heroBody,
    path: `/features/${feature.slug}`,
  });
}

function Breadcrumb({ name }: { name: string }) {
  return (
    <div>
      <nav className="flex items-center gap-3 px-6 pt-7 text-[15px] md:px-10">
        <span className="text-fg-dim">Features</span>
        <ChevronDown width={12} height={12} className="-rotate-90 text-fg-disabled" />
        <span className="text-fg-faint">{name}</span>
      </nav>
      <div className="mt-6 h-px w-[57%] bg-border" />
    </div>
  );
}

function HeroBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex rounded-full border border-border-strong/70 bg-surface px-3.5 py-1 text-[13px] text-fg-soft">
      {name}
    </span>
  );
}

function HeroCtas({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button href="/pricing">Get started</Button>
      <Button href="/pricing" variant="secondary">
        View prices
      </Button>
    </div>
  );
}

function Hero({ feature }: { feature: Feature }) {
  const conf = featureHero[feature.slug] ?? { layout: "art-top", ctas: false };
  const art = `/art/feature-${feature.slug}-art.png`;
  const titleLines = feature.heroTitle.split("\n");

  if (conf.layout === "centered") {
    return (
      <section className="flex flex-col items-center px-6 pb-24 text-center md:px-10">
        <img
          src={art}
          alt=""
          className="art-blend pointer-events-none -mb-4 mt-2 w-[400px] max-w-full"
        />
        <Reveal className="flex flex-col items-center">
          <HeroBadge name={feature.name} />
          <h1 className="mt-8 text-5xl font-medium leading-[1.06] tracking-tight text-fg md:text-[64px]">
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-6 max-w-[620px] text-[17px] leading-relaxed text-fg-muted">
            {feature.heroBody}
          </p>
          {conf.ctas && <HeroCtas className="mt-10 justify-center" />}
        </Reveal>
      </section>
    );
  }

  if (conf.layout === "split") {
    return (
      <section className="relative grid items-center gap-10 px-6 pb-12 pt-4 md:grid-cols-[1fr_auto] md:px-10">
        <Reveal>
          <HeroBadge name={feature.name} />
          <h1 className="mt-7 whitespace-pre-line text-4xl font-medium leading-[1.12] tracking-tight text-fg md:text-[52px]">
            {feature.heroTitle}
          </h1>
          <p className="mt-6 max-w-[470px] text-base leading-relaxed text-fg-muted">
            {feature.heroBody}
          </p>
          {conf.ctas && <HeroCtas className="mt-9" />}
        </Reveal>
        <img
          src={art}
          alt=""
          className="art-blend pointer-events-none hidden w-[480px] justify-self-end md:block"
        />
      </section>
    );
  }

  return (
    <section className="relative px-6 pb-16 md:px-10">
      <img
        src={art}
        alt=""
        className="art-blend pointer-events-none absolute -top-4 right-6 hidden w-[420px] lg:block"
      />
      <Reveal className="pt-[430px]">
        <HeroBadge name={feature.name} />
        <h1 className="mt-7 whitespace-pre-line text-5xl font-medium leading-[1.08] tracking-tight text-fg md:text-[64px]">
          {feature.heroTitle}
        </h1>
        <p className="mt-7 max-w-[620px] text-[17px] leading-relaxed text-fg-muted">
          {feature.heroBody}
        </p>
        {conf.ctas && <HeroCtas className="mt-9" />}
      </Reveal>
    </section>
  );
}

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) notFound();

  const extras = featureExtras[feature.slug];

  return (
    <>
      <Breadcrumb name={feature.name} />
      <Hero feature={feature} />
      <FeatureShowcase slug={feature.slug} benefits={feature.benefits} />
      {feature.slug === "cortex" && extras?.midSection && (
        <CortexMidSection mid={extras.midSection} />
      )}
      {feature.slug === "ask" && extras?.midSection && (
        <CapabilityChips title={extras.midSection.title} items={extras.midSection.items} />
      )}
      {feature.slug === "pulse" && extras?.midSection && (
        <PulseMidSection mid={extras.midSection} />
      )}
      {feature.stats && extras?.statsTitle && (
        <StatsBand
          titleMuted={extras.statsTitleMuted}
          title={extras.statsTitle}
          stats={feature.stats}
        />
      )}
      <CtaBand />
    </>
  );
}
