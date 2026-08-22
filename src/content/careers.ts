import type { Job } from "@/lib/types";

export const careersHero = {
  title: "Careers",
  openCount: "1",
  openLabel: "open application",
  images: [
    {
      src: "/images/om9pwPLkFklXwLLjFl1snW2kdA.png",
      alt: "",
      width: 1587,
      height: 1058,
    },
    {
      src: "/images/FGxTNZStnlzm2hOOOW5ZIpyCKZA.png",
      alt: "",
      width: 1160,
      height: 774,
    },
  ],
  statement: "Build the layer that lets developers ship quickly and securely.",
};

export const peopleSection = {
  eyebrow: "The people behind TeraCode",
  title: "Small team, unreasonable standards",
  paragraphs: [
    "TeraSoft is a small team working on a problem that is easy to fake and hard to actually solve. Anyone can get an agent to look impressive once. Getting one to be worth running on a real codebase, every day, without a human babysitting it, is the whole job.",
    "That means we care more about judgement than volume. The interesting questions here are about what an agent should refuse to do, how you measure whether its output was worth reading, and how you build something people trust with their production repository — not about how many tokens you can spend.",
    "We are not running open roles right now. If that problem is the one you want to work on, write to us anyway and tell us what you would build.",
  ],
  cta: { label: "More about us", href: "/about-us" },
};

export const jobsSection = {
  title: "No open roles today.",
  body: "We hire opportunistically while we are in private beta. If you would be a fit, introduce yourself and we will keep you in mind as the team grows.",
};

export const jobs: Job[] = [
  {
    slug: "open-application",
    title: "Open Application",
    team: "All teams",
    location: "Remote",
    type: "Introduce yourself",
  },
];
