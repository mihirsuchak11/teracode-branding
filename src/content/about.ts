export const aboutHero = {
  title: "About us",
};

export const origins = {
  eyebrow: "Origins",
  paragraphs: [
    "Agents are easy to demo and hard to operate. A scripted run on a clean repository proves very little; the same agent against a real codebase, on a Friday, with branch protection and a CI suite in the way, is a different problem entirely. The gap between those two things is where most of this category currently lives.",
    "TeraSoft AI builds TeraCode to close that gap — an authoring, execution and scoring layer, and the agents we run on top of it. The first is TeraCode Review, an AI review board on every pull request. It runs on your own API keys, bills you nothing on top of what your provider charges, and is measured on which of its findings your team actually kept.",
  ],
  /* A verifiable fact about how we charge, in place of a funding number. */
  funding: { value: "$0", label: "Markup on your token spend" },
  facts: [
    { label: "Company:", value: "TeraSoft AI" },
    { label: "Product:", value: "TeraCode" },
    { label: "Stage:", value: "Private beta" },
  ],
  trustedBy: "Bring your own key — TeraCode runs on the providers and stacks you already use",
};

export const milestones = {
  eyebrow: "Milestones",
  items: [
    { date: "2026", event: "TeraSoft AI founded" },
    { date: "2026", event: "TeraCode Review enters private beta" },
    { date: "Next", event: "TeraCode Migrate and Oncall" },
    { date: "The future", event: "Help shape what we build" },
  ],
};
