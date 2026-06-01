---
name: Looping (clone-based) carousel a11y
description: How to keep an infinite/"roundabout" carousel that duplicates cards accessible.
---

# Clone-based infinite carousels must not duplicate interactive controls in the a11y/tab order

When building an infinite "roundabout" loop carousel by rendering the same card
list in multiple identical copies (e.g. 3 clones, scroll parked in the middle copy,
wrap by one copy-width near the edges), the clones contain **duplicate interactive
controls** (buttons/links). Left unhandled, keyboard and screen-reader users hit the
same control N times — a real a11y regression.

**Rule:** keep exactly ONE copy in the tab/AT order. Mark the other copies'
wrappers `aria-hidden`, and set their interactive descendants to `tabIndex={-1}`.

**Why tabIndex=-1 and NOT `inert`:** `inert` also blocks pointer clicks, so a
visible cloned card that happens to scroll to the centre becomes unclickable.
`aria-hidden` + `tabIndex=-1` removes the clone from keyboard/AT navigation while
keeping mouse clicks working on the visible clone.

**How to apply:** thread an `interactive` boolean prop down to the card so the
inner control can toggle `tabIndex`; set `interactive`/un-hidden only on the
canonical (middle) copy.

**Related perf note:** the centre-spotlight effect (toggling an `is-center` class
on the card nearest centre) should be done imperatively in a rAF-throttled scroll
handler, and should only mutate the DOM when the centred element actually *changes*
(track it in a ref) — not re-toggle every card every frame.
