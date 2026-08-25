import { ogImage } from "@/lib/ogImage";

/**
 * The share card, rendered on demand.
 *
 * This is deliberately a route handler rather than the `opengraph-image` file
 * convention. As a convention file it would inject itself as `og:image` on `/`
 * and win over the static card `buildMetadata` advertises, which is the
 * opposite of what we want: the extensionless, per-request URL is the one some
 * unfurlers choke on. Kept alive so links already cached against
 * `/opengraph-image` by a crawler still resolve — the card people see today is
 * `public/teracode-og-1200x630.png`, and these pixels no longer match it.
 */
export function GET() {
  return ogImage();
}
