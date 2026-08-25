/**
 * Bakes the generated card into `public/og.png`.
 *
 * Running this does NOT change the site's share image. `buildMetadata`
 * advertises the designed `public/teracode-og-1200x630.png`; this only
 * refreshes the older generated copy, which exists so a link a crawler cached
 * against `/og.png` still resolves. To change what people see when they paste a
 * link, replace the designed PNG.
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
