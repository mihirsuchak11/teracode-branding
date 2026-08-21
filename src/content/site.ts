import type { NavDropdownItem } from "@/lib/types";

export const nav = {
  features: [
    {
      label: "Cortex",
      description: "Connect and unify data across every source.",
      href: "/features/cortex",
    },
    {
      label: "Ask",
      description: "Query your data in plain language.",
      href: "/features/ask",
    },
    {
      label: "Pulse",
      description: "Detect anomalies before they become problems.",
      href: "/features/pulse",
    },
  ] satisfies NavDropdownItem[],
  resources: {
    support: [
      {
        label: "Developer docs",
        description: "API references, SDKs, and guides.",
        href: "https://www.framer.com/developers/",
      },
      {
        label: "Help Center",
        description: "Tutorials and answers for your team.",
        href: "https://www.framer.com/help/",
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
  cta: { label: "Get started", href: "/pricing" },
};

export const footer = {
  columns: [
    {
      title: "Features",
      links: [
        { label: "Cortex", href: "/features/cortex" },
        { label: "Ask", href: "/features/ask" },
        { label: "Pulse", href: "/features/pulse" },
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
        { label: "Developer docs", href: "https://www.framer.com/developers/" },
        { label: "Help Center", href: "https://www.framer.com/help/" },
        // Intentionally links to a non-route so the styled not-found page renders,
        // matching the original template's footer 404 showcase link.
        { label: "404", href: "/404" },
      ],
    },
    {
      title: "Connect",
      links: [
        { label: "X", href: "https://x.com" },
        { label: "LinkedIn", href: "https://linkedin.com" },
        { label: "GitHub", href: "https://github.com" },
      ],
    },
  ],
  status: { label: "All systems operational", uptime: "99.98% UPTIME" },
  newsletter: { blurb: "Updates on new features and releases.", cta: "Subscribe" },
  legal: [
    { label: "Terms and Conditions", href: "/terms-of-service" },
    { label: "Privacy Policy", href: "/privacy-policy" },
  ],
  copyright: "© 2026 Strand. All rights reserved.",
};

export const ctaBand = {
  title: "Your data, finally connected",
  titleLine1: "Your data,",
  titleLine2: "finally connected",
  primary: { label: "Get started", href: "/pricing" },
  secondary: { label: "Book a demo", href: "/contact-us" },
};
