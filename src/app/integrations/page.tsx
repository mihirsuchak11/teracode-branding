import { buildMetadata } from "@/lib/metadata";
import { integrationsHero, integrationCategories, integrations } from "@/content/integrations";
import { Reveal } from "@/components/motion/Reveal";
import { IntegrationsGrid } from "@/components/sections/IntegrationsGrid";
import { CtaBand } from "@/components/sections/CtaBand";

export const metadata = buildMetadata({
  title: "Integrations",
  description:
    "GitHub App or GitLab project token. Anthropic or OpenRouter with your key. No Bitbucket or Azure DevOps row.",
  path: "/integrations",
});

function SearchBox() {
  return (
    <div className="flex h-9 w-full max-w-[320px] items-center gap-2.5 rounded-lg border border-border-strong/70 bg-surface px-3 text-sm text-fg-faint">
      <svg
        width={14}
        height={14}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.8}
        strokeLinecap="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      {integrationsHero.searchPlaceholder}
    </div>
  );
}

export default function IntegrationsPage() {
  const [titleFirst, titleSecond] = integrationsHero.title.split("\n");
  return (
    <>
      <section className="px-6 pt-14 md:px-10">
        <Reveal>
          <h1 className="text-5xl font-medium leading-[1.08] tracking-tight md:text-[60px]">
            <span className="block text-fg">{titleFirst}</span>
            <span className="block text-fg-muted">{titleSecond}</span>
          </h1>
          <p className="mt-8 max-w-[520px] text-[15px] leading-relaxed text-fg-muted">
            {integrationsHero.body}
          </p>
          <div className="mt-8">
            <SearchBox />
          </div>
        </Reveal>
        <Reveal delay={0.05}>
          <div className="mb-6 mt-24 flex flex-wrap items-center gap-2.5">
            {integrationCategories.map((category, i) => (
              <span
                key={category}
                className={`flex h-9 items-center rounded-full px-4 text-sm ${
                  i === 0
                    ? "bg-fg font-medium text-bg"
                    : "border border-border-strong/80 text-fg-dim"
                }`}
              >
                {category}
              </span>
            ))}
          </div>
        </Reveal>
      </section>
      <IntegrationsGrid integrations={integrations} />
      <CtaBand />
    </>
  );
}
