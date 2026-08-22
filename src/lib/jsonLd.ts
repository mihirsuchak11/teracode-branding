import { SITE_NAME, SITE_URL } from "@/lib/metadata";
import type { FaqItem, FeaturePage } from "@/lib/types";

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;

/**
 * Site-wide graph: the company and the site itself.
 *
 * Deliberately omitted:
 * - `sameAs` — no verified public social profiles to claim.
 * - `foundingDate` — not confirmed.
 */
export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: "TeraCodeAI",
      url: SITE_URL,
      logo: `${SITE_URL}/apple-icon`,
      brand: { "@type": "Brand", name: SITE_NAME },
      email: "contact@teracodeai.com",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "contact@teracodeai.com",
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
 * All three pages are facets of the same obtainable product.
 */
export function productJsonLd(feature: FeaturePage, released: boolean) {
  const url = `${SITE_URL}/products/${feature.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "@id": `${url}#software`,
        name: "TeraCodeAI",
        alternateName: feature.name,
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
                price: "20",
                priceCurrency: "USD",
                availability: "https://schema.org/InStock",
                description:
                  "$20 per connected repository per month. The first repository in an organization is free forever. Inference is billed by your own provider.",
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
