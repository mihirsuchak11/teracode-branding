import type { BlogPost } from "@/lib/types";

/**
 * Intended pieces, not published articles. Each renders `placeholderBody`.
 */
export const blogHero = {
  title: "Blog",
  body: "Notes on BYOK review, keep-rate, and the $29-per-repo meter — when there is something true to write.",
};

export const posts: BlogPost[] = [
  {
    slug: "why-we-do-not-resell-you-tokens",
    title: "Why we don't resell you tokens",
    date: "Coming soon",
    excerpt:
      "The platform charge is connected repositories. Inference is your provider. Mixing those into one “AI review” invoice is how the bill becomes unexplainable.",
  },
  {
    slug: "keep-rate-scoring-agents-on-what-humans-kept",
    title: "Keep rate: scoring agents on what humans kept",
    date: "Coming soon",
    excerpt:
      "Model confidence is not quality. We measure a review by which findings a human resolved rather than deleted.",
  },
  {
    slug: "glob-scoped-skills",
    title: "Glob-scoped skills: knowledge that knows where it applies",
    date: "Coming soon",
    excerpt:
      "The reviewer reading auth should not carry the same instructions as the one reading a migration.",
  },
  {
    slug: "a-board-of-specialists-beats-one-generalist",
    title: "A board of specialists beats one generalist",
    date: "Coming soon",
    excerpt:
      "Why several agents, each with its own check, then one merged review on the thread.",
  },
  {
    slug: "the-demo-always-works",
    title: "The demo always works",
    date: "Coming soon",
    excerpt:
      "On the gap between a scripted run and a Friday afternoon against a real pull request.",
  },
];

export const placeholderBody: string[] = [
  "This piece has not been published yet. It is on the list of things to write when there are real numbers from real repositories — not a second marketing site inside the dashboard.",
  "If the topic is one you care about, write to contact@teracodeai.com.",
];
