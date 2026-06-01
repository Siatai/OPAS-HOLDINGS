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
`FEES` is the single source of truth (`buySell` 7%, `trade`/swap 5%,
`maintenanceMonthly` 5%). A fee that is only shown in UI/logs but never changes
state is a review failure.

**How to apply:**
- Buy: buyer cost basis = ask + 7%. Seller activity logs proceeds net of 7%.
- Swap settle: received asset basis = carried/given basis **+ 5% fee** (so the
  fee lowers future P&L).
- Maintenance: seeded rent activity in `getActivity` is logged **net** of 5%, so
  Dashboard's lifetime "Rent collected" (sum of rent entries) stays consistent
  with `rentalSummary`'s net model. Show gross and net explicitly in UI.
- Reference `FEES` in every UI fee label to avoid drift.

## Known non-blocking warning
Console: "Cannot update a component (WalletProvider) while rendering Hydrate" —
expected/benign, do not chase it. Screenshots always catch the 4s intro loader.
