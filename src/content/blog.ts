import type { BlogPost } from "@/lib/types";

/**
 * These are the pieces we intend to write, not published articles. Each renders
 * `placeholderBody`, and the date field reads "Coming soon" rather than showing
 * a publication date for something that has not been published.
 */
export const blogHero = {
  title: "Blog",
  body: "Notes on operating agents, BYOK economics, and building TeraCode.",
};

export const posts: BlogPost[] = [
  {
    slug: "why-we-do-not-resell-you-tokens",
    title: "Why we don't resell you tokens",
    date: "Coming soon",
    excerpt:
      "Every AI reviewer on the market bills per seat and takes a margin on inference. Here is why we think the review should be the product and the tokens should be yours.",
  },
  {
    slug: "keep-rate-scoring-agents-on-what-humans-kept",
    title: "Keep rate: scoring agents on what humans kept",
    date: "Coming soon",
    excerpt:
      "Model confidence is not quality. We measure a review by which findings a human resolved rather than deleted, and that changes what you optimise for.",
  },
  {
    slug: "glob-scoped-skills",
    title: "Glob-scoped skills: knowledge that knows where it applies",
    date: "Coming soon",
    excerpt:
      "The reviewer reading your auth code should not carry the same instructions as the one reading a migration. Attaching knowledge to file paths is how we do that.",
  },
  {
    slug: "a-board-of-specialists-beats-one-generalist",
    title: "A board of specialists beats one generalist",
    date: "Coming soon",
    excerpt:
      "Why we run security, performance, tests and style as separate reviewers with separate instructions, then reconcile them into a single review.",
  },
  {
    slug: "the-demo-always-works",
    title: "The demo always works",
    date: "Coming soon",
    excerpt:
      "Agents are easy to prototype and brutal to operate. On the gap between a scripted run and a Friday afternoon against a real codebase.",
  },
];

export const placeholderBody: string[] = [
  "This piece has not been published yet. It is on the list of things we want to write once TeraCode Review is out of private beta and we have real numbers to write about.",
  "In the meantime, if the topic is one you care about, write to contact@teracode.ai — we would rather answer your actual question than guess at it in a post.",
];
