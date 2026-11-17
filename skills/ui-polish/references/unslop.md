# Unslop checklist

Generated pages share the same tells. Each is small; together they say nobody
looked at this. Go through the page once per section, fix what you find, and
prefer deleting to adding. Items marked † are this skill's own additions.

## Contents
- 1. Delete
- 2. Say something real
- 3. Hierarchy
- 4. Craft details
- 5. States and feedback
- Provenance

## 1. Delete

- **Filler badges (1).** The pill above the headline: "✨ New", "Now in beta", "AI-powered". Keep one only if it carries real news the reader needs.
- **Redundant labels (2).** Eyebrow text that repeats the heading ("FAQ" above "Questions, answered"), "Features" above an obvious feature grid, captions that restate the image.
- **The random italic word (3).** One word of the headline in italic, serif or gradient for no reason. Set the whole headline in one style; emphasis needs a reason.
- **Monospace as a vibe (4).** Keep mono for code, terminal output, IDs and aligned numbers. Body copy, nav and labels in mono is a costume.
- **Embellishments (13).** Glows, gradient borders, gradient buttons, floating blobs, sparkle icons, "Most popular" ribbons stacked on a card that is already highlighted. Keep what is content or structure.

## 2. Say something real

- **Specific headline (9).** Replace the slogan with what the product does for whom: "Curiosity, meet clarity." → "Cited answers from papers." Test: could a competitor use this headline unchanged? If yes, rewrite it. Use only facts you have; where the specifics are unknown, write the best honest version and ask for the missing fact instead of inventing a number.
- **Show the actual product (6).** A real screenshot or live component next to the headline beats an illustration or a mock dashboard of fake charts. If no real asset exists, leave a marked placeholder and ask for one.
- **One CTA that wins (10).** The primary action is filled and gets the strongest contrast; secondary actions step down visibly (outline or link). Two equal buttons means no decision was made. On a pricing page, only the recommended plan's button is filled.

## 3. Hierarchy

- **Enlarge the main feature (7).** Give the most important feature a larger cell than its siblings instead of a grid of equal cards.
- **Group with spacing (8).** Tight inside a group, generous between groups. Reach for whitespace before borders, dividers and boxes.
- **One accent colour (11).** Used for what matters - the primary button, the active state, the key number. Everything else stays neutral, including the secondary button.
- **Use a design system (5).** Buttons, inputs and chips in one toolbar should share height, radius, border and type size. Use the project's tokens; if it has none, define a small scale (spacing, radius, type sizes, colours) and stick to it - ad-hoc values are where inconsistency comes from.

## 4. Craft details

- **Nested radius (14):** inner radius = outer radius − padding. A 24 px card with 12 px padding gets 12 px inner corners, so the two curves are concentric. The same radius on both looks pinched. If the result would be below ~2 px, use square corners †.
- **Text contrast (15):** secondary and body text must stay readable - at least 4.5:1 against its background †. Light grey on white is the most common failure.
- **Headline wrapping (16):** no single word orphaned on the last line. `text-wrap: balance` on headings, `text-wrap: pretty` on paragraphs †, or set the break by hand.
- **Align by eye, not pixels (17):** geometric centring is often visually wrong. A play triangle centred by its bounding box looks left-heavy in a circle - nudge it toward its point until it looks centred. The same applies to icons beside text and glyphs with uneven side-bearings; expect 1-2 px corrections.
- **Tabular numbers (18):** `font-variant-numeric: tabular-nums` on prices, stats, timers, counters and table columns, so digits don't jitter when values change and columns line up.
- **Consistent icons (12):** one set, one stroke weight, one size grid. No mixing outline and filled, and no emoji standing in for icons.

## 5. States and feedback

- **Loading states (19).** Every async region has a skeleton shaped like the content that will arrive (rows for a table, blocks for cards), plus empty and error states †.
- **Animate useful feedback (20).** Animate what tells the user something happened - "Add to cart" becoming "Added ✓", a save confirming. Skip animation that only decorates. Values are in `motion.md`.

## Provenance

Items 1-20 come from Charles Liu's "20 Ways to Unslop AI Designs"
(@charles.unemployed, TikTok), checked against the on-screen before/after
examples; the numbers in brackets are the source's numbering. Items marked †
are this skill's additions. The source's example for item 13 was only seen
mid-transition, so the list of embellishments there is this skill's reading of
it.
