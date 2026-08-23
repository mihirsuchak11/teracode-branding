/**
 * Bakes the share card into `public/og.png`.
 *
 * `app/opengraph-image.tsx` already serves the same pixels from
 * `/opengraph-image`, but that URL carries no file extension and is generated
 * per request. A handful of link unfurlers — WhatsApp among them — are happier
 * with a plain static `.png`, so that is the one `buildMetadata` advertises and
 * this script is how it gets regenerated.
 *
 * Usage: npx tsx scripts/generate-og.tsx   (run from the repo root)
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { ogImage } from "../src/lib/ogImage";

const OUT = join(import.meta.dirname, "..", "public", "og.png");

async function main() {
  const png = Buffer.from(await ogImage().arrayBuffer());
  writeFileSync(OUT, png);
  console.log(`wrote ${OUT} (${(png.length / 1024).toFixed(1)} KB)`);
}

main();
