import Link from "next/link";
import { footer } from "@/content/site";
import { NewsletterForm } from "./NewsletterForm";
import { FooterWordmark } from "./FooterWordmark";
import { ArrowUpRight } from "@/components/ui/icons";

function FooterLink({ label, href, external }: { label: string; href: string; external?: boolean }) {
  const cls = "inline-flex items-center gap-1.5 text-[15px] text-fg-muted transition-colors hover:text-fg";
  // mailto: is not a route, and should not open in a new tab either.
  if (href.startsWith("mailto:")) {
    return (
      <a href={href} className={cls}>
        {label}
      </a>
    );
  }
  return external || href.startsWith("http") ? (
    <a href={href} target="_blank" rel="noreferrer" className={cls}>
      {label}
      <ArrowUpRight width={13} height={13} className="text-fg-faint" />
    </a>
  ) : (
    <Link href={href} className={cls}>
      {label}
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="px-6 pt-16 md:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4">
          {footer.columns.map((col) => (
            <div key={col.title} className="flex flex-col gap-4">
              <h3 className="text-base font-medium text-fg">{col.title}</h3>
              {col.links.map((link) => (
                <FooterLink key={link.label} {...link} />
              ))}
            </div>
          ))}
        </div>

        {/* Status + newsletter bar */}
        <div className="mt-20 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <span className="inline-flex w-fit items-center gap-2.5 rounded-full border border-border-strong/50 bg-surface px-4 py-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-brand" />
            <span className="text-[13px] text-fg-dim">{footer.status.label}</span>
            <span className="text-fg-disabled">|</span>
            <span className="font-mono text-xs tracking-wider text-fg-faint">
              {footer.status.uptime}
            </span>
          </span>
          <div className="flex items-center gap-4">
            <p className="hidden text-[15px] text-fg-muted lg:block">{footer.newsletter.blurb}</p>
            <NewsletterForm />
          </div>
        </div>

        <FooterWordmark />

        <div className="flex flex-col items-start justify-between gap-3 pb-8 text-sm text-fg-muted md:flex-row md:items-center">
          <p>{footer.copyright}</p>
          <p className="flex items-center gap-3">
            {footer.legal.map((link, i) => (
              <span key={link.href} className="flex items-center gap-3">
                {i > 0 && <span>/</span>}
                <Link href={link.href} className="transition-colors hover:text-fg">
                  {link.label}
                </Link>
              </span>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
