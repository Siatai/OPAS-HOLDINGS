---
name: "mobile untouched" needs render-gating, not just CSS hide
description: When a change must leave mobile byte-for-byte unchanged AND fetch nothing extra, gate the JSX render by viewport, not with hidden/`hidden xl:block`.
---

# `hidden xl:block` is NOT enough when the requirement is "mobile untouched / no extra fetches"

A Tailwind `hidden` / `hidden xl:block` wrapper only sets `display:none` — the
subtree (including `<img src=...>`) still ships in the DOM, and browsers will
still fetch those images on mobile/tablet. That violates a "mobile must stay
byte-for-byte unchanged" or "no extra bandwidth on small screens" requirement
even though the element is visually absent.

**Rule:** when desktop-only UI must add zero DOM and zero network on smaller
screens, gate the JSX with a JS media-query hook (render `null` below the
breakpoint), don't just CSS-hide it.

**How to apply (this repo):** `src/hooks/use-mobile.tsx` exports
`useMinWidth(px)` (matchMedia-based). `const showX = useMinWidth(1280);` then
`{showX && (<desktop-only JSX/>)}`. Hook returns `false` on first render and
flips after mount — fine here because such hero decals already have entrance
animation delays, so there's no visible pop-in.

**Why:** purely-visual `hidden` left the collage imagery fetching on phones; the
code-review architect flagged it as failing the "mobile untouched" objective.
