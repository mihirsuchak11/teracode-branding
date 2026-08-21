import Link from "next/link";
import { notFound } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import { integrations, getIntegration } from "@/content/integrations";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { CtaBand } from "@/components/sections/CtaBand";
import { IntegrationMark } from "@/components/sections/IntegrationsGrid";
import { ChevronDown } from "@/components/ui/icons";

export function generateStaticParams() {
  return integrations.map((integration) => ({ slug: integration.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const integration = getIntegration(slug);
  if (!integration) return {};
  return buildMetadata({
    title: `${integration.name} integration`,
    description: integration.description,
    path: `/integrations/${integration.slug}`,
  });
}

export default async function IntegrationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const integration = getIntegration(slug);
  if (!integration) notFound();

  return (
    <>
      <div>
        <nav className="flex items-center gap-3 px-6 pt-7 text-[15px] md:px-10">
          <Link href="/integrations" className="text-fg-dim transition-colors hover:text-fg">
            Integrations
          </Link>
          <ChevronDown width={12} height={12} className="-rotate-90 text-fg-disabled" />
          <span className="text-fg-faint">{integration.name}</span>
        </nav>
        <div className="mt-6 h-px w-[57%] bg-border" />
      </div>
      <section className="px-6 pb-28 pt-16 md:px-10">
        <Reveal>
          <IntegrationMark slug={integration.slug} />
          <p className="mt-9 font-mono text-xs text-fg-faint">{integration.meta}</p>
          <h1 className="mt-4 max-w-[720px] text-4xl font-medium leading-[1.1] tracking-tight text-fg md:text-[52px]">
            Connect {integration.name} to Strand
          </h1>
          <p className="mt-6 max-w-[560px] text-[17px] leading-relaxed text-fg-muted">
            {integration.description}
          </p>
          <div className="mt-9 flex items-center gap-3">
            <Button href="/pricing">Get started</Button>
            <Button href="/contact-us" variant="secondary">
              Book a demo
            </Button>
          </div>
        </Reveal>
        <Reveal className="mt-20">
          <div className="max-w-[720px] border border-border p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-fg-faint">
                Setup guide
              </p>
              <p className="font-mono text-xs text-fg-disabled">Coming soon</p>
            </div>
            <p className="mt-5 max-w-[540px] text-sm leading-relaxed text-fg-muted">
              Detailed setup documentation for this integration is on the way. In the meantime,
              every connection follows the same three steps:
            </p>
            <ul className="mt-7">
              {[
                "Authorize the connection from your Strand workspace.",
                "Cortex ingests the source and starts mapping relationships immediately.",
                "Query the connected data in plain language through Ask.",
              ].map((step, i) => (
                <li
                  key={step}
                  className="flex items-center gap-4 border-t border-border py-3.5 text-sm text-fg-dim last:pb-0"
                >
                  <span className="font-mono text-xs text-fg-faint">0{i + 1}</span>
                  {step}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </section>
      <CtaBand />
    </>
  );
}
