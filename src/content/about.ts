export const aboutHero = {
  title: "About us",
};

export const origins = {
  eyebrow: "Origins",
  paragraphs: [
    "TeraCodeAI is a GitHub App and dashboard that runs several review agents on every pull request. You bring the model key. Each agent posts its own check. The first connected repository in an organization is free; after that the meter is $20 per repository per month.",
    "That is the company. There is not a second platform of knowledge graphs, migrate-the-monorepo agents, or on-call triage under another name. If a page here describes something the dashboard cannot do, the page is wrong.",
  ],
  funding: { value: "$20", label: "Per extra connected repository / month" },
  facts: [
    { label: "Product:", value: "TeraCodeAI" },
    { label: "What it is:", value: "BYOK multi-agent PR review" },
    { label: "Meter:", value: "$20 / extra repo, first free" },
  ],
  trustedBy: "GitHub App, GitLab token, Anthropic or OpenRouter — the stack you already pay for",
};

export const milestones = {
  eyebrow: "What exists",
  items: [
    { date: "Now", event: "GitHub App + dashboard reviews" },
    { date: "Now", event: "GitLab project connect" },
    { date: "Now", event: "BYOK Anthropic and OpenRouter" },
    { date: "The meter", event: "First repo free; $20 each after that" },
  ],
};
