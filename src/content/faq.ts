import type { FaqItem } from "@/lib/types";

export const faq: FaqItem[] = [
  {
    question: "What does TeraCodeAI do?",
    answer:
      "It helps teams ship fast and secure. TeraCodeAI is a platform to build and ship AI agents — Studio to author them, Runtime to execute them on your own keys, Evals to score them on what humans kept — and the applications we run on it for you. Review reads every pull request today; the other six are coming soon.",
  },
  {
    question: "How do I start?",
    answer:
      "Start free opens the TeraCodeAI dashboard login and, after GitHub OAuth, the connect-repository screen. The first repository in an organization is free forever. If you are already signed in, the app keeps that destination instead of showing the button again.",
  },
  {
    question: "What is BYOK, and what does it mean for my bill?",
    answer:
      "Bring your own key. You add an Anthropic or OpenRouter key; TeraCodeAI calls that provider from the host. Tokens are billed to you by the provider. We do not resell inference. The platform charge is separate: $20 or ₹1,699 per extra connected repository per month.",
  },
  {
    question: "How is TeraCodeAI priced?",
    answer:
      "The product is an army of review agents. $20 or ₹1,699 per extra connected repository per month; the first repository is free forever. There is no per-seat licence. Inference is your provider invoice. Students with a university email and public open-source projects run one agent, free. Pay in USD or INR on Razorpay hosted checkout after you sign in — the card is never typed on this site. We remain the GST seller.",
  },
  {
    question: "I am a student or I maintain an open-source project. What do I get?",
    answer:
      "One review agent, on the free repository. Apply from the dashboard billing page. A .edu / .ac.in / .ac.uk email is granted immediately. A public GitHub repository is checked against the forge. The rest of the army unlocks when you subscribe.",
  },
  {
    question: "Which forges and models do you support?",
    answer:
      "GitHub via the App, and GitLab via a project access token and webhook. Models are Anthropic direct or whatever OpenRouter fronts with your key. We do not list Bitbucket or Azure DevOps as coming soon.",
  },
  {
    question: "Can I try a hosted model without bringing a key?",
    answer:
      "No. Reviews call the provider whose key you add. The dashboard can show a labeled fixture of what a comment looks like; that is not a live review and not hosted inference.",
  },
  {
    question: "Does TeraCodeAI merge or deploy for me?",
    answer:
      "No. Each agent posts a status check and you require the names you care about in branch protection. Migrate opens pull requests your team merges; Oncall posts to the incident channel. Nothing auto-merges, nothing auto-deploys, and there is no seat licence.",
  },
];
