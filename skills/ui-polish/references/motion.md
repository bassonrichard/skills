# Motion rules

Twenty rules with the values to use. "Avoid" is the common default that makes
motion feel cheap; "Use" is the fix. Values marked † are this skill's own
defaults where the source showed the technique but no number. Items marked ‡
come from Charles Liu's published skills (see Provenance).

## Contents
- Should it move at all?
- Easing
- Duration and stagger
- Origin and path
- Press, drag and knobs
- State changes
- Always
- Reviewing existing motion
- Provenance

## Should it move at all? ‡

Decide this before tuning anything. The right curve on an animation that
shouldn't exist is still wrong.

| How often it fires | What it gets |
|---|---|
| 100+ times a day, or from a keyboard shortcut (command palette, tab switch, typing) | No transition that delays the action. Speed beats smoothness. Instant press feedback is still fine |
| Occasionally (menu, modal, drawer) | Standard motion, under 300 ms |
| Rarely or once (success, onboarding, a reveal) | May be choreographed |

Then ask what question the motion answers: where did this come from, did that
register, what caused this? If it answers none, cut it. Delete on sight:

- looping pulses, pings and breathing glows on things that aren't live
- shimmer on headings, parallax, elements drifting on scroll
- every section fading in on scroll, and entrances on things already at rest at page load
- `hover:scale` on cards - use a colour or surface step on hover and keep scale for the press

## Easing

| # | Situation | Avoid | Use | Why |
|---|---|---|---|---|
| 1 | Something enters | ease-in | ease-out | A fast start reads as responsive, a soft landing as settled |
| 9 | Something moves and stays on screen | linear | ease-in-out (≈300 ms for a short move) | It has to leave rest and arrive at rest; linear looks robotic |
| 13 | Everyday UI: menus, cards, tabs, settings | underdamped spring that wobbles | no overshoot | Bounce on a routine action is noise. Keep it for rare, playful moments |
| 14 | Anything held by the finger or cursor | a tween/transition on the dragged element | direct pointer tracking, no easing | Easing a held object makes it trail the pointer and feel laggy. Animate only after release |

For rule 14 in practice: remove the `transition` (or set duration 0) while the
pointer is down and write the position straight from the pointer event; restore
the transition on release for the settle.

## Duration and stagger

| # | Situation | Avoid | Use |
|---|---|---|---|
| 2 | Dropdowns, menus, popovers | 600 ms | 150-250 ms (200 is a safe default) |
| 3 | List rows entering | 200 ms between rows | ~30 ms between rows. Cap the total † (stop staggering after ~8-10 rows) so long lists don't crawl |
| 15 | Exits | same duration as the entrance | ~20% shorter than the entrance: 250 ms in → 200 ms out |
| 6 | Attached details (badge, counter, icon riding on a moving card) | everything stopping rigidly on the same frame | the detail trails its parent by ~50 ms and settles just after it |

Durations for the rest ‡: hover, press and colour changes 100-150 ms; tooltips
150-250 ms; modals, drawers and toasts 200-300 ms; page transitions 300-400 ms.
If something feels slow, cut the duration before changing anything else.

Rule 6 is follow-through, not list stagger: one object moves, and its small
attachments arrive a beat late. It applies to secondary parts of a single
element, not to siblings in a list (that is rule 3).

## Origin and path

| # | Situation | Avoid | Use |
|---|---|---|---|
| 10 | Popover/menu entrance | `scale(0) → 1` | `scale(0.95) → 1` with opacity 0 → 1. From 0 it looks like it flies in from far away |
| 11 | Where a popover grows from | `transform-origin: center` | origin at the trigger - a menu under a right-aligned button uses `top right` |
| 12 | Where it goes on close | fading out around its own centre | shrinking back toward the trigger, same origin as the entrance |
| 7 | An object travelling between two places | a dead-straight line | a shallow arc (the demo used a 32 px rise) † scale the arc to the distance |

## Press, drag and knobs

| # | Situation | Avoid | Use |
|---|---|---|---|
| 4 | Button press | no feedback | `scale(0.97)` over ~150 ms, back on release |
| 5 | Toggle or slider knob in motion | a rigid circle sliding across | an area-preserving stretch of ~12%: longer along the travel axis, proportionally thinner across it (≈ `scaleX(1.12) scaleY(0.89)`), relaxing to a circle at rest |
| 19 | Dragging past a limit | a hard stop at the edge | diminishing resistance - the further past the bound, the less it moves - then settle back on release |
| 8 | An action succeeded | only swapping the label to "Saved" | the label change plus a single pulse on that same element. One pulse, not a loop |

## State changes

| # | Situation | Avoid | Use |
|---|---|---|---|
| 16 | Old state out, new state in | out → blank beat → in | overlap them: the new state enters while the old one leaves. The blank beat doubles perceived latency |
| 17 | Sliding indicator over labels; revealing content | fading the content, crossfading text colour | clip the content and mask the text (see below) |
| 18 | Icon swap (copy → check, play → pause) | a hard replacement | crossfade with scale + opacity + blur † ≈ scale 0.8 → 1, blur 2-4 px → 0, ~150 ms |
| 20 | The same object in two views (thumbnail → detail, tab indicator, card → modal) | a disconnected replacement: one fades out, a twin fades in | one object that expands - give both the same layout identity |

**Rule 17 in practice.** For a segmented control with a pill that slides
between tabs, render the labels twice: a base layer in the inactive colour and
a top layer in the active colour, with the top layer clipped (`clip-path` or a
mask) to the pill's current rectangle. As the pill moves, the colour change
follows its edge exactly instead of both labels cross-fading on a timer. For
content reveals, animate `clip-path` / a mask over the content instead of its
opacity, so the eye has an edge to follow.

**Rule 20 by library.** Motion: the same `layoutId`. Reanimated: `sharedTransitionTag`.
SwiftUI: `matchedGeometryEffect`. Plain web: the View Transitions API with a
shared `view-transition-name`, or a FLIP animation.

## Always

- Animate `transform` and `opacity`; avoid animating layout properties (`width`, `height`, `top`, `left`) †.
- Honour `prefers-reduced-motion` / the OS reduce-motion setting †: drop movement, scale and stretch; keep short opacity fades so state changes are still visible.
- Keep it interruptible ‡: never lock input while something animates, and let a reversed action start from where the element is on screen. Interactive states use transitions or springs, which retarget mid-flight; keyframes restart, so keep them for one-shots.
- Name the properties a transition animates ‡. `transition: all` animates things nobody chose.

## Reviewing existing motion

First decide whether each animation should exist (see the top of this file).
Then walk the surface in order of how often each thing fires: press states → menus
and popovers → toggles and drags → list and page entrances. For each animated
element note what it does now (duration, easing, from/to, origin), which rule
it breaks, and the exact replacement values.

## Provenance

Rules 1-20 and their before/after values come from Charles Liu's
"20 Ways to Make Beautiful AI Animations" (@charles.unemployed, TikTok),
checked against the on-screen demos, which label each pair. Items marked † and
the unmarked lines of the "Always" section are this skill's additions. Items
marked ‡ are adapted, in this skill's own words, from `charles-polish` and
`charles-unslop` in github.com/LemonFace0309/charles-skills; `charles-unslop`
is adapted from unslop by Damir Sokolovsky (@heydamir), CC BY 4.0. Rule 13's demo shows a card,
so "everyday UI" is the source's own wording; the icon-swap values in rule 18
and the arc scaling in rule 7 are not given by the source.
