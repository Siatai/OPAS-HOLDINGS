---
name: Navbar overflow fix without touching mobile
description: How to fix desktop Navbar right-edge overflow in Opas without changing the mobile/tablet contract
---

# Navbar right-edge overflow

**Rule:** When the Opas top Navbar overflows on the right (too many items: links +
OpasPriceTag + connected Dashboard/address pill), fix it with *spacing and
conditional visibility*, NOT by shifting the `md`/`lg` show-hide breakpoints.

**Why:** The desktop nav shows at `md` and the hamburger at `md:hidden`. Moving
those to `lg` looks like it fixes desktop, but it silently changes the 768–1023px
tablet experience (desktop-nav → hamburger), which violates the standing "do not
touch mobile UI" constraint. An architect review will (correctly) fail it.

**How to apply:**
- Keep `hidden md:flex` / `md:hidden` exactly as-is (anything `<768` must stay
  byte-for-byte the original mobile code).
- Reclaim width instead: gate the wide `OpasPriceTag withSparkline` behind
  `hidden xl:inline-flex`, use responsive gaps (`gap-4 lg:gap-6 xl:gap-7`), and
  keep the connected cluster compact (`px-3.5 py-1.5`, `gap-1.5`).
- The connected Dashboard + address cluster is "metallicized" by wrapping it in a
  `metallic-border rounded-lg` pill with `metallic-text` on the label/address and
  `btn-metal-silver` buttons (all classes already in index.css).
- The CONNECTED cluster is the widest state. Two must-dos so the wallet address
  never wraps to 2 lines / clips at the right corner: (1) `whitespace-nowrap` +
  `leading-none` on both pill buttons and `shrink-0` on the pill so flex can't
  squeeze them; (2) hide the wide price ticker earlier when connected —
  `isConnected ? "hidden 2xl:inline-flex" : "hidden xl:inline-flex"` — to reclaim
  the width the Dashboard+address need.
- Loader replays ~4s on every load, so the screenshot tool always catches it —
  verify Navbar/Hero via `runTest` with a ~6s wait, not the screenshot tool.
