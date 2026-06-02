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

## Smooth wrap (avoiding the visible "jump")

A clone-based infinite rail glitches if the seamless wrap (`scrollLeft += copyWidth`) fires **during** an in-flight smooth scroll. Split the work:
- **spotlight** (centre-card class toggle) + a **hard-edge guard** run every rAF on scroll.
- the **graceful re-centre** wrap (pull back toward middle copy once past half a copy) is **debounced ~90ms** to fire only after scroll settles — never mid-animation.
- the hard-edge guard only shifts by one copy when `scrollLeft` is at the very first/last clone (`<=1` or `>= max-1`); those edges line up with identical cards, so the shift is invisible and stops sustained manual drags from hitting a dead edge before the debounced wrap runs.

**Why:** instant repositioning mid smooth-scroll makes the browser visibly jump. Debounce removes autoplay jank; the rAF edge-guard keeps manual scrolling seamless. Use `snap-proximity` (not `snap-mandatory`) so native snap doesn't fight programmatic smooth scrolling.

## Depth-of-field (per-card blur) is JS-driven, NOT a CSS class

The Opas city rail's "centre sharp, edges blurry" look is computed per-card inside
the rAF spotlight handler and written as **inline** `transform`/`filter`/`opacity`
based on each card's distance from rail centre measured in card-steps
(`dist / cardStep`). The 0.5s transition lives on the `.asset-loop-card` base class
so the inline changes animate.

**Why:** a binary `is-center` class (sharp centre + one uniform blur for everyone
else) reads as uneven/accidental — neighbours look as blurred as far cards, and edge
fade overlays make it look worse on wide screens. A continuous distance function
gives a smooth, symmetric falloff that's identical at every breakpoint (because it's
in card-step units, not px).

**How to apply:** control side-card blur/scale from the spotlight JS, not CSS — any
`.asset-loop-card`/`.is-center` filter rules are overridden by the inline styles and
will silently do nothing.

## Depth-of-field: discrete game-style levels + hover-focus (user preference)

The user explicitly preferred a **discrete 3-step** falloff over the earlier
continuous distance function: focused card sharp, immediate neighbours a touch
blurred, everything further out a bit more — and it stops there (capped). Keep the
blur gentle (~1–2px), "like car-select screens in games." Don't reintroduce a
strong continuous falloff.

**Hover shifts the focus:** the sharp card is normally the one nearest rail centre,
but while the pointer hovers a card the focus moves to *it* (it sharpens, its
prev/next take the stepped blur). Implemented by a `hoverRef` that the spotlight
uses as the focus centre instead of `scrollLeft + clientWidth/2`. Hover is detected
by **delegated** `mouseover`/`mouseleave` listeners on the rail (not per-card), and
autoplay is already paused on hover so the focus stays put.

**Why:** continuous + strong blur read as "too much"; discrete steps look
intentional and let the hovered card pop without the rail moving.
