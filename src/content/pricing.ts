import type { ComparisonGroup, PricingTier } from "@/lib/types";
import { MAIL_ACCESS, MAIL_DEMO } from "@/content/home";

export const pricingHero = {
  title: "Pricing",
  note: "You pay your model provider. You do not pay us a margin on top.",
};

/**
 * TeraCode is in private beta and team pricing is not set yet. Rather than
 * publish numbers that are not real, the tiers below state what is true today.
 */
export const tiers: PricingTier[] = [
  {
    name: "Private beta",
    price: "$0",
    period: "/month",
    description: "What early access costs while we are in private beta.",
    cta: { label: "Get early access", href: MAIL_ACCESS },
    features: [
      "No platform fee",
      "No per-seat licence",
      "Connect your own provider account",
      "Tokens billed to you, by your provider",
      "TeraCode Review on your repositories",
      "Support direct from the team",
    ],
    highlighted: true,
  },
  {
    name: "Team",
    price: "Not yet set",
    description: "We have not priced team plans yet.",
    cta: { label: "Help us price it", href: MAIL_DEMO },
    features: [
      "Everything in the private beta",
      "Shared configuration across repositories",
      "Org-wide skills and personas",
      "Usage and spend reporting",
      "Priced once beta feedback is in",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "For teams with procurement, residency or isolation requirements.",
    cta: { label: "Talk to us", href: MAIL_DEMO },
    features: [
      "Everything in Team",
      "Self-hosted runtime",
      "SSO and audit logging",
      "Custom data residency",
      "Security review and MSA",
    ],
  },
];

export const tierNames = tiers.map((t) => t.name);

/**
 * The comparison is about the billing model rather than a feature checklist —
 * that is the part of TeraCode that differs from everything else in this
 * category, and it is the part a buyer needs to understand.
 */
export const comparison: ComparisonGroup[] = [
  {
    name: "",
    rows: [
      { feature: "Platform fee", values: ["$0", "Not yet set", "Custom"] },
      { feature: "Per-seat licence", values: ["None", "None", "None"] },
      { feature: "Markup on inference", values: ["$0", "$0", "$0"] },
    ],
  },
  {
    name: "How inference is billed",
    rows: [
      { feature: "Bring your own API keys (BYOK)", values: [true, true, true] },
      { feature: "Billed directly by your provider", values: [true, true, true] },
      { feature: "We resell you tokens", values: [false, false, false] },
      { feature: "Choose your own model", values: [true, true, true] },
      { feature: "Keys encrypted at rest", values: [true, true, true] },
    ],
  },
  {
    name: "Products",
    rows: [
      { feature: "TeraCode Review", values: ["Private beta", "Private beta", "Private beta"] },
      { feature: "TeraCode Migrate", values: ["Coming soon", "Coming soon", "Coming soon"] },
      { feature: "TeraCode Oncall", values: ["Coming soon", "Coming soon", "Coming soon"] },
      { feature: "Shared configuration across repos", values: [false, true, true] },
      { feature: "Org-wide skills and personas", values: [false, true, true] },
    ],
  },
  {
    name: "Security and admin",
    rows: [
      { feature: "Sandboxed execution", values: [true, true, true] },
      { feature: "Usage and spend reporting", values: [false, true, true] },
      { feature: "SSO and audit logging", values: [false, false, true] },
      { feature: "Self-hosted runtime", values: [false, false, true] },
      { feature: "Custom data residency", values: [false, false, true] },
      { feature: "Security review and MSA", values: [false, false, true] },
    ],
  },
];
