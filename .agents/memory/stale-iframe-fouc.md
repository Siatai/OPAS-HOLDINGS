---
name: Stale canvas iframe vs live render
description: How to verify the real rendered state when the canvas preview looks broken
---

A user-reported "broken/crammed/unstyled" component in the canvas iframe can be a **stale cached frame or flash-of-unstyled-content (FOUC)** the iframe got stuck on — NOT a real code bug. The Opas hero index card looked crammed (collapsed flex/grid, oversized fonts) in the canvas, but the live app rendered it perfectly.

**Why:** the canvas iframe does not always hot-reload after HMR/CSS edits, so it can keep showing an old pre-fix or pre-CSS frame.

**How to verify the real state before editing:**
- The hero card sits below the fold on mobile and behind the skyline; the right-column card also fades in via a Framer entrance animation (delay 0.5s), so a fast screenshot catches it near-invisible.
- The home route always shows a ~3.75s LoaderScreen (`loaded` state in `App.tsx`). To screenshot the real page, temporarily set `useState(true)` for `loaded`, and temporarily set the card's `motion.div` `initial={false}` to skip the entrance fade. Screenshot at desktop (e.g. 1280×760) where the card is in the right column. **Revert both temp changes afterward.**
- After confirming the live app is correct, `restart_workflow` the web service and tell the user to reload the canvas preview.
