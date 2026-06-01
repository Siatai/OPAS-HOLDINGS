# Opas Properties

Luxury PropTech fractional property investment landing page. Dark navy + amber-gold (#EA8D0E) + electric teal (#0BB5BE). Cinematic, billionaire-grade aesthetic.

## Run & Operate

- `pnpm --filter @workspace/sexolicious run dev` — run the web app (PORT env var)
- `pnpm --filter @workspace/sexolicious run typecheck` — typecheck the app
- Workflow: `artifacts/sexolicious: web`

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- React 18 + Vite + Tailwind CSS v4
- Framer Motion (animations), Wouter (routing), Lucide React (icons)
- No backend — pure static landing page

## Where things live

- `artifacts/sexolicious/src/` — all source code
- `artifacts/sexolicious/src/components/` — all components
- `artifacts/sexolicious/public/fonts/` — 23 local custom font files
- `artifacts/sexolicious/public/` — logo, images, static assets
- `artifacts/sexolicious/src/index.css` — @font-face declarations, CSS variables, Tailwind config
- `artifacts/sexolicious/src/assets/images/` — city property photos (Dubai, London, NYC, etc.)

## Font system

All fonts loaded locally from `public/fonts/`. Font stack:

| Variable          | Font                   | Usage                              |
|-------------------|------------------------|------------------------------------|
| `--app-font-hero`    | DuneRise               | Hero h1, loader "OPAS" title       |
| `--app-font-display` | BankGothic             | Logo wordmark, section h2, buttons |
| `--app-font-sans`    | Neuropol               | Nav links, body text               |
| `--app-font-serif`   | Cormorant Garamond     | Italic subheadings, testimonials   |
| `--app-font-mono`    | Xirod                  | Badges, labels, token codes        |
| `--app-font-label`   | Rostex                 | Stat counter numbers               |

CSS utility classes: `.font-hero`, `.font-display`, `.font-sans`, `.font-serif`, `.font-mono`, `.font-label`

## Components

| Component         | Section                         |
|-------------------|---------------------------------|
| `LoaderScreen`    | Cinematic split-curtain intro   |
| `Navbar`          | Fixed top nav + wallet button   |
| `Hero`            | Full-screen hero + data card    |
| `HowItWorks`      | 4-step protocol flow            |
| `Properties`      | 8 property cards with ROI data  |
| `Stats`           | Animated counters               |
| `Benefits`        | 6 feature cards                 |
| `Testimonials`    | Investor quotes                 |
| `FAQ`             | Accordion FAQ                   |
| `Newsletter`      | Email capture                   |
| `Footer`          | Links + legal                   |
| `WalletContext`   | Wallet modal ("coming soon")    |

## Architecture decisions

- No backend or database — static marketing page only
- Wallet modal shows "coming soon" — no real Web3 integration yet
- All property ROI data is real 2024 data from Knight Frank, JLL, CBRE, Savills
- Custom fonts are self-hosted to avoid Google Fonts dependency for premium fonts
- CSS variables map Tailwind font tokens to actual font families

## Product

Opas Properties is a luxury tokenized-asset investment platform spanning four asset classes: **real estate, supercars, yachts, and private jets**. Users browse curated assets with real yield/ROI data and connect a Web3 wallet to acquire equity interests starting from $100. The site showcases the AI valuation engine, blockchain co-ownership, and 24/7 secondary market capabilities.

- `src/data/assets.ts` is the single source of truth for ALL tokenized assets (real estate flattened from `cities.ts` + curated cars/yachts/jets). `src/lib/portfolio.ts` indexes via `ASSET_INDEX` from there.
- Non-real-estate assets have `city = ""` — any `/city/:id` link must be conditional on a truthy city (see Portfolio + Marketplace).
- Portfolio is a multi-segment view grouped by asset class; Marketplace filters by asset class.

## User preferences

- No "fractional" language — use "equity interest," "co-ownership stake," "ownership interest"
- All amber/gold accent should be #EA8D0E or hsl(35, 92%, 50%)
- Teal secondary: #0BB5BE or hsl(185, 88%, 40%)
- Dark navy background: hsl(222, 47%, 5%)
- Typography must be premium — BankGothic for display, DuneRise for hero

## Gotchas

- `@import` statements in index.css MUST come before all other rules (including @font-face)
- Font files in `public/fonts/` are lowercase with hyphens (renamed for URL safety)
- `.ticker-track` animation class defined in index.css (moved from inline `<style>` tag)
- Screenshot tool always catches the loader animation — this is expected (4s animation on page load)
- `._Dune_Rise.otf` is a macOS metadata file — use `dune_rise.ttf` instead
