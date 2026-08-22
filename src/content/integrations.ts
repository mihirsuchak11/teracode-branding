import type { Integration } from "@/lib/types";

/** Integration plus the tile meta line ("Category · Auth method"). */
export type IntegrationItem = Integration & { meta: string };

/**
 * NOTE: this list states which platforms TeraCode connects to and which model
 * providers it can call with your key. Confirm each entry against what is
 * actually supported before launch — every row here is a claim.
 */
export const integrationsHero = {
  title: "Your platform.\nYour provider. Your keys.",
  body: "TeraCode connects to the source control you already use and calls whichever model you already pay for. Inference is billed to you by your provider — we never sit in the middle of it.",
  searchPlaceholder: "Search integrations...",
};

export const integrationCategories = ["All", "Source control", "Model providers"];

const meta: Record<string, string> = {
  github: "Source control · GitHub App",
  gitlab: "Source control · OAuth",
  bitbucket: "Source control · OAuth",
  anthropic: "Model provider · Your API key",
  openai: "Model provider · Your API key",
  google: "Model provider · Your API key",
  "azure-openai": "Model provider · Your deployment",
  bedrock: "Model provider · Your AWS account",
};

const base: Integration[] = [
  {
    slug: "github",
    name: "GitHub",
    category: "Source control",
    description:
      "Review runs on your pull requests and posts back a single reconciled review. Works with your existing branch protection and required checks.",
  },
  {
    slug: "gitlab",
    name: "GitLab",
    category: "Source control",
    description:
      "Merge requests are reviewed the same way, with findings posted back into the discussion your team already uses.",
  },
  {
    slug: "bitbucket",
    name: "Bitbucket",
    category: "Source control",
    description:
      "Pull requests are picked up, reviewed by the specialist board, and returned as one review rather than a comment storm.",
  },
  {
    slug: "anthropic",
    name: "Anthropic",
    category: "Model providers",
    description:
      "Call Claude models with your own Anthropic key. Tokens are billed to you by Anthropic at Anthropic's price, with nothing added by us.",
  },
  {
    slug: "openai",
    name: "OpenAI",
    category: "Model providers",
    description:
      "Use your own OpenAI account. Your key, your rate limits, your invoice — TeraCode never resells inference back to you.",
  },
  {
    slug: "google",
    name: "Google",
    category: "Model providers",
    description:
      "Run against Gemini models on your own Google credentials, billed directly to your Google account.",
  },
  {
    slug: "azure-openai",
    name: "Azure OpenAI",
    category: "Model providers",
    description:
      "Point TeraCode at your own Azure deployment when inference has to stay inside your tenant and your commercial agreement.",
  },
  {
    slug: "bedrock",
    name: "AWS Bedrock",
    category: "Model providers",
    description:
      "Call models through your own AWS account, so inference spend lands on the bill you already reconcile.",
  },
];

export const integrations: IntegrationItem[] = base.map((i) => ({
  ...i,
  meta: meta[i.slug] ?? `${i.category} · Your API key`,
}));

export function getIntegration(slug: string): IntegrationItem | undefined {
  return integrations.find((i) => i.slug === slug);
}
