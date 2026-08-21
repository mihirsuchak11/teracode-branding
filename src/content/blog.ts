import type { BlogPost } from "@/lib/types";

/**
 * Blog posts were not scraped from the original site. Titles/excerpts below
 * are placeholders in the site's voice; the first slug is the known post
 * linked from the homepage hero announcement.
 */
export const blogHero = {
  title: "Blog",
  body: "Notes on connected data, knowledge graphs, and building Strand.",
};

export const posts: BlogPost[] = [
  {
    slug: "introducing-ask-query-your-entire-stack-in-plain-language",
    title: "Introducing Ask: Query your entire stack in plain language",
    date: "Jun 10, 2026",
    excerpt:
      "Ask turns plain-language questions into answers drawn from every connected source — no SQL, no dashboards, no waiting on an analyst.",
  },
  {
    slug: "how-cortex-builds-your-knowledge-graph",
    title: "How Cortex builds your knowledge graph",
    date: "May 28, 2026",
    excerpt:
      "A look under the hood at how Cortex resolves entities across sources and keeps your graph current in real time.",
  },
  {
    slug: "why-dashboards-fail-and-what-comes-next",
    title: "Why dashboards fail, and what comes next",
    date: "May 14, 2026",
    excerpt:
      "Dashboards answer yesterday's questions. Here's why we think conversational data intelligence replaces them.",
  },
  {
    slug: "pulse-anomaly-detection-without-the-noise",
    title: "Pulse: anomaly detection without the noise",
    date: "Apr 30, 2026",
    excerpt:
      "How Pulse learns what normal looks like for your business and only surfaces what's genuinely unusual.",
  },
  {
    slug: "connecting-your-first-source-in-five-minutes",
    title: "Connecting your first source in five minutes",
    date: "Apr 16, 2026",
    excerpt:
      "A quick-start walkthrough: from an empty workspace to a living knowledge graph before your coffee cools.",
  },
  {
    slug: "the-real-cost-of-tab-switching",
    title: "The real cost of tab-switching",
    date: "Mar 26, 2026",
    excerpt:
      "We measured how much time teams lose stitching answers together across tools. The number surprised us.",
  },
  {
    slug: "entity-resolution-at-scale",
    title: "Entity resolution at scale",
    date: "Mar 5, 2026",
    excerpt:
      "Matching the same customer across six systems is harder than it sounds. Here's how we approach it.",
  },
  {
    slug: "how-fieldstone-caught-churn-three-weeks-early",
    title: "How Fieldstone caught churn three weeks early",
    date: "Feb 18, 2026",
    excerpt:
      "A customer story: Pulse flagged a churn spike long before the dashboards did, and the ops team kept the accounts.",
  },
  {
    slug: "shipping-the-nucleus-sdk",
    title: "Shipping the Nucleus SDK",
    date: "Jan 29, 2026",
    excerpt:
      "Everything in Strand is now available to your own code: queries, graph traversal, and streaming results.",
  },
];

export const placeholderBody: string[] = [
  "This post is coming soon. We're migrating our writing over to the new site, and the full article will land here shortly.",
  "In the meantime, you can explore how Strand connects your stack, ask questions in plain language, and see the knowledge graph in action.",
];
