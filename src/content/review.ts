import type { FaqItem } from "@/lib/types";

/**
 * Product-page copy for TeraCode Review — the launch product.
 *
 * Section set is what a buyer has to understand before they will try an AI
 * reviewer, mapped against CodeRabbit, Greptile and Conductor without copying
 * claims we cannot make (IDE/CLI, SOC 2, one-click fix, “learns from 👍”).
 */

export const reviewHowItWorks = {
  eyebrow: "How it works",
  titleMuted: "Connect the repo.",
  title: "The board reviews the diff. You keep the merge.",
  steps: [
    {
      n: "1.",
      title: "Connect",
      body: "Install on GitHub, GitLab or Bitbucket and drop in the provider key you already pay for. TeraCode never resells inference.",
    },
    {
      n: "2.",
      title: "Review",
      body: "Security, performance, tests and style each run as their own specialist against the diff — in parallel, scoped to the paths they own.",
    },
    {
      n: "3.",
      title: "Ship",
      body: "Findings are reconciled into one review, ranked by real risk, and posted on the pull request. Nothing is written to your default branch.",
    },
  ],
};

export const reviewCatches = {
  eyebrow: "What it looks for",
  titleMuted: "Four specialists.",
  title: "One verdict.",
  items: [
    {
      title: "Security",
      body: "Secrets in logs, broken auth, missing rollback paths — the findings that actually ship incidents.",
    },
    {
      title: "Performance",
      body: "Regressions on the hot path. An N+1 in checkout is not the same class of comment as a rename.",
    },
    {
      title: "Tests",
      body: "Coverage that moved the wrong way, and the cases the diff implied but never added.",
    },
    {
      title: "Style",
      body: "House rules, last. Style does not outrank a leaked token just because it sat on line 3.",
    },
  ],
};

export const reviewAudience = {
  eyebrow: "Who it is for",
  titleMuted: "Built for teams that",
  title: "already generate more code than they can read.",
  items: [
    {
      title: "AI-authored pull requests",
      body: "Agents write faster than any review rotation. Review is the board that lets that speed reach main.",
    },
    {
      title: "No new seat tax",
      body: "You already pay Anthropic, OpenAI or Google. TeraCode runs on those keys. No per-developer licence on top.",
    },
    {
      title: "Security as a reviewer, not a linter",
      body: "A logged credential and a missing comma are not the same finding. Risk order is the product.",
    },
  ],
};

export const reviewTrust = {
  eyebrow: "Security and keys",
  titleMuted: "You keep the keys.",
  title: "We never sit between you and the model.",
  items: [
    {
      title: "Bring your own key",
      body: "Review calls your provider with your account. Tokens land on the invoice you already reconcile.",
    },
    {
      title: "Sandboxed execution",
      body: "The board runs in a sandbox. It reads the diff you asked it to review. It does not browse the rest of your estate.",
    },
    {
      title: "Keys encrypted at rest",
      body: "The key you supply is stored encrypted and used only to make the requests you asked for.",
    },
    {
      title: "The review is the only write",
      body: "TeraCode posts one review on the pull request. It does not push commits, and it does not touch default.",
    },
  ],
};

export const reviewCompare = {
  eyebrow: "Why not the usual reviewer",
  titleMuted: "Most AI reviewers",
  title: "bill per seat and resell you tokens.",
  ours: "TeraCode Review",
  theirs: "Typical AI reviewer",
  rows: [
    { feature: "Who pays for inference", theirs: "They resell you tokens", ours: "Your provider, at their price" },
    { feature: "Platform fee", theirs: "Per seat, per month", ours: "$0 in private beta" },
    { feature: "Who reviews", theirs: "One generalist", ours: "A board of specialists" },
    { feature: "What lands on the PR", theirs: "A comment storm", ours: "One reconciled review" },
    { feature: "How findings are ordered", theirs: "By line number", ours: "By real risk" },
    { feature: "How quality is scored", theirs: "Model confidence", ours: "What your team kept" },
    { feature: "What it writes", theirs: "Comments, sometimes commits", ours: "The review. Nothing else." },
  ],
};

export const reviewIntegrations = {
  eyebrow: "Works with what you already have",
  title: "Your platform. Your provider. Your keys.",
  body: "TeraCode connects to the source control you already use and calls the model you already pay for.",
  href: "/integrations",
  cta: "See integrations",
  items: [
    { name: "GitHub", meta: "Pull requests" },
    { name: "GitLab", meta: "Merge requests" },
    { name: "Bitbucket", meta: "Pull requests" },
    { name: "Anthropic", meta: "Your API key" },
    { name: "OpenAI", meta: "Your API key" },
    { name: "Google", meta: "Your API key" },
    { name: "Azure OpenAI", meta: "Your deployment" },
    { name: "AWS Bedrock", meta: "Your AWS account" },
  ],
};

export const reviewFaqBlurb =
  "Private beta. A person reads every message — there is no waitlist form.";

export const reviewFaq: FaqItem[] = [
  {
    question: "How do I get TeraCode Review on my repositories?",
    answer:
      "Email contact@teracode.ai. We are in private beta, so a person sets you up — GitHub, GitLab or Bitbucket, plus the provider key you already have.",
  },
  {
    question: "What does a review actually look like?",
    answer:
      "Four specialists run on the diff: security, performance, tests and style. TeraCode reconciles their findings into a single review, ranked by the damage each issue would do, and posts that on the pull request. Not a comment per line.",
  },
  {
    question: "Does it write code or merge the pull request?",
    answer:
      "No. Review posts one review. It does not push commits, open follow-up PRs, or touch your default branch. Merge stays a human decision.",
  },
  {
    question: "How is this different from CodeRabbit or Greptile?",
    answer:
      "Those tools are capable generalist reviewers, usually billed per seat, and they resell you inference. TeraCode Review is a board of specialists, scored on which findings your team kept, and it runs on your own API keys — no markup, no per-seat licence. We do not claim an IDE, a CLI, or a SOC 2 report we do not have.",
  },
  {
    question: "Where does Conductor fit?",
    answer:
      "Conductor runs coding agents in parallel on your machine, on your own logins. That is the generation side. TeraCode Review is the board that reads the pull request those agents open, so the speed they create can actually merge.",
  },
  {
    question: "What is BYOK, and what do I pay?",
    answer:
      "Bring your own key. You connect Anthropic, OpenAI, Google, Azure or Bedrock. Tokens are billed by that provider at that provider's price. During private beta there is no platform fee and no per-seat licence.",
  },
  {
    question: "Which languages does it review?",
    answer:
      "The first private-beta languages are TypeScript, Python and Go. The board reads the diff you opened — we are not claiming every language on day one.",
  },
  {
    question: "How do I get early access?",
    answer:
      "Write to contact@teracode.ai. There is no waitlist form. A person reads every message.",
  },
];
