import type { ComparisonGroup, PricingTier } from "@/lib/types";
import { APP_START } from "@/lib/app";

export const pricingHero = {
  title: "Pricing",
  note: "$20 per connected repository per month, across every product. The first repository in an organization is free, forever. One meter.",
};

/**
 * One meter, matching teracodeai BILLING.md. The three columns explain that
 * meter rather than inventing Starter / Pro / Enterprise prices.
 */
export const tiers: PricingTier[] = [
  {
    name: "First repository",
    price: "$0",
    period: "forever",
    description: "The oldest connected repository in an organization stays free.",
    cta: { label: "Start free", href: APP_START },
    features: [
      "One connected repository",
      "Every review agent you configure",
      "Each agent posts its own check",
      "Bring your own Anthropic or OpenRouter key",
      "GitHub App or GitLab project token",
      "Findings journal and keep-rate",
    ],
  },
  {
    name: "Each additional repository",
    price: "$20",
    period: "/month",
    description: "Same product. The meter is connected repositories, not seats and not queries.",
    cta: { label: "Start free", href: APP_START },
    features: [
      "Everything on the first repository",
      "$20 per extra connected repo / month",
      "Prorated when you connect mid-cycle",
      "Cancel a repo; quantity drops at the next boundary",
      "Inference billed by your provider, not by us",
      "No per-seat licence",
    ],
    highlighted: true,
  },
  {
    name: "Inference",
    price: "Yours",
    description: "Not a TeraCodeAI line item. You pay Anthropic or OpenRouter directly.",
    cta: { label: "Start free", href: APP_START },
    features: [
      "Your API key, encrypted at rest",
      "Calls go to the provider you chose",
      "We add no markup on tokens",
      "OpenRouter reports exact per-call cost",
      "Anthropic reports tokens (unmetered, not free)",
      "A monthly budget you set in the dashboard",
    ],
  },
];

export const tierNames = tiers.map((t) => t.name);

export const comparison: ComparisonGroup[] = [
  {
    name: "",
    rows: [
      { feature: "Platform meter", values: ["First repo", "Each extra repo", "Not us"] },
      { feature: "Price", values: ["$0 forever", "$20 / month", "Your provider"] },
      { feature: "Per-seat licence", values: ["None", "None", "None"] },
    ],
  },
  {
    name: "What you get",
    rows: [
      { feature: "Review: multi-agent pull request review", values: [true, true, true] },
      { feature: "Studio, Runtime and Evals on the same account", values: [true, true, true] },
      { feature: "Migrate, Oncall and Signals when they launch (same meter)", values: [true, true, true] },
      { feature: "One status check per agent", values: [true, true, true] },
      { feature: "Bring your own key", values: [true, true, true] },
      { feature: "GitHub App", values: [true, true, true] },
      { feature: "GitLab project token", values: [true, true, true] },
    ],
  },
  {
    name: "How inference is billed",
    rows: [
      { feature: "We resell you tokens", values: [false, false, false] },
      { feature: "Keys encrypted at rest", values: [true, true, true] },
      { feature: "Key enters the review sandbox", values: [false, false, false] },
      { feature: "Spend from the provider's report", values: [true, true, true] },
      { feature: "Monthly budget in the dashboard", values: [true, true, true] },
    ],
  },
  {
    name: "What this is not",
    rows: [
      { feature: "SOC 2 scanner in a box", values: [false, false, false] },
      { feature: "Hosted model with a hidden margin", values: [false, false, false] },
      { feature: "Bitbucket or Azure DevOps", values: [false, false, false] },
      { feature: "Per-developer seat fee", values: [false, false, false] },
      { feature: "Query or data-source pack", values: [false, false, false] },
    ],
  },
];
