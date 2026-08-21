import type { ChangelogEntry } from "@/lib/types";

export interface ChangelogRelease extends Omit<ChangelogEntry, "items"> {
  version: string;
  image?: { src: string; alt: string; width: number; height: number };
  items: { label?: "NEW" | "IMPROVED" | "FIXED"; text: string }[];
}

export const changelogHero = {
  title: "Changelog",
  status: { label: "All systems operational", uptime: "99.98% UPTIME" },
};

export const releases: ChangelogRelease[] = [
  {
    version: "v2.4.0",
    date: "Jun 12, 2026",
    title: "Faster cross source queries and quieter Pulse alerts",
    image: {
      src: "/images/2lGbNb0EKRZCISNfMTcVLhJDY.png",
      alt: "Screenshot of Ask suggesting follow-up questions after a query result.",
      width: 960,
      height: 734,
    },
    items: [
      {
        label: "NEW",
        text: "Ask now suggests two or three follow up questions after every result, so you can keep digging without typing a new query from scratch.",
      },
      {
        label: "IMPROVED",
        text: "Queries spanning five or more connected sources resolve noticeably faster, with no change to how you phrase them.",
      },
      {
        text: "Pulse adjusts its baseline for known seasonal patterns, like quarter end spikes, so expected swings stop triggering alerts.",
      },
    ],
  },
  {
    version: "v2.3.0",
    date: "Jun 3, 2026",
    title: "Cortex traces deeper relationships, Nucleus streams larger results",
    items: [
      {
        label: "NEW",
        text: "Cortex now resolves relationships across three or more linked entities in a single pass, not just direct connections.",
      },
      {
        text: "Nucleus TypeScript SDK v1.4.0 adds streaming support for large query results, instead of waiting on the full payload.",
      },
    ],
  },
  {
    version: "v2.2.1",
    date: "May 20, 2026",
    title: "Local schema validation and a Snowflake sync fix",
    items: [
      {
        label: "NEW",
        text: "Nucleus CLI v2.1.0 validates your graph schema locally before pushing changes, instead of waiting on a round trip to the server.",
      },
      {
        label: "IMPROVED",
        text: "Resolved a delay where the Snowflake connector could lag behind other sources during high volume Pathways syncs.",
      },
    ],
  },
  {
    version: "v2.2.0",
    date: "May 6, 2026",
    title: "Recall now scores its own confidence",
    items: [
      {
        label: "NEW",
        text: "Recall attaches a confidence score to every correlation it surfaces, so you can tell a strong signal from a coincidence at a glance.",
      },
      {
        label: "IMPROVED",
        text: "Weekly insight reports load faster when spanning a full quarter of historical data.",
      },
    ],
  },
  {
    version: "v2.1.0",
    date: "Apr 22, 2026",
    title: "Configurable sync rules and a Jira fix",
    items: [
      {
        label: "NEW",
        text: "Pathways supports configurable conflict resolution rules, so you can set which source wins when two systems disagree on the same field.",
      },
      {
        label: "IMPROVED",
        text: "Resolved an issue where Jira custom fields with special characters failed to map into the knowledge graph.",
      },
    ],
  },
  {
    version: "v2.0.1",
    date: "Apr 9, 2026",
    title: "Query latency and alert routing fixes",
    items: [
      {
        label: "FIXED",
        text: "Resolved a latency spike affecting Ask queries that combined date filters with nested relationships.",
      },
      {
        text: "Fixed an issue where some Pulse alerts routed to the wrong Slack channel after a workspace rename.",
      },
    ],
  },
  {
    version: "v2.0.0",
    date: "Mar 28, 2026",
    title: "Automated insight reports and webhook support land",
    items: [
      {
        label: "NEW",
        text: "Recall now generates automated insight reports on a weekly cadence, or on demand, summarizing the trends and correlations it finds across your historical data.",
      },
      {
        text: "Nucleus adds webhook support, so you can trigger downstream workflows whenever the graph changes.",
      },
      {
        label: "IMPROVED",
        text: "The graph explorer in Cortex renders large graphs with noticeably less lag.",
      },
    ],
  },
];
