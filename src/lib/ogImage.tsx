import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";
export const OG_ALT = "TeraCodeAI — BYOK multi-agent PR review";

/* The symbol is used rather than the horizontal lockup: the lockup sets its
   wordmark as live SVG <text>, which needs a font at raster time. The mark is
   pure paths, so the wordmark is set here in real type instead. */
const mark = readFileSync(join(process.cwd(), "public", "teracode-symbol-white.svg"));

/**
 * The single source of truth for the share card.
 *
 * Two things render it: `app/opengraph-image.tsx`, which serves it from
 * `/opengraph-image` at request time, and `scripts/generate-og.tsx`, which
 * bakes the identical pixels into `public/og.png`. The static copy is what
 * `buildMetadata` actually advertises — see the note there — so this module
 * exists to keep the two from drifting apart.
 */
export function ogImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          background: "#110f0d",
          padding: "72px 80px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <img
            src={`data:image/svg+xml;base64,${mark.toString("base64")}`}
            width={62}
            height={54}
            alt=""
          />
          <div style={{ fontSize: 40, color: "#fafaf9", letterSpacing: -1 }}>TeraCodeAI</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 72, color: "#fafaf9", letterSpacing: -3, lineHeight: 1.05 }}>
            Ship fast. Ship secure.
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#a6a09b", marginTop: 26 }}>
            Seven products, one platform. Review is live on your keys today.
          </div>
        </div>

        <div style={{ display: "flex", gap: 40, fontSize: 24, color: "#79716b" }}>
          <div style={{ display: "flex", color: "#10ec90" }}>$20 / extra repo</div>
          <div style={{ display: "flex" }}>BYOK</div>
          <div style={{ display: "flex" }}>GitHub App + dashboard</div>
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
