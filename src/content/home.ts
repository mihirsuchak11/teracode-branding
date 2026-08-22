import type { Stat } from "@/lib/types";

export const hero = {
  announcement: {
    badge: "New",
    text: "Introducing Ask: Query your entire stack in plain language",
    href: "/blog/introducing-ask-query-your-entire-stack-in-plain-language",
  },
  title: "The missing connection layer",
  body: "Strand builds a living knowledge graph across every tool in your stack. Ask questions in plain language. Get answers no single source could provide alone.",
  primary: { label: "Connect a source", href: "/pricing" },
  secondary: { label: "Book a demo", href: "/contact-us" },
  mock: {
    prompt: "How can I help today?",
    chips: ["Analyze", "Compare", "Monitor", "Report"],
    status: ["Thinking", "Scanning Salesforce", "3 Results"],
  },
};

export const steps = [
  { n: "1.", title: "Connect", body: "Plug in your tools. 240+ integrations out of the box." },
  { n: "2.", title: "Map", body: "Cortex automatically builds your knowledge graph." },
  { n: "3.", title: "Ask", body: "Query in plain language. Share results with your team." },
];

export const statement = {
  eyebrow: "Trusted by 56+ teams who are tired of tab-switching",
  title:
    "Your team wastes hours pulling data from scattered tools. Strand turns that into one conversation.",
};

export const spotlights = [
  {
    name: "Cortex",
    href: "/features/cortex",
    body: "Connect every data source. Strand maps relationships automatically — customers to revenue, usage to churn signals, support tickets to product gaps. One graph. Zero manual mapping.",
    bullets: [
      "Resolves entities across every source.",
      "Updates in real time, no rebuilds.",
      "Visual graph explorer for every team.",
    ],
    mock: "graph" as const,
  },
  {
    name: "Ask",
    href: "/features/ask",
    body: 'Stop writing SQL for simple questions. Ask "Which enterprise accounts haven\'t logged in this month?" and get an answer in seconds. Strand translates intent into insight.',
    bullets: [
      "Understands your exact data model.",
      "Suggests smart follow-up questions.",
      "Exports to Slack, CSV, or JSON.",
    ],
    mock: "ask" as const,
  },
  {
    name: "Pulse",
    href: "/features/pulse",
    body: "Not another dashboard with 47 alerts. Pulse learns what normal looks like for your business and only surfaces what's genuinely unusual. Less noise, more signal.",
    bullets: [
      "Adaptive baselines, zero config.",
      "Severity scoring by business impact.",
      "Routes alerts to the right channel.",
    ],
    mock: "pulse" as const,
  },
];

export const graphSources = [
  { name: "Scaleforce", detail: "14,203 entities", status: "Live" },
  { name: "Strive", detail: "8,847 entities", status: "Live" },
  { name: "PostgridDB", detail: "52,091 entities", status: "Syncing" },
  { name: "HotSpot", detail: "—", status: "Pending" },
];

export const pulseAlert = {
  severity: "High severity",
  time: "2 min ago",
  title: "EU activation rate dropped 12%",
  body: "Activation in EU markets fell from 34% to 22% over the past 6 hours.",
  routed: "Sent to #product-alerts",
  delivered: "Delivered 1m ago",
};

export const stack = {
  title: "Connect your stack",
  body: "Monitoring, code, observability, cloud, CI/CD systems, messaging, and even homegrown tooling.",
  cta: { label: "View integrations", href: "/integrations" },
  label: "Connected sources",
  addLabel: "Add integration",
  /** `logo` files are the original site's own brand marks, saved from its DOM. */
  sources: [
    { name: "Chatdock", a: "9.841 conversations", b: "204 open", logo: "/logos/chatdock.svg" },
    { name: "VaultDB", a: "38 schemes", b: "6.4M rows", logo: "/logos/vaultdb.svg" },
    { name: "Stride", a: "$2.4 MMR", b: "1,204 subscriptions", logo: "/logos/stride.svg" },
    { name: "ThreadBase", a: "42 channels", b: "alerts enabled", logo: "/logos/threadbase.svg" },
    { name: "Pipecloud", a: "874 accounts", b: "12,400 records", logo: "/logos/pipecloud.svg" },
  ],
  /** The dim 3-wide tile grid beside the list. */
  tiles: Array.from({ length: 11 }, (_, i) => `/logos/tile-${String(i).padStart(2, "0")}.svg`),
  totals: [
    { value: "41.2M", label: "records indexed" },
    { value: "0", label: "errors" },
  ],
};

/* Fictional brand wordmarks shown in the trusted-by ticker, as in the original. */
export const tickerBrands = [
  "Nietzsche",
  "Acme Corp",
  "CloudWatch",
  "Sisyphus",
  "Capsule",
  "Luminous",
  "Acme",
  "Focal Point",
];

export const statementMock = {
  question: "Which accounts are at risk this quarter?",
  status: "Thinking",
  scoring: ["Scoring by ", "churn signal", " weight"],
  rows: [
    { name: "Meridian Corp", risk: "High risk", pill: "No login in 30d", dim: false },
    { name: "Apex Systems", risk: "Medium", pill: "Usage -40%", dim: true },
  ],
  actions: ["Export CSV", "Share with team"],
};

/**
 * Copy + colours for the looping chat demo in the Statement section, taken
 * verbatim from the original "Ask Chat Anim" Framer component.
 */
export const askChat = {
  placeholder: "How can I help today?",
  message: "Which accounts are at risk this quarter?",
  thinkingLabel: "Thinking",
  resultsLabel: "3 Results",
  chips: [
    { icon: "analyze", label: "Analyze" },
    { icon: "compare", label: "Compare" },
    { icon: "monitor", label: "Monitor" },
    { icon: "report", label: "Report" },
  ],
  ticker: ["Scanning Salesforce", "Scoring by churn signal weight", "3 accounts flagged"],
  rows: [
    {
      name: "Meridian Corp",
      risk: "High risk",
      reason: "No login in 30d",
      tint: "rgb(229, 72, 77)",
      tintSoft: "rgba(229, 72, 77, 0.2)",
    },
    {
      name: "Apex Systems",
      risk: "Medium",
      reason: "Usage -40%",
      tint: "rgb(249, 171, 0)",
      tintSoft: "rgba(249, 171, 0, 0.2)",
    },
    {
      name: "Acme Corp",
      risk: "High Risk",
      reason: "Ticket spike",
      tint: "rgb(229, 72, 77)",
      tintSoft: "rgba(229, 72, 77, 0.2)",
    },
  ],
  resultActions: [
    { icon: "export", label: "Export CSV" },
    { icon: "share", label: "Share with team" },
  ],
};

export const testimonial = {
  stat: { value: "12 hours", label: "saved per week across the ops team" },
  quote:
    "“Pulse caught a churn spike three weeks before our dashboards would have shown it. That gap used to cost us accounts.”",
  name: "Priya Nair",
  role: "Head of Customer Success @ Fieldstone",
  image: "/images/ydiaCWUrza6Xgn2ss3YWI3IFX7Y.png",
};

export const statsSection: { title: string; stats: Stat[] } = {
  title: "Your team already has the data. Strand gives you the answers.",
  stats: [
    { value: "16x", label: "Faster time-to-answer" },
    { value: "47%", label: "Fewer tools needed" },
    { value: "80%", label: "Less time building reports" },
    { value: "4.2hrs", label: "Saved per team per week" },
  ],
};
