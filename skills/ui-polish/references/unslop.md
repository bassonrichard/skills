# Unslop checklist

Generated pages share the same tells. Each is small; together they say nobody
looked at this. Go through the page once per section, fix what you find, and
prefer deleting to adding. Items marked † are this skill's own additions;
items marked ‡ come from Charles Liu's published skills (see Provenance).

## Contents
- 1. Delete
- 2. Say something real
- 3. Hierarchy
- 4. Craft details
- 5. States and feedback
- 6. Final check
- Provenance

## 1. Delete

**The test ‡.** For every icon, line, badge, caption, container and word, ask
what breaks if it is gone. "Nothing" means delete it. "It adds interest" and
"it fills space" are not answers. Go round twice, because one deletion exposes
the next. Information people need (a price, a password rule) gets moved or
shrunk, never lost.

- **Filler badges (1).** The pill above the headline: "✨ New", "Now in beta", "AI-powered". Keep one only if it carries real news the reader needs.
- **Redundant labels (2).** Eyebrow text that repeats the heading ("FAQ" above "Questions, answered"), "Features" above an obvious feature grid, captions that restate the image.
- **The random italic word (3).** One word of the headline in italic, serif or gradient for no reason. Set the whole headline in one style; emphasis needs a reason.
- **Monospace as a vibe (4).** Keep mono for code, terminal output, IDs and aligned numbers. Body copy, nav and labels in mono is a costume.
- **Embellishments (13).** Glows, gradient borders, gradient buttons, floating blobs, sparkle icons, "Most popular" ribbons stacked on a card that is already highlighted. Keep what is content or structure.
- **Dividers spacing can replace ‡.** Lists, settings rows and chips rarely need lines; proximity already groups them. Keep lines that help the eye track across a table row.
- **Subtitles that restate the title ‡.** Keep one only if it says something the title can't.
- **Nesting ‡.** A container inside a container inside a card. If an image, map or chart is the content, run it to its parent's edges and delete wrappers until each surface has a job.
- **Two mechanisms for one job ‡.** A progress bar and a step counter, a toast and a visible change, an icon and a label saying the same thing. Keep the better one.
- **Decorative motion ‡.** See "Should it move at all?" in `motion.md`.

## 2. Say something real

- **Specific headline (9).** Replace the slogan with what the product does for whom: "Curiosity, meet clarity." → "Cited answers from papers." Test: could a competitor use this headline unchanged? If yes, rewrite it. Use only facts you have; where the specifics are unknown, write the best honest version and ask for the missing fact instead of inventing a number.
- **Show the actual product (6).** A real screenshot or live component next to the headline beats an illustration or a mock dashboard of fake charts. If no real asset exists, leave a marked placeholder and ask for one.
- **One CTA that wins (10).** The primary action is filled and gets the strongest contrast; secondary actions step down visibly (outline or link). Two equal buttons means no decision was made. On a pricing page, only the recommended plan's button is filled.
- **Plain copy ‡.** No greeting headlines ("Welcome back!") - use the page or the period as the title. No exclamation marks, no hype words (supercharge, seamless, unlock, magic): say what the thing does. No trailing periods on labels and buttons.
- **A change names its comparison ‡.** `+12%` means nothing alone; write `+12% vs last month`.
- **Specific mock content ‡.** Maya, Sarah, Alex, Acme and John Doe mark a screen as generated. In a mock or demo, use a plausible, specific person and detail. This is for placeholder content only - never invent facts about a real product.
- **No unsourced proof ‡.** "Trusted by 10,000+ teams", five stars, a row of avatars. Ask whether it is real; then make it specific and quiet, or remove it.

## 3. Hierarchy

- **Enlarge the main feature (7).** Give the most important feature a larger cell than its siblings instead of a grid of equal cards.
- **Group with spacing (8).** Tight inside a group, generous between groups. Reach for whitespace before borders, dividers and boxes.
- **One accent colour (11).** Used for what matters - the primary button, the active state, the key number. Everything else stays neutral, including the secondary button.
- **Use a design system (5).** Buttons, inputs and chips in one toolbar should share height, radius, border and type size. Use the project's tokens; if it has none, define a small scale (spacing, radius, type sizes, colours) and stick to it - ad-hoc values are where inconsistency comes from.
- **Hierarchy from size and colour, not weight ‡.** Weights of 400-500, with 600 for rare emphasis; 800-900 headings shout. Uppercase labels with wide tracking become sentence case. Keep to about five type sizes on a screen.

## 4. Craft details

- **Nested radius (14):** inner radius = outer radius − padding. A 24 px card with 12 px padding gets 12 px inner corners, so the two curves are concentric. The same radius on both looks pinched. If the result would be below ~2 px, use square corners †.
- **One depth cue per surface ‡:** a border, a shadow or a tinted surface - pick one. Border plus shadow plus ring plus gradient is hedging.
- **Text contrast (15):** secondary and body text must stay readable - at least 4.5:1 against its background †, and at least 3:1 for large text and icons ‡, measured over the real background. Light grey on white is the most common failure.
- **Headline wrapping (16):** no single word orphaned on the last line. `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs †, or set the break by hand.
- **Align by eye, not pixels (17):** geometric centring is often visually wrong. A play triangle centred by its bounding box looks left-heavy in a circle - nudge it toward its point until it looks centred. The same applies to icons beside text and glyphs with uneven side-bearings; expect 1-2 px corrections.
- **Tabular numbers (18):** `font-variant-numeric: tabular-nums` on prices, stats, timers, counters and table columns, so digits don't jitter when values change and columns line up.
- **Consistent icons (12):** one set, one stroke weight, one size grid. No mixing outline and filled, and no emoji standing in for icons. Third-party logos are the exception ‡: they keep their real colours, because people recognise them before they read them.

## 5. States and feedback

- **Loading states (19).** Every async region has a skeleton shaped like the content that will arrive (rows for a table, blocks for cards), plus empty and error states †.
- **Animate useful feedback (20).** Animate what tells the user something happened - "Add to cart" becoming "Added ✓", a save confirming. Skip animation that only decorates. Values are in `motion.md`.
- **Hit area ‡.** At least 44×44 px for touch and 40×40 px on desktop. Extend a small control's target with padding or a pseudo-element instead of enlarging what is drawn, and don't let targets overlap.
- **No layout shift ‡.** Reserve space for images, skeletons, async content and validation messages (fixed dimensions or `aspect-ratio`). Content that jumps reads as broken.
- **Hover changes colour, not weight ‡.** A `font-weight` change on hover or selection reflows the text. Gate hover styles to `@media (hover: hover)` so they don't stick on touch.
- **Forms ‡.** Input text of at least 16 px (smaller makes iOS zoom the page), real labels, and errors that keep what was typed.

## 6. Final check

- **Swap in another product's name ‡.** If the screen still fits, the copy and the visual are generic - push them toward this product.
- **Delete one more thing ‡.** If something breaks, put it back and stop.

## Provenance

Items 1-20 come from Charles Liu's "20 Ways to Unslop AI Designs"
(@charles.unemployed, TikTok), checked against the on-screen before/after
examples; the numbers in brackets are the source's numbering. Items marked †
are this skill's additions. Items marked ‡ are adapted, in this skill's own
words, from `charles-unslop` and `charles-polish` in
github.com/LemonFace0309/charles-skills. `charles-unslop` is adapted from
unslop by Damir Sokolovsky (@heydamir, github.com/heydamir/unslop), CC BY 4.0;
keep this credit in copies. The source's example for item 13 was only seen
mid-transition, so the list of embellishments there is this skill's reading of
it.
