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
(current) abstract metallic "index-core" emblem (SVG rings + gauge bezel +
4 asset-class node chips around an OPAS disc, no imagery). Subtle slow rotations
are OK (radar sweep / dashed orbit, ~22–30s) but NO bobbing/float.

**Radar-sweep node highlighting (current design):** the emblem is a "radar" — a
rotating conic amber beam (leading edge at `from 0deg`, ~8s/rev) that lights up
each asset node ONLY as it crosses. No per-frame JS: each node fires its
highlight on a phase delay = `(angleClockwiseFromTop/360)*PERIOD`, where
`angle = atan2(x-144, -(y-144))` normalized to [0,360) (144 = emblem center in
288 viewBox). All synced effects (center→node emission dot, node ripple, chip
pulse) use `duration: PERIOD`, `repeat: Infinity`, same `delay`, and keyframe
`times` arrays that MUST end at 1. The conic bright stop sits at 0deg so beam
angle == rotation angle, matching the delay formula. Gate is now
`useMinWidth(1535)` (was 1280).

**Gap-centering (don't covered-by-columns):** a `z-[6]` absolute decoration in
the Hero gap will be painted over by the `z-10` columns unless it lives in the
genuinely empty band. The Hero grid is asymmetric (left `col-span-7` copy
`max-w-md`, right `col-span-5` panel `max-w-sm` justify-end) and the Tailwind
`container` caps at 1280 for all 1280–1535 viewports, so the true gap is offset
~+32px right of container-center. Park the emblem at `left-[calc(50%_+_24px)]`
(NOT plain `50%`) so the columns never cover it — raising z over the text is
worse (it would overlap copy). **Tailwind calc arbitrary values need underscores
for spaces**: `calc(50%_+_24px)`; `calc(50%+24px)` emits invalid CSS and the
property is dropped. Continuous rotations use `animate-spin` + inline
`animationDuration` (Tailwind v4 only emits `@keyframes spin` for `animate-spin`,
not `animate-[spin_…]`); add `motion-reduce:animate-none`.
