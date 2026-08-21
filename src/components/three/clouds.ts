/**
 * Generated 2D point clouds (comma-separated x,y pairs, normalized to ±0.5)
 * for the strand renderer, mirroring the ring/scatter graphics the original
 * used behind the Ask and Pulse sections. Deterministic (seeded) so SSR and
 * client agree.
 */

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function toStr(pairs: number[][]): string {
  return pairs.map(([x, y]) => `${x.toFixed(4)},${y.toFixed(4)}`).join(",");
}

/** A clean ring outline — Ask's chat-prompt halo. */
function ring(count: number, radius: number, jitter: number, seed: number): string {
  const rnd = seeded(seed);
  const pairs: number[][] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    const r = radius + (rnd() - 0.5) * jitter;
    pairs.push([Math.cos(a) * r, Math.sin(a) * r]);
  }
  return toStr(pairs);
}

export const ASK_RING = ring(1000, 0.46, 0.02, 12345);

/** Pulse's scatter — a looser, slightly elliptical ring with inner speckle. */
export function pulseCloud(): string {
  const rnd = seeded(67890);
  const pairs: number[][] = [];
  for (let i = 0; i < 900; i++) {
    const a = (i / 900) * Math.PI * 2;
    const r = 0.44 + (rnd() - 0.5) * 0.06;
    pairs.push([Math.cos(a) * r * 1.02, Math.sin(a) * r * 0.92]);
  }
  return toStr(pairs);
}

export const PULSE_SCATTER = pulseCloud();
