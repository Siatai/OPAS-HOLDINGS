---
name: Sharkon font text clipping
description: Why variable-length text rendered in the Sharkon display font clips on mobile, and the required pattern to avoid it.
---

# Sharkon display font is unusually wide — variable text clips easily

The Opas Holdings app renders display/title text in a custom font "Sharkon" via the
`SHARKON` style const (e.g. `{ fontFamily: "Sharkon, ..." }`). Sharkon glyphs are
much wider than a normal sans, so any dynamic/variable-length string (city names,
asset/property titles, category labels, blurbs) overflows narrow or fixed-width
containers — especially mobile cards (`w-[150px]`, `w-[260px]`, `grid-cols-2`).

**Rule:** for any variable-length text in SHARKON inside a constrained container,
do NOT use single-line `truncate` (hides text behind an ellipsis) or
`whitespace-nowrap` (hard-cuts under `overflow-hidden`). Instead:
- Scale the font with a responsive `clamp()` font-size, and/or
- Allow wrapping with `line-clamp-2` + `leading-tight` (and `break-words` /
  `[overflow-wrap:anywhere]` for single long words).

**Exception:** short numeric stats (currency via `fmtUsd`/`fmtUsdCompact`,
percentages, counts, 1–2 char labels) may keep `truncate` — they never actually
overflow, and `truncate` just guards layout.

**Why:** the user considers BOTH hard-clipped text and ellipsis-hidden text a
defect — long content must remain fully readable (scale to fit, else wrap), only
falling back to ellipsis after 2 wrapped lines.

**How to apply:** whenever adding a new SHARKON title/name/label, assume it can be
long and constrained; reach for `clamp()` + `line-clamp-2` by default. `line-clamp-*`
utilities are available (Tailwind v4).
