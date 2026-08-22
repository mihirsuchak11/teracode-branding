import type { FeaturePage } from "@/lib/types";

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
  migrate: { layout: "centered", ctas: true },
  oncall: { layout: "split", ctas: true },
};

export const features: FeaturePage[] = [
  {
    slug: "review",
    name: "TeraCode Review",
    tagline: "An AI review board on every pull request.",
    heroTitle: "Every pull request,\nreviewed before you look.",
    heroBody:
      "Security, performance, tests and style each run as their own specialist. TeraCode reconciles them into a single review a human can act on — running on your own API keys.",
    benefits: [
      {
        title: "A board of specialists, not one generalist.",
        body: "Each concern gets its own reviewer with its own instructions and tools. They run in parallel against the diff, and disagreements get reconciled before anything reaches your team.",
      },
      {
        title: "Ranked by risk, not by line number.",
        body: "A logged credential and a missing trailing comma are not the same finding. Review orders what it reports by the damage it would actually do.",
      },
      {
        title: "One review, not forty comments.",
        body: "Findings are merged, de-duplicated and posted as a single review. No comment storm, no forty notifications, no reviewer fatigue.",
      },
    ],
  },
  {
    slug: "migrate",
    name: "TeraCode Migrate",
    tagline: "Carry a codebase-wide migration to done.",
    heroTitle: "Point it at the change.\nIt finishes the job.",
    heroBody:
      "Describe the migration you want. Migrate works every call site, opens pull requests you review normally, and keeps going until nothing is left behind.",
    benefits: [
      {
        title: "Every call site, not a sample.",
        body: "Migrate enumerates the work before it starts changing anything, so you know the size of the job up front and can see what is left at any point.",
      },
      {
        title: "Pull requests you review normally.",
        body: "Work lands as ordinary pull requests against your branch protection and your checks. Nothing is written to your default branch, and nothing bypasses review.",
      },
      {
        title: "It stops when the migration is done.",
        body: "Not when a token budget runs out or a turn limit trips. Migrate tracks remaining call sites as its own completion condition.",
      },
    ],
    chips: [
      "Enumerates before editing",
      "Opens ordinary PRs",
      "Respects branch protection",
      "Runs your existing checks",
      "Resumable mid-migration",
      "Your own API keys",
    ],
    stats: [
      { value: "$0", label: "Markup on your token spend" },
      { value: "0", label: "Per-seat licences" },
      { value: "100%", label: "BYOK — your own API keys" },
      { value: "1", label: "Runtime under every product" },
    ],
  },
  {
    slug: "oncall",
    name: "TeraCode Oncall",
    tagline: "Triage that reads the trace, not the alert.",
    heroTitle: "Arrives with causes.\nNot notifications.",
    heroBody:
      "When something pages, Oncall pulls the trace, the recent deploys and the owning code, then hands you ranked causes instead of another line in a channel.",
    benefits: [
      {
        title: "It reads what the alert points at.",
        body: "An alert is a symptom. Oncall follows it into the trace, the deploys that landed near the incident window, and the code that owns the failing path.",
      },
      {
        title: "Ranked causes, with the evidence attached.",
        body: "Every candidate cause arrives with what it was inferred from, so the first thing you do is judge the reasoning rather than start the investigation from nothing.",
      },
    ],
  },
];

export const featureExtras: Record<string, FeatureExtras> = {
  review: {
    midSection: {
      title: "Four specialists on the diff,\nreconciled into one review.",
      items: [
        {
          title: "Scoped to the paths that matter",
          body: "Skills attach to file paths, so the reviewer reading your auth code carries different instructions from the one reading a migration.",
        },
        {
          title: "Runs on your own keys",
          body: "Review calls the model with your provider account. Your tokens are billed to you, at your provider's price, with nothing added on top.",
        },
        {
          title: "Scored on what you kept",
          body: "Quality is measured by which findings your team resolved rather than deleted — not by how confident the model sounded.",
        },
      ],
    },
  },
  migrate: {
    midSection: {
      title: "A migration is not a prompt.\nIt is a work list you have to finish.",
      items: [
        {
          title: "Enumerates before editing",
          body: "The work list is built and shown before a single file changes, so the size of the job is never a surprise.",
        },
        {
          title: "Opens ordinary PRs",
          body: "Changes arrive the way your team already reviews them. No special client, no separate approval surface.",
        },
        {
          title: "Respects branch protection",
          body: "Migrate works within the rules your repository already enforces, rather than asking you to relax them.",
        },
        {
          title: "Runs your existing checks",
          body: "Your CI is the gate. If the suite fails, the change does not proceed on the strength of the model's opinion.",
        },
        {
          title: "Resumable mid-migration",
          body: "Stop it, review what has landed, and pick the run back up. Progress is state, not a single long conversation.",
        },
        {
          title: "Your own API keys",
          body: "The same BYOK runtime as every other TeraCode product. No reselling, no markup, no per-seat licence.",
        },
      ],
    },
    statsTitleMuted: "Every AI reviewer charges per seat.",
    statsTitle: "TeraCode runs on your keys, at cost.",
  },
  oncall: {
    midSection: {
      title: "Most tools tell you something broke.\nOncall tells you what to look at.",
      items: [
        {
          title: "Follows the trace, not the threshold.",
          body: "The alert is where triage starts, not where it ends. Oncall reads the span that actually failed and the path that led into it, rather than restating the rule that fired.",
        },
        {
          title: "Correlates deploys against the incident window.",
          body: "Most incidents have a change behind them. Oncall lines up what shipped against when the symptom appeared and says which is worth ruling out first.",
        },
        {
          title: "Routes with the reasoning attached.",
          body: "The page reaches the team that owns the failing code, carrying the evidence it was ranked on — so the first responder starts from a hypothesis instead of a blank terminal.",
        },
      ],
    },
  },
};

/** Decorative mock cards, index-aligned with each product's benefits. */
export const featureMocks: Record<string, FeatureMock[]> = {
  review: [
    {
      callout: {
        tone: "brand",
        title: "PR #482",
        body: "Reconciled from 4 specialists",
        meta: "Reviewed",
      },
      label: "Specialists:",
      rows: [
        { label: "Security", value: "2 findings", dot: "brand" },
        { label: "Performance", value: "1 regression", dot: "brand" },
        { label: "Tests", value: "coverage -3%", dot: "brand" },
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
        { label: "Blocking", value: "2", mono: true },
      ],
    },
  ],
  migrate: [
    {
      callout: {
        tone: "neutral",
        title: "Upgrade every call site to the v3 API",
        meta: "428 call sites",
      },
      rows: [
        { label: "packages/api", value: "162 sites", mono: true },
        { label: "packages/web", value: "141 sites", mono: true },
        { label: "packages/jobs", value: "83 sites", mono: true },
        { label: "services/billing", value: "42 sites", mono: true },
        { label: "remaining", value: "0", mono: true },
      ],
    },
    {
      callout: {
        tone: "brand",
        title: "Opened 14 pull requests",
        body: "Each scoped to one package, against your branch protection and your checks.",
      },
      rows: [
        { label: "Checks passing", value: "14/14", mono: true },
        { label: "Awaiting review", value: "3", mono: true },
        { label: "Merged", value: "11", mono: true },
      ],
    },
    {
      label: "Completion",
      rows: [
        { label: "Call sites migrated", value: "428 of 428", dot: "brand" },
        { label: "Left behind", value: "None", dot: "brand" },
        { label: "Stopped because", value: "The work list is empty", dot: "brand" },
      ],
    },
  ],
  oncall: [
    {
      callout: {
        tone: "danger",
        badge: "High severity",
        meta: "2 min ago",
        title: "Checkout latency spike",
        body: "p95 on /checkout rose from 240ms to 1.9s over the last 20 minutes.",
      },
      rows: [
        { label: "service", value: "checkout-api", mono: true },
        { label: "p95 now", value: "1,900ms", mono: true },
        { label: "p95 baseline", value: "220–260ms", mono: true },
        { label: "deviation", value: "+680%", mono: true, dot: "danger" },
      ],
      footer: { left: "Routed to #incidents", right: "Paged 1m ago" },
    },
    {
      callout: {
        tone: "brand",
        title: "3 ranked causes",
        meta: "From trace, deploys and ownership",
      },
      label: "Ranked by evidence",
      rows: [
        { label: "Connection pool exhausted", value: "trace · high", dot: "danger" },
        { label: "Deploy 4f21c landed 18m ago", value: "timing · high", dot: "warn" },
        { label: "Upstream retry storm", value: "trace · medium", dot: "warn" },
        { label: "Cache eviction", value: "ruled out", dot: "faint" },
      ],
    },
  ],
};

export function getFeature(slug: string): FeaturePage | undefined {
  return features.find((f) => f.slug === slug);
}
