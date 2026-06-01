---
name: Opas slide-deck header/footer chrome
description: Convention for the shared SlideHeader/SlideFooter across the three Opas decks and which slides get it.
---

# Opas deck chrome (SlideHeader / SlideFooter)

Each of the three Opas decks (investor / customer / overview) has an identical
`src/components/Chrome.tsx` exporting `SlideHeader` (logo + "OPAS HOLDINGS"
wordmark left; gold section number + uppercase label right) and `SlideFooter`
(gold diamond + note left; "NN / 08" page number right).

**Rule — which slides get chrome:**
- Interior content slides get both `SlideHeader` and `SlideFooter`.
- **Bookend slides carry their own bespoke bottom branding lockup** (big OPAS
  wordmark, contact/url block, taglines). On these, the shared chrome is OMITTED
  to avoid duplicated/overlapping branding; instead the existing lockup stays and
  the cover logo is enlarged (`h-[9vh]`).
  - Pure cover (position 1) and pure "thank you" closing (position 8 in customer
    & overview): omit BOTH header and footer.
  - A content-heavy final slide (e.g. investor `Ask.tsx`, position 8: raise +
    use-of-funds) KEEPS `SlideHeader` (it reads as a content slide) but omits
    `SlideFooter` because it has a bottom contact lockup.

**Why:** adding the shared footer on top of bespoke bottom lockups produced
visible duplicate "opasholdings.com" / "Strictly private & confidential" lines
and overlapping page numbers. Covers/closings being unnumbered is standard.

**How to apply:** when adding/editing a slide, decide by whether it has its own
bottom branding lockup, not purely by position. Keep the three decks' chrome
identical except the `SlideFooter` `note` default (investor = "Strictly private
& confidential"; customer/overview = "opasholdings.com").

**Brand language also lives in `src/data/slides-manifest.json` `description`
fields** — these are NOT rendered into slides/PPTX, but still scrub forbidden
terms ("fractional", bare "share"/"stake"; only "co-ownership stake" allowed).
