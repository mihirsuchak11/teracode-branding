import { ContactForm } from "@/components/sections/ContactForm";
import { PageShell } from "@/components/sections/PageShell";
import { Reveal } from "@/components/motion/Reveal";
import { XSocial, LinkedIn, GitHub } from "@/components/ui/icons";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Contact us",
  description:
    "Questions about Strand, pricing, or your data setup? Reach the right team in under a minute.",
  path: "/contact-us",
});

const emails = [
  { label: "Sales:", email: "sales@strand.io" },
  { label: "Support:", email: "support@strand.io" },
  { label: "Partnerships:", email: "partnerships@strand.io" },
];

const socials = [
  { label: "X", href: "https://x.com", icon: XSocial },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedIn },
  { label: "GitHub", href: "https://github.com", icon: GitHub },
];

export default function ContactPage() {
  return (
    <PageShell>
      <section className="grid border-b border-border py-10 md:grid-cols-2">
        <Reveal className="flex flex-col justify-between gap-16 p-6 md:p-8">
          <div>
            <h1 className="text-2xl font-semibold leading-7 tracking-tight text-fg">
              Let&apos;s connect the dots.
            </h1>
            <p className="mt-3 max-w-[496px] text-base leading-6 text-fg-muted">
              Questions about Strand, pricing, or your data setup? Reach the right team in under a
              minute.
            </p>
          </div>
          <p className="text-xs leading-4 text-fg-muted">
            You can also email us at{" "}
            <a href="mailto:sales@strand.io" className="transition-colors hover:text-fg">
              sales@strand.io
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
        <div className="flex items-center gap-2">
          {socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-2 text-fg-dim transition-colors hover:text-fg"
            >
              <social.icon width={14} height={14} />
            </a>
          ))}
        </div>
      </section>
    </PageShell>
  );
}
