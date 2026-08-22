import type { Stat } from "@/lib/types";

/** Prefilled mail links — the private beta has no signup form, just an inbox. */
export const MAIL_ACCESS =
  "mailto:contact@teracode.ai?subject=Early%20access%20%E2%80%94%20TeraCode%20Review";
export const MAIL_DEMO =
  "mailto:contact@teracode.ai?subject=Demo%20request%20%E2%80%94%20TeraCode";
export const MAIL_CONTACT = "mailto:contact@teracode.ai";

export const hero = {
  announcement: {
    badge: "New",
    text: "TeraCode Review is now in private beta",
    href: MAIL_ACCESS,
  },
  title: "Ship faster. Ship safer.",
  body: "TeraCode Review puts an AI review board on every pull request — catching bugs, security issues and regressions before a human opens the diff. It is BYOK — it runs on your own API keys, with no markup on what you spend.",
  primary: { label: "Get early access", href: MAIL_ACCESS },
  secondary: { label: "Book a demo", href: MAIL_DEMO },
  mock: {
    prompt: "What should I review?",
    chips: ["Review", "Explain", "Secure", "Test"],
    status: ["Reviewing", "Reading the diff", "3 issues"],
  },
};

export const steps = [
  {
    n: "1.",
    title: "Author",
    body: "Define personas, skills and tools. An agent is instructions, a model and a policy.",
  },
  {
    n: "2.",
    title: "Run",
    body: "Sandboxed execution on your own API keys. No reselling, no markup.",
  },
  {
    n: "3.",
    title: "Measure",
    body: "Scored on what your team kept, not on how the demo looked.",
  },
];

export const statement = {
  eyebrow: "Bring your own key — TeraCode runs on the providers and stacks you already use",
  title:
    "AI writes code faster than any team can review it. TeraCode closes the gap.",
};

export const spotlights = [
  {
    name: "TeraCode Review",
    status: "Private beta",
    href: MAIL_ACCESS,
    body: "A review board on every pull request. Security, performance, tests and style each run as their own specialist, then TeraCode reconciles them into a single review a human can act on — before anyone opens the diff.",
    bullets: [
      "BYOK: runs on your own keys.",
      "Findings ranked by real risk.",
      "One review, not forty comments.",
    ],
    mock: "graph" as const,
  },
  {
    name: "TeraCode Migrate",
    status: "Coming soon",
    href: MAIL_ACCESS,
    body: "Carry a codebase-wide migration to done. Point TeraCode at the change you want, and it works every call site, opens the pull requests, and keeps going until nothing is left behind.",
    bullets: [
      "Works every call site, not a sample.",
      "Opens PRs you review normally.",
      "Stops when the migration is done.",
    ],
    mock: "ask" as const,
  },
  {
    name: "TeraCode Oncall",
    status: "Coming soon",
    href: MAIL_ACCESS,
    body: "Triage that reads the trace, not the alert. When something pages, TeraCode pulls the trace, the recent deploys and the owning code, then arrives with ranked causes instead of another notification.",
    bullets: [
      "Reads traces, deploys and diffs.",
      "Arrives with ranked causes.",
      "Routes to the right channel.",
    ],
    mock: "pulse" as const,
  },
];

/** The specialist board shown beside TeraCode Review. */
export const graphSources = [
  { name: "Security", detail: "2 findings", status: "Done" },
  { name: "Performance", detail: "1 regression", status: "Done" },
  { name: "Tests", detail: "coverage -3%", status: "Running" },
  { name: "Style", detail: "awaiting diff", status: "Queued" },
];

/** The triage card shown beside TeraCode Oncall. */
export const pulseAlert = {
  severity: "High severity",
  time: "2 min ago",
  title: "Checkout latency spike",
  body: "p95 on /checkout rose from 240ms to 1.9s over the last 20 minutes.",
  channel: "#incidents",
  routed: "Routed to",
  delivered: "Paged 1m ago",
};

export const stack = {
  title: "One platform, one runtime",
  body: "Seven products, one execution layer underneath. Author agents, run them sandboxed on your own keys, and score them on what your team actually kept.",
  cta: { label: "Explore the platform", href: "/integrations" },
  label: "Platform products",
  addLabel: "Request access",
  /** `logo` files are abstract marks carried over from the template. */
  sources: [
    { name: "TeraCode Studio", a: "Personas, skills, tools", b: "Private beta", logo: "/logos/chatdock.svg" },
    { name: "TeraCode Runtime", a: "Sandboxed execution", b: "Your own keys", logo: "/logos/vaultdb.svg" },
    { name: "TeraCode Evals", a: "Keep-rate scoring", b: "Private beta", logo: "/logos/stride.svg" },
    { name: "TeraCode Signals", a: "Traces, spend, drift", b: "Coming soon", logo: "/logos/threadbase.svg" },
    { name: "TeraCode Review", a: "Every pull request", b: "Private beta", logo: "/logos/pipecloud.svg" },
  ],
  /** The dim 3-wide tile grid beside the list. */
  tiles: Array.from({ length: 11 }, (_, i) => `/logos/tile-${String(i).padStart(2, "0")}.svg`),
  totals: [
    { value: "7", label: "products on one platform" },
    { value: "1", label: "runtime under all of them" },
  ],
};

/* Providers, platforms and languages TeraCode runs against — not customers. */
export const tickerBrands = [
  "Anthropic",
  "OpenAI",
  "Google",
  "GitHub",
  "GitLab",
  "TypeScript",
  "Python",
  "Go",
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
  ticker: ["Reading the diff", "Running security and performance checks", "3 issues found"],
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

/** Composer placeholder for the TeraCode Migrate panel. */
export const migrateComposer = "Upgrade every call site to the v3 API";

export const testimonial = {
  stat: { value: "100%", label: "of your token spend goes to your provider, not to us" },
  quote:
    "“Every AI reviewer on the market bills you per seat and resells you tokens at a margin. We think the review should be the product, and the tokens should be yours.”",
  name: "The team building TeraCode",
  role: "TeraSoft AI",
  image: "/art/hero-knot.png",
};

export const statsSection: { titleMuted: string; title: string; stats: Stat[] } = {
  titleMuted: "Every AI reviewer charges per seat.",
  title: "TeraCode runs on your keys, at cost.",
  stats: [
    { value: "$0", label: "Markup on your token spend" },
    { value: "0", label: "Per-seat licences" },
    { value: "100%", label: "BYOK — your own API keys" },
    { value: "1", label: "Runtime under every product" },
  ],
};
