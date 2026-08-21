import { Fragment } from "react";
import type { ComparisonGroup, PricingTier } from "@/lib/types";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { Check, Close } from "@/components/ui/icons";

function CellValue({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <Check
        width={17}
        height={17}
        strokeWidth={1.7}
        className="mx-auto text-fg-dim"
        aria-label="Included"
      />
    );
  }
  if (value === false) {
    return (
      <Close
        width={15}
        height={15}
        strokeWidth={1.5}
        className="mx-auto text-fg-disabled"
        aria-label="Not included"
      />
    );
  }
  return <span className="text-[15px] text-fg-dim">{value}</span>;
}

/** Hairline comparison table with centered plan columns, matching the original. */
export function ComparisonTable({
  groups,
  tiers,
}: {
  groups: ComparisonGroup[];
  tiers: PricingTier[];
}) {
  return (
    <section className="px-6 pb-24 pt-24 md:px-32 md:pt-28">
      <Reveal>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="w-1/4 pb-8" aria-label="Feature" />
                {tiers.map((tier) => (
                  <th
                    key={tier.name}
                    className="w-1/4 pb-8 text-center text-[17px] font-medium text-fg"
                  >
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {groups.map((group) => (
                <Fragment key={group.name || "usage"}>
                  {group.name && (
                    <tr>
                      <td
                        colSpan={tiers.length + 1}
                        className="pb-4 pt-16 text-[17px] font-medium text-fg"
                      >
                        {group.name}
                      </td>
                    </tr>
                  )}
                  {group.rows.map((row) => (
                    <tr
                      key={`${group.name}-${row.feature}`}
                      className="border-b border-border"
                    >
                      <td className="py-[22px] pr-6 text-[15px] text-fg-dim">
                        {row.feature}
                      </td>
                      {row.values.map((value, i) => (
                        <td key={tiers[i].name} className="px-4 py-[22px] text-center">
                          <CellValue value={value} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </Fragment>
              ))}
              <tr>
                <td className="pt-14" />
                {tiers.map((tier) => (
                  <td key={tier.name} className="px-4 pt-14 text-center">
                    <Button
                      href={tier.cta.href}
                      variant={tier.highlighted ? "primary" : "secondary"}
                      className="w-full max-w-[240px]"
                    >
                      {tier.cta.label}
                    </Button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </Reveal>
    </section>
  );
}
