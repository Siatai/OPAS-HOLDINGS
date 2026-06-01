---
name: FitText shared-scale group
description: How even/centered stat-tile numerics work in the sexolicious app and the context-loop pitfall to avoid
---

# FitText + FitTextGroup (sexolicious)

Stat tiles (label + Sharkon numeric value) across the app use `FitText` to shrink-to-fit
on one line. To make a ROW of values render at the SAME size (e.g. "$480M","120","18K"),
wrap the row in `<FitTextGroup>` and mark each value `<FitText share>`. The group collects
each child's fit ratio and exposes `scale = min(1, ...ratios)`; all `share` children use it,
so the widest value sets the size for the whole row. Labels stay non-shared (local scale).

Vertical centering: FitText container is `flex items-center` and the inner span uses
`transformOrigin: center` (not top) — otherwise scaled text pins to the TOP of its box and
looks like it's "hiding" with empty space below.

**Why / pitfall:** The measuring `useEffect` must NOT depend on the group context object.
Its identity changes whenever the shared scale changes, and the effect's cleanup calls
`release(id)` + re-`report(id)`, which mutate the group's ratios state → new scale → new
context identity → effect re-runs → infinite "Maximum update depth exceeded" loop. Read the
group via a ref (`groupRef.current`) and keep effect deps to `[min, grouped, id]`.

**How to apply:** Any new stat/KPI row that should look even → wrap in `FitTextGroup`,
add `share` to the value FitTexts only. CSS transforms don't change `offsetWidth`, so
measuring stays loop-free as long as you don't re-subscribe on scale change.
