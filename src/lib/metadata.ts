import type { Metadata } from "next";

/**
 * Canonical origin for this site. Feeds `metadataBase` (canonical + OpenGraph
 * URLs), `robots.txt`, `sitemap.xml` and the JSON-LD graph, so it has to be a
 * host that actually resolves — `teracodeai.com` is NXDOMAIN today, which made
 * every canonical, OG and sitemap URL point at a dead domain, and left the
 * legal pages the product app links to unreachable. Set
 * `NEXT_PUBLIC_SITE_URL=https://teracodeai.com` once the apex domain has DNS.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://teracode-site.vercel.app";
export const SITE_NAME = "TeraCodeAI";

export function buildMetadata({
  title,
  description,
  path = "/",
  brandSuffix = true,
}: {
  title: string;
  description: string;
  path?: string;
  /** Set false when `title` already carries the brand. */
  brandSuffix?: boolean;
}): Metadata {
  const fullTitle = path === "/" || !brandSuffix ? title : `${title} — ${SITE_NAME}`;
  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE_URL),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
