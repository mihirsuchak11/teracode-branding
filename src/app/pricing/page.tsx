import { buildMetadata } from "@/lib/metadata";
import { pricingHero, tiers, comparison } from "@/content/pricing";
import { Reveal } from "@/components/motion/Reveal";
import { PricingTiers } from "@/components/sections/PricingTiers";
import { ComparisonTable } from "@/components/sections/ComparisonTable";
import { LogoTicker } from "@/components/sections/LogoTicker";

export const metadata = buildMetadata({
  title: "Pricing",
  description:
    "An army of agents on every pull request. Team is $10.00 or ₹799 + GST per Seat / month. Students and open-source projects run one agent, 25 Reviews, free. Enterprise is seats we set / invoice. Stripe in USD · Razorpay in INR. Inference is BYOK.",
  path: "/pricing",
});

/** Honest meter, not a yearly toggle we do not offer. */
function MeterNote() {
  return (
    <p className="max-w-sm text-right text-[15px] leading-6 text-fg-muted">
      {pricingHero.note}
    </p>
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
          <MeterNote />
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
