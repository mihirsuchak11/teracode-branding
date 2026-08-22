# 003 — Add motion tokens and button press feedback

- **Status**: TODO
- **Commit**: ce68c0a
- **Severity**: MEDIUM
- **Category**: Physicality & origin
- **Estimated scope**: 2 files (`src/app/globals.css`, `src/components/ui/Button.tsx`) plus two hero `<a>`s that duplicate the button classes

## Problem

Pressable controls have color hover only. Nothing scales on `:active`. The
catalog’s press feedback is `transform: scale(0.97)` with
`transition: transform 160ms ease-out`.

```34:34:src/components/ui/Button.tsx
  const cls = `inline-flex items-center justify-center gap-2 rounded-btn transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`;
```

The same pattern is copy-pasted on the homepage hero (not using `Button`):

```43:52:src/components/sections/Hero.tsx
          <a
            href={hero.primary.href}
            className="inline-flex h-10 items-center rounded-lg bg-fg-soft px-4 text-sm font-medium leading-5 text-[#1c1917] transition-colors hover:bg-fg"
          >
            {hero.primary.label}
          </a>
          <a
            href={hero.secondary.href}
            className="inline-flex h-10 items-center rounded-lg bg-[#1c1917] px-4 text-sm font-medium leading-5 text-fg-soft transition-colors hover:bg-border-strong"
          >
```

and the header CTA:

```158:161:src/components/layout/Header.tsx
          <a
            href={nav.cta.href}
            className="inline-flex items-center rounded-lg bg-fg-soft p-2 transition-colors hover:bg-fg"
          >
```

There are no shared motion tokens. UI code uses Tailwind defaults or
`"easeOut"` strings; marketing reveals keep a different house curve
(`[0.12, 0.23, 0.5, 1]`). That house curve is settled — do not replace it.
Add tokens for **UI** only.

## Target

In `src/app/globals.css` `@theme { … }`, after the radius tokens
(`--radius-btn` / `--radius-card`), add:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
--duration-press: 160ms;
```

These values are the audit catalog verbatim. Tailwind v4 `@theme` exposes
them as `ease-out`, `ease-in-out`, `ease-drawer`, `duration-press`.

`Button` class string — colors stay 200ms with default `ease` (hover/color
change). Transform is 160ms ease-out. Press scale 0.97. No hover-grow.

```tsx
const cls = `inline-flex items-center justify-center gap-2 rounded-btn cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-[color,background-color,transform] duration-200 ease-out active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 ${variants[variant]} ${sizes[size]} ${className}`;
```

`duration-200` applies to color. Override transform:

```css
/* if Tailwind cannot split durations cleanly, use an arbitrary property on Button: */
[style is wrong — use class instead]
```

Prefer this exact class list on `Button`:

```
transition-[color,background-color] duration-200
[transition-property:transform] duration-press ease-out
active:scale-[0.97]
motion-reduce:active:scale-100
```

If `duration-press` does not generate (theme token name), use
`duration-[160ms]` and `ease-[cubic-bezier(0.23,1,0.32,1)]`.

Do **not** add `hover:scale-*`.

Hero/header raw `<a>`s that share the same visual: add
`active:scale-[0.97] duration-[160ms] ease-[cubic-bezier(0.23,1,0.32,1)]`
and `motion-reduce:active:scale-100` next to their existing
`transition-colors`. Also add `transition-transform` so scale is on-GPU.

## Repo conventions to follow

- Tokens live in `src/app/globals.css` `@theme` — that is where
  `--radius-btn` already lives (`src/app/globals.css:35`).
- Do not touch `[data-chromatic]` or `Reveal` easings.
- Color hover on buttons may stay ungated; only gate **transform** hover
  if you add any (you must not add hover scale).

## Steps

1. Add the four tokens to `@theme` in `src/app/globals.css`.
2. Update `src/components/ui/Button.tsx` `cls` as specified.
3. Add the same press classes to the two hero links in
   `src/components/sections/Hero.tsx` and the header CTA in
   `src/components/layout/Header.tsx`.

## Boundaries

- Do NOT restyle colors, radii, or type.
- Do NOT add `whileTap` / Framer Motion to `Button` (it is a server
  component today — keep it that way).
- Do NOT change marketing reveal curves.
- Do NOT add a new dependency.

## Verification

- **Mechanical**: `npx eslint src/components/ui/Button.tsx src/components/sections/Hero.tsx src/components/layout/Header.tsx` exits 0.
- **Feel check**:
  - Press Get early access: the chip scales to ~0.97 and returns in ~160ms,
    starting immediately (ease-out), no bounce.
  - Spam-press: CSS transition retargets; it never restarts from 0.
  - Animations panel at 10%: only `transform` and color, no `width`/`padding`.
  - Emulate reduced motion: scale does not run; color hover may remain.
- **Done when**: every `Button` and the three listed CTAs scale to 0.97 on
  `:active` in 160ms with `cubic-bezier(0.23, 1, 0.32, 1)`.
