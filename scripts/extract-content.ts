/**
 * Dumps text/structure from the scraped Framer HTML files into content-dump/*.json
 * for reference while transcribing content into src/content modules.
 *
 * Usage: npx tsx scripts/extract-content.ts
 */
import * as cheerio from "cheerio";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const SCRAPE = "/Users/mihirsuchak/Downloads/scraped-1787202851051";
const OUT = join(import.meta.dirname, "..", "content-dump");

const PAGES: Record<string, string> = {
  home: "index.html",
  "about-us": "about-us",
  careers: "careers",
  changelog: "changelog",
  "contact-us": "contact-us",
  integrations: "integrations",
  pricing: "pricing",
  "privacy-policy": "privacy-policy",
  "terms-of-service": "terms-of-service",
  "404": "404",
  "features-ask": "features/ask",
  "features-cortex": "features/cortex",
  "features-pulse": "features/pulse",
};

type Node = { tag: string; text?: string; href?: string; src?: string; alt?: string };

mkdirSync(OUT, { recursive: true });

for (const [name, rel] of Object.entries(PAGES)) {
  let html: string;
  try {
    html = readFileSync(join(SCRAPE, rel), "utf8");
  } catch (e) {
    console.error(`SKIP ${rel}: ${(e as Error).message}`);
    continue;
  }
  const $ = cheerio.load(html);
  const nodes: Node[] = [];
  const seen = new Set<string>();

  $("h1,h2,h3,h4,h5,h6,p,a,li,button,figcaption,img").each((_, el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === "img") {
      const src = $(el).attr("src") ?? "";
      if (!src.startsWith("http")) return;
      const key = `img:${src.split("?")[0]}`;
      if (seen.has(key)) return;
      seen.add(key);
      nodes.push({ tag, src: src.split("?")[0], alt: $(el).attr("alt") ?? "" });
      return;
    }
    // own visible text (skip wrappers that only contain other block elements)
    const text = $(el).text().replace(/\s+/g, " ").trim();
    if (!text || text.length > 1500) return;
    const href = tag === "a" ? $(el).attr("href") : undefined;
    // dedupe desktop/mobile duplicate DOM by normalized tag+text
    const key = `${tag}:${text.toLowerCase()}${href ?? ""}`;
    if (seen.has(key)) return;
    // avoid parents swallowing children: only keep p/li/a/button whose direct text differs from a child block
    if (["p", "li", "a", "button"].includes(tag) && $(el).find("h1,h2,h3,p").length > 0) return;
    seen.add(key);
    nodes.push({ tag, text, ...(href ? { href } : {}) });
  });

  const title = $("title").first().text();
  const appearCount = $("[data-framer-appear-id]").length;
  writeFileSync(
    join(OUT, `${name}.json`),
    JSON.stringify({ page: rel, title, appearCount, nodes }, null, 2)
  );
  console.log(`${name}: ${nodes.length} nodes, ${appearCount} appear-anims`);
}
