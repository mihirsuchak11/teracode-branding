import type { Stat } from "@/lib/types";
import { APP_START } from "@/lib/app";

export const MAIL_CONTACT = "mailto:contact@teracodeai.com";

export const hero = {
  announcement: {
    badge: "New",
    text: "First connected repository is free. Then $20 per repo, per month.",
    href: "/pricing",
  },
  title: "Several reviewers. Your keys. One check each.",
  body: "TeraCodeAI is a GitHub App and dashboard that runs multiple review agents on every pull request. Each agent writes in its own voice, posts its own status check, and comments only when it has something to say. You bring the model key; we take no cut of inference.",
  primary: { label: "Start free", href: APP_START },
  secondary: { label: "See pricing", href: "/pricing" },
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
    body: "Install the GitHub App, sign in, and connect a repository. The first one in an org is free forever.",
  },
  {
    n: "2.",
    title: "Bring a key",
    body: "Add an Anthropic or OpenRouter key. Reviews run on your account, at your provider's price.",
  },
  {
    n: "3.",
    title: "Gate the merge",
    body: "Each agent posts its own check. Require the ones you care about. The dashboard shows what your team kept.",
  },
];

export const statement = {
  eyebrow: "Bring your own key — several reviewers, one check each",
  title:
    "AI writes code faster than any team can review it. TeraCodeAI puts named reviewers on the pull request, not a SOC 2 scanner in a box.",
};

export const spotlights = [
  {
    name: "Multi-agent review",
    status: "Several reviewers",
    href: "/products/review",
    body: "Legal, Compliance, Team Lead, Senior Engineer, or agents you write. They fan out on the same diff, then findings merge into one review so two agents flagging the same line become one comment.",
    bullets: [
      "Each agent posts its own status check.",
      "Findings merge before they hit the thread.",
      "Skills attach to the paths they know.",
    ],
    mock: "graph" as const,
  },
  {
    name: "Bring your own key",
    status: "Your keys",
    href: "/products/agents",
    body: "Anthropic or OpenRouter, stored encrypted, used only to call the provider you chose. The key never enters the sandbox that clones the pull request. We do not resell tokens.",
    bullets: [
      "Keys encrypted at rest.",
      "Spend shown from what the provider reports.",
      "A monthly budget you can actually hit.",
    ],
    mock: "ask" as const,
  },
  {
    name: "One check each",
    status: "Merge gates",
    href: "/products/checks",
    body: "A clean run is a passing check, not an approval you did not ask for. Require the agents you trust. The journal records which findings the team kept, so you can see whether the reviewers were worth it.",
    bullets: [
      "Checks you can require in branch protection.",
      "A journal, not a black box.",
      "Keep-rate per agent, per repository.",
    ],
    mock: "pulse" as const,
  },
];

/** The specialist board shown beside multi-agent review. */
export const graphSources = [
  { name: "Security", detail: "2 findings", status: "Done" },
  { name: "Team Lead", detail: "1 regression", status: "Done" },
  { name: "Senior Eng", detail: "coverage -3%", status: "Running" },
  { name: "Compliance", detail: "awaiting diff", status: "Queued" },
];

/** The check card shown beside merge gates. */
export const pulseAlert = {
  severity: "Check failed",
  time: "2 min ago",
  title: "security · check failed",
  body: "Token logged in plaintext in auth/session.ts. Check security is failing until this finding is addressed.",
  channel: "PR #482",
  routed: "Posted to",
  delivered: "Check run updated",
};

export const stack = {
  title: "The dashboard after you sign in",
  body: "Agents, skills, findings, coverage, and usage for the repositories you connected. Two forges: GitHub App, or a GitLab project token.",
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

/** Composer placeholder for the BYOK spotlight panel. */
export const migrateComposer = "Add the Anthropic key from Settings → Vault";

export const testimonial = {
  stat: { value: "$20", label: "per extra connected repository, per month — first repo free" },
  quote:
    "“Bring your own key. Several reviewers in their own voice. One check each. We show you whether they were worth it.”",
  name: "The product, in one line",
  role: "TeraCodeAI",
  image: "/art/hero-knot.png",
};

export const statsSection: { titleMuted: string; title: string; stats: Stat[] } = {
  titleMuted: "One meter. Your keys. No second company.",
  title: "TeraCodeAI is the review board, not the model bill.",
  stats: [
    { value: "$20", label: "Per extra connected repository / month" },
    { value: "1", label: "First repository in an org, free forever" },
    { value: "0", label: "Cut of your inference spend" },
    { value: "N", label: "Reviewers — each posts its own check" },
  ],
};
