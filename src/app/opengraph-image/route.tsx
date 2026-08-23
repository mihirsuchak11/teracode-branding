import { ogImage } from "@/lib/ogImage";

/**
 * The share card, rendered on demand.
 *
 * This is deliberately a route handler rather than the `opengraph-image` file
 * convention. As a convention file it would inject itself as `og:image` on `/`
 * and win over the static `public/og.png` that `buildMetadata` advertises,
 * which is the opposite of what we want: the extensionless, per-request URL is
 * the one some unfurlers choke on. Kept alive so links already cached against
 * `/opengraph-image` by a crawler still resolve.
 */
export function GET() {
  return ogImage();
}
