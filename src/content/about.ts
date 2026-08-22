export const aboutHero = {
  title: "About TeraSoft",
};

/**
 * Company brand: TeraSoft is the company, TeraCode is what it ships.
 * The mission is the test for every product — not a slogan parked on this page.
 */
export const mission = {
  eyebrow: "The goal",
  title: "Empower developers to ship software quickly and securely.",
  paragraphs: [
    "At TeraSoft, that is the whole job. We build TeraCode so teams can use AI to streamline development — review, migration, incident triage — without trading speed for safety, or safety for speed.",
    "AI already writes code faster than most teams can review it. TeraCode is the layer that lets that speed reach production: an authoring, execution and scoring runtime, and the agents we run on top of it. Starting with TeraCode Review, on your own API keys.",
  ],
};

export const principles = {
  eyebrow: "How that shows up",
  items: [
    {
      title: "Quickly — finish the work, do not demo it.",
      body: "A scripted run on a clean repository is not shipping. Review lands before a human opens the diff. Migrations are carried to the last call site. Incidents arrive with ranked causes. Speed is measured in work completed, not tokens spent.",
    },
    {
      title: "Securely — ranked by real risk, on your own keys.",
      body: "A logged credential and a missing comma are not the same finding. Security is a specialist on the board, not a linter afterthought. Execution is sandboxed. Inference runs on the keys you already hold, so your code and your spend never sit on a reseller’s meter.",
    },
    {
      title: "AI that streamlines, then gets out of the way.",
      body: "One review, not forty comments. Findings scored on what your team kept, not on how confident the model sounded. The point of the agent is less grinding for the person who has to ship — not a second backlog to babysit.",
    },
  ],
};

export const origins = {
  eyebrow: "Origins",
  paragraphs: [
    "Agents are easy to demo and hard to operate. A scripted run on a clean repository proves very little; the same agent against a real codebase, on a Friday, with branch protection and a CI suite in the way, is a different problem entirely. The gap between those two things is where most of this category currently lives.",
    "TeraSoft builds TeraCode to close that gap — an authoring, execution and scoring layer, and the agents we run on top of it. The first is TeraCode Review, an AI review board on every pull request. It runs on your own API keys, bills you nothing on top of what your provider charges, and is measured on which of its findings your team actually kept.",
  ],
  /* A verifiable fact about how we charge, in place of a funding number. */
  funding: { value: "$0", label: "Markup on your token spend" },
  facts: [
    { label: "Company:", value: "TeraSoft AI" },
    { label: "Product:", value: "TeraCode" },
    { label: "Who it’s for:", value: "Developers shipping to production" },
    { label: "Stage:", value: "Private beta" },
  ],
  stacks: "Runs on the providers and stacks you already use — bring your own key",
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
