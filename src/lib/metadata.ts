import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://teracode.ai";
export const SITE_NAME = "TeraCode";

export function buildMetadata({
  title,
  description,
  path = "/",
  brandSuffix = true,
}: {
  title: string;
  description: string;
  path?: string;
  /** Set false when `title` already carries the brand, e.g. "TeraCode Review". */
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
