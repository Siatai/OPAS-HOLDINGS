---
name: Opas unified notification feed
description: How the navbar bell + Marketplace inbox stay in sync, and where the swap simulator must live.
---

# Unified notification feed (Opas)

A single attention feed (`AppNotification`) merges two localStorage stores: interest-on-own-listings (href `/marketplace`) and incoming pending swap offers (href `/portfolio`). It backs BOTH the global navbar bell and the Marketplace inbox so the same items surface everywhere.

**Live-update mechanism:** any mutation to the interest/swap store calls `notifyChanged()`, which dispatches a `window` event `"opas:notify"`. Consumers (bell, Marketplace) listen for it (plus a `storage` listener + short poll) and re-read. So a new offer appears instantly without prop drilling.

**Rule — drive simulators from a SINGLE mount.**
The `NotificationBell` is rendered twice in the navbar (desktop + mobile, each shown via responsive CSS), so each has its own listeners/poll. Therefore any timer that *generates* notifications (e.g. `simulateIncomingSwap`) must NOT live in the bell — it would double-fire. Put it in `WalletProvider` (a single provider instance, connection-aware via wagmi `useAccount`).

**Why:** the bell's double mount is a deliberate responsive-layout choice; centralizing generation avoids duplicate seeded data while keeping the bell purely a consumer.

**How to apply:** consumers read via `getNotifications`/`unreadNotificationCount` and may mount multiple times; generators (sim ticks, seeders) belong in one place and just call the store's `write*` which fires `opas:notify`.
