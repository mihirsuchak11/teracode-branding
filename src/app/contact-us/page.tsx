import { ContactForm } from "@/components/sections/ContactForm";
import { PageShell } from "@/components/sections/PageShell";
import { Reveal } from "@/components/motion/Reveal";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Contact us",
  description:
    "Questions about TeraCodeAI, the $20-per-repo meter, or BYOK keys? Reach the team here or start free on the dashboard.",
  path: "/contact-us",
});

const emails = [{ label: "Email:", email: "contact@teracodeai.com" }];

export default function ContactPage() {
  return (
    <PageShell>
      <section className="grid border-b border-border py-10 md:grid-cols-2">
        <Reveal className="flex flex-col justify-between gap-16 p-6 md:p-8">
          <div>
            <h1 className="text-2xl font-semibold leading-7 tracking-tight text-fg">
              Talk to TeraCodeAI.
            </h1>
            <p className="mt-3 max-w-[496px] text-base leading-6 text-fg-muted">
              Questions about the GitHub App, the $20-per-repo meter, or bringing your own key? Start free
              on the dashboard, or write us here.
            </p>
          </div>
          <p className="text-xs leading-4 text-fg-muted">
            You can also email us at{" "}
            <a href="mailto:contact@teracodeai.com" className="transition-colors hover:text-fg">
              contact@teracodeai.com
            </a>
          </p>
        </Reveal>
        <Reveal>
          <ContactForm />
        </Reveal>
      </section>

      {/* Email directory */}
      <section className="flex flex-wrap items-center justify-between gap-6 px-6 py-8 md:px-8">
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 font-mono text-xs font-medium leading-5">
          {emails.map((row) => (
            <div key={row.email} className="contents">
              <dt className="text-fg-muted">{row.label}</dt>
              <dd>
                <a
                  href={`mailto:${row.email}`}
                  className="text-fg transition-colors hover:text-fg-muted"
                >
                  {row.email}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </PageShell>
  );
}
