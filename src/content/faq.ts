import type { FaqItem } from "@/lib/types";

export const faq: FaqItem[] = [
  {
    question: "How do I start?",
    answer:
      "Start free opens the TeraCodeAI dashboard login and, after GitHub OAuth, the connect-repository screen. The first repository in an organization is free forever. If you are already signed in, the app keeps that destination instead of showing the button again.",
  },
  {
    question: "What is BYOK, and what does it mean for my bill?",
    answer:
      "Bring your own key. You add an Anthropic or OpenRouter key; TeraCodeAI calls that provider from the host. Tokens are billed to you by the provider. We do not resell inference. The platform charge is separate: $20 per extra connected repository per month.",
  },
  {
    question: "How is TeraCodeAI priced?",
    answer:
      "One meter. $20 per connected repository per month. The first repository in an organization is free, forever. There is no per-seat licence and no query pack. Inference is your provider invoice.",
  },
  {
    question: "Which forges and models do you support?",
    answer:
      "GitHub via the App, and GitLab via a project access token and webhook. Models are Anthropic direct or whatever OpenRouter fronts with your key. We do not list Bitbucket or Azure DevOps as coming soon.",
  },
];
