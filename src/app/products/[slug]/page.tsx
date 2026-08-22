import { notFound } from "next/navigation";
import { features, featureExtras, featureHero, getFeature } from "@/content/features";
import { MAIL_ACCESS } from "@/content/home";
import { faqJsonLd, productJsonLd } from "@/lib/jsonLd";
import { JsonLd } from "@/components/seo/JsonLd";
import type { FeaturePage as Feature } from "@/lib/types";
import { buildMetadata } from "@/lib/metadata";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { FeatureShowcase, PulseMidSection } from "@/components/sections/BenefitSection";
import { ReviewMidPanels } from "@/components/sections/ReviewMidPanels";
import { CapabilityChips } from "@/components/sections/CapabilityChips";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { ReviewSpecialists } from "@/components/sections/ReviewFlow";
import { CopyGrid } from "@/components/sections/CopyGrid";
import { Differentiator } from "@/components/sections/Differentiator";
import { IntegrationStrip } from "@/components/sections/IntegrationStrip";
import { FaqSection } from "@/components/sections/FaqSection";
import { StatsBand } from "@/components/sections/StatsBand";
import { CtaBand } from "@/components/sections/CtaBand";
import { FeatureStrands } from "@/components/three/FeatureStrands";
import {
  reviewAudience,
  reviewCatches,
  reviewCompare,
  reviewFaq,
  reviewFaqBlurb,
  reviewHowItWorks,
  reviewIntegrations,
  reviewTrust,
} from "@/content/review";

export function generateStaticParams() {
  return features.map((feature) => ({ slug: feature.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const feature = getFeature(slug);
  if (!feature) return {};
  return buildMetadata({
    title: `${feature.name} — ${feature.tagline.replace(/\.$/, "")}`,
    description: feature.heroBody,
    path: `/products/${feature.slug}`,
    brandSuffix: false,
  });
}

/* The original's breadcrumb block is 58px tall with the rule at its baseline,
   running from the frame edge to wherever the 480px hero graphic begins. */
function Breadcrumb({ name, ruleToArt = true }: { name: string; ruleToArt?: boolean }) {
  return (
    <div>
      <nav className="flex h-[58px] items-center gap-2 px-6 pt-5 pb-[18px] text-sm leading-5 md:px-10">
        <span className="text-fg">Products</span>
        <span className="flex w-4 justify-center font-mono text-xs text-fg-faint">∴</span>
        <span className="text-fg-faint">{name}</span>
      </nav>
      <div
        className={`h-px bg-border ${ruleToArt ? "w-[calc(100%-480px)]" : "w-full max-w-[692px]"}`}
      />
    </div>
  );
}

function HeroBadge({ name }: { name: string }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full bg-[#1c1917] px-4 text-xs font-medium leading-4 text-fg">
      {name}
    </span>
  );
}

function HeroCtas({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Button href={MAIL_ACCESS}>Get early access</Button>
      <Button href="/pricing" variant="secondary">
        View pricing
      </Button>
    </div>
  );
}

function Hero({ feature }: { feature: Feature }) {
  const conf = featureHero[feature.slug] ?? { layout: "art-top", ctas: false };
  const titleLines = feature.heroTitle.split("\n");

  /* "centered": the strand graphic sits in the flow, centred above the copy. */
  if (conf.layout === "centered") {
    return (
      <section className="flex flex-col items-center px-6 pb-[61px] pt-px text-center md:px-20">
        <div className="pointer-events-none h-[457px] w-[460px] max-w-full">
          <FeatureStrands slug={feature.slug} />
        </div>
        <Reveal className="flex w-full flex-col items-center">
          <HeroBadge name={feature.name} />
          <h1 className="mt-10 w-full text-display-hero text-fg">
            {titleLines.map((line) => (
              <span key={line} className="block">
                {line}
              </span>
            ))}
          </h1>
          <p className="mt-3 w-full text-base leading-6 text-fg-muted">{feature.heroBody}</p>
          {conf.ctas && <HeroCtas className="mt-10 justify-center" />}
        </Reveal>
      </section>
    );
  }

  /* "split": copy in a 612px column, the strand graphic parked to its right. */
  if (conf.layout === "split") {
    return (
      <section className="relative px-6 pb-[138px] md:px-10">
        <div className="pointer-events-none absolute right-[78px] top-[44px] hidden h-[554px] w-[536px] lg:block">
          <FeatureStrands slug={feature.slug} />
        </div>
        <Reveal className="max-w-[612px] pt-[98px]">
          <HeroBadge name={feature.name} />
          <h1 className="mt-10 whitespace-pre-line text-display-hero text-fg">
            {feature.heroTitle}
          </h1>
          <p className="mt-5 text-base leading-6 text-fg-muted">{feature.heroBody}</p>
          {conf.ctas && <HeroCtas className="mt-10" />}
        </Reveal>
      </section>
    );
  }

  /* "art-top": the 480px strand graphic is pinned to the frame's top-right by
     the page shell, so the copy simply starts below it. */
  return (
    <section className="relative px-6 pb-[60px] md:px-10">
      <Reveal className="pt-[440px]">
        <HeroBadge name={feature.name} />
        <h1 className="mt-10 whitespace-pre-line text-display-hero text-fg">
          {feature.heroTitle}
        </h1>
        <div className="mt-[100px] flex flex-wrap items-center justify-between gap-8">
          <p className="max-w-[418px] text-base leading-6 text-fg">{feature.heroBody}</p>
          <HeroCtas />
        </div>
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

  const heroLayout = featureHero[feature.slug]?.layout ?? "art-top";
  const artTop = heroLayout === "art-top";

  return (
    <>
      {/* Only Review is obtainable today, so only Review carries an offer. */}
      <JsonLd data={productJsonLd(feature, feature.slug === "review")} />
      {feature.slug === "review" && <JsonLd data={faqJsonLd(reviewFaq)} />}
      <div className="relative">
        {artTop && (
          <div className="pointer-events-none absolute right-0 top-0 hidden h-[480px] w-[480px] md:block">
            <FeatureStrands slug={feature.slug} />
          </div>
        )}
        <Breadcrumb name={feature.name} ruleToArt={artTop} />
        <Hero feature={feature} />
      </div>
      {feature.slug === "review" && (
        <HowItWorks
          eyebrow={reviewHowItWorks.eyebrow}
          titleMuted={reviewHowItWorks.titleMuted}
          title={reviewHowItWorks.title}
          steps={reviewHowItWorks.steps}
        />
      )}
      <FeatureShowcase slug={feature.slug} benefits={feature.benefits} />
      {feature.slug === "review" && extras?.midSection && (
        <ReviewMidPanels title={extras.midSection.title} items={extras.midSection.items} />
      )}
      {feature.slug === "migrate" && extras?.midSection && (
        <CapabilityChips title={extras.midSection.title} items={extras.midSection.items} />
      )}
      {feature.slug === "oncall" && extras?.midSection && (
        <PulseMidSection mid={extras.midSection} />
      )}
      {feature.slug === "review" && (
        <>
          <CopyGrid
            eyebrow={reviewCatches.eyebrow}
            titleMuted={reviewCatches.titleMuted}
            title={reviewCatches.title}
            items={reviewCatches.items}
            columns={4}
            graphic={<ReviewSpecialists />}
          />
          <CopyGrid
            eyebrow={reviewAudience.eyebrow}
            titleMuted={reviewAudience.titleMuted}
            title={reviewAudience.title}
            items={reviewAudience.items}
          />
          <IntegrationStrip {...reviewIntegrations} />
          <CopyGrid
            eyebrow={reviewTrust.eyebrow}
            titleMuted={reviewTrust.titleMuted}
            title={reviewTrust.title}
            items={reviewTrust.items}
            columns={4}
          />
          <Differentiator {...reviewCompare} />
        </>
      )}
      {feature.stats && extras?.statsTitle && (
        <StatsBand
          titleMuted={extras.statsTitleMuted}
          title={extras.statsTitle}
          stats={feature.stats}
          icons={[
            "/lottie/stat-1.json",
            "/lottie/stat-2.json",
            "/lottie/stat-3.json",
            "/lottie/stat-4.json",
          ]}
        />
      )}
      {feature.slug === "review" && (
        <FaqSection items={reviewFaq} title="Questions about Review" blurb={reviewFaqBlurb} />
      )}
      <CtaBand />
    </>
  );
}
