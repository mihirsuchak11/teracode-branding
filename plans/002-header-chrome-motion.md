# 002 — Header chrome: no height, origin, reduced motion

- **Status**: TODO
- **Commit**: ce68c0a
- **Severity**: HIGH
- **Category**: Performance
- **Estimated scope**: 1 file (`src/components/layout/Header.tsx`)

## Problem

The mobile drawer animates `height: "auto"`. That forces layout + paint +
composite on every open/close (a high-frequency control).

```182:186:src/components/layout/Header.tsx
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
```

The desktop dropdown is closer: `scale: 0.98` is the right physical start
(not `scale(0)`). Two gaps remain:

1. Framer Motion `y` / `scale` shorthands run on the main thread.
2. No `transform-origin` from the trigger — the panel scales from center.
3. No `useReducedMotion`; movement still plays for reduced-motion users.
4. `transition={{ duration: 0.15 }}` uses Motion’s default curve, not a
   strong ease-out.
5. `onMouseEnter` opens the menu on devices that fire false hovers.

```44:48:src/components/layout/Header.tsx
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.15 }}
```

```26:27:src/components/layout/Header.tsx
        onMouseEnter={() => !open && onToggle()}
```

## Target

Values from the audit catalog:

- Enter/exit UI: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1);`
- Dropdown duration: 150–250ms → keep **150ms** (`0.15`)
- Popovers scale from the trigger: `transform-origin: top left` (panel is
  `absolute left-0 top-full` under the label)
- Start scale **0.98** (already correct) + opacity 0 — never `scale(0)`
- Animate `transform` and `opacity` only — no `height`
- Framer Motion: full transform string, not `x`/`y`/`scale`
- Reduced motion: keep opacity, drop movement
- Hover-open only when `(hover: hover) and (pointer: fine)`

Desktop dropdown:

```tsx
const reduced = useReducedMotion();
const easeOut = [0.23, 1, 0.32, 1] as const;

<motion.div
  initial={reduced ? { opacity: 0 } : { opacity: 0, transform: "translateY(8px) scale(0.98)" }}
  animate={reduced ? { opacity: 1 } : { opacity: 1, transform: "translateY(0px) scale(1)" }}
  exit={reduced ? { opacity: 0 } : { opacity: 0, transform: "translateY(8px) scale(0.98)" }}
  transition={{ duration: 0.15, ease: easeOut }}
  style={{ transformOrigin: "24px 0px" }}
  className="absolute left-0 top-full pt-2"
>
```

`24px 0px` is the chevron/label cluster: `p-2` (8px) + half the label hit
area. If the panel’s left edge is already aligned with the trigger, `0px 0px`
(`top left`) is also correct — prefer `top left`.

Mobile nav — AnimatePresence already unmounts it, so **drop height**:

```tsx
<motion.nav
  initial={reduced ? { opacity: 0 } : { opacity: 0, transform: "translateY(-8px)" }}
  animate={reduced ? { opacity: 1 } : { opacity: 1, transform: "translateY(0px)" }}
  exit={reduced ? { opacity: 0 } : { opacity: 0, transform: "translateY(-8px)" }}
  transition={{ duration: 0.2, ease: easeOut }}
  className="overflow-hidden border-t border-border bg-bg md:hidden"
>
```

Hover gate on `Dropdown`:

```tsx
onMouseEnter={() => {
  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
  if (!open) onToggle();
}}
```

Keep `onClick` for keyboard/touch.

## Repo conventions to follow

- If `003` has landed, import/use `--ease-out` from `globals.css` `@theme`
  as `ease-out` in Tailwind or the same `[0.23, 1, 0.32, 1]` tuple.
- `FeatureAccordion` already expands without `height: auto`
  (`grid-template-rows` at `src/components/sections/FeatureAccordion.tsx:112`).
  Mobile header should not invent a second expand strategy — fade+translate
  is enough because the node unmounts.
- `Reveal` (`src/components/motion/Reveal.tsx:23`) is the reduced-motion
  pattern: park, no movement.

## Steps

1. `src/components/layout/Header.tsx` — `"use client"` already present. Import
   `useReducedMotion` from `framer-motion`.
2. In `Header`, `const reduced = useReducedMotion();` and pass `reduced` into
   `Dropdown` as a prop (or call the hook inside `Dropdown` — it is a client
   child; either is fine).
3. Rewrite the desktop `motion.div` to the transform-string + origin target.
4. Rewrite the mobile `motion.nav` to opacity + `translateY` only.
5. Gate `onMouseEnter` with the hover/pointer media query.

## Boundaries

- Do NOT restyle the header, change nav IA, or touch `Button`.
- Do NOT add a new dependency.
- Do NOT animate `height`, `grid-template-rows`, or `max-height` on the
  mobile menu.
- If `Dropdown`’s markup is no longer `absolute left-0 top-full`, STOP and
  re-derive origin.

## Verification

- **Mechanical**: `npx eslint src/components/layout/Header.tsx` exits 0.
- **Feel check**:
  - Desktop: open Products. The panel grows from the top-left of the trigger,
    not the center. Duration ~150ms, starts fast (ease-out). Spam the trigger:
    it retargets (AnimatePresence + transform), never pops from `scale(0)`.
  - DevTools Animations panel at 10%: confirm `translateY` + `scale`, no
    `height` keyframes.
  - Mobile (< md): open the hamburger. The sheet fades/slides 8px; layout
    of the page behind does not reflow mid-animation (no height tween).
  - Emulate reduced motion: menus appear/disappear with opacity only.
  - Touch emulation: tap Products — menu toggles on click, does not stick
    open from a hover ghost.
- **Done when**: no `height` appears in the mobile menu’s motion props, and
  reduced motion drops translate/scale.
