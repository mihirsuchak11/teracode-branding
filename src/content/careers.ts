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
  statement: "Build the review board teams will actually require.",
};

export const peopleSection = {
  eyebrow: "The people behind TeraCodeAI",
  title: "Small team, the product you can run tomorrow",
  paragraphs: [
    "The job is a GitHub App that several reviewers can share, on keys the customer already has, with a check each and a journal that says whether they were worth it. Not a SOC 2 scanner, not a seven-product platform.",
    "We are not running a slate of open roles. If that problem is the one you want to work on, write anyway.",
  ],
  cta: { label: "More about us", href: "/about-us" },
};

export const jobsSection = {
  title: "No open roles today.",
  body: "Introduce yourself if you would be a fit. We hire when the product needs it, not when a careers page looks empty.",
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
