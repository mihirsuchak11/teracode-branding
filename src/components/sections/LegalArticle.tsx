import Link from "next/link";
import type { LegalDoc } from "@/content/legal";
import { PageShell } from "@/components/sections/PageShell";

function sectionId(heading: string): string {
  return heading
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function LegalArticle({ doc }: { doc: LegalDoc }) {
  return (
    <PageShell>
      <div className="grid md:grid-cols-[373px_1fr]">
        <aside className="border-border p-6 md:border-r md:p-8">
          <h1 className="text-2xl font-semibold leading-7 tracking-tight text-fg">
            {doc.title}
          </h1>
          <p className="mt-2 font-mono text-xs font-medium leading-4 text-fg-faint">
            {doc.updatedLabel} <time>{doc.updated}</time>
          </p>
          <nav aria-label="Table of contents" className="mt-12 hidden md:block">
            <ol className="flex flex-col gap-3">
              {doc.sections.map((section, i) => (
                <li
                  key={section.heading}
                  className="flex gap-2.5 font-mono text-xs font-medium leading-4 text-fg-muted"
                >
                  <span className="w-4 shrink-0">{i + 1}.</span>
                  <Link
                    href={`#${sectionId(section.heading)}`}
                    className="transition-colors hover:text-fg"
                  >
                    {section.heading}
                  </Link>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
        <article className="flex flex-col gap-8 p-6 pb-16 md:p-8 md:pb-16">
          {doc.sections.map((section, i) => (
            <section
              key={section.heading}
              id={sectionId(section.heading)}
              className="scroll-mt-24"
            >
              <h3 className="text-lg font-semibold leading-6 text-fg">
                {i + 1}. {section.heading}
              </h3>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="mt-3 text-sm leading-5 text-fg-muted">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}
        </article>
      </div>
    </PageShell>
  );
}
