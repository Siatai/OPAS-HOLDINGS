---
name: Opas hosting architecture
description: Opas is 4 separate static apps glued by Replit path-routing; matters for deploy/custom-domain/off-Replit hosting questions.
---

# Opas hosting architecture

What looks like one site is **four independent static (frontend-only) artifacts**,
stitched together by Replit's shared path-routing proxy:
- `/` → main app (`sexolicious`)
- `/opas-investor-deck/`, `/opas-customer-deck/`, `/opas-overview-deck/` → 3 slide decks

All four are `serve = "static"` SPAs — **no backend** is required (the api-server
artifact exists but the main site does not call it; the wallet talks directly to
WalletConnect/RPC servers from the browser).

**Why this matters:**
- The hidden `/pitch` chooser links to the decks via absolute `<a href="/opas-*-deck/">`.
  Those paths only resolve because the proxy routes each artifact. Publishing on
  Replit serves all four under one domain automatically.
- **Hosting off Replit** (Netlify/Vercel/etc.) is not "just drop the frontend" — you
  must reproduce the path routing (build all four and place each under its base path,
  or deploy each separately) or the deck links 404. No Render/Node engine needed.
- A custom domain (e.g. opasholdings.com) added to the Replit deployment covers all
  four paths at once — the deck links need no code change since they're root-relative.
