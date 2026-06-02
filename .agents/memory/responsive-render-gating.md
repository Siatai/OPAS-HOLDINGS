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
`{showX && (<desktop-only JSX/>)}`. The Hero's central ≥1280px decoration uses
this gate (`showCenter`).

**Why:** purely-visual `hidden` left desktop-only decoration (originally an
image collage) fetching/shipping on phones; the code-review architect flagged it
as failing the "mobile untouched" objective.

**Related:** `MarqueeText` has a `desktopStatic` prop built on the same
`useMinWidth(768)` — on desktop it renders plain truncated text instead of the
auto-scroll, while mobile keeps marqueeing. `useMinWidth` initialises its state
synchronously from `matchMedia` (lazy `useState` initialiser) so the first paint
is already correct and there's no flash / pop-in on load.

**History:** the Hero center has been an image collage → flipped-L collage →
(current) abstract metallic "index-core" emblem (SVG rings + dashed spokes +
4 asset-class nodes around an OPAS disc, no imagery). The user dislikes excess
hero motion — keep it settled (entrance fade/scale only, no infinite float).
