import type { Integration } from "@/lib/types";

/** Integration plus the tile meta line ("Category · Auth method"). */
export type IntegrationItem = Integration & { meta: string };

/**
 * Only connections the product actually has. GitHub App, GitLab token,
 * Anthropic key, OpenRouter key. No Bitbucket, no Azure DevOps, no Soon row.
 */
export const integrationsHero = {
  title: "GitHub or GitLab.\nYour key, not ours.",
  body: "Install the GitHub App, or connect a GitLab project with a token and a webhook. Reviews call Anthropic or OpenRouter with the key you put in the vault.",
  searchPlaceholder: "Search connections...",
};

export const integrationCategories = ["All", "Source control", "Model providers"];

const meta: Record<string, string> = {
  github: "Source control · GitHub App",
  gitlab: "Source control · Project token",
  anthropic: "Model provider · Your API key",
  openrouter: "Model provider · Your API key",
};

const base: Integration[] = [
  {
    slug: "github",
    name: "GitHub",
    category: "Source control",
    description:
      "Install the App, sign in, and connect repositories it can see. Reviews post one merged review and one check per agent. Works with the branch protection you already have.",
  },
  {
    slug: "gitlab",
    name: "GitLab",
    category: "Source control",
    description:
      "Connect a project with the instance URL, full path, and a project access token (api, Developer). You add the webhook. Checks become commit statuses; GitLab has no request-changes review.",
  },
  {
    slug: "anthropic",
    name: "Anthropic",
    category: "Model providers",
    description:
      "Your sk-ant key, stored encrypted, used only to call Anthropic from the host. The dashboard shows token counts, not a made-up dollar price.",
  },
  {
    slug: "openrouter",
    name: "OpenRouter",
    category: "Model providers",
    description:
      "Your OpenRouter key. One credential for the models it fronts, with the per-call cost the usage page can show. We do not take a cut; OpenRouter's own fees stay on their invoice.",
  },
];

export const integrations: IntegrationItem[] = base.map((i) => ({
  ...i,
  meta: meta[i.slug] ?? `${i.category} · Your API key`,
}));

export function getIntegration(slug: string): IntegrationItem | undefined {
  return integrations.find((i) => i.slug === slug);
}
