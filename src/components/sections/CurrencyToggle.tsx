"use client";

import { useEffect, useId, useState } from "react";
import { preferInrFromBrowser } from "@/lib/prefer-inr";

export type DisplayCurrency = "usd" | "inr";

/**
 * Preview-only USD / INR switch for the extra-repo card.
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
        <span className="text-[12px] font-medium text-fg-faint" id={`${labelId}-usd`}>
          USD
        </span>
        <button
          type="button"
          role="switch"
          aria-checked={inrOn}
          aria-labelledby={`${labelId}-usd ${labelId}-inr`}
          disabled={currency === null}
          onClick={() => setCurrency(inrOn ? "usd" : "inr")}
          className="relative h-5 w-9 shrink-0 rounded-full border border-border bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fg/30 disabled:opacity-50"
        >
          <span
            className={`absolute top-0.5 size-3.5 rounded-full bg-fg-soft transition-transform ${
              inrOn ? "translate-x-4" : "translate-x-0.5"
            }`}
          />
        </button>
        <span className="text-[12px] font-medium text-fg-faint" id={`${labelId}-inr`}>
          INR
        </span>
      </div>
      <p className="mt-2 text-[13px] leading-5 text-fg-faint">
        Preview. Also {other}. You pick USD or INR when you subscribe; it
        locks after the first payment.
      </p>
    </div>
  );
}
