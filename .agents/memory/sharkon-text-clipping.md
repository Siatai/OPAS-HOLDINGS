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
