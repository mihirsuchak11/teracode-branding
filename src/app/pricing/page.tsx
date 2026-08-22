import { buildMetadata } from "@/lib/metadata";
import { pricingHero, tiers, comparison } from "@/content/pricing";
import { Reveal } from "@/components/motion/Reveal";
import { PricingTiers } from "@/components/sections/PricingTiers";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { LogoTicker } from "@/components/sections/LogoTicker";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "No platform fee, no per-seat licence and no markup on inference. You bring your own API keys and your provider bills you directly. Private beta.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <section className="flex flex-wrap items-end justify-between gap-6 px-6 pb-7 pt-7 md:px-32">
        <Reveal>
          <h1 className="text-4xl font-medium tracking-tight text-fg md:text-[46px]">
            {pricingHero.title}
          </h1>
        </Reveal>
        <Reveal delay={0.05}>
          <p className="max-w-[360px] text-right text-[15px] leading-6 text-fg-muted">
            {pricingHero.note}
          </p>
        </Reveal>
      </section>
      <PricingTiers tiers={tiers} />
      <div className="mt-9">
        <LogoTicker />
      </div>
      <ComparisonTable groups={comparison} tiers={tiers} />
    </>
  );
}
