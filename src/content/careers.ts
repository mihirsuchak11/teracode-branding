import type { Job } from "@/lib/types";

export const careersHero = {
  title: "Careers",
  openCount: "9",
  openLabel: "open positions",
  images: [
    {
      src: "/images/om9pwPLkFklXwLLjFl1snW2kdA.png",
      alt: "Colleagues working together.",
      width: 1587,
      height: 1058,
    },
    {
      src: "/images/FGxTNZStnlzm2hOOOW5ZIpyCKZA.png",
      alt: "Colleagues working together.",
      width: 1160,
      height: 774,
    },
  ],
  statement: "Build the intelligence layer for every company.",
};

export const peopleSection = {
  eyebrow: "The people behind Strand",
  title: "Different backgrounds, one problem worth solving",
  headshots: [
    {
      src: "/images/gfPJbC7V3QACmJdAcFt5syFFiHY.png",
      alt: "Headshot of Marcus Webb, office background.",
    },
    {
      src: "/images/aQkc8mu4NCz0NVM2hfvK3SHMo.png",
      alt: "Headshot of Claire Fontaine, office background.",
    },
    {
      src: "/images/j1fVVsYHNOOJBwG2aIWyAD8jmE.png",
      alt: "Headshot of Daniel Reyes, office background.",
    },
    {
      src: "/images/Ni3cnJQsyiAgoukmGDvJDmo0UA.png",
      alt: "Headshot of Jordan Osei, office background.",
    },
    {
      src: "/images/L3vArIaTs2iYs7hHUuNDrr8Wx0.png",
      alt: "Headshot of Ravi Menon, office background.",
    },
    {
      src: "/images/kncH615mlGnZy7BL3qEYyx7tKs.png",
      alt: "Headshot of Kevin Liang, office background.",
    },
    {
      src: "/images/NEfG84PT6RYlY2rNFvDR1LWA1Ec.png",
      alt: "Headshot of Zara Mitchell, office background.",
    },
  ],
  paragraphs: [
    "We are a small team solving a massive problem. Strand exists because data shouldn’t require a dedicated analyst, a three-day sprint, or six open browser tabs to be useful. We built the thing we always wished existed: one place where every question about your business gets a real answer, instantly.",
    "Most companies aren’t losing to competitors. They’re losing to their own blind spots. Data sitting in disconnected tools, insights buried in exports nobody reads, decisions made on gut feel because the truth takes too long to find. We think that’s a solvable problem. And we’re solving it.",
    "If you care deeply about the work, go deep on hard problems, and believe that good infrastructure should be invisible and intelligence should be accessible to everyone, we would like to talk.",
  ],
  cta: { label: "More about us", href: "/about-us" },
};

export const jobsSection = {
  title: "We're hiring across the stack.",
  body: "All roles are remote unless noted. We care about the work, not the timezone.",
};

export const jobs: Job[] = [
  {
    slug: "senior-backend-engineer",
    title: "Senior Backend Engineer",
    team: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    slug: "ml-engineer",
    title: "ML Engineer",
    team: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    slug: "product-designer",
    title: "Product Designer",
    team: "Design",
    location: "Remote",
    type: "Full-time",
  },
  {
    slug: "developer-relations-lead",
    title: "Developer Relations Lead",
    team: "Developer Relations",
    location: "Remote or San Francisco",
    type: "Part-time",
  },
  {
    slug: "account-executive",
    title: "Account Executive",
    team: "Sales",
    location: "New York",
    type: "Full-time",
  },
  {
    slug: "data-infrastructure-engineer",
    title: "Data Infrastructure Engineer",
    team: "Engineering",
    location: "Remote",
    type: "Full-time",
  },
  {
    slug: "technical-writer",
    title: "Technical Writer",
    team: "Developer Relations",
    location: "Remote",
    type: "Internship",
  },
  {
    slug: "growth-marketing-manager",
    title: "Growth Marketing Manager",
    team: "Marketing",
    location: "Remote or New York",
    type: "Full-time",
  },
  {
    slug: "open-application",
    title: "Open Application",
    team: "All teams",
    location: "Varies",
    type: "Full-time",
  },
];
