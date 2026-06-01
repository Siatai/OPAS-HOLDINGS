---
name: Sharkon font text clipping & marquee
description: Why variable-length text in the Sharkon display font clips, and how the app handles it (clamp/line-clamp for descriptions, MarqueeText scroll for titles).
---

# Sharkon display font is unusually wide — variable text clips easily

The Opas Holdings app renders display/title text in a custom font "Sharkon" via the
`SHARKON` style const (e.g. `{ fontFamily: "Sharkon, ..." }`). Sharkon glyphs are
much wider than a normal sans, so any dynamic/variable-length string (city names,
asset/property titles, category labels) overflows narrow or fixed-width containers —
especially mobile cards (`w-[150px]`, `w-[260px]`, `grid-cols-2`).

## Scope: this is a PROJECT-WIDE rule (user was emphatic)
EVERY single-line title/name/label that would otherwise clip (`truncate`),
scale-to-fit (`clamp()` font-size keyed to content length / viewport), or
break mid-word (`break-words`/`[overflow-wrap:anywhere]`/`hyphens`) inside a
constrained component MUST use `MarqueeText` instead. The user explicitly does
NOT want wrap-or-scale; they want scroll-on-overflow. When auditing, sweep ALL
of: Properties, Hero, Marketplace, Portfolio, Dashboard, CityPage (and any new
component). Re-run the sweep after edits: `rg -n "truncate|clamp\(|break-words"
src --glob '*.tsx'`.

## CRITICAL: MarqueeText overflow detection must NOT use scrollWidth on inline spans
The measure span is inline phrasing content (so MarqueeText is valid inside
h3/h4/a/span). `element.scrollWidth`/`clientWidth` return **0 on inline
elements**, so `overflow = measure.scrollWidth - container.clientWidth` was
always negative → `shift` stayed 0 → it NEVER animated and text just got
clipped by the root's `overflow-hidden` (clip WITHOUT ellipsis — looked like a
plain cut-off title, e.g. "SOUTH BEA").
**Why:** symptom is sneaky — looks identical to a missing marquee, and a quick
"no ellipsis" visual check passes. **How to apply:** measure container via
`clientWidth` (root is `display:block`, reliable) but measure CONTENT via
`measureRef.getBoundingClientRect().width` (works for inline). Also make the
measure span `inline-block`. Re-measure on web-font swap: the wide display
fonts (SHARKON etc.) load after first paint and widen text — listen to
`document.fonts` `loadingdone` + `document.fonts.ready`, plus a few delayed
timeouts and a rAF, not just one synchronous measure.

## Pages must open at the top (Wouter)
Wouter does NOT reset scroll on route change. A `<ScrollToTop>` component
(`useLocation` effect → `window.scrollTo(0,0)`) is mounted inside `<WouterRouter>`
in App.tsx. It keys on pathname only, so in-page hash anchors (e.g. #rentals)
still work.

## Layout pattern for icon/title/badge rows
When a heading sits in a flex row next to an icon and/or a badge/count, give
MarqueeText `className="min-w-0 flex-1"`, the row `min-w-0`, and the icon/badge
`shrink-0`. This lets MarqueeText measure the correct available width and keeps
the badge inline (instead of forcing block-full-width that pushes it to a new
line). Drop any `flex-wrap` on that row.

## Intentionally KEEP `truncate` (do NOT marquee)
- Numeric stat VALUES (`fmtUsd`/`fmtUsdCompact`/percent/counts/P&L) — never
  meaningfully overflow.
- Codes/IDs: wallet address slices, asset token codes (e.g. `prop.token`) —
  treat like numerics.

## Fluid hero headlines
A small multi-line marketing hero headline with an explicit `<br>` (e.g. Hero
"Own anything, / anywhere.") is NOT a clip case — just swap any `clamp()` for
fixed breakpoint sizes (`text-2xl sm:text-3xl md:text-[..]`); do NOT marquee it.

## Handling, by text type
- **Single-line TITLES / NAMES / labels in components** → use the reusable
  `MarqueeText` component (`src/components/MarqueeText.tsx`): it auto-scrolls
  horizontally ONLY when the text overflows its container, else renders static.
  This is the user's preferred treatment ("scroll animation, not scale").
- **Multi-line descriptive text** (blurbs, specs, activity notes) → `line-clamp-2`
  (wrap up to 2 lines, then ellipsis). Do NOT marquee these.
- **Short numeric stats** (currency via `fmtUsd`/`fmtUsdCompact`, percentages,
  counts) → keep `truncate`; they never actually overflow.

## MarqueeText constraints (don't regress)
- It MUST render `<span>` elements (root span is `display:block` so it fills width
  for overflow measurement). It is dropped inside `<h3>/<h4>/<a>/<span>` (e.g. the
  wouter Link `TitleTag`), so a `<div>` root would be invalid HTML and break the
  font/colour cascade. Keep it phrasing content.
- Colour/font cascade INTO the marquee from the parent (parent sets `style={SHARKON}`
  and text colour / `hover:text-primary`); MarqueeText spans don't set their own.
- Seamless loop = two copies (2nd `aria-hidden`) + translateX by
  `scrollWidth + gap` via CSS var `--marquee-shift`; `.marquee-track` keyframe
  `app-marquee` lives in `index.css`, pauses on hover, disabled under
  prefers-reduced-motion. Re-measures on ResizeObserver + 300ms timeout +
  `document.fonts.ready` (custom fonts load late).

**Why:** the user considers BOTH hard-clipped text and ellipsis-hidden headings a
defect — titles must remain fully readable; scrolling reveals the whole string.

**Note:** an HMR-only "useWallet must be used within a WalletProvider" error in the
console is a pre-existing Fast-Refresh artifact (WalletContext export is HMR-
incompatible), NOT a real runtime bug — ignore it.
