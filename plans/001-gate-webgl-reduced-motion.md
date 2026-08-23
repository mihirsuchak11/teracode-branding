# 001 — Gate GPGPU fields on reduced motion

- **Status**: TODO
- **Commit**: ce68c0a
- **Severity**: HIGH
- **Category**: Accessibility
- **Estimated scope**: 3 files (`HeroStrands.tsx`, `StrandMorph.tsx`, `ParticleGrid.tsx`)

## Problem

`StrandBurst` already skips the simulation when `prefers-reduced-motion` is on
and shows `/art/cta-burst.png`. The other three WebGL fields do not.

`HeroStrands` (also used by `FeatureStrands` on every product page) always
boots a GPGPU renderer. Reduced-motion users still get a continuous rAF loop
and pointer-reactive strands. There is already a still: `fallbackImage:
"/art/hero-fallback.png"`.

```387:397:src/components/three/HeroStrands.tsx
export function HeroStrands({
  className = "",
  config,
}: {
  className?: string;
  /** Partial overrides merged onto HERO_CONFIG (e.g. a different point cloud). */
  config?: Partial<StrandConfig>;
}) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [failed, setFailed] = useState(false);
  const P = useMemo<StrandConfig>(() => ({ ...HERO_CONFIG, ...config }), [config]);
```

The `useEffect` that constructs `THREE.WebGLRenderer` has no reduced-motion
gate. The failed-state still is only used on WebGL failure:

```858:864:src/components/three/HeroStrands.tsx
  if (failed) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={P.fallbackImage} alt="" aria-hidden className={`${className} object-cover`} />
    );
  }
  return <div ref={mountRef} className={className} aria-hidden />;
```

`StrandMorph` (sticky homepage feature column) is the same: `failed` still
only, fallback `/art/feature-morph-fallback.png`, no `useReducedMotion`.

`ParticleGrid` is skipped by `AskChatAnim` when reduced, but the component
itself will still start WebGL if any future caller forgets. Fallback is
`/art/statement-waves.png`.

## Target

Copy `StrandBurst` exactly:

```359:362:src/components/three/StrandBurst.tsx
  const reduced = useReducedMotion();

  // Reduced motion: skip the whole simulation and show the site's own fallback.
  const enabled = !reduced;
```

```380:382:src/components/three/StrandBurst.tsx
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || !enabled) return;
```

```828:838:src/components/three/StrandBurst.tsx
  if (failed || !enabled) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={fallbackImage}
        alt={fallbackAlt}
        aria-hidden={!fallbackAlt}
        className={`${className ?? ""} object-cover`}
      />
    );
  }
  return <div ref={mountRef} className={className} aria-hidden />;
```

On each of the three files:

- `import { useReducedMotion } from "framer-motion";`
- `const reduced = useReducedMotion(); const enabled = !reduced;`
- Early-return the existing `useEffect` that constructs the renderer when
  `!enabled`.
- Put `enabled` in that effect’s dependency array (same as StrandBurst).
- Render the existing fallback `<img>` when `failed || !enabled`.

Keep opacity/color of the still. Do not add a fade-in on the fallback.

## Repo conventions to follow

- Exemplar: `src/components/three/StrandBurst.tsx:359` and `:828`.
- Existing stills, do not invent new art:
  - HeroStrands: `P.fallbackImage` (`/art/hero-fallback.png`)
  - StrandMorph: `fallbackImage` prop default `/art/feature-morph-fallback.png`
  - ParticleGrid: `fallbackImage` prop default `/art/statement-waves.png`
- `AskChatAnim` already does `{!reduced && <ParticleGrid />}`. Leave that
  guard; the component-level gate is defense in depth.

## Steps

1. `src/components/three/HeroStrands.tsx` — add `useReducedMotion`, `enabled`,
   skip the renderer `useEffect` when `!enabled`, show `P.fallbackImage` when
   `failed || !enabled`.
2. `src/components/three/StrandMorph.tsx` — same pattern with its
   `fallbackImage` prop.
3. `src/components/three/ParticleGrid.tsx` — same pattern with its
   `fallbackImage` prop.

## Boundaries

- Do NOT change shaders, point clouds, or StrandBurst (already correct).
- Do NOT change AskChatAnim’s existing `{!reduced && …}` guard.
- Do NOT add new fallback images.
- Do NOT add dependencies.
- If the renderer effect’s dependency list does not match this commit, STOP.

## Verification

- **Mechanical**: `npx eslint src/components/three/HeroStrands.tsx src/components/three/StrandMorph.tsx src/components/three/ParticleGrid.tsx` exits 0.
- **Feel check**:
  - Default: homepage hero strands still react to the pointer; statement
    wave still swells; feature-column morph still swaps.
  - DevTools → Rendering → emulate `prefers-reduced-motion: reduce`: hero
    shows `/art/hero-fallback.png`, CTA burst still (already), statement
    wave is the still, feature morph is the still. No WebGL canvases in
    those slots (Elements: `img`, not `canvas`).
  - Toggle the emulation off: canvases return without a full refresh if
    the components remount; a refresh is acceptable.
- **Done when**: with reduced motion on, those three fields never construct
  a `WebGLRenderer`.
