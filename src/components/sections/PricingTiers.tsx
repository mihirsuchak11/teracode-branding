import type { PricingTier } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/button";
import { CurrencyToggle } from "@/components/sections/CurrencyToggle";

/** Circled check, as in the original tier checklists. */
function CircleCheck() {
  return (
    <svg
      width={19}
      height={19}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mt-px shrink-0 text-fg-faint"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.2 2.4 2.4 4.6-5" />
    </svg>
  );
}

/** One hairline-bordered panel divided into three tier columns. */
export function PricingTiers({ tiers }: { tiers: PricingTier[] }) {
  return (
    <section id="community" className="px-6 md:px-24">
      <Reveal>
        <div className="grid border border-border md:grid-cols-3 md:divide-x md:divide-border">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className="flex flex-col border-t border-border p-8 pb-9 first:border-t-0 md:min-h-[483px] md:border-t-0"
            >
              <h3 className="text-[17px] font-medium text-fg-dim">{tier.name}</h3>
              {tier.billed ? (
                <CurrencyToggle
                  usd={tier.billed.usd}
                  inr={tier.billed.inr}
                  period={tier.billed.period}
                />
              ) : (
                <p className="mt-4 flex items-baseline gap-1.5">
                  <span className="text-[28px] font-medium tracking-tight text-fg">
                    {tier.price}
                  </span>
                  {tier.period && (
                    <span className="text-[15px] text-fg-faint">{tier.period}</span>
                  )}
                </p>
              )}
              <div className="mt-10">
                <p className="text-[15px] text-fg-muted">{tier.description}</p>
                <ul className="mt-6 flex flex-col gap-[13px]">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3 text-sm text-fg-dim">
                      <CircleCheck />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-auto pt-10">
                <Button
                  href={tier.cta.href}
                  variant={tier.highlighted ? "primary" : "secondary"}
                  className="w-full"
                >
                  {tier.cta.label}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
