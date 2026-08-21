import type { TeamMember } from "@/lib/types";

export const aboutHero = {
  title: "About us",
};

export const origins = {
  eyebrow: "Origins",
  paragraphs: [
    "We came from companies where the data existed but the answers did not. Brilliant people spending half their week pulling exports, merging spreadsheets, and rebuilding context that should have been instant. The problem was never the data. It was the distance between the data and the person who needed it.",
    "We built Strand to close that distance. One graph. Every source. Anyone on the team can ask a question and get an answer in seconds, not days. Two years in, 2,400 teams have made that switch.",
  ],
  funding: { value: "$12M", label: "Funding raised" },
  facts: [
    { label: "Founded:", value: "2025" },
    { label: "Location:", value: "San Francisco, CA" },
    { label: "Team size:", value: "7 people" },
  ],
  trustedBy: "Trusted by 56+ teams who are tired of tab-switching",
};

export const milestones = {
  eyebrow: "Milestones",
  items: [
    { date: "January 2023", event: "Strand founded" },
    { date: "June 2023", event: "Cortex v1 shipped" },
    { date: "September 2023", event: "First 100 teams onboarded" },
    { date: "The future", event: "Help shape the future of Strand" },
  ],
};

export const teamSection = {
  eyebrow: "The team",
  members: [
    {
      name: "Marcus Webb",
      role: "Backend Engineer",
      image: "/images/ksqJrieXLUsSNwxF8kGqLgc3Yg.png",
    },
    {
      name: "Claire Fontaine",
      role: "Customer Success",
      image: "/images/PUecTk9jWpVwlN9nigmsQSli9q4.png",
    },
    {
      name: "Daniel Reyes",
      role: "Product Designer",
      image: "/images/iZ6PrlyGPqoYuxYixWxyH4SexY.png",
    },
    {
      name: "Jordan Osei",
      role: "Machine Learning",
      image: "/images/6r2LlY9YSSFLbGFQuS7DHN40A.png",
    },
    {
      name: "Ravi Menon",
      role: "Full Stack Engineer",
      image: "/images/8CzrxWF534iSkitS47r5A5xKy8.png",
    },
    {
      name: "Kevin Liang",
      role: "Developer Relations",
      image: "/images/7jcAeS53cIjZhvIADnuaNUcY.png",
    },
    {
      name: "Zara Mitchell",
      role: "Sales",
      image: "/images/mCrcfzFZ37SpEpNzcBAy5oB8.png",
    },
  ] satisfies TeamMember[],
  openSpot: {
    name: "Could be you",
    cta: { label: "View careers", href: "/careers" },
    image: "/images/zYExH6gc2W0VSA18crbFqkTKFI.png",
  },
};
