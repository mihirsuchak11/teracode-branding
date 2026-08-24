import type { ChangelogEntry } from "@/lib/types";

export interface ChangelogRelease extends Omit<ChangelogEntry, "items"> {
  version: string;
  image?: { src: string; alt: string; width: number; height: number };
  items: { label?: "NEW" | "IMPROVED" | "FIXED"; text: string }[];
}

export const changelogHero = {
  title: "Changelog",
  status: { label: "GitHub App + dashboard", uptime: "BYOK" },
};

export const releases: ChangelogRelease[] = [
  {
    version: "Now",
    date: "2026",
    title: "TeraCodeAI — Review is live; six more products on the way",
    items: [
      {
        label: "NEW",
        text: "Several review agents on every pull request. Findings merge into one thread. Each agent posts its own status check.",
      },
      {
        label: "NEW",
        text: "Bring your own Anthropic or OpenRouter key. The key is encrypted at rest and does not enter the sandbox that clones the pull request.",
      },
      {
        label: "NEW",
        text: "Three plans. Student and public OSS: one agent, free. Team: $29 or ₹2,999 per extra connected repository per month, first repo free. Enterprise: bulk / invoice. Extra repos are paid on Razorpay hosted checkout after you sign in.",
      },
      {
        text: "The lineup: Migrate, Oncall, Studio, Runtime, Evals and Signals are coming soon on the same dashboard, the same keys and the same meter.",
      },
      {
        text: "Start from this site at the dashboard login, destination /projects/new. Contact: contact@teracodeai.com.",
      },
    ],
  },
];
