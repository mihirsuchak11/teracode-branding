"use client";

import { useEffect, useId, useState } from "react";
import { preferInrFromBrowser } from "@/lib/prefer-inr";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export type DisplayCurrency = "usd" | "inr";

/**
 * Preview-only USD / INR switch for the Team card.
 *
 * Does not start checkout and does not lock `billing_currency`. That happens
 * on the dashboard when they press Pay in ₹ or Pay in $.
 */
export function CurrencyToggle({
  usd,
  inr,
  period,
}: {
  usd: string;
  inr: string;
  period: string;
}) {
  const labelId = useId();
  const [currency, setCurrency] = useState<DisplayCurrency | null>(null);

  useEffect(() => {
    setCurrency(preferInrFromBrowser() ? "inr" : "usd");
  }, []);

  const resolved: DisplayCurrency = currency ?? "usd";
  const inrOn = resolved === "inr";
  const price = inrOn ? inr : usd;
  const other = inrOn ? usd : inr;

  return (
    <div>
      <p className="mt-4 flex items-baseline gap-1.5">
        <span className="text-[28px] font-medium tracking-tight text-fg">
          {currency ? price : `${usd} / ${inr}`}
        </span>
        <span className="text-[15px] text-fg-faint">{period}</span>
      </p>
      <div className="mt-3 flex items-center gap-2.5">
        <Label
          className="cursor-pointer text-[12px] font-medium text-fg-faint"
          id={`${labelId}-usd`}
          onClick={() => currency && setCurrency("usd")}
        >
          USD
        </Label>
        <Switch
          id={`${labelId}-currency`}
          checked={inrOn}
          disabled={currency === null}
          onCheckedChange={(checked) => setCurrency(checked ? "inr" : "usd")}
          aria-labelledby={`${labelId}-usd ${labelId}-inr`}
        />
        <Label
          className="cursor-pointer text-[12px] font-medium text-fg-faint"
          id={`${labelId}-inr`}
          onClick={() => currency && setCurrency("inr")}
        >
          INR
        </Label>
      </div>
      <p className="mt-2 text-[13px] leading-5 text-fg-faint">
        Preview. Also {other}. You pick USD or INR when you subscribe; it
        locks after the first payment.
      </p>
    </div>
  );
}
