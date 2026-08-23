import type { FeaturePage } from "@/lib/types";
import { APP_START } from "@/lib/app";
import { MAIL_CONTACT } from "@/lib/app";

/** A small decorative mock card rendered beside a benefit section. */
export interface MockCallout {
  tone?: "brand" | "danger" | "neutral";
  badge?: string;
  meta?: string;
  title?: string;
  body?: string;
}

export interface MockRow {
  label: string;
  value?: string;
  dot?: "brand" | "warn" | "danger" | "faint";
  mono?: boolean;
}

export interface FeatureMock {
  callout?: MockCallout;
  label?: string;
  rows?: MockRow[];
  footer?: { left: string; right?: string };
}

/** Mid-page headline + grid of small capability cards/chips. */
export interface FeatureMidSection {
  title: string;
  items: { title: string; body: string }[];
}

export interface FeatureExtras {
  midSection?: FeatureMidSection;
  /** Which mid-page layout renders `midSection`. Defaults to "panels". */
  midLayout?: "panels" | "chips" | "pulse";
  statsTitleMuted?: string;
  statsTitle?: string;
}

/** Per-slug hero layout. Unchanged from the template — only the keys differ. */
export const featureHero: Record<
  string,
  { layout: "art-top" | "centered" | "split"; ctas: boolean }
> = {
  review: { layout: "art-top", ctas: true },
  migrate: { layout: "split", ctas: true },
  oncall: { layout: "centered", ctas: true },
  studio: { layout: "split", ctas: true },
  runtime: { layout: "centered", ctas: true },
  evals: { layout: "split", ctas: true },
  signals: { layout: "centered", ctas: true },
};

export const featureCta = { label: "Start free", href: APP_START };

/**
 * CTAs for a coming-soon product: you cannot buy it yet, so the pricing
 * button becomes a waitlist and the secondary points back at Review, the
 * product you can connect today.
 */
export const comingSoonCtas = (name: string) => ({
  primary: {
    label: "Join the waitlist",
    href: `${MAIL_CONTACT}?subject=${encodeURIComponent(`${name} — waitlist`)}`,
  },
  secondary: { label: "Start with Review", href: "/products/review" },
});

export const features: FeaturePage[] = [
  {
    slug: "review",
    name: "TeraCode Review",
    status: "available",
    category: "Code review",
    tagline: "A board of specialists on every pull request.",
    heroTitle: "Several reviewers.\nOne review on the thread.",
    heroBody:
      "Agents you name — Legal, Compliance, Team Lead, Senior Engineer, or your own — fan out on the same diff. Findings merge so two agents flagging the same line become one comment. Each still posts its own check.",
    benefits: [
      {
        title: "A board, not one generalist.",
        body: "Each agent has its own instructions, model, and skills. They run in parallel. Disagreements are visible; duplicates are not posted twice.",
      },
      {
        title: "Ranked by what it would break.",
        body: "A logged credential and a missing trailing comma are not the same finding. Severity is something you can act on, not a line-number sort.",
      },
      {
        title: "One thread, several checks.",
        body: "Comments land as one review from the App. Checks stay per agent, so you can require security without requiring style.",
      },
    ],
    stats: [
      { value: "$0", label: "Markup on your token spend" },
      { value: "0", label: "Per-seat licences" },
      { value: "100%", label: "BYOK — your own API keys" },
      { value: "1", label: "Review on the pull request" },
    ],
  },
  {
    slug: "migrate",
    name: "TeraCode Migrate",
    status: "coming-soon",
    category: "Migrations",
    tagline: "Carry a codebase-wide migration to done.",
    heroTitle: "The last call site\nis the hard one.",
    heroBody:
      "Point a fleet at a framework upgrade or a deprecated API. It opens one pull request per module, keeps the build green, and stops when the last call site is gone. Migrate is coming soon; join the waitlist and you will hear from us the week it opens up.",
    benefits: [
      {
        title: "One pull request per module.",
        body: "Nobody reviews a 400-file diff. The fleet splits the work along your module boundaries and lands it piece by piece, each PR small enough for the Review board to actually read.",
      },
      {
        title: "Green the whole way.",
        body: "Each pull request runs your suite before it opens. A module that cannot go green is reported with the failing test, not merged and hoped for.",
      },
      {
        title: "Stops when it is done.",
        body: "The migration has a definition of finished — zero remaining call sites — and the fleet shuts itself off when it gets there. No agent is left running on a done job.",
      },
    ],
  },
  {
    slug: "oncall",
    name: "TeraCode Oncall",
    status: "coming-soon",
    category: "Incident response",
    tagline: "Triage that reads the trace, not the alert.",
    heroTitle: "The page fires.\nThe work is done.",
    heroBody:
      "When a page fires, an agent has already pulled the trace, the recent deploys and the owning service, and posted the three most likely causes, ranked, with the evidence for each. Oncall is coming soon; join the waitlist and you will hear from us the week it opens up.",
    benefits: [
      {
        title: "Context before you are awake.",
        body: "Trace, recent deploys, owning service and the last incident that looked like this — gathered and posted to the incident channel before you open the laptop.",
      },
      {
        title: "Three causes, ranked.",
        body: "Not a summary of the alert. An ordered hypothesis list with the evidence for each one attached, and the suspected commit linked when a deploy correlates.",
      },
      {
        title: "Writes the timeline for you.",
        body: "Every step it took lands in the channel as it happens, so the post-mortem is half-written by the time you resolve.",
      },
    ],
  },
  {
    slug: "studio",
    name: "TeraCode Studio",
    status: "coming-soon",
    category: "Authoring",
    tagline: "Author agents: personas, skills and tools.",
    heroTitle: "An agent is\na document.",
    heroBody:
      "Write an agent's instructions, attach skills scoped to file globs, give it tools, and version every change. It is the same authoring model behind every application we ship — the Review board is built in it. Studio is coming soon; join the waitlist and we will reach out when your organisation can connect.",
    benefits: [
      {
        title: "Personas, not prompts.",
        body: "An agent is instructions, a model, a set of skills and a policy — a document you can read, review and roll back. Edit any preset and it becomes yours: same slug, your voice.",
      },
      {
        title: "Skills scoped to globs.",
        body: "Attach a skill to the paths it understands and it stays out of the prompt everywhere else. Context that scales with the codebase instead of against it.",
      },
      {
        title: "Org-wide, repo-deep.",
        body: "Set the roster once for the organisation, then override it on the repositories that genuinely differ. Every change is a revision you can compare.",
      },
    ],
  },
  {
    slug: "runtime",
    name: "TeraCode Runtime",
    status: "coming-soon",
    category: "Execution",
    tagline: "Sandboxed execution on your own keys.",
    heroTitle: "One turn.\nOne sandbox.",
    heroBody:
      "Every agent turn runs isolated and concurrent, on the provider key you supply. One agent failing never sinks the run, and we never take a cut of inference. Runtime is what every TeraCodeAI product executes on; it is coming soon as a surface you can build your own agents against.",
    benefits: [
      {
        title: "Bring your own key.",
        body: "Your provider bills you directly. The key is encrypted at rest, decrypted only to run a turn, never written to a log, and never enters the sandbox that clones the repository.",
      },
      {
        title: "Isolated by default.",
        body: "Each turn gets its own sandbox. One agent throwing never takes down the others in the run; the rest complete and report.",
      },
      {
        title: "Spend, itemised.",
        body: "Every run records its tokens against the agent that spent them, so cost has a name attached. A cheap model for docs, a frontier model for security — routed per agent, not per account.",
      },
    ],
  },
  {
    slug: "evals",
    name: "TeraCode Evals",
    status: "coming-soon",
    category: "Measurement",
    tagline: "Scored on what humans kept, not vibes.",
    heroTitle: "Kept,\nor deleted.",
    heroBody:
      "Resolve a finding and it counted. Delete it and it didn't. Every agent carries a keep rate, and regression suites gate a persona before it reaches production. Evals is coming soon; join the waitlist and we will reach out when your organisation can connect.",
    benefits: [
      {
        title: "Signal from the work itself.",
        body: "No survey, no thumbs. The two things a human already does — resolve or delete — are the whole scoring model, recorded from what the team did on the pull request.",
      },
      {
        title: "Keep rate per agent.",
        body: "Every persona carries a number that says whether it earned its place on the roster, per repository. It is how you decide to keep an agent, not a marketing score.",
      },
      {
        title: "Regression suites and side-by-side.",
        body: "Replay a persona against cases it has already seen; a change that loses ground does not ship. Run two versions on live traffic and promote the one that wins.",
      },
    ],
  },
  {
    slug: "signals",
    name: "TeraCode Signals",
    status: "coming-soon",
    category: "Observability",
    tagline: "Traces, spend and drift for every agent.",
    heroTitle: "Watch it\nin production.",
    heroBody:
      "Every run itemised: which agent, which model, how many tokens, what it cost. Watch a keep rate drift off its own baseline before anyone thinks to complain about it. Signals is coming soon; join the waitlist and you will hear from us the week it opens up.",
    benefits: [
      {
        title: "Full trace per turn.",
        body: "The prompt that went out, the skills that joined it, the tools it called and what came back — retained per turn, per agent.",
      },
      {
        title: "Cost with a name on it.",
        body: "Spend broken down by agent, model and repository, so an expensive persona is visible immediately rather than at invoice time.",
      },
      {
        title: "Drift alerts and an audit trail.",
        body: "When an agent's keep rate falls off its baseline, you hear about it from us first. Who changed which agent, when, and what it did afterwards — exportable.",
      },
    ],
  },
];

export const featureExtras: Record<string, FeatureExtras> = {
  review: {
    midLayout: "panels",
    midSection: {
      title: "Named reviewers on the diff,\nmerged into one thread.",
      items: [
        {
          title: "Skills on the paths they know",
          body: "Attach instructions to file globs so the agent reading auth is not the one reading a migration.",
        },
        {
          title: "Runs on your own keys",
          body: "The host calls your provider. Tokens are billed to you. We add nothing on top.",
        },
        {
          title: "Scored on what you kept",
          body: "Quality is which findings the team resolved rather than deleted — not how confident the model sounded.",
        },
      ],
    },
    statsTitleMuted: "Every AI reviewer charges per seat.",
    statsTitle: "TeraCode runs on your keys, at cost.",
  },
};

/**
 * Decorative mock cards, index-aligned with each page's benefits. Only
 * available products render a showcase; coming-soon pages are a teaser.
 */
export const featureMocks: Record<string, FeatureMock[]> = {
  review: [
    {
      callout: {
        tone: "brand",
        title: "PR #482",
        body: "Merged from 4 agents",
        meta: "Reviewed",
      },
      label: "Agents:",
      rows: [
        { label: "Security", value: "2 findings", dot: "brand" },
        { label: "Team Lead", value: "1 regression", dot: "brand" },
        { label: "Senior Eng", value: "coverage -3%", dot: "brand" },
      ],
    },
    {
      rows: [
        { label: "Token logged in plaintext", value: "High", dot: "danger" },
        { label: "Missing rollback path", value: "High", dot: "danger" },
        { label: "Unhandled promise rejection", value: "Medium", dot: "warn" },
        { label: "N+1 query in list view", value: "Medium", dot: "warn" },
        { label: "Unused import", value: "Low", dot: "faint" },
      ],
    },
    {
      rows: [
        { label: "Comments posted", value: "1 review", dot: "brand" },
        { label: "Findings merged", value: "12 → 5" },
        { label: "Duplicates removed", value: "7" },
        { label: "Checks posted", value: "4", mono: true },
      ],
    },
  ],
};

export function getFeature(slug: string): FeaturePage | undefined {
  return features.find((f) => f.slug === slug);
}
