import type { ChangelogEntry } from "@/lib/types";

export interface ChangelogRelease extends Omit<ChangelogEntry, "items"> {
  version: string;
  image?: { src: string; alt: string; width: number; height: number };
  items: { label?: "NEW" | "IMPROVED" | "FIXED"; text: string }[];
}

export const changelogHero = {
  title: "Changelog",
  status: { label: "Private beta", uptime: "BY INVITATION" },
};

/**
 * TeraCode Review is in private beta, so there is one entry here rather than a
 * manufactured release history. Add real releases as they ship.
 */
export const releases: ChangelogRelease[] = [
  {
    version: "Private beta",
    date: "2026",
    title: "TeraCode Review opens to the first teams",
    items: [
      {
        label: "NEW",
        text: "TeraCode Review runs a board of specialists — security, performance, tests and style — against every pull request, then reconciles their findings into a single review rather than a comment storm.",
      },
      {
        label: "NEW",
        text: "Bring your own API keys. TeraCode calls your model provider directly with your key, so inference is billed to you at your provider's price with no markup and no per-seat licence.",
      },
      {
        label: "NEW",
        text: "Findings are ranked by the damage they would actually do, so a logged credential does not arrive alongside a missing trailing comma as though they were equivalent.",
      },
      {
        text: "Access is by invitation while we are in private beta. Write to contact@teracode.ai to be included.",
      },
    ],
  },
];
