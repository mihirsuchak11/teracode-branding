# Animation plans

Written by `/improve-animations` against commit `ce68c0a`.
Personality: crisp dark SaaS marketing site (Strand port). Scroll-reveal
easings `[0.12, 0.23, 0.5, 1]` and Framer-ported loops (AskChatAnim,
FooterWordmark spring, Lenis 1.2s) are settled — do not replace them.

| # | Title | Severity | Status | Depends on |
| --- | --- | --- | --- | --- |
| 001 | Gate GPGPU fields on reduced motion | HIGH | TODO | — |
| 002 | Header chrome: no height, origin, reduced motion | HIGH | TODO | 003 tokens (optional) |
| 003 | Add motion tokens and button press feedback | MEDIUM | TODO | — |
| 004 | FAQ accordion without height and without reduced-motion | MEDIUM | TODO | 003 tokens (optional) |
| 005 | Replace `transition-all` on the blog index arrow | HIGH | TODO | — |

## Execution order

003 (tokens) → 002 and 004 (they can hardcode the same cubic-bezier if 003 is not merged yet) → 001 → 005.

001 is independent and the highest accessibility/GPU win. 005 is a one-liner.

## Settled — do not re-open

- `Reveal` / chromatic CSS (`0.4s` + `[0.12, 0.23, 0.5, 1]`) — Strand appear config
- `FooterWordmark` spring `{ bounce: 0.2, duration: 1 }` — documented house reveal
- `AskChatAnim` 12s variant machine — verbatim Framer port
- `SmoothScroll` Lenis `duration: 1.2` — original intensity
- Chromatic `--e` driving child layers — original RGB split
