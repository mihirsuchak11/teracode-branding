import { buildMetadata } from "@/lib/metadata";
import { pricingHero, tiers, comparison } from "@/content/pricing";
import { Reveal } from "@/components/motion/Reveal";
import { PricingTiers } from "@/components/sections/PricingTiers";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { LogoTicker } from "@/components/sections/LogoTicker";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "Start free with up to 5 data sources, upgrade to Pro for unlimited queries and anomaly detection, or talk to sales about Enterprise.",
  path: "/pricing",
});

/** Static billing-period toggle, styled after the original (Monthly active). */
function BillingToggle() {
  return (
    <div className="flex items-center rounded-[10px] bg-bg-deep p-1 text-[15px]">
      <span className="rounded-lg border border-border-strong/70 bg-surface-2 px-6 py-1.5 font-medium text-fg">
        Monthly
      </span>
      <span className="px-6 py-1.5 text-fg-faint">Yearly</span>
    </div>
  );
}

export default function PricingPage() {
  return (
    <>
      <section className="flex flex-wrap items-center justify-between gap-6 px-6 pb-7 pt-7 md:px-32">
        <Reveal>
          <h1 className="text-4xl font-medium tracking-tight text-fg md:text-[46px]">
            {pricingHero.title}
          </h1>
        </Reveal>
        <Reveal delay={0.05}>
          <BillingToggle />
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
