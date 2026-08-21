/**
 * Finds all framerusercontent.com image URLs in the scraped HTML, downloads the
 * originals into public/images/, and writes scripts/url-map.json (old -> new).
 *
 * Usage: npx tsx scripts/download-assets.ts
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SCRAPE = "/Users/mihirsuchak/Downloads/scraped-1787202851051";
const PUB = join(import.meta.dirname, "..", "public", "images");
const MAP_PATH = join(import.meta.dirname, "url-map.json");

function* htmlFiles(dir: string): Generator<string> {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    let st;
    try {
      st = statSync(p);
    } catch {
      continue; // permission-denied blobs
    }
    if (st.isDirectory()) yield* htmlFiles(p);
    else if (st.isFile()) {
      try {
        const head = readFileSync(p, { encoding: "utf8" }).slice(0, 200);
        if (head.includes("<!doctype html") || head.includes("<!DOCTYPE html")) yield p;
      } catch {
        /* skip unreadable */
      }
    }
  }
}

const urls = new Set<string>();
for (const f of htmlFiles(SCRAPE)) {
  const html = readFileSync(f, "utf8");
  for (const m of html.matchAll(
    /https:\/\/framerusercontent\.com\/images\/[A-Za-z0-9]+\.(?:png|svg|jpg|jpeg|webp|gif)/g
  )) {
    urls.add(m[0]);
  }
}

console.log(`Found ${urls.size} unique base image URLs`);
mkdirSync(PUB, { recursive: true });

const map: Record<string, string> = {};

async function main() {
let i = 0;
for (const url of [...urls].sort()) {
  const file = url.split("/").pop()!;
  const local = `/images/${file}`;
  const dest = join(PUB, file);
  map[url] = local;
  try {
    if (statSync(dest).size > 0) {
      console.log(`exists ${file}`);
      continue;
    }
  } catch {
    /* not downloaded yet */
  }
  const res = await fetch(url);
  if (!res.ok) {
    console.error(`FAIL ${res.status} ${url}`);
    continue;
  }
  writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  console.log(`${++i} saved ${file} (${res.headers.get("content-length")} bytes)`);
}

writeFileSync(MAP_PATH, JSON.stringify(map, null, 2));
console.log(`Wrote ${MAP_PATH}`);
}

main();
