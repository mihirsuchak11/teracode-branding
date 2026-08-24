export interface NavDropdownItem {
  label: string;
  description?: string;
  href: string;
  eyebrow?: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface FeatureBenefit {
  eyebrow?: string;
  title: string;
  body: string;
  bullets?: string[];
  image?: { src: string; alt: string };
}

/**
 * Where a product is in its life. Only `available` products carry the $0/$20
 * offer and the Start free CTA; coming-soon products swap it for a waitlist.
 */
export type ProductStatus = "available" | "coming-soon";

export interface FeaturePage {
  slug: string;
  name: string;
  status: ProductStatus;
  /** schema.org applicationSubCategory for the product's JSON-LD. */
  category: string;
  tagline: string;
  heroTitle: string;
  heroBody: string;
  benefits: FeatureBenefit[];
  chips?: string[];
  stats?: Stat[];
}

export interface PricingTier {
  name: string;
  price: string;
  period?: string;
  description: string;
  cta: { label: string; href: string };
  features: string[];
  highlighted?: boolean;
  /** Extra-repo card: display-only USD/INR toggle. Checkout still happens on the dashboard. */
  billed?: { usd: string; inr: string; period: string };
}

export interface ComparisonGroup {
  name: string;
  rows: { feature: string; values: (string | boolean)[] }[];
}

export interface Integration {
  slug: string;
  name: string;
  category: string;
  description: string;
}

export interface ChangelogEntry {
  date: string;
  title: string;
  tags?: string[];
  items: string[];
}

export interface Job {
  slug: string;
  title: string;
  team: string;
  location: string;
  type: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  body?: string[];
}

export interface TeamMember {
  name: string;
  role: string;
  image: string;
}
