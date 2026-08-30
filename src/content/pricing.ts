import type { ComparisonGroup, PricingTier } from "@/lib/types";
import { APP_BILLING, APP_START, MAIL_CONTACT } from "@/lib/app";

export const pricingHero = {
  title: "Pricing",
  note: "An army of agents on every pull request. Three plans. Student and public OSS: one agent, 25 Reviews, free. Team: $10.00 or ₹799 + GST per Seat / month. Enterprise: seats we set, invoice billing. A Review is every agent on one change — not one agent-pass. India sees rupees first. You pick USD or INR when you subscribe; it locks after the first payment.",
};

/**
 * Seats (ADR 0015). Three columns: student / OSS, Team, Enterprise.
 * Student is one agent and 25 Reviews. Team is per Seat. Enterprise is seats we set.
 */
export const tiers: PricingTier[] = [
  {
    name: "Student & open source",
    price: "$0",
    period: "one agent",
    description:
      "University email or a public repo we can verify. One agent. 25 Reviews / month, then one agent on the diff only. Unlimited Projects.",
    cta: { label: "Apply in the dashboard", href: APP_BILLING },
    features: [
      "One review agent — Senior Engineer by default",
      "25 Reviews / month, then one agent on the diff only",
      "Unlimited Projects",
      "University email (.edu, .ac.in) granted immediately",
      "Public GitHub repo on this account, checked live",
      "Same BYOK vault, same dashboard",
    ],
  },
  {
    name: "Team",
    price: "$10.00 / ₹799 + GST",
    period: "/month per Seat",
    billed: { usd: "$10.00", inr: "₹799 + GST", period: "/month per Seat" },
    description:
      "The army of agents. $10.00 or ₹799 + GST / month per Seat. Each Seat includes 100 Reviews, pooled, no rollover.",
    cta: { label: "Start free", href: APP_START },
    features: [
      "Legal, Compliance, Security, Team Lead, Senior Engineer…",
      "$10.00 or ₹799 + GST / month per Seat — 100 Reviews each, pooled, no rollover",
      "USD extras $0.10 on the next invoice. INR packs: 250 / ₹1,999 + GST · 1,000 / ₹6,999 + GST",
      "Stripe (Link, cards) in USD · Razorpay in INR",
      "Owner, Member, Developer occupy a Seat. Viewer and Contributor do not",
      "Inference is BYOK — we take no cut",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "seats / invoice",
    description:
      "Seats we set, invoice billing, named support. Same army, same BYOK vault.",
    cta: { label: "Talk to us", href: MAIL_CONTACT },
    features: [
      "Everything on Team",
      "Seats we set — not self-serve checkout",
      "Invoice billing for procurement",
      "Named support",
      "Same BYOK vault, same dashboard",
      "USD or INR, locked after the first invoice",
    ],
  },
];

export const tierNames = tiers.map((t) => t.name);

export const comparison: ComparisonGroup[] = [
  {
    name: "",
    rows: [
      { feature: "What you pay for", values: ["One agent, 25 Reviews", "Seats + pooled Reviews", "Seats we set"] },
      { feature: "Price", values: ["$0", "$10.00 / month · ₹799 + GST / month", "Custom"] },
      { feature: "Agents", values: ["One", "The army", "The army"] },
      { feature: "Who occupies a Seat", values: ["—", "Owner, Member, Developer", "Same"] },
    ],
  },
  {
    name: "What you get",
    rows: [
      { feature: "Review: multi-agent pull request review", values: ["One agent", true, true] },
      { feature: "One status check per agent", values: [true, true, true] },
      { feature: "Bring your own key", values: [true, true, true] },
      { feature: "GitHub App", values: [true, true, true] },
      { feature: "GitLab project token", values: [true, true, true] },
      { feature: "Projects", values: ["Unlimited", "Unlimited", "Unlimited"] },
    ],
  },
  {
    name: "How you pay",
    rows: [
      { feature: "We resell you tokens", values: [false, false, false] },
      { feature: "Stripe hosted checkout (USD)", values: ["Not needed", true, "Invoice"] },
      { feature: "Razorpay hosted checkout (INR)", values: ["Not needed", true, "Invoice"] },
      { feature: "Stripe Link on USD Checkout", values: [false, true, false] },
      { feature: "Card typed on this website", values: [false, false, false] },
      { feature: "Monthly budget in the dashboard", values: [true, true, true] },
    ],
  },
];
