---
name: PPTX export does not embed self-hosted fonts
description: Why exported slide PPTX loses custom brand fonts, and how to post-process the .pptx to embed them.
---

The slides `exportSlides({format:"pptx"})` pipeline emits **editable** text runs that reference font-family names (e.g. `typeface="DuneRise"`) but does **not** embed the font binaries. On any machine without those fonts installed, PowerPoint silently substitutes defaults — so self-hosted brand fonts (DuneRise wordmark, Sharkon headings, Nevera body) disappear.

**Why:** dom-to-pptx maps CSS font-family → run typeface only; there is no font-embedding step.

**How to apply — post-process the .pptx (a zip) to add OOXML font embedding:**
1. Fonts must be **TrueType**. Convert any OTF brand fonts to TTF first: `pip install otf2ttf` then `otf2ttf -o Name.ttf src.otf`. PowerPoint embedding does not reliably render CFF/OTF.
2. Add font bytes as `ppt/fonts/fontN.fntdata`.
3. `[Content_Types].xml`: add `<Default Extension="fntdata" ContentType="application/x-fontdata"/>`.
4. `ppt/presentation.xml`: add `embedTrueTypeFonts="1"` on `<p:presentation>`, and insert a `<p:embeddedFontLst>` (with one `<p:embeddedFont><p:font typeface="X"/><p:regular r:id="rIdN"/></p:embeddedFont>` per font) **immediately after `</p:notesSz>`** — schema order matters (embeddedFontLst sits after notesSz, before defaultTextStyle).
5. `ppt/_rels/presentation.xml.rels`: add a Relationship per font, `Type=".../relationships/font"`, `Target="fonts/fontN.fntdata"`, with fresh rIds (max existing + 1).
6. The `typeface` in embeddedFontLst must exactly match the `typeface="..."` used in slide runs (scan `ppt/slides/slideN.xml` to find which are actually used; only embed those).

Validate after: zip.testzip() is None, and presentation.xml / rels / Content_Types parse as well-formed XML.

**Caveat:** Google web fonts used in a deck but not self-hosted (e.g. Cormorant Garamond) have no local file to embed — those runs still substitute. Only fonts present on disk can be embedded.
