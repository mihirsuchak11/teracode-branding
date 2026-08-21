import type { ComparisonGroup, PricingTier } from "@/lib/types";

export const pricingHero = {
  title: "Pricing",
  note: "Trusted by 56+ teams who are tired of tab-switching",
};

export const tiers: PricingTier[] = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    description: "Everything you need to connect your first sources.",
    cta: { label: "Get started free", href: "/contact-us" },
    features: [
      "Up to 5 data sources",
      "1,000 queries per month",
      "Cortex knowledge graph",
      "Ask natural language queries",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    description: "Everything from Starter, and:",
    cta: { label: "Start 14-day trial", href: "/contact-us" },
    features: [
      "Up to 25 data sources",
      "Unlimited queries",
      "Pulse anomaly detection",
      "Recall pattern recognition",
      "Slack and email integrations",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Everything from Pro, and:",
    cta: { label: "Talk to sales", href: "/contact-us" },
    features: [
      "Unlimited data sources",
      "Nucleus developer toolkit",
      "Custom Pathways pipelines",
      "SSO and SAML",
      "Dedicated account manager",
      "99.99% uptime SLA",
    ],
  },
];

export const tierNames = tiers.map((t) => t.name);

/* Groups and values match the original comparison table exactly.
   The first group is unlabeled in the original. */
export const comparison: ComparisonGroup[] = [
  {
    name: "",
    rows: [
      { feature: "Data sources", values: ["5", "25", "Unlimited"] },
      { feature: "Queries per month", values: ["1,000", "Unlimited", "Unlimited"] },
      { feature: "Team members", values: ["Unlimited", "Unlimited", "Unlimited"] },
    ],
  },
  {
    name: "Core",
    rows: [
      { feature: "Cortex knowledge graph", values: [true, true, true] },
      { feature: "Ask natural language queries", values: [true, true, true] },
      { feature: "Pathways data pipelines", values: [false, true, true] },
      { feature: "Exportable results (CSV, JSON, Slack)", values: [false, true, true] },
      { feature: "Visual graph explorer", values: [false, true, true] },
    ],
  },
  {
    name: "Intelligence",
    rows: [
      { feature: "Pulse anomaly detection", values: [false, true, true] },
      { feature: "Recall pattern recognition", values: [false, true, true] },
      { feature: "Adaptive baselines per metric", values: [false, true, true] },
      {
        feature: "Automated insight reports",
        values: [false, "Weekly", "Weekly + on-demand"],
      },
      { feature: "Cross-source correlation analysis", values: [false, false, true] },
    ],
  },
  {
    name: "Security and admin",
    rows: [
      { feature: "SSO and SAML", values: [false, false, true] },
      { feature: "Full pipeline audit logs", values: [false, true, true] },
      { feature: "Custom Pathways pipelines", values: [false, false, true] },
      { feature: "Nucleus developer toolkit", values: [false, false, true] },
      { feature: "Dedicated account manager", values: [false, false, true] },
      { feature: "99.99% uptime SLA", values: [false, false, true] },
    ],
  },
];
