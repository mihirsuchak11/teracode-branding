import type { NavDropdownItem } from "@/lib/types";
import { APP_LOGIN, APP_START } from "@/lib/app";
import { MAIL_CONTACT } from "@/content/home";

export const nav = {
  products: [
    {
      label: "Multi-agent review",
      description: "Several reviewers on every pull request.",
      href: "/products/review",
    },
    {
      label: "Bring your own key",
      description: "Anthropic or OpenRouter. We take no cut.",
      href: "/products/agents",
    },
    {
      label: "One check each",
      description: "Require the agents you trust to merge.",
      href: "/products/checks",
    },
  ] satisfies NavDropdownItem[],
  resources: {
    support: [
      {
        label: "Start free",
        description: "Sign in and connect the first repository.",
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
      title: "Product",
      links: [
        { label: "Multi-agent review", href: "/products/review" },
        { label: "Bring your own key", href: "/products/agents" },
        { label: "One check each", href: "/products/checks" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "Pricing", href: "/pricing" },
        { label: "About", href: "/about-us" },
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
      /* Social profiles are intentionally absent until real handles exist. */
      title: "Connect",
      links: [
        { label: "Start free", href: APP_START },
        { label: "Sign in", href: APP_LOGIN },
        { label: "contact@teracodeai.com", href: MAIL_CONTACT },
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
  title: "Start on the first repository. It stays free.",
  titleLine1: "Start on the first repository.",
  titleLine2: "It stays free.",
  primary: { label: "Start free", href: APP_START },
  secondary: { label: "See pricing", href: "/pricing" },
};
