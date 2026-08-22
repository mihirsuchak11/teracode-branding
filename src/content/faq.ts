import type { FaqItem } from "@/lib/types";

export const faq: FaqItem[] = [
  {
    question: "How do I get access to TeraCode Review?",
    answer:
      "TeraCode Review is in private beta. Email contact@teracode.ai and we will get you set up — there is no waitlist form to fill in, and a person reads every message.",
  },
  {
    question: "What is BYOK, and what does it mean for my bill?",
    answer:
      "BYOK means bring your own key. You connect your own provider account, and TeraCode calls the model directly with your key. Tokens are billed to you by your provider, at your provider's price — we never resell inference, so there is no markup between you and the model, and nothing to true up later.",
  },
  {
    question: "How is TeraCode priced?",
    answer:
      "There is no per-seat licence during the private beta. Most AI review tools charge per developer per month on top of the tokens they resell you — TeraCode charges nothing on top of what you already pay your provider.",
  },
  {
    question: "What else is coming?",
    answer:
      "TeraCode Migrate carries codebase-wide migrations to done, and TeraCode Oncall triages incidents from traces rather than alerts. Both run on the same platform as Review: Studio for authoring, Runtime for execution, Evals for scoring and Signals for observability.",
  },
];
