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

/** Per-slug hero layout, matching the original pages. */
export const featureHero: Record<
  string,
  { layout: "art-top" | "centered" | "split"; ctas: boolean }
> = {
  cortex: { layout: "art-top", ctas: false },
  ask: { layout: "centered", ctas: true },
  pulse: { layout: "split", ctas: true },
};

export const features: FeaturePage[] = [
  {
    slug: "cortex",
    name: "Cortex",
    tagline: "Connect and unify data across every source.",
    heroTitle: "Connect every data source.\nZero manual mapping.",
    heroBody:
      "The knowledge graph that connects everything. Relationships mapped automatically, in real time.",
    benefits: [
      {
        title: "Entity resolution, automatic.",
        body: "Same customer across your CRM, payments, and database - Cortex links them without configuration.",
      },
      {
        title: "The graph updates itself.",
        body: "Every change in a connected tool reflects within seconds. Always current, zero manual effort.",
      },
      {
        title: "Explore relationships without writing a query.",
        body: "Browse connections between any two entities - customers, revenue, support history - without touching SQL.",
      },
    ],
  },
  {
    slug: "ask",
    name: "Ask",
    tagline: "Query your data in plain language.",
    heroTitle: "Ask anything.\nGet answers quickly.",
    heroBody:
      "Ask queries your entire data stack in plain language and returns precise answers in seconds.",
    benefits: [
      {
        title: "Understands your schema.",
        body: "Ask is trained on your specific data structure, so it translates questions into precise queries — not guesses.",
      },
      {
        title: "Knows what to ask next.",
        body: "Every answer comes with suggested follow-up questions, so the right insight is always one click away.",
      },
      {
        title: "Results go where your team works.",
        body: "Export answers as CSV or JSON, or send them straight to your team. No copy-pasting, no extra steps.",
      },
    ],
    chips: [
      "Plain language input",
      "Relationship-aware",
      "Time range context",
      "Suggested follow-ups",
      "One-click sharing",
      "Under 200ms",
    ],
    stats: [
      { value: "16x", label: "Faster time-to-answer" },
      { value: "47%", label: "Fewer tools needed" },
      { value: "80%", label: "Less time building reports" },
      { value: "4.2hrs", label: "Saved per team per week" },
    ],
  },
  {
    slug: "pulse",
    name: "Pulse",
    tagline: "Detect anomalies before they become problems.",
    heroTitle: "Less noise.\nThe alerts that matter.",
    heroBody:
      "Pulse learns what normal looks like for your business and only fires when something genuinely deviates. No more alert fatigue.",
    benefits: [
      {
        title: "Adaptive baselines, per metric.",
        body: "Pulse builds a normal range for every data point it watches. Thresholds adjust automatically as your business grows.",
      },
      {
        title: "Severity scoring with context.",
        body: "Not every deviation is an emergency. Pulse scores each alert by impact and timing so you know what to act on first.",
      },
    ],
  },
];

export const featureExtras: Record<string, FeatureExtras> = {
  cortex: {
    midSection: {
      title: "Every relationship in your stack,\nmapped and queryable.",
      items: [
        {
          title: "Connect your stack",
          body: "Plug in 240+ tools in minutes. Cortex ingests every source and starts mapping immediately.",
        },
        {
          title: "Map relationships automatically",
          body: "Cortex finds connections across your data you didn't know existed. No manual schema work required.",
        },
        {
          title: "Query everything, instantly",
          body: "Once mapped, every relationship in your graph is queryable in plain language through Ask.",
        },
      ],
    },
  },
  ask: {
    midSection: {
      title: "Questions your whole team can ask.\nAnswers only Strand can give.",
      items: [
        {
          title: "Plain language input",
          body: "No SQL, no syntax. Ask questions the way you'd phrase them to a colleague.",
        },
        {
          title: "Relationship-aware",
          body: "Ask understands how your data connects - not just what's in a single table.",
        },
        {
          title: "Time range context",
          body: 'Reference periods naturally. "Last quarter", "since onboarding", "before the outage" all work.',
        },
        {
          title: "Suggested follow-ups",
          body: "Every answer surfaces the next logical question so you keep moving forward.",
        },
        {
          title: "One-click sharing",
          body: "Send results to your team chat or export as CSV and JSON without leaving the interface.",
        },
        {
          title: "Under 200ms",
          body: "Queries run against a live graph, not a slow warehouse. Answers arrive before the thought fades.",
        },
      ],
    },
    statsTitleMuted: "Your team already has the data.",
    statsTitle: "Strand gives you the answers.",
  },
  pulse: {
    midSection: {
      title: "Most tools alert you to everything.\nPulse only tells you what matters.",
      items: [
        {
          title: "Baselines that learn your business.",
          body: "Pulse builds a rolling model of normal for every metric it watches - accounting for weekly patterns, seasonal shifts, and growth - so deviations mean something.",
        },
        {
          title: "Every alert scored by impact.",
          body: "Severity is weighted by how far a deviation sits from baseline, when it's happening, and which metrics are affected. A ranked signal, not a flat list.",
        },
        {
          title: "Routed to the right person, instantly.",
          body: "The right alert reaches the right person every time. Route by severity, by team, or by source — without anyone manually deciding who gets what.",
        },
      ],
    },
  },
};

/** Decorative mock cards, index-aligned with each feature's benefits. */
export const featureMocks: Record<string, FeatureMock[]> = {
  cortex: [
    {
      callout: {
        tone: "brand",
        title: "J. Smith",
        body: "john.smith@company.com",
        meta: "Synced",
      },
      label: "Synced from:",
      rows: [
        { label: "VaultDB", value: "jsmith@co.com", dot: "brand" },
        { label: "Gridwork", value: "John Smith", dot: "brand" },
        { label: "Pipecloud", value: "Records found", dot: "brand" },
      ],
    },
    {
      rows: [
        { label: "Account updated", value: "just now", dot: "brand" },
        { label: "New payment linked · Stride", value: "12s ago", dot: "brand" },
        { label: "Record created", value: "28s ago", dot: "faint" },
        { label: "Entity resolved", value: "1m ago", dot: "faint" },
        { label: "Subscription changed", value: "2m ago", dot: "faint" },
      ],
    },
    {
      rows: [
        { label: "Subscription", value: "Active", dot: "brand" },
        { label: "Plan", value: "Enterprise" },
        { label: "Renewal", value: "Dec 14, 2025" },
        { label: "MRR", value: "$1,240", mono: true },
      ],
    },
  ],
  ask: [
    {
      callout: {
        tone: "neutral",
        title: "Which accounts haven't logged in today?",
        meta: "14,203 records",
      },
      rows: [
        { label: "id", value: "uuid", mono: true },
        { label: "name", value: "string", mono: true },
        { label: "last_session", value: "timestamp", mono: true },
        { label: "created_at", value: "auto-resolved", mono: true },
        { label: "mrr", value: "float", mono: true },
      ],
    },
    {
      callout: {
        tone: "brand",
        title: "Which accounts are at risk this quarter?",
        body: "4 enterprise accounts with no session activity in the current calendar month.",
      },
      rows: [
        { label: "How has their usage trended?", value: "1", mono: true },
        { label: "Who is the account owner for each?", value: "2", mono: true },
        { label: "Ask a different question", value: "3", mono: true },
      ],
    },
    {
      label: "Share results",
      rows: [
        { label: "Send to Threadbase", value: "Post to any channel", dot: "brand" },
        { label: "Export CSV", value: "Download as spreadsheet", dot: "brand" },
        { label: "Export JSON", value: "Structured data output", dot: "brand" },
      ],
    },
  ],
  pulse: [
    {
      callout: {
        tone: "danger",
        badge: "High severity",
        meta: "2 min ago",
        title: "Active sessions",
        body: "Activation in EU markets fell from 34% to 22% over the past 6 hours.",
      },
      rows: [
        { label: "metric", value: "active_sessions", mono: true },
        { label: "current", value: "1,840", mono: true },
        { label: "expected", value: "3,200–3,800", mono: true },
        { label: "deviation", value: "-42%", mono: true, dot: "danger" },
      ],
      footer: { left: "Sent to #product-alerts", right: "Delivered 1m ago" },
    },
    {
      callout: {
        tone: "brand",
        title: "87 / 100",
        meta: "Source: Stride / Mixboard",
      },
      label: "Score breakdown",
      rows: [
        { label: "Deviation from baseline", value: "-34% · high", dot: "danger" },
        { label: "Timing context", value: "peak traffic window", dot: "warn" },
        { label: "Business impact", value: "revenue-critical metric", dot: "warn" },
        { label: "Historical recurrence", value: "first occurrence", dot: "faint" },
      ],
    },
  ],
};

export function getFeature(slug: string): FeaturePage | undefined {
  return features.find((f) => f.slug === slug);
}
