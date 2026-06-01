---
name: Opas (sexolicious) trading simulation — design boundary & accounting rules
description: How the localStorage-backed trading/swap/fee simulation is intended to work, and the invariants that keep P&L consistent.
---

# Opas trading simulation (artifacts/sexolicious)

## Design boundary — single-wallet simulation
The marketplace, swaps, listings, holdings, and activity are a **single-wallet
localStorage simulation**. There is no backend, no multi-user state, no real
counterparty storage. Everything is modeled from the connected wallet's POV.

**Why:** product is a static marketing+demo app; real Web3 wagmi connect exists
but trading is simulated.

**How to apply:** do NOT implement "two-sided cross-wallet settlement" — it is
out of scope by design. A code reviewer flagging "assets only switch on one
side" / "no real counterparty" is over-applying multi-user expectations. Instead
simulate the counterparty: incoming swap offers are *seeded* so the user is
notified to accept; the user's *outgoing* offers are auto-settled by a simulated
order-book filler (a short timer in Portfolio calls `settleOutgoingSwap`).

## Cost-basis invariant (the bug class that caused repeated review FAILs)
Any operation that moves shares out of a holding (listing escrow, swap escrow,
sells, partial fills) MUST move the **proportional slice of `costBasisUsd`** with
those shares — never just decrement `shares`. And any operation that returns
shares (cancel listing/swap) MUST restore the **original** basis that was
escrowed, not a fair-value/ask-derived figure.

**Why:** decrementing shares without adjusting basis (or re-adding at fair value)
silently distorts P&L. This was the root cause flagged across multiple architect
reviews for both `createListing/cancelListing` and the swap path.

**How to apply:**
- Escrow stores the removed basis on the record (`escrowBasisUsd` on `Listing`
  and `SwapOffer`); cancel restores exactly that.
- On a **partial fill** (`buyListing` with `remaining > 0`), scale the remaining
  listing's `escrowBasisUsd` to the unsold fraction, or a later cancel
  over-restores basis.
- Listing/swap lifecycle must be **basis-neutral unless an actual sale occurs**.

## Fees must be economically real, not just displayed
`FEES` is the single source of truth. Current policy: `buySell` 7%, **`trade`/swap
= 0 (FREE)**, `maintenanceMonthly` 5%. A fee that is only shown in UI/logs but
never changes state is a review failure.
**Why:** user removed the swap ("exchange of assets") fee — fees apply only to
deposit (buy 7%), withdrawal (sell 7%), and monthly maintenance (5%).

**How to apply:**
- Buy: buyer cost basis = ask + 7%. Seller activity logs proceeds net of 7%.
- Swap settle: received asset basis = carried/given basis, **no fee added**.
  Settlement must NOT add `offer.feeUsd` — legacy localStorage offers can carry a
  stale non-zero `feeUsd` from when swaps cost 5%; ignore it at settlement so the
  free-swap policy holds for pre-existing pending offers (no migration needed).
- Maintenance: seeded rent activity in `getActivity` is logged **net** of 5%, so
  Dashboard's lifetime "Rent collected" (sum of rent entries) stays consistent
  with `rentalSummary`'s net model. Show gross and net explicitly in UI.
- Reference `FEES`/`FEE_LABEL` in every UI fee label to avoid drift.

## Currency rails (copy/framing only — do NOT convert $ valuations)
Asset valuations stay in USD ($). Settlement rails are framing only: **capital in
= $OPAS**, **yield/sale distributions out = USDT**. Withdraw page (`/withdraw`)
cashes out accumulated USDT proceeds; available = sum(rent+sell usd) − sum(withdraw
usd), clamped ≥0, single-sourced via `proceedsFromActivity(activity)` (and
`proceedsBalance(address)` wrapper) so Dashboard + Withdraw never drift.

## Bids — buy-side offers bounded to ±2% of fair value
A user places a bid to buy shares at a chosen price/share, **constrained to
fairValuePerShare ± 2%** (`BID_VARIANCE`). Single-wallet sim: a simulated seller
fills it via a timer (mirrors the swap settle timer). A filled bid is a purchase
→ charges the 7% buy fee and logs `kind:"buy"` (placement logs `kind:"bid"`).
**Why:** keeps quotes anchored to the real valuation; bids aren't proceeds so
they must not feed `proceedsBalance`.
**How to apply:**
- `validateBid(propertyId, shares, bidPerShare)` is the **single source of truth**
  for validity (finite, positive, within band). It MUST be called in BOTH
  `createBid` AND `settleBid` — re-validate at settlement so a tampered
  localStorage bid (out-of-band price / NaN) can never fill.
- Any new `ActivityKind` (e.g. `"bid"`) must be added to Dashboard `ACT_META`
  or the ledger hits an undefined lookup. Classify in/out in Dashboard's
  isOut/isIn; bid *placement* is neutral (no cash moves until fill).
- Sim fill timers: track handles in a ref Map, dedupe by id, capture a local
  `acct = address`, and clear all on unmount/wallet switch to avoid stale-wallet
  settlement (same pattern as the Portfolio swap timer).

## Live $OPAS/USDT price engine
$OPAS is the trading currency: capital in is paid in $OPAS, distributions/proceeds
settle out in USDT (1 USDT ≈ 1 USD). A client-side **mean-reverting random walk**
(`src/lib/opasPrice.ts`) produces a real-time rate that ticks up/down, shared as a
singleton via `useSyncExternalStore` (`useOpasPrice()`), persisted to localStorage
with a per-day open anchor for the change %.
**Why:** the user wants a visibly live token price and OPAS-denominated trade
amounts; no backend/oracle exists, so it's simulated and must be one shared source.
**How to apply:**
- All USD→OPAS conversions go through `usdToOpas(usd, price)` + `fmtOpas`; never
  divide inline. Show "≈ OPAS required/(max)/in $OPAS" on every trade surface
  (Marketplace buy + bid modals, Portfolio sell modal) using the live `opasPrice`.
- The price is decorative/UX only — it does NOT change share economics. Asset
  totals, fees, costBasis, and proceeds stay USD-based; OPAS is just the displayed
  settlement currency. Do not feed the OPAS rate into portfolio accounting.
- The live pill is `OpasPriceTag`; subpages (Marketplace/Portfolio/Dashboard) each
  render their own header copy of it because `Navbar` only mounts on Home.
- Engine starts its interval on first subscribe and clears it when the last
  listener unsubscribes — keep that lifecycle if refactoring.

## Known non-blocking warning
Console: "Cannot update a component (WalletProvider) while rendering Hydrate" —
expected/benign, do not chase it. Screenshots always catch the 4s intro loader.
