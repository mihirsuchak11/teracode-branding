import type { Integration } from "@/lib/types";

/** Integration plus the tile meta line ("Category · Auth method") from the original grid. */
export type IntegrationItem = Integration & { meta: string };

export const integrationsHero = {
  title: "240+ integrations.\nOne connection point.",
  body: "Pulse learns what normal looks like for your business and only fires when something genuinely deviates. No more alert fatigue.",
  searchPlaceholder: "Search integrations...",
};

export const integrationCategories = [
  "All",
  "CRM & Sales",
  "Analytics",
  "Databases",
  "Support",
  "Productivity",
  "Finance",
  "Marketing",
];

/* Tile meta lines for the first twelve match the original grid exactly. */
const meta: Record<string, string> = {
  pipecloud: "CRM · OAuth",
  scaleforce: "CRM · API key",
  closetrack: "Sales · OAuth",
  mixboard: "Product analytics · API key",
  metripanel: "Web analytics · Tracking ID",
  signalkit: "Analytics · OAuth",
  trackwise: "Event tracking · API key",
  beamcast: "Business intelligence · OAuth",
  polysql: "Databases · Connection string",
  vaultdb: "NoSQL · Connection string",
  cleardesk: "Support · OAuth",
  driftline: "Customer messaging · API key",
  replystack: "Shared inbox · OAuth",
  gridwork: "Project management · OAuth",
  fieldpoint: "Field sales · API key",
  paystream: "Payments · API key",
  mintledger: "Accounting · OAuth",
  coreledger: "ERP · API key",
  cashline: "Billing · API key",
  openloop: "Marketing automation · OAuth",
  pushmark: "Push notifications · API key",
  arcline: "Email marketing · API key",
  surfboard: "Scheduling · OAuth",
  threadbase: "Team chat · OAuth",
};

const base: Integration[] = [
  {
    slug: "pipecloud",
    name: "Pipecloud",
    category: "CRM",
    description:
      "Sync deals, contacts, and pipeline stages. Cortex maps account relationships across your full sales cycle.",
  },
  {
    slug: "scaleforce",
    name: "Scaleforce",
    category: "CRM",
    description:
      "Pull accounts, opportunities, and custom objects. Bi-directional sync keeps both systems current.",
  },
  {
    slug: "closetrack",
    name: "Closetrack",
    category: "Sales",
    description:
      "Import leads, activities, and revenue data. Track conversion paths from first touch to closed deal.",
  },
  {
    slug: "mixboard",
    name: "Mixboard",
    category: "Product analytics",
    description:
      "Stream event data, funnels, and cohorts. Correlate product usage with revenue and support signals.",
  },
  {
    slug: "metripanel",
    name: "Metripanel",
    category: "Web analytics",
    description:
      "Connect pageviews, sessions, and conversion events. Map user journeys to account-level behavior.",
  },
  {
    slug: "signalkit",
    name: "Signalkit",
    category: "Product analytics",
    description:
      "Ingest behavioral data and engagement scores. Identify usage patterns that predict churn or expansion.",
  },
  {
    slug: "trackwise",
    name: "Trackwise",
    category: "Event tracking",
    description:
      "Pull raw event streams and user properties. Build granular segments inside the graph.",
  },
  {
    slug: "beamcast",
    name: "Beamcast",
    category: "Business intelligence",
    description:
      "Import dashboards, saved queries, and metric definitions. Unify BI data with live source data.",
  },
  {
    slug: "polysql",
    name: "PolySQL",
    category: "Relational database",
    description:
      "Connect production databases via read replica. CDC streams keep the graph current.",
  },
  {
    slug: "vaultdb",
    name: "VaultDB",
    category: "NoSQL",
    description:
      "Sync collections and documents in real time. Schema-flexible ingestion handles nested data.",
  },
  {
    slug: "cleardesk",
    name: "Cleardesk",
    category: "Help desk",
    description:
      "Import tickets, conversations, and satisfaction scores. Link support history to customer health signals.",
  },
  {
    slug: "driftline",
    name: "Driftline",
    category: "Customer messaging",
    description:
      "Sync chat transcripts, user events, and resolution data. Surface messaging trends across accounts.",
  },
  {
    slug: "replystack",
    name: "Replystack",
    category: "Shared inbox",
    description:
      "Sync shared inboxes, replies, and response times. Connect conversation history to every account in the graph.",
  },
  {
    slug: "gridwork",
    name: "Gridwork",
    category: "Project management",
    description:
      "Import projects, tasks, and delivery timelines. Link execution data to the accounts and teams behind it.",
  },
  {
    slug: "fieldpoint",
    name: "Fieldpoint",
    category: "Field sales",
    description:
      "Sync field activities, visits, and territory data. Tie on-the-ground activity to pipeline outcomes.",
  },
  {
    slug: "paystream",
    name: "Paystream",
    category: "Payments",
    description:
      "Sync charges, invoices, and payout schedules. Link every transaction to the customer behind it.",
  },
  {
    slug: "mintledger",
    name: "Mintledger",
    category: "Accounting",
    description:
      "Import journals, expenses, and reconciliation data. Keep financial records aligned with live revenue.",
  },
  {
    slug: "coreledger",
    name: "Coreledger",
    category: "ERP",
    description:
      "Connect general ledger accounts and cost centers. Unify financial reporting with operational data.",
  },
  {
    slug: "cashline",
    name: "Cashline",
    category: "Billing",
    description:
      "Sync subscriptions, renewals, and dunning events. Surface revenue risk before invoices slip.",
  },
  {
    slug: "openloop",
    name: "Openloop",
    category: "Marketing automation",
    description:
      "Import campaigns, sequences, and engagement events. Trace pipeline back to the touches that created it.",
  },
  {
    slug: "pushmark",
    name: "Pushmark",
    category: "Push notifications",
    description:
      "Stream sends, opens, and opt-outs. Correlate messaging pressure with retention and churn.",
  },
  {
    slug: "arcline",
    name: "Arcline",
    category: "Email marketing",
    description:
      "Sync campaigns, lists, and click-through data. Map email engagement onto account health.",
  },
  {
    slug: "surfboard",
    name: "Surfboard",
    category: "Scheduling",
    description:
      "Import meetings, availability, and booking events. Connect calendar activity to deals and support load.",
  },
  {
    slug: "threadbase",
    name: "Threadbase",
    category: "Team chat",
    description:
      "Send answers and alerts to any channel. Bring team conversations into the graph alongside your data.",
  },
];

export const integrations: IntegrationItem[] = base.map((i) => ({
  ...i,
  meta: meta[i.slug] ?? `${i.category} · OAuth`,
}));

export function getIntegration(slug: string): IntegrationItem | undefined {
  return integrations.find((i) => i.slug === slug);
}
