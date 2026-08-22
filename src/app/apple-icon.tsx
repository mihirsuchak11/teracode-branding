import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export const alt = "TeraCode";

/* The app icon is pure vector paths on its own gradient plate, so it rasterises
   cleanly — no font is needed to render it. */
const icon = readFileSync(join(process.cwd(), "public", "teracode-app-icon.svg"));

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%" }}>
        <img
          src={`data:image/svg+xml;base64,${icon.toString("base64")}`}
          width={180}
          height={180}
          alt=""
        />
      </div>
    ),
    { ...size },
  );
}
