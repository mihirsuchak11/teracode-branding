import type { FaqItem } from "@/lib/types";

/**
 * NOTE: only the first answer existed in the scraped HTML (Framer renders
 * collapsed accordion items without their content). Answers 2–4 are authored
 * to match — edit freely.
 */
export const faq: FaqItem[] = [
  {
    question: "What is an AI Agent?",
    answer:
      "An AI Agent is a task-specific assistant that automates workflows like scheduling, content creation, data processing, and more—without requiring any code.",
  },
  {
    question: "Can I use multiple agents at the same time?",
    answer:
      "Yes. Agents run independently and in parallel — you can have Cortex mapping new sources while Ask answers questions and Pulse watches your metrics, all at once.",
  },
  {
    question: "How customizable are the agents?",
    answer:
      "Each agent can be tuned to your data model, terminology, and alerting preferences. You control which sources it sees, how it scores severity, and where results are delivered.",
  },
  {
    question: "What tools do the agents integrate with?",
    answer:
      "Strand ships with 240+ integrations covering monitoring, code, observability, cloud, CI/CD, messaging, and databases — plus a webhook API for homegrown tooling.",
  },
];
