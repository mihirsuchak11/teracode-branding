/**
 * ChromaticGlareBand — the original site's "glare".
 *
 * Ported 1:1 from index.html's `framer-13yx5bq-container`: a fixed, 69px-tall,
 * full-width strip pinned to the BOTTOM of the viewport. It holds five stacked
 * `backdrop-filter` layers, each masked by a linear-gradient that sits 20%
 * lower than the one before it, and each running a chromatic-aberration filter
 * whose strength ramps quadratically.
 *
 * This is a SCREEN-SPACE effect, not a per-element one. Nothing here animates.
 * Content looks smeared and blurred because it is physically inside the band
 * while you scroll, and resolves to crisp the moment it travels up and out of
 * it. That is why the effect cannot be faked with a per-element blur: the
 * original's own text reveal is only `opacity 0.001 -> 1` plus a 10px rise.
 *
 * Filter maths (exact, from the scrape). With base unit u = 0.00024 and layer
 * index n = 0..4, in `objectBoundingBox` units (fractions of the strip's width):
 *
 *   split_n = u * (n + 1)^2      -> .00024  .00096  .00216  .00384  .006
 *   blur_n  = split_n            (feGaussianBlur stdDeviation)
 *   shift_n = -split_n * 2 / 3   (the pre-split feOffset nudge)
 *
 * At a 1440px-wide viewport that is roughly 0.35px of RGB separation in the
 * topmost band up to 8.6px in the bottom one.
 */

/** Base separation, in fractions of the band's width. */
const BASE = 0.00024;
const LAYERS = 5;

/** `cr-0` … `cr-4`, matching the original's id scheme closely enough to debug. */
const filterId = (n: number) => `cr-glare-${n}`;

function GlareFilter({ index }: { index: number }) {
  const split = BASE * (index + 1) ** 2;
  const shift = -split * (2 / 3);

  return (
    <filter
      id={filterId(index)}
      x="0%"
      y="0%"
      width="100%"
      height="100%"
      primitiveUnits="objectBoundingBox"
      colorInterpolationFilters="sRGB"
    >
      <feGaussianBlur in="SourceGraphic" stdDeviation={split} result="blurred" />
      <feOffset in="blurred" dx={shift} dy="0" result="shifted" />
      {/* isolate each channel, keeping alpha */}
      <feColorMatrix
        in="shifted"
        type="matrix"
        values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
        result="r"
      />
      <feColorMatrix
        in="shifted"
        type="matrix"
        values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
        result="g"
      />
      <feColorMatrix
        in="shifted"
        type="matrix"
        values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
        result="b"
      />
      {/* red drifts left, blue drifts right, green holds the core */}
      <feOffset in="r" dx={-split} dy="0" result="rOff" />
      <feOffset in="g" dx={0} dy="0" result="gOff" />
      <feOffset in="b" dx={split} dy="0" result="bOff" />
      <feBlend in="rOff" in2="gOff" mode="screen" result="rg" />
      <feBlend in="rg" in2="bOff" mode="screen" />
    </filter>
  );
}

export function ChromaticGlareBand() {
  return (
    <div aria-hidden className="chromatic-glare" data-chromatic-glare>
      <svg width="0" height="0" className="absolute" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {Array.from({ length: LAYERS }, (_, n) => (
            <GlareFilter key={n} index={n} />
          ))}
        </defs>
      </svg>
      {Array.from({ length: LAYERS }, (_, n) => {
        // each layer's mask window starts 20% lower than the previous one
        const start = n * 20;
        const mask =
          `linear-gradient(to bottom, transparent ${start}%, black ${start + 20}%, ` +
          `black ${start + 40}%, transparent ${start + 60}%)`;
        return (
          <div
            key={n}
            className="chromatic-glare__layer"
            style={{
              backdropFilter: `url(#${filterId(n)})`,
              WebkitBackdropFilter: `url(#${filterId(n)})`,
              maskImage: mask,
              WebkitMaskImage: mask,
            }}
          />
        );
      })}
    </div>
  );
}
