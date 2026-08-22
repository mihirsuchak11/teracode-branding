import type { FeaturePage } from "@/lib/types";
import { APP_START } from "@/lib/app";

/** A small decorative mock card rendered beside a benefit section. */
export interface MockCallout {
  tone?: "brand" | "danger" | "neutral";
  badge?: string;
  meta?: string;
  title?: string;
  body?: string;
}

export interface MockRow {
  label: string;
  value?: string;
  dot?: "brand" | "warn" | "danger" | "faint";
  mono?: boolean;
}

export interface FeatureMock {
  callout?: MockCallout;
  label?: string;
  rows?: MockRow[];
  footer?: { left: string; right?: string };
}

/** Mid-page headline + grid of small capability cards/chips. */
export interface FeatureMidSection {
  title: string;
  items: { title: string; body: string }[];
}

export interface FeatureExtras {
  midSection?: FeatureMidSection;
  statsTitleMuted?: string;
  statsTitle?: string;
}

/** Per-slug hero layout. Unchanged from the template — only the keys differ. */
export const featureHero: Record<
  string,
  { layout: "art-top" | "centered" | "split"; ctas: boolean }
> = {
  review: { layout: "art-top", ctas: true },
  agents: { layout: "centered", ctas: true },
  checks: { layout: "split", ctas: true },
};

export const featureCta = { label: "Start free", href: APP_START };

export const features: FeaturePage[] = [
  {
    slug: "review",
    name: "Multi-agent review",
    tagline: "Several reviewers on every pull request.",
    heroTitle: "Several reviewers.\nOne review on the thread.",
    heroBody:
      "Agents you name — Legal, Compliance, Team Lead, Senior Engineer, or your own — fan out on the same diff. Findings merge so two agents flagging the same line become one comment. Each still posts its own check.",
    benefits: [
      {
        title: "A board, not one generalist.",
        body: "Each agent has its own instructions, model, and skills. They run in parallel. Disagreements are visible; duplicates are not posted twice.",
      },
      {
        title: "Ranked by what it would break.",
        body: "A logged credential and a missing trailing comma are not the same finding. Severity is something you can act on, not a line-number sort.",
      },
      {
        title: "One thread, several checks.",
        body: "Comments land as one review from the App. Checks stay per agent, so you can require security without requiring style.",
      },
    ],
  },
  {
    slug: "agents",
    name: "Bring your own key",
    tagline: "Your provider. Your bill. No markup.",
    heroTitle: "You bring the key.\nWe run the reviewers.",
    heroBody:
      "Add an Anthropic or OpenRouter key in the vault. Reviews call that provider from the host. The key is encrypted at rest and never enters the sandbox that clones the pull request.",
    benefits: [
      {
        title: "Two providers, on purpose.",
        body: "Anthropic direct when you already hold a key and do not want a second account. OpenRouter when you want exact per-call cost in the dashboard. Other models are whatever OpenRouter fronts — not a pretend Azure or Bedrock product page.",
      },
      {
        title: "A budget you can hit.",
        body: "Set a monthly cap on the project. The review stops spending when it would go over, and says so on the pull request instead of going quiet.",
      },
      {
        title: "No seat tax, no token resale.",
        body: "The platform meter is connected repositories. Inference is your provider invoice. Those are different bills on purpose.",
      },
    ],
    chips: [
      "Anthropic or OpenRouter",
      "Encrypted at rest",
      "Key stays off the sandbox",
      "Spend from the provider",
      "Monthly project budget",
      "No markup on tokens",
    ],
    stats: [
      { value: "$20", label: "Per extra connected repository / month" },
      { value: "1", label: "First repository free forever" },
      { value: "0", label: "Cut of your inference spend" },
      { value: "2", label: "Providers: Anthropic, OpenRouter" },
    ],
  },
  {
    slug: "checks",
    name: "One check each",
    tagline: "Require the agents you trust.",
    heroTitle: "A check per agent.\nNot a rubber stamp.",
    heroBody:
      "Each reviewer posts its own status check. Gate the merge on the ones that matter. The dashboard journal shows which findings the team kept, so you can tell whether the reviewers were worth it.",
    benefits: [
      {
        title: "Branch protection, not theatre.",
        body: "A clean run is a passing check you can require in branch protection. The App posts comments and checks. It does not merge the pull request.",
      },
      {
        title: "A journal, not a black box.",
        body: "Resolved, deleted, or silently fixed: the product records what became of each comment from what the team did, and feeds that back to the agent as calibration.",
      },
    ],
  },
];

export const featureExtras: Record<string, FeatureExtras> = {
  review: {
    midSection: {
      title: "Named reviewers on the diff,\nmerged into one thread.",
      items: [
        {
          title: "Skills on the paths they know",
          body: "Attach instructions to file globs so the agent reading auth is not the one reading a migration.",
        },
        {
          title: "Runs on your own keys",
          body: "The host calls your provider. Tokens are billed to you. We add nothing on top.",
        },
        {
          title: "Scored on what you kept",
          body: "Quality is which findings the team resolved rather than deleted — not how confident the model sounded.",
        },
      ],
    },
  },
  agents: {
    midSection: {
      title: "The vault is the product.\nThe model bill is yours.",
      items: [
        {
          title: "Anthropic direct",
          body: "Your sk-ant key. Token counts in the dashboard; dollars on Anthropic's invoice. Recorded as unmetered, never as free.",
        },
        {
          title: "OpenRouter",
          body: "One key for whatever it fronts, with the per-call cost the dashboard can show. Their BYOK path still charges a small platform fee on their side — that is their bill, not ours.",
        },
        {
          title: "Encrypted at rest",
          body: "Keys sit in the vault. They are used to call the provider from the host process.",
        },
        {
          title: "Never in the sandbox",
          body: "The clone can read the repository. It cannot see your key, the database URL, or the App private key.",
        },
        {
          title: "A cap that speaks",
          body: "When spend would pass the project budget, the review says so on the pull request. A cap that only fails closed is a cap nobody can plan around.",
        },
        {
          title: "First repo free",
          body: "Connect one repository and reviews start. The $20 meter is the second repository, not a trial clock.",
        },
      ],
    },
    statsTitleMuted: "One meter for the platform.",
    statsTitle: "Your provider for the tokens.",
  },
  checks: {
    midSection: {
      title: "Most tools dump a comment storm.\nEach agent here has a check you can require.",
      items: [
        {
          title: "One check per agent.",
          body: "Security can fail while style passes. That is the point of several reviewers instead of one blob.",
        },
        {
          title: "Comment-only unless you say otherwise.",
          body: "Default policy posts findings and checks. It does not merge the pull request. You require the check names in the forge.",
        },
        {
          title: "Keep-rate in the dashboard.",
          body: "The journal is how you decide whether to keep an agent on a repository — not a marketing score.",
        },
      ],
    },
  },
};

/** Decorative mock cards, index-aligned with each page's benefits. */
export const featureMocks: Record<string, FeatureMock[]> = {
  review: [
    {
      callout: {
        tone: "brand",
        title: "PR #482",
        body: "Merged from 4 agents",
        meta: "Reviewed",
      },
      label: "Agents:",
      rows: [
        { label: "Security", value: "2 findings", dot: "brand" },
        { label: "Team Lead", value: "1 regression", dot: "brand" },
        { label: "Senior Eng", value: "coverage -3%", dot: "brand" },
      ],
    },
    {
      rows: [
        { label: "Token logged in plaintext", value: "High", dot: "danger" },
        { label: "Missing rollback path", value: "High", dot: "danger" },
        { label: "Unhandled promise rejection", value: "Medium", dot: "warn" },
        { label: "N+1 query in list view", value: "Medium", dot: "warn" },
        { label: "Unused import", value: "Low", dot: "faint" },
      ],
    },
    {
      rows: [
        { label: "Comments posted", value: "1 review", dot: "brand" },
        { label: "Findings merged", value: "12 → 5" },
        { label: "Duplicates removed", value: "7" },
        { label: "Checks posted", value: "4", mono: true },
      ],
    },
  ],
  agents: [
    {
      callout: {
        tone: "neutral",
        title: "Vault",
        meta: "Encrypted at rest",
      },
      rows: [
        { label: "provider", value: "anthropic", mono: true },
        { label: "key", value: "sk-ant-…4f21", mono: true },
        { label: "in sandbox", value: "no", mono: true },
        { label: "budget", value: "$40 / month", mono: true },
        { label: "spent", value: "$12.40", mono: true },
      ],
    },
    {
      callout: {
        tone: "brand",
        title: "OpenRouter reports the dollar",
        body: "Anthropic reports tokens only. The dashboard does not invent a price table.",
      },
      rows: [
        { label: "This run", value: "$0.18", mono: true },
        { label: "Month to date", value: "$12.40", mono: true },
        { label: "Budget remaining", value: "$27.60", mono: true },
      ],
    },
    {
      label: "Meter",
      rows: [
        { label: "First repository", value: "Free forever", dot: "brand" },
        { label: "This extra repository", value: "$20 / month", dot: "brand" },
        { label: "Inference", value: "Your provider", dot: "brand" },
      ],
    },
  ],
  checks: [
    {
      callout: {
        tone: "danger",
        badge: "Check failed",
        meta: "2 min ago",
        title: "security",
        body: "Token logged in plaintext in auth/session.ts. Require this check to hold the merge.",
      },
      rows: [
        { label: "agent", value: "security", mono: true },
        { label: "check", value: "failure", mono: true },
        { label: "findings", value: "2", mono: true },
        { label: "blocking", value: "1", mono: true, dot: "danger" },
      ],
      footer: { left: "Posted on PR #482", right: "Check run updated" },
    },
    {
      callout: {
        tone: "brand",
        title: "Keep-rate 64%",
        meta: "Last 30 days · security",
      },
      label: "What the team did",
      rows: [
        { label: "Resolved", value: "18", dot: "brand" },
        { label: "Deleted as noise", value: "7", dot: "warn" },
        { label: "Still open", value: "3", dot: "faint" },
        { label: "Silently fixed", value: "2", dot: "brand" },
      ],
    },
  ],
};

export function getFeature(slug: string): FeaturePage | undefined {
  return features.find((f) => f.slug === slug);
}
