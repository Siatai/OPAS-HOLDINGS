---
name: Opas multi-asset catalog & wallet gate
description: Architecture of the unified asset catalog and the testing constraint imposed by the Web3 wallet gate in the Opas (sexolicious) artifact.
---

# Unified asset catalog (real estate + cars + yachts + jets)

`src/data/assets.ts` is the single source of truth for ALL tokenized assets. `src/lib/portfolio.ts` indexes via `ASSET_INDEX` from there (NOT from `cities.ts`).

- Non-real-estate assets carry `city = ""` (empty). `ASSET_INDEX` sets `{ city: a.cityId ?? "", prop: a }`.
- **Rule:** any `/city/:id` link MUST be conditional on `city` being truthy. Non-RE assets have no city route — linking them produces a dead `/city/` route. This applies in `Portfolio.tsx` and `Marketplace.tsx` (title links + "view" chevron).
- Asset id namespaces are non-overlapping: real estate `dxb-* ldn-* nyc-*` etc., plus `car-*`, `yacht-*`, `jet-*`.
- Display label falls back `prop.spec ?? prop.subtitle` (RE has subtitle; non-RE has both spec + subtitle).
- NYC city id is `"newyork"` (not `"new-york"`) — seeds must match.

**Why:** the product expanded from RE-only to four asset classes; the conditional-link guard prevents runtime dead routes for non-RE assets.

# Portfolio/Dashboard are un-screenshottable by automated tools

Two compounding gates:
1. App-level 4s intro loader (`LoaderScreen`, no sessionStorage skip) runs on every fresh navigation — the screenshot tool always catches it.
2. Portfolio/Dashboard require a connected Web3 wallet. `WalletContext` connect button is **disabled unless `window.ethereum` (injected EIP-1193) exists**, so the testing subagent cannot connect without injecting a mock provider.

**How to apply:** don't rely on `screenshot`/`runTest` to verify the connected Portfolio. Verify via typecheck + architect review of render-path null-safety, or inject a mock `window.ethereum` if a real e2e is mandatory. The Marketplace (vault listings) renders WITHOUT a wallet, so it's the testable surface — but still behind the loader.
