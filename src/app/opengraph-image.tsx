import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "TeraCodeAI — BYOK multi-agent PR review";

/* The symbol is used rather than the horizontal lockup: the lockup sets its
   wordmark as live SVG <text>, which needs a font at raster time. The mark is
   pure paths, so the wordmark is set here in real type instead. */
const mark = readFileSync(join(process.cwd(), "public", "teracode-symbol-white.svg"));

export default function OpengraphImage() {
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
            Several reviewers. Your keys.
          </div>
          <div style={{ display: "flex", fontSize: 30, color: "#a6a09b", marginTop: 26 }}>
            One check each. First connected repository free.
          </div>
        </div>

        <div style={{ display: "flex", gap: 40, fontSize: 24, color: "#79716b" }}>
          <div style={{ display: "flex", color: "#10ec90" }}>$20 / extra repo</div>
          <div style={{ display: "flex" }}>BYOK</div>
          <div style={{ display: "flex" }}>GitHub App + dashboard</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
