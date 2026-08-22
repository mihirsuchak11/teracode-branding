import type { NavDropdownItem } from "@/lib/types";
import { MAIL_ACCESS, MAIL_CONTACT, MAIL_DEMO } from "@/content/home";

export const nav = {
  products: [
    {
      label: "TeraCode Review",
      description: "An AI review board on every pull request.",
      href: "/products/review",
    },
    {
      label: "TeraCode Migrate",
      description: "Carry a codebase-wide migration to done.",
      href: "/products/migrate",
    },
    {
      label: "TeraCode Oncall",
      description: "Triage that reads the trace, not the alert.",
      href: "/products/oncall",
    },
  ] satisfies NavDropdownItem[],
  resources: {
    support: [
      {
        label: "Early access",
        description: "Get TeraCode Review in private beta.",
        href: MAIL_ACCESS,
      },
      {
        label: "Contact us",
        description: "Talk to the team building TeraCode.",
        href: "/contact-us",
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
    { label: "About TeraSoft", href: "/about-us" },
  ],
  cta: { label: "Get early access", href: MAIL_ACCESS },
};

export const footer = {
  columns: [
    {
      title: "Products",
      links: [
        { label: "TeraCode Review", href: "/products/review" },
        { label: "TeraCode Migrate", href: "/products/migrate" },
        { label: "TeraCode Oncall", href: "/products/oncall" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Pricing", href: "/pricing" },
        { label: "About TeraSoft", href: "/about-us" },
        { label: "Careers", href: "/careers" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Blog", href: "/blog" },
        { label: "Integrations", href: "/integrations" },
        { label: "Changelog", href: "/changelog" },
        { label: "Contact", href: "/contact-us" },
      ],
    },
    {
      /* Social profiles are intentionally absent until real handles exist.
         The template shipped x.com / linkedin.com / github.com root URLs as
         placeholders; linking those would send visitors to the wrong company
         (linkedin.com/company/teracode is an unrelated business). */
      title: "Connect",
      links: [
        { label: "contact@teracode.ai", href: MAIL_CONTACT },
        { label: "Get early access", href: MAIL_ACCESS },
        { label: "Contact form", href: "/contact-us" },
      ],
    },
  ],
  status: { label: "Private beta", uptime: "BY INVITATION" },
  newsletter: { blurb: "Updates on what we ship next.", cta: "Subscribe" },
  legal: [
    { label: "Terms and Conditions", href: "/terms-of-service" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
  copyright: "TeraSoft AI builds TeraCode. © 2026. All rights reserved.",
};

export const ctaBand = {
  title: "Private beta is open. Bring your own keys.",
  titleLine1: "Private beta is open.",
  titleLine2: "Bring your own keys.",
  primary: { label: "Get early access", href: MAIL_ACCESS },
  secondary: { label: "Book a demo", href: MAIL_DEMO },
};
