import type { ComparisonGroup, PricingTier } from "@/lib/types";
import { APP_BILLING, APP_START } from "@/lib/app";

export const pricingHero = {
  title: "Pricing",
  note: "An army of agents on every pull request. $20 per extra repository / month; first repo free. Students and public open-source projects run one agent, free. Pay in USD or INR through hosted checkout — we do not integrate Razorpay.",
};

/**
 * One meter, matching teracodeai BILLING.md, plus the community grant.
 * Three columns: the army on the free repo, each extra repo, and the
 * student / OSS one-agent program.
 */
export const tiers: PricingTier[] = [
  {
    name: "The army",
    price: "$0",
    period: "first repo",
    description: "Every review agent you name, on the oldest connected repository. It stays free.",
    cta: { label: "Start free", href: APP_START },
    features: [
      "Legal, Compliance, Security, Team Lead, Senior Engineer…",
      "Each agent posts its own check",
      "Bring your own Anthropic or OpenRouter key",
      "GitHub App or GitLab project token",
      "Findings journal and keep-rate",
      "Inference billed by your provider, not by us",
    ],
    highlighted: true,
  },
  {
    name: "Each extra repository",
    price: "$20",
    period: "/month",
    description: "Same army. The meter is connected repositories, not seats and not queries.",
    cta: { label: "Start free", href: APP_START },
    features: [
      "Everything on the first repository",
      "$20 per extra connected repo / month",
      "Pay in USD or INR via hosted checkout",
      "Paddle, Polar, or Stripe — not Razorpay",
      "Cancel a repo; quantity drops at the next boundary",
      "No per-seat licence",
    ],
  },
  {
    name: "Student & open source",
    price: "$0",
    period: "one agent",
    description: "Verified students and public open-source repositories run one review agent, free.",
    cta: { label: "Apply in the dashboard", href: APP_BILLING },
    features: [
      "One review agent — Senior Engineer by default",
      "One connected repository, free forever",
      "University email (.edu, .ac.in) granted immediately",
      "Public GitHub repo checked against the forge",
      "The rest of the army unlocks when you subscribe",
      "Same BYOK vault, same dashboard",
    ],
  },
];

export const tierNames = tiers.map((t) => t.name);

export const comparison: ComparisonGroup[] = [
  {
    name: "",
    rows: [
      { feature: "Platform meter", values: ["First repo", "Each extra repo", "One agent"] },
      { feature: "Price", values: ["$0 forever", "$20 / month", "$0"] },
      { feature: "Review agents", values: ["The army", "The army", "One"] },
      { feature: "Per-seat licence", values: ["None", "None", "None"] },
    ],
  },
  {
    name: "What you get",
    rows: [
      { feature: "Review: multi-agent pull request review", values: [true, true, "One agent"] },
      { feature: "One status check per agent", values: [true, true, true] },
      { feature: "Bring your own key", values: [true, true, true] },
      { feature: "GitHub App", values: [true, true, true] },
      { feature: "GitLab project token", values: [true, true, true] },
    ],
  },
  {
    name: "How you pay",
    rows: [
      { feature: "We resell you tokens", values: [false, false, false] },
      { feature: "Hosted checkout (USD or INR)", values: [true, true, "Not needed"] },
      { feature: "Razorpay or a gateway we operate", values: [false, false, false] },
      { feature: "Monthly budget in the dashboard", values: [true, true, true] },
    ],
  },
];
