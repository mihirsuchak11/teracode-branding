import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageShell } from "@/components/sections/PageShell";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { buildMetadata } from "@/lib/metadata";
import { jobs } from "@/content/careers";

export function generateStaticParams() {
  return jobs.map((job) => ({ slug: job.slug }));
}

export async function generateMetadata({ params }: PageProps<"/careers/[slug]">) {
  const { slug } = await params;
  const job = jobs.find((j) => j.slug === slug);
  if (!job) return buildMetadata({ title: "Careers", description: "Open application at TeraCodeAI.", path: "/careers" });
  return buildMetadata({
    title: job.title,
    description: `${job.title} at TeraCodeAI — ${job.location}, ${job.type}. Help build the agents that let teams ship fast and secure.`,
    path: `/careers/${job.slug}`,
  });
}

export default async function JobPage({ params }: PageProps<"/careers/[slug]">) {
  const { slug } = await params;
  const job = jobs.find((j) => j.slug === slug);
  if (!job) notFound();

  return (
    <>
      <PageShell>
        <section className="px-6 py-14 md:px-10">
          <Reveal className="max-w-[683px]">
            <Link
              href="/careers"
              className="font-mono text-xs font-medium text-fg-muted transition-colors hover:text-fg"
            >
              &larr; All positions
            </Link>
            <h1 className="mt-6 text-2xl font-semibold leading-[1.1] tracking-tight text-fg md:text-[32px]">
              {job.title}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-sm leading-5 text-fg-muted">
              <span>{job.team}</span>
              <span aria-hidden="true" className="text-fg-faint">/</span>
              <span>{job.location}</span>
              <span aria-hidden="true" className="text-fg-faint">/</span>
              <span className="font-mono text-xs font-medium text-fg-faint">{job.type}</span>
            </div>
            <div className="mt-10 border border-border p-6 md:p-8">
              <p className="text-sm leading-5 text-fg-muted">
                The full description for this role is coming soon. In the meantime, we would still
                love to hear from you — send us your background and a note on why this problem
                matters to you.
              </p>
              <p className="mt-4 text-sm leading-5 text-fg-muted">
                All roles are remote unless noted. We care about the work, not the timezone.
              </p>
              <div className="mt-6">
                <Button href="/contact-us" size="sm">
                  Apply for this role
                </Button>
              </div>
            </div>
          </Reveal>
        </section>
      </PageShell>
      <CtaBand />
    </>
  );
}
