import type { Metadata } from "next";

/**
 * Canonical origin for this site. Feeds `metadataBase` (canonical + OpenGraph
 * URLs), `robots.txt`, `sitemap.xml` and the JSON-LD graph, so it has to be a
 * host that actually resolves. `teracode.ai` is the live apex and the target of
 * the `www` redirect, which makes it the right canonical; the env var stays as
 * an override so preview deploys can point at themselves.
 */
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://teracode.ai";
export const SITE_NAME = "TeraCodeAI";

/**
 * The share card: a designed asset, not a generated one.
 *
 * `src/lib/ogImage.tsx` still renders a card at `/opengraph-image`, and
 * `scripts/generate-og.tsx` still bakes that one into `public/og.png`, but
 * neither is what unfurlers are pointed at any more. Editing the generator no
 * longer changes what anyone sees when they paste a link — replace this file.
 *
 * It stays a plain static `.png` for the reason the generated copy did:
 * `/opengraph-image` is extensionless and rendered per request, and some
 * unfurlers (WhatsApp in particular) are happier with a file.
 */
const OG_IMAGE = {
  url: "/teracode-og-1200x630.png",
  width: 1200,
  height: 630,
  alt: "TeraCode — Ship fast. Ship secure. Every change. An AI reviewer on every pull request, catching bugs and leaks before they merge.",
  type: "image/png",
} as const;

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
    applicationName: SITE_NAME,
    authors: [{ name: SITE_NAME, url: SITE_URL }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "technology",
    keywords: [
      "AI code review",
      "pull request review",
      "AI agents",
      "BYOK",
      "bring your own key",
      "GitHub App",
      "code review automation",
      "AI agent platform",
      "developer tools",
      "TeraCodeAI",
    ],
    alternates: { canonical: path },
    /* Phone-number autolinking mangles version strings and pricing in the copy. */
    formatDetection: { telephone: false, address: false, email: false },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        /* Without max-image-preview:large Google renders a thumbnail crop. */
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      title: fullTitle,
      description,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      /* Every page sets `openGraph`, and Next merges metadata shallowly — a
         page-level `openGraph` replaces the root layout's wholesale, including
         the image the `opengraph-image` file convention injects there. Carrying
         the image here is what keeps `/pricing`, `/blog/*` and the rest from
         unfurling as a bare card. */
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [OG_IMAGE],
    },
  };
}
