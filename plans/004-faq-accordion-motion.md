# 004 — FAQ accordion without height and without reduced-motion

- **Status**: TODO
- **Commit**: ce68c0a
- **Severity**: MEDIUM
- **Category**: Performance
- **Estimated scope**: 1 file (`src/components/sections/FaqSection.tsx`)

## Problem

FAQ rows animate `height: "auto"` (layout thrash) and have no reduced-motion
branch. The dots use Framer `left` (also layout). Built-in `"easeOut"` /
`"easeInOut"` strings, not a token.

```49:56:src/components/sections/FaqSection.tsx
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
```

```17:21:src/components/sections/FaqSection.tsx
          <motion.span
            key={i}
            className="absolute top-0 h-0.5 w-0.5 rounded-[1px] bg-fg-muted"
            animate={{ left: open ? i * 6 : i * 4 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
```

The product mid-accordion already expands without `height`:

```112:115:src/components/sections/FeatureAccordion.tsx
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
            >
```

FAQ should match that interruptible CSS transition (toggles are slammed).
Duration budget for this control: 150–250ms → **200ms**.
On-screen morph: `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);` if you
keep a JS tween; for the CSS grid expand use ease-out
`cubic-bezier(0.23, 1, 0.32, 1)` (entering content).

## Target

Drop `AnimatePresence` + `height` on the answer. Keep the row mounted and
clip with the same grid trick:

```tsx
<div
  className="grid overflow-hidden transition-[grid-template-rows] duration-200 motion-reduce:transition-none"
  style={{
    gridTemplateRows: open ? "1fr" : "0fr",
    transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
  }}
>
  <div className="min-h-0 overflow-hidden">
    <p className="pr-8 pb-8 text-[15px] leading-relaxed text-fg-muted">{item.answer}</p>
  </div>
</div>
```

Always render the answer (for height measure). When closed, `pb-8` on a
clipped child is fine. `aria-hidden={!open}` on the inner paragraph.

Dots: do not animate `left`. Use `transform: translateX(...)` via CSS
transition so it is interruptible and on-GPU:

```tsx
<span
  className="absolute top-0 h-0.5 w-0.5 rounded-[1px] bg-fg-muted transition-transform duration-200 motion-reduce:transition-none"
  style={{
    transform: `translateX(${open ? i * 6 : i * 4}px)`,
    transitionTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
  }}
/>
```

If `003` landed, use `duration-200 ease-out` Tailwind classes instead of the
inline timing function.

Remove unused `AnimatePresence` / `motion` imports if nothing else needs
them.

## Repo conventions to follow

- Exemplar expand: `src/components/sections/FeatureAccordion.tsx:112`.
- Exemplar reduced-motion park: `FeatureAccordion` skips the auto-advance
  timer (`src/components/sections/FeatureAccordion.tsx:85`). FAQ has no
  timer; `motion-reduce:transition-none` is enough — the open state still
  shows the answer (opacity/comprehension stays).
- Do not restyle FAQ type or spacing.

## Steps

1. Rewrite `AccordionItem` body to the grid-template-rows clip. Delete the
   `motion.div` height tween.
2. Rewrite `DotsIndicator` to CSS `translateX` (plain `span`s).
3. Remove dead `framer-motion` imports if unused.

## Boundaries

- Do NOT change FAQ copy, heading, or the blog link.
- Do NOT add auto-advance (that is FeatureAccordion’s job).
- Do NOT add a dependency.
- Do NOT animate `width`, `height`, or `left`.

## Verification

- **Mechanical**: `npx eslint src/components/sections/FaqSection.tsx` exits 0.
- **Feel check**:
  - Toggle a row, then immediately toggle another: the first closes from
    its current height (CSS grid transition retargets), never jumps to 0
    and replays.
  - Animations panel at 10%: `grid-template-rows` and `transform` only.
  - Dots fan from 4px to 6px pitch without sliding as `left`.
  - Emulate reduced motion: answer appears/disappears instantly; no
    translate on the dots.
- **Done when**: `FaqSection.tsx` contains no `height: "auto"` and no
  `animate={{ left`.
