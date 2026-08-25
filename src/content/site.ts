import type { NavDropdownItem } from "@/lib/types";
import { APP_LOGIN, APP_START, MAIL_CONTACT } from "@/lib/app";
import {
  applications,
  platform,
  productHref,
  productStatus,
  type Product,
} from "@/content/products";

const productItem = (p: Product): NavDropdownItem => ({
  label: p.name,
  description: `${productStatus[p.status].label} — ${p.tagline}.`,
  href: productHref(p),
});

export const nav = {
  /** Grouped like the catalog: the agents we run, then the platform you build on. */
  products: {
    applications: applications.map(productItem),
    platform: platform.map(productItem),
  },
  resources: {
    support: [
      {
        label: "Start free",
        description: "Sign in and put the army on the first repository.",
        href: APP_START,
      },
      {
        label: "Sign in",
        description: "Already have an org? Open the dashboard.",
        href: APP_LOGIN,
      },
    ] satisfies NavDropdownItem[],
    company: [
      { label: "Integrations", href: "/integrations" },
      { label: "Changelog", href: "/changelog" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact-us" },
    ] satisfies NavDropdownItem[],
  },
  links: [
    { label: "Pricing", href: "/pricing" },
    { label: "About", href: "/about-us" },
  ],
  cta: { label: "Start free", href: APP_START },
};

export const footer = {
  columns: [
    {
      title: "Applications",
      links: applications.map((p) => ({ label: p.name, href: productHref(p) })),
    },
    {
      title: "Platform",
      links: platform.map((p) => ({ label: p.short, href: productHref(p) })),
    },
    {
      title: "Company",
      links: [
        { label: "Pricing", href: "/pricing" },
        { label: "About", href: "/about-us" },
        { label: "Careers", href: "/careers" },
        { label: "Blog", href: "/blog" },
        { label: "Integrations", href: "/integrations" },
        { label: "Changelog", href: "/changelog" },
        { label: "Contact", href: "/contact-us" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "Start free", href: APP_START },
        { label: "Sign in", href: APP_LOGIN },
        { label: "Contact", href: MAIL_CONTACT },
        { label: "X", href: "https://x.com/TeraCodeAI" },
        { label: "LinkedIn", href: "https://www.linkedin.com/company/139374388" },
        { label: "Facebook", href: "https://www.facebook.com/profile.php?id=61593670505385" },
      ],
    },
  ],
  /* Not an uptime claim. The dashboard does not publish a status page. */
  status: { label: "GitHub App + dashboard", uptime: "BYOK" },
  newsletter: { blurb: "Product notes when we have them.", cta: "Subscribe" },
  legal: [
    { label: "Terms and Conditions", href: "/terms-of-service" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
  copyright: "© 2026 TeraCodeAI. All rights reserved.",
};

export const ctaBand = {
  title: "Put the army on one repository. It stays free.",
  titleLine1: "Put the army on one repository.",
  titleLine2: "It stays free.",
  primary: { label: "Start free", href: APP_START },
  secondary: { label: "See pricing", href: "/pricing" },
};
