import type { ComparisonGroup, PricingTier } from "@/lib/types";
import { APP_BILLING, APP_START, MAIL_CONTACT } from "@/lib/app";

export const pricingHero = {
  title: "Pricing",
  note: "An army of agents on every pull request. Three plans. Student and public OSS: one agent, free. Team: $29 or ₹2,999 per extra connected repository / month, first repo free. Enterprise: bulk quantity, invoice billing. India sees rupees first. You pick USD or INR when you subscribe; it locks after the first payment.",
};

/**
 * One meter, matching teracodeai BILLING.md.
 * Three columns: student / OSS, Team, Enterprise. The free first repo is
 * unpaid Team, not a fourth SKU.
 */
export const tiers: PricingTier[] = [
  {
    name: "Student & open source",
    price: "$0",
    period: "one agent",
    description:
      "University email or a public repo we can verify. One review agent, on the free repository.",
    cta: { label: "Apply in the dashboard", href: APP_BILLING },
    features: [
      "One review agent — Senior Engineer by default",
      "One connected repository, free forever",
      "University email (.edu, .ac.in) granted immediately",
      "Public GitHub repo on this account, checked live",
      "The rest of the army unlocks on Team or Enterprise",
      "Same BYOK vault, same dashboard",
    ],
  },
  {
    name: "Team",
    price: "$29 / ₹2,999",
    period: "/month extra repo",
    billed: { usd: "$29", inr: "₹2,999", period: "/month extra repo" },
    description:
      "The army of agents on every connected repository. First repo free; each extra is $29 or ₹2,999 / month.",
    cta: { label: "Start free", href: APP_START },
    features: [
      "Legal, Compliance, Security, Team Lead, Senior Engineer…",
      "First connected repository free forever",
      "$29 or ₹2,999 per extra connected repo / month",
      "INR: UPI, RuPay, Indian cards. USD: international cards",
      "Razorpay hosted checkout — we remain the GST seller",
      "No per-seat licence. Inference billed by your provider",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "bulk / invoice",
    description:
      "Bulk repositories, invoice billing, named support. Same army, quantity we set with you.",
    cta: { label: "Talk to us", href: MAIL_CONTACT },
    features: [
      "Everything on Team",
      "Quantity we set — not self-serve checkout",
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
      { feature: "Platform meter", values: ["One agent, free repo", "Connected repos", "Bulk repos"] },
      { feature: "Price", values: ["$0", "$29 / ₹2,999 extra repo", "Custom"] },
      { feature: "Review agents", values: ["One", "The army", "The army"] },
      { feature: "Per-seat licence", values: ["None", "None", "None"] },
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
    ],
  },
  {
    name: "How you pay",
    rows: [
      { feature: "We resell you tokens", values: [false, false, false] },
      { feature: "Razorpay hosted checkout (USD or INR)", values: ["Not needed", true, "Invoice"] },
      { feature: "Card typed on this website", values: [false, false, false] },
      { feature: "Monthly budget in the dashboard", values: [true, true, true] },
    ],
  },
];
