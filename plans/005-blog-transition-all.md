# 005 — Replace `transition-all` on the blog index arrow

- **Status**: TODO
- **Commit**: ce68c0a
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`src/app/blog/page.tsx`), one class string

## Problem

`transition: all` is always a finding — it animates unintended properties
off-GPU (color, transform, and anything else that changes).

```38:42:src/app/blog/page.tsx
            <ArrowUpRight
              width={16}
              height={16}
              className="hidden self-start text-fg-faint transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg md:block"
            />
```

The intended change is only `transform` (2px nudge) and `color`.

## Target

```tsx
<ArrowUpRight
  width={16}
  height={16}
  className="hidden self-start text-fg-faint transition-[color,transform] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-fg motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:translate-y-0 md:block"
/>
```

- Duration 200ms (small control, hover/color).
- Entering-style nudge uses ease-out `cubic-bezier(0.23, 1, 0.32, 1)`.
- If `003` landed, `ease-out duration-200` is enough.
- Gate the **transform** hover with reduced-motion utilities. Color hover
  may remain (comprehension).
- Optional: wrap the translate classes as
  `@media (hover: hover) and (pointer: fine)` via
  `[@media(hover:hover)_and_(pointer:fine)]:group-hover:translate-x-0.5`
  so touch does not nudge on tap. Prefer this if the class string stays
  readable; otherwise leave hover as-is (color+transform on group-hover
  is a list row, tens/day — the `transition-all` removal is the HIGH fix).

## Repo conventions to follow

- List rows already use `transition-colors` elsewhere (Header dropdown
  links, `src/components/layout/Header.tsx:74`). Match that: name the
  properties.
- Marquee already uses `motion-reduce:animate-none`
  (`src/components/motion/Marquee.tsx:7`).

## Steps

1. Replace the `className` on `ArrowUpRight` in `src/app/blog/page.tsx`
   with the target string.

## Boundaries

- Do NOT change blog layout, excerpts, or routing.
- Do NOT add Framer Motion to this page.
- Do NOT add a dependency.

## Verification

- **Mechanical**: `npx eslint src/app/blog/page.tsx` exits 0.
- **Feel check**:
  - Hover a post on `/blog`: the arrow nudges 2px up-right and the glyph
    lightens in ~200ms, starting immediately.
  - Computed style: `transition-property` is `color, transform`, never
    `all`.
  - Emulate reduced motion: color may still change; the arrow does not
    move.
- **Done when**: `transition-all` is gone from `src/app/blog/page.tsx`.
