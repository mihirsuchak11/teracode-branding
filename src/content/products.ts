import type { ProductStatus } from "@/lib/types";

/**
 * The product catalog — the one list the homepage lineup, the nav, the footer
 * and `/products/[slug]` all read from. Mirrors the lineup on the product
 * site: three applications we run, four platform pieces you build with.
 *
 * Status is per product. Review is the one you can connect today; everything
 * else is coming soon until the dashboard can do it.
 */
export type ProductGroup = "applications" | "platform";

export interface Product {
  slug: string;
  /** Full name, as on the product site. */
  name: string;
  /** The one word used in running copy and the lineup. */
  short: string;
  group: ProductGroup;
  /** Category label on cards; also the schema.org applicationSubCategory. */
  category: string;
  status: ProductStatus;
  tagline: string;
  body: string;
  stat: { value: string; label: string };
}

export const productStatus: Record<
  ProductStatus,
  { label: string; tone: "brand" | "warn" }
> = {
  available: { label: "Available now", tone: "brand" },
  "coming-soon": { label: "Coming soon", tone: "warn" },
};

export const productGroups: Record<ProductGroup, { title: string; body: string }> = {
  applications: {
    title: "Applications",
    body: "Agents we built on the platform and run on your repositories.",
  },
  platform: {
    title: "Platform",
    body: "The pieces you build and ship your own agents with.",
  },
};

export const products: Product[] = [
  {
    slug: "review",
    name: "TeraCode Review",
    short: "Review",
    group: "applications",
    category: "Code review",
    status: "available",
    tagline: "A board of specialists on every pull request",
    body: "Legal, Compliance, Security, Team Lead, Senior Engineer and more read the same diff at once. Findings merge into one review, and each agent posts its own check you can require in branch protection.",
    stat: { value: "1", label: "check run per agent" },
  },
  {
    slug: "migrate",
    name: "TeraCode Migrate",
    short: "Migrate",
    group: "applications",
    category: "Migrations",
    status: "coming-soon",
    tagline: "Carry a codebase-wide migration to done",
    body: "Point a fleet at a framework upgrade or a deprecated API. It opens one pull request per module, keeps the build green, and stops when the last call site is gone.",
    stat: { value: "0", label: "call sites left behind" },
  },
  {
    slug: "oncall",
    name: "TeraCode Oncall",
    short: "Oncall",
    group: "applications",
    category: "Incident response",
    status: "coming-soon",
    tagline: "Triage that reads the trace, not the alert",
    body: "When a page fires, an agent has already pulled the trace, the recent deploys and the owning service, and posted the three most likely causes, ranked.",
    stat: { value: "3", label: "ranked causes on arrival" },
  },
  {
    slug: "studio",
    name: "TeraCode Studio",
    short: "Studio",
    group: "platform",
    category: "Authoring",
    status: "coming-soon",
    tagline: "Author agents: personas, skills and tools",
    body: "Write an agent's instructions, attach skills scoped to file globs, give it tools, and version every change. The same authoring model behind every application we ship.",
    stat: { value: "1", label: "authoring model, every product" },
  },
  {
    slug: "runtime",
    name: "TeraCode Runtime",
    short: "Runtime",
    group: "platform",
    category: "Execution",
    status: "coming-soon",
    tagline: "Sandboxed execution on your own keys",
    body: "Every agent turn runs isolated and concurrent, on the provider key you supply. One agent failing never sinks the run, and we never take a cut of inference.",
    stat: { value: "$0", label: "markup on your tokens" },
  },
  {
    slug: "evals",
    name: "TeraCode Evals",
    short: "Evals",
    group: "platform",
    category: "Measurement",
    status: "coming-soon",
    tagline: "Scored on what humans kept, not vibes",
    body: "Resolve a finding and it counted. Delete it and it didn't. Every agent carries a keep rate, and regression suites gate a persona before it reaches production.",
    stat: { value: "2", label: "signals, no survey" },
  },
  {
    slug: "signals",
    name: "TeraCode Signals",
    short: "Signals",
    group: "platform",
    category: "Observability",
    status: "coming-soon",
    tagline: "Traces, spend and drift for every agent",
    body: "Every run itemised: which agent, which model, how many tokens, what it cost. Watch a keep rate drift before anyone thinks to complain about it.",
    stat: { value: "100%", label: "of runs traced" },
  },
];

export const applications = products.filter((p) => p.group === "applications");
export const platform = products.filter((p) => p.group === "platform");

export const productHref = (p: Pick<Product, "slug">) => `/products/${p.slug}`;

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
