/**
 * Samples `public/teracode-symbol.svg` into a strand-root point cloud for the
 * hero's GPGPU strand renderer, writing `src/components/three/logoPoints.ts`.
 *
 * The symbol is three filled paths (slash, bar, "C" ring) where the ring is
 * masked by a polygon cut. We flatten the paths (M/L/A/Z only) to polygons,
 * then emit dense points along the outlines plus a lighter interior fill so the
 * mark stays readable once each root is extruded into a strand.
 *
 * Run: node scripts/generate-logo-points.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/* ---------- tuning ---------- */
const OUTLINE_SPACING = 2.6; // user units between outline samples
const FILL_SPACING = 7.5; // grid pitch for interior fill
const FILL_JITTER = 0.45; // fraction of pitch
const ARC_SEGMENTS_PER_RAD = 14;
const TARGET_SPAN = 0.95; // longest axis maps to this (points land in ±0.5)

/* ---------- deterministic RNG so reruns are stable ---------- */
let seed = 0x2f6e2b1;
const rnd = () => {
  seed ^= seed << 13; seed >>>= 0;
  seed ^= seed >> 17;
  seed ^= seed << 5; seed >>>= 0;
  return seed / 0xffffffff;
};

/* ---------- path -> polygon ---------- */
function arcToPoints(x0, y0, rx, ry, phiDeg, largeArc, sweep, x1, y1) {
  const phi = (phiDeg * Math.PI) / 180;
  const cosP = Math.cos(phi), sinP = Math.sin(phi);
  const dx2 = (x0 - x1) / 2, dy2 = (y0 - y1) / 2;
  const x1p = cosP * dx2 + sinP * dy2;
  const y1p = -sinP * dx2 + cosP * dy2;
  rx = Math.abs(rx); ry = Math.abs(ry);
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) { const s = Math.sqrt(lambda); rx *= s; ry *= s; }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  let coef = Math.sqrt(Math.max(0, num / den));
  if (largeArc === sweep) coef = -coef;
  const cxp = (coef * rx * y1p) / ry;
  const cyp = (-coef * ry * x1p) / rx;
  const cx = cosP * cxp - sinP * cyp + (x0 + x1) / 2;
  const cy = sinP * cxp + cosP * cyp + (y0 + y1) / 2;
  const ang = (ux, uy, vx, vy) => {
    const dot = ux * vx + uy * vy;
    const len = Math.hypot(ux, uy) * Math.hypot(vx, vy);
    let a = Math.acos(Math.min(1, Math.max(-1, dot / len)));
    if (ux * vy - uy * vx < 0) a = -a;
    return a;
  };
  const theta0 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dTheta = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!sweep && dTheta > 0) dTheta -= 2 * Math.PI;
  if (sweep && dTheta < 0) dTheta += 2 * Math.PI;
  const steps = Math.max(8, Math.ceil(Math.abs(dTheta) * ARC_SEGMENTS_PER_RAD));
  const out = [];
  for (let i = 1; i <= steps; i++) {
    const t = theta0 + (dTheta * i) / steps;
    const px = cosP * rx * Math.cos(t) - sinP * ry * Math.sin(t) + cx;
    const py = sinP * rx * Math.cos(t) + cosP * ry * Math.sin(t) + cy;
    out.push([px, py]);
  }
  return out;
}

/** Flattens an absolute M/L/A/Z path into a list of closed polygons. */
function flattenPath(d) {
  const tokens = d.match(/[MLAZmlaz]|-?\d*\.?\d+(?:e[-+]?\d+)?/gi) ?? [];
  const polys = [];
  let poly = null;
  let cx = 0, cy = 0, i = 0;
  let cmd = "";
  const num = () => parseFloat(tokens[i++]);
  while (i < tokens.length) {
    if (/[MLAZ]/i.test(tokens[i])) cmd = tokens[i++].toUpperCase();
    if (cmd === "M") {
      cx = num(); cy = num();
      poly = [[cx, cy]];
      polys.push(poly);
      cmd = "L"; // implicit lineto for repeated pairs
    } else if (cmd === "L") {
      cx = num(); cy = num();
      poly.push([cx, cy]);
    } else if (cmd === "A") {
      const rx = num(), ry = num(), rot = num(), la = num(), sw = num();
      const x = num(), y = num();
      for (const p of arcToPoints(cx, cy, rx, ry, rot, la, sw, x, y)) poly.push(p);
      cx = x; cy = y;
    } else if (cmd === "Z") {
      poly = null;
    } else {
      i++; // unsupported command: skip a token rather than loop forever
    }
  }
  return polys.filter((p) => p && p.length > 2);
}

const pointInPoly = (x, y, poly) => {
  let inside = false;
  for (let a = 0, b = poly.length - 1; a < poly.length; b = a++) {
    const [xa, ya] = poly[a], [xb, yb] = poly[b];
    if (ya > y !== yb > y && x < ((xb - xa) * (y - ya)) / (yb - ya) + xa) inside = !inside;
  }
  return inside;
};

/* ---------- read the symbol ---------- */
const svg = readFileSync(resolve(root, "public/teracode-symbol.svg"), "utf8");
const ds = [...svg.matchAll(/<path[^>]*\bd="([^"]+)"/g)].map((m) => m[1]);
const masked = [...svg.matchAll(/<path([^>]*)\bd="([^"]+)"/g)].map((m) => /mask=/.test(m[1]));
if (ds.length !== 3) throw new Error(`expected 3 paths in the symbol, found ${ds.length}`);

const maskPts = (svg.match(/<polygon[^>]*points="([^"]+)"/) ?? [])[1]
  ?.trim()
  .split(/\s+/)
  .map((p) => p.split(",").map(Number));
if (!maskPts) throw new Error("mask cut polygon not found");

const shapes = ds.map((d, idx) => ({ polys: flattenPath(d), cut: masked[idx] }));

/** Inside the mark: inside any shape's contours (even-odd) and outside its cut. */
const inShape = (x, y, shape) => {
  let inside = false;
  for (const poly of shape.polys) if (pointInPoly(x, y, poly)) inside = !inside;
  if (!inside) return false;
  if (shape.cut && pointInPoly(x, y, maskPts)) return false;
  return true;
};
const inMark = (x, y) => shapes.some((s) => inShape(x, y, s));

/* ---------- sample ---------- */
const pts = [];

// Outlines: walk every edge, dropping samples that the mask cut removed.
for (const shape of shapes) {
  for (const poly of shape.polys) {
    for (let a = 0; a < poly.length; a++) {
      const [x0, y0] = poly[a];
      const [x1, y1] = poly[(a + 1) % poly.length];
      const len = Math.hypot(x1 - x0, y1 - y0);
      const steps = Math.max(1, Math.round(len / OUTLINE_SPACING));
      for (let s = 0; s < steps; s++) {
        const t = s / steps;
        const x = x0 + (x1 - x0) * t;
        const y = y0 + (y1 - y0) * t;
        if (shape.cut && pointInPoly(x, y, maskPts)) continue;
        pts.push([x, y]);
      }
    }
  }
}

// Interior fill: jittered grid so strands read as a solid mark, not a wireframe.
let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
for (const shape of shapes)
  for (const poly of shape.polys)
    for (const [x, y] of poly) {
      minX = Math.min(minX, x); maxX = Math.max(maxX, x);
      minY = Math.min(minY, y); maxY = Math.max(maxY, y);
    }
for (let y = minY; y <= maxY; y += FILL_SPACING) {
  for (let x = minX; x <= maxX; x += FILL_SPACING) {
    const jx = x + (rnd() - 0.5) * FILL_SPACING * 2 * FILL_JITTER;
    const jy = y + (rnd() - 0.5) * FILL_SPACING * 2 * FILL_JITTER;
    if (inMark(jx, jy)) pts.push([jx, jy]);
  }
}

/* ---------- normalise to the renderer's ±0.5 space ---------- */
let nMinX = Infinity, nMinY = Infinity, nMaxX = -Infinity, nMaxY = -Infinity;
for (const [x, y] of pts) {
  nMinX = Math.min(nMinX, x); nMaxX = Math.max(nMaxX, x);
  nMinY = Math.min(nMinY, y); nMaxY = Math.max(nMaxY, y);
}
const cxN = (nMinX + nMaxX) / 2;
const cyN = (nMinY + nMaxY) / 2;
const scale = TARGET_SPAN / Math.max(nMaxX - nMinX, nMaxY - nMinY);

// Shuffle so the renderer's random threshold thins outline and fill evenly.
for (let i = pts.length - 1; i > 0; i--) {
  const j = Math.floor(rnd() * (i + 1));
  [pts[i], pts[j]] = [pts[j], pts[i]];
}

const flat = pts
  .map(([x, y]) => `${((x - cxN) * scale).toFixed(3)},${((y - cyN) * scale).toFixed(3)}`)
  .join(",");

const file = `/**
 * Strand-root point cloud (x,y pairs) sampled from the TeraCode symbol.
 * Generated by \`node scripts/generate-logo-points.mjs\` — edit that script,
 * not this file.
 */
export const TERACODE_POINTS =
  "${flat}";
`;
writeFileSync(resolve(root, "src/components/three/logoPoints.ts"), file);
console.log(`wrote ${pts.length} points`);
