import type { FaqItem } from "@/lib/types";

/**
 * Product-page copy for multi-agent review — the launch product.
 *
 * Section set is what a buyer has to understand before they will try an AI
 * reviewer, mapped against CodeRabbit, Greptile and Conductor without copying
 * claims we cannot make (IDE/CLI, SOC 2, one-click fix, “learns from 👍”).
 *
 * Every fact here has to match `content/pricing.ts`, `content/integrations.ts`
 * and `content/faq.ts`: GitHub App or GitLab token, Anthropic or OpenRouter,
 * first repository free forever then $20 per repository per month, inference
 * billed to you. No Bitbucket, no hosted inference, no private beta.
 */

export const reviewHowItWorks = {
  eyebrow: "How it works",
  titleMuted: "Connect the repository.",
  title: "The board reviews the diff. You keep the merge.",
  steps: [
    {
      n: "1.",
      title: "Connect",
      body: "Install the GitHub App, or connect a GitLab project with a token and a webhook. Add an Anthropic or OpenRouter key to the vault — TeraCodeAI never resells inference.",
    },
    {
      n: "2.",
      title: "Review",
      body: "The agents you name fan out on the same diff, in parallel, each with its own instructions, model and skills.",
    },
    {
      n: "3.",
      title: "Ship",
      body: "Findings merge, so two agents flagging one line become one comment. The review posts on the pull request and each agent posts its own check.",
    },
  ],
};

export const reviewCatches = {
  eyebrow: "What it looks for",
  titleMuted: "An army of agents you name.",
  title: "One review on the thread.",
  items: [
    {
      title: "Security",
      body: "Secrets in logs, broken auth, missing rollback paths — the findings that actually ship incidents.",
    },
    {
      title: "Legal and Compliance",
      body: "The clauses and controls your team has to answer for, read on the diff rather than at audit time.",
    },
    {
      title: "Team Lead",
      body: "House rules and the shape of the change: is this the way this codebase does it?",
    },
    {
      title: "Or your own",
      body: "An agent is instructions, a model and skills. Name one after whatever your reviews keep repeating.",
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
      body: "Agents write faster than any review rotation. This is the board that lets that speed reach main.",
    },
    {
      title: "No seat tax",
      body: "One meter: the first repository in an organization is free forever, then $20 per connected repository per month. There is no per-developer licence.",
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
      body: "Reviews call Anthropic or OpenRouter with the key you put in the vault. Tokens land on the invoice you already reconcile.",
    },
    {
      title: "No hosted inference",
      body: "There is no trial model behind the curtain. Without a key there is no review — only a labelled fixture of what a comment looks like.",
    },
    {
      title: "Scoped to the diff",
      body: "The board reads the change you asked it to review. It does not browse the rest of your estate.",
    },
    {
      title: "The review is the only write",
      body: "Comments land as one review, plus a status check per agent. Nothing auto-merges and nothing is pushed to your default branch.",
    },
  ],
};

export const reviewCompare = {
  eyebrow: "Why not the usual reviewer",
  titleMuted: "Most AI reviewers",
  title: "bill per seat and resell you tokens.",
  ours: "TeraCodeAI",
  theirs: "Typical AI reviewer",
  rows: [
    { feature: "Who pays for inference", theirs: "They resell you tokens", ours: "Your provider, at their price" },
    { feature: "Platform fee", theirs: "Per seat, per month", ours: "$0 first repo, then $20 each" },
    { feature: "Who reviews", theirs: "One generalist", ours: "A board of agents you name" },
    { feature: "What lands on the PR", theirs: "A comment storm", ours: "One review, one check per agent" },
    { feature: "How findings are ordered", theirs: "By line number", ours: "By what it would break" },
    { feature: "Duplicate findings", theirs: "Posted twice", ours: "Merged into one comment" },
    { feature: "What it writes", theirs: "Comments, sometimes commits", ours: "The review. Nothing else." },
  ],
};

export const reviewIntegrations = {
  eyebrow: "Works with what you already have",
  title: "Your forge. Your provider. Your keys.",
  body: "TeraCodeAI connects to the source control you already use and calls the model you already pay for. We do not list forges we have not built.",
  href: "/integrations",
  cta: "See integrations",
  items: [
    { name: "GitHub", meta: "Source control · GitHub App" },
    { name: "GitLab", meta: "Source control · Token + webhook" },
    { name: "Anthropic", meta: "Model provider · Your API key" },
    { name: "OpenRouter", meta: "Model provider · Your API key" },
  ],
};

export const reviewFaqBlurb =
  "Start free connects your first repository. It stays free, forever.";

export const reviewFaq: FaqItem[] = [
  {
    question: "How do I get multi-agent review on my repositories?",
    answer:
      "Start free opens the TeraCodeAI dashboard login. After GitHub OAuth you land on the connect-repository screen. The first repository in an organization is free, forever.",
  },
  {
    question: "What does a review actually look like?",
    answer:
      "The agents you name run on the same diff in parallel. Findings merge, so two agents flagging the same line become one comment, and the result posts as a single review from the App. Each agent still posts its own status check.",
  },
  {
    question: "Does it write code or merge the pull request?",
    answer:
      "No. Each agent posts a status check and the board posts one review. You require the check names you care about in branch protection. There is no auto-merge, and nothing is pushed to your default branch.",
  },
  {
    question: "How is this different from CodeRabbit or Greptile?",
    answer:
      "Those tools are capable generalist reviewers, usually billed per seat, and they resell you inference. This is a board of agents you name and instruct, running on your own key with no markup and no per-seat licence. We do not claim an IDE, a CLI, or a SOC 2 report we do not have.",
  },
  {
    question: "Where does Conductor fit?",
    answer:
      "Conductor runs coding agents in parallel on your machine, on your own logins. That is the generation side. This is the board that reads the pull request those agents open, so the speed they create can actually merge.",
  },
  {
    question: "What is BYOK, and what do I pay?",
    answer:
      "Bring your own key. You add an Anthropic or OpenRouter key and TeraCodeAI calls that provider. Tokens are billed to you by the provider. The platform charge is separate and is one meter: $20 per extra connected repository per month.",
  },
  {
    question: "Which forges and models do you support?",
    answer:
      "GitHub via the App, and GitLab via a project access token and webhook. Models are Anthropic direct, or whatever OpenRouter fronts with your key. We do not list Bitbucket or Azure DevOps as coming soon.",
  },
  {
    question: "Can I try it without bringing a key?",
    answer:
      "No. Reviews call the provider whose key you add. The dashboard can show a labelled fixture of what a comment looks like; that is not a live review and not hosted inference.",
  },
];
