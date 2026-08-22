import { SITE_NAME, SITE_URL } from "@/lib/metadata";
import type { FaqItem, FeaturePage } from "@/lib/types";

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

/**
 * Site-wide graph: the company and the site itself.
 *
 * Deliberately omitted:
 * - `sameAs` — the footer's social links currently point at x.com / linkedin.com
 *   / github.com root URLs, not real profiles. Listing those as the company's
 *   verified accounts would be a false claim. Add real profile URLs here and in
 *   `content/site.ts` together.
 * - `foundingDate` — not confirmed.
 */
export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "TeraSoft AI",
      url: SITE_URL,
      /* Raster logo: the generated Apple touch icon, which is a real 180x180 PNG. */
      logo: `${SITE_URL}/apple-icon`,
      brand: { "@type": "Brand", name: SITE_NAME },
      email: "contact@teracode.ai",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "contact@teracode.ai",
        availableLanguage: "English",
      },
    },
    {
      "@type": "WebSite",
      "@id": SITE_ID,
      name: SITE_NAME,
      url: SITE_URL,
      publisher: { "@id": ORG_ID },
      inLanguage: "en",
    },
  ],
};

/** FAQPage, built from the same source the visible accordion renders. */
export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#faq`,
    isPartOf: { "@id": SITE_ID },
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * A product page: the software itself plus a breadcrumb.
 *
 * `offers` is attached only to products that are actually obtainable. Review is
 * in private beta at no platform fee; Migrate and Oncall are not released, so
 * advertising a price for them would be untrue.
 */
export function productJsonLd(feature: FeaturePage, released: boolean) {
  const url = `${SITE_URL}/products/${feature.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#software`,
        name: feature.name,
        url,
        applicationCategory: "DeveloperApplication",
        applicationSubCategory: "Code review",
        operatingSystem: "Web",
        description: feature.heroBody,
        publisher: { "@id": ORG_ID },
        ...(released
          ? {
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
                availability: "https://schema.org/LimitedAvailability",
                description:
                  "Private beta. No platform fee and no per-seat licence — model usage is billed to you directly by your own provider.",
              },
            }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${url}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: feature.name, item: url },
        ],
      },
    ],
  };
}
