import type { Stat } from "@/lib/types";
import { APP_START, MAIL_CONTACT } from "@/lib/app";
import { applications, productHref } from "@/content/products";

export { MAIL_CONTACT };

export const hero = {
  announcement: {
    badge: "Live",
    text: "An army of agents on every pull request. First repo free, then $29 / ₹2,999 per extra repo. Students and OSS: one agent free.",
    href: "/products/review",
  },
  title: "An army of agents on every pull request.",
  body: "Legal, Compliance, Security, Team Lead, Senior Engineer — they read the same diff at once, each in its own voice, each with its own check. Review is live today. You bring the key; we take no cut of inference. Students and open-source projects run one agent, free.",
  primary: { label: "Start free", href: APP_START },
  secondary: { label: "See the products", href: "/#products" },
  mock: {
    prompt: "What should I review?",
    chips: ["Review", "Explain", "Secure", "Test"],
    status: ["Reviewing", "Reading the diff", "3 issues"],
  },
};

export const steps = [
  {
    n: "1.",
    title: "Connect",
    body: "Install the GitHub App or connect a GitLab project. The first repository in an org is free forever.",
  },
  {
    n: "2.",
    title: "Bring a key",
    body: "Add an Anthropic or OpenRouter key. Every agent runs on your account, at your provider's price.",
  },
  {
    n: "3.",
    title: "Ship behind a gate",
    body: "Each agent posts its own check. Require the ones you trust, merge when they pass, and see what the team kept.",
  },
];

export const statement = {
  eyebrow: "Runs on the forges, providers, and languages you already use",
  /* Two-tone headline: the problem dim, the answer bright. */
  problem: "AI writes code faster than any team can check, secure, or release it.",
  answer:
    "TeraCodeAI is the layer between a diff and a deploy that keeps fast from turning into unsafe.",
};

export const productsSection = {
  id: "products",
  eyebrow: "Products",
  title: "Seven products. One platform.",
  body: "Three applications we run for you, and the four platform pieces they are built on. Same dashboard, same keys, same meter.",
};

/** What the pinned scroller says under each application. */
const spotlightDetails: Record<string, { bullets: string[]; mock: "graph" | "ask" | "pulse" }> = {
  review: {
    bullets: [
      "One check per agent, not one blob of comments.",
      "Your Anthropic or OpenRouter key. No cut of inference.",
      "A keep rate from what the team resolved, not deleted.",
    ],
    mock: "graph",
  },
  migrate: {
    bullets: [
      "One pull request per module, never a 400-file diff.",
      "Your test suite runs before each PR opens.",
      "A burn-down of every remaining call site.",
    ],
    mock: "ask",
  },
  oncall: {
    bullets: [
      "Trace, deploys and owner gathered before you wake.",
      "Three ranked causes, with the evidence attached.",
      "The timeline written for the post-mortem.",
    ],
    mock: "pulse",
  },
};

/** The three applications, in lineup order, with their scroller extras. */
export const applicationSpotlights = applications.map((p) => ({
  ...p,
  href: productHref(p),
  ...spotlightDetails[p.slug],
}));

/** The reviewer board shown beside Review. */
export const graphSources = [
  { name: "Security", detail: "2 findings", status: "Done" },
  { name: "Team Lead", detail: "1 regression", status: "Done" },
  { name: "Senior Eng", detail: "coverage -3%", status: "Running" },
  { name: "Compliance", detail: "awaiting diff", status: "Queued" },
];

/** The incident card shown beside Oncall. */
export const pulseAlert = {
  severity: "Page fired",
  time: "40 s ago",
  title: "checkout-api · p95 latency",
  body: "Spike began 2 min after deploy 4f21c. Three ranked causes and the suspected diff are in the channel.",
  labels: { baseline: "Baseline", anomaly: "Spike" },
  channel: "#inc-checkout",
  routed: "Posted to",
  delivered: "Trace attached",
};

export const stack = {
  title: "One dashboard for every product",
  body: "Agents, skills, findings, coverage, and usage for the repositories you connected. Review today; every product lands on the same screen. Two forges: GitHub App, or a GitLab project token.",
  cta: { label: "See how it connects", href: "/integrations" },
  label: "What you configure",
  addLabel: "Connect a repository",
  /** `logo` files are abstract marks carried over from the template. */
  sources: [
    { name: "Agents", a: "Personas, models, checks", b: "Per repo or org", logo: "/logos/chatdock.svg" },
    { name: "BYOK vault", a: "Anthropic or OpenRouter", b: "Encrypted at rest", logo: "/logos/vaultdb.svg" },
    { name: "Findings", a: "Keep-rate journal", b: "What the team kept", logo: "/logos/stride.svg" },
    { name: "Usage", a: "Tokens and spend", b: "From the provider", logo: "/logos/threadbase.svg" },
    { name: "Reviews", a: "Every pull request", b: "GitHub or GitLab", logo: "/logos/pipecloud.svg" },
  ],
  tiles: Array.from({ length: 11 }, (_, i) => `/logos/tile-${String(i).padStart(2, "0")}.svg`),
  totals: [
    { value: "2", label: "forges: GitHub and GitLab" },
    { value: "1", label: "meter: connected repositories" },
  ],
};

/* Providers, platforms and languages the product actually talks to. */
export const tickerBrands = [
  "Anthropic",
  "OpenRouter",
  "GitHub",
  "GitLab",
  "TypeScript",
  "Python",
  "Go",
  "Rust",
];

/**
 * Copy for the looping review demo in the Statement section. The animation is
 * unchanged from the template — only the strings differ.
 */
export const askChat = {
  placeholder: "What should I review?",
  message: "Review PR #482 before it merges",
  thinkingLabel: "Reviewing",
  resultsLabel: "3 issues",
  chips: [
    { icon: "analyze", label: "Review" },
    { icon: "compare", label: "Explain" },
    { icon: "monitor", label: "Secure" },
    { icon: "report", label: "Test" },
  ],
  ticker: ["Cloning the pull request", "Running security and team-lead agents", "3 issues found"],
  rows: [
    {
      name: "auth/session.ts",
      risk: "High",
      reason: "Token logged in plaintext",
      tint: "rgb(229, 72, 77)",
      tintSoft: "rgba(229, 72, 77, 0.2)",
    },
    {
      name: "api/orders.ts",
      risk: "Medium",
      reason: "Unhandled promise rejection",
      tint: "rgb(249, 171, 0)",
      tintSoft: "rgba(249, 171, 0, 0.2)",
    },
    {
      name: "db/migrate.sql",
      risk: "High",
      reason: "Missing rollback path",
      tint: "rgb(229, 72, 77)",
      tintSoft: "rgba(229, 72, 77, 0.2)",
    },
  ],
  resultActions: [
    { icon: "export", label: "Post review" },
    { icon: "share", label: "Open in GitHub" },
  ],
};

/** Composer placeholder for the Migrate product panel. */
export const migrateComposer = "Move every call site off the deprecated client";

export const testimonial = {
  stat: { value: "7", label: "products on one platform — the first connected repository free on every one of them" },
  quote:
    "“Help teams ship fast and secure. Connect a repository to Review and you are already on the platform: Studio, Runtime and Evals are the same account, the same keys and the same agents.”",
  name: "The company, in one line",
  role: "TeraCodeAI",
  image: "/art/hero-knot.png",
};

export const statsSection: { titleMuted: string; title: string; stats: Stat[] } = {
  titleMuted: "One platform. One meter. Your keys.",
  title: "TeraCodeAI is the layer between the agent and the model bill.",
  stats: [
    { value: "8", label: "Review agents in the army — Legal, Security, Team Lead…" },
    { value: "1", label: "Free agent for students and public open-source projects" },
    { value: "$0", label: "Markup on your tokens" },
    { value: "$29 / ₹2,999", label: "Per extra connected repository / month — first one free" },
  ],
};
