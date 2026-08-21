import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://strand.example.com";
export const SITE_NAME = "Strand";

export function buildMetadata({
  title,
  description,
  path = "/",
}: {
  title: string;
  description: string;
  path?: string;
}): Metadata {
  const fullTitle = path === "/" ? title : `${title} — ${SITE_NAME}`;
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
      images: [{ url: "/images/hcH4DnsAZpvFOzdaEnJi8Pk094.png", width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: ["/images/hcH4DnsAZpvFOzdaEnJi8Pk094.png"],
    },
  };
}
