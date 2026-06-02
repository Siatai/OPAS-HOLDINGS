---
name: Wallet connectors (wagmi + WalletConnect)
description: How the Opas wallet supports browser + mobile wallets, and the wagmi typing gotcha when mixing connectors.
---

# Wallet connectors

The Opas wallet uses wagmi. To support wallets installed on a **phone** (not just
browser extensions) it adds a `walletConnect` connector (QR on desktop, deep-link
on mobile) alongside `injected`. The connect modal shows "Connect browser wallet"
only when `window.ethereum` exists, and "Use a mobile wallet" whenever the
walletConnect connector is present; the old "no wallet detected" state shows only
when neither is available.

## WalletConnect needs a project id
- Requires `VITE_WALLETCONNECT_PROJECT_ID` (free, public client id from
  cloud.reown.com). It ships in the client bundle — it is **not** a secret, so it
  lives as a shared env var, not a Replit secret.
- The connector is added **conditionally** — if the env var is unset the app still
  works with injected-only. Never construct `walletConnect()` with an empty
  projectId (it throws at connect time).

## Gotcha: typing a mixed connectors array
**Rule:** annotate the connectors array as `CreateConnectorFn[]` before pushing a
second connector type.
**Why:** TS infers the array element type from the first connector (`injected`),
whose internal `StorageItemMap` differs from `walletConnect`'s, so pushing
walletConnect fails with a long "storage types incompatible" TS2345 error.
**How to apply:** `const connectors: CreateConnectorFn[] = [injected(...)]; if (id) connectors.push(walletConnect(...))`.
