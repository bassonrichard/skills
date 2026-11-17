---
name: ui-polish
description: The concrete-numbers final pass on a UI that already exists - exact durations, easings, scales and origins for animation, plus a de-slopping checklist for the tells of templated or AI-generated pages (filler badges, random italic words, equal-weight CTAs, mismatched nested radii, weak contrast, orphaned headline words). Use after building or generating any page, screen or component, and whenever the user says a UI looks generic, AI-generated, templated, cheap, stiff, janky or "off", or asks to polish, tighten, unslop, or add micro-interactions - even if they never say "animation" or "design". It does not pick an aesthetic direction or teach a library's API - pair it with frontend-design for direction and with the gsap or expo animation skills for API details; this skill supplies the values to put into them.
---

# UI polish

Two checklists of small, specific fixes. Each one is barely visible alone; the
effect is cumulative, so apply the whole relevant list to a surface instead of
cherry-picking. This is a finishing pass on what is already there, not a
redesign: keep the layout, brand, copy intent and stack, and prefer deleting to
adding.

## Which reference to read

| The task is about | Read |
|---|---|
| How things move: transitions, menus, popovers, press states, drags, toggles, list entrances, icon swaps, success feedback | `references/motion.md` |
| How a page looks and reads: hero, headline, CTAs, badges, cards, spacing, radius, contrast, icons, numbers, loading states | `references/unslop.md` |
| "Polish this", "make it feel premium", a whole page or screen | both - unslop first, then motion |

Read only what the task needs.

## How to work

1. **Read the actual code first** and note which library drives motion (CSS, Motion, Reanimated, GSAP, SwiftUI). The rules are library-neutral values; express them in whatever is already installed. Adding a dependency to animate a dropdown is the wrong trade.
2. **Look at it rendered.** Where a browser or simulator is available, screenshot the surface at its real size, and at the smallest size it will be seen, and judge that. Code hides what the eye catches in a second. If you can't render it, say so in the report.
3. **Match the scope to what you find.** Tells everywhere: run the whole relevant list. A designed screen with a few tells: fix only those and leave its palette, type and layout alone. No tells: say so, suggest at most three refinements with exact values, and stop. Never change a good screen just to make it different.
4. **The project's own tokens win.** If it has motion or design tokens, map the rules onto them and only flag tokens that break a rule badly (a 600 ms menu, a 3:1 body colour).
5. **Fix the frequent things first.** A press state or menu is felt hundreds of times a session; a hero entrance once.
6. **Don't invent content.** A specific headline needs real facts and "show the product" needs a real screenshot. Where those are missing, leave a clearly marked placeholder and ask - made-up numbers on a landing page are worse than a vague headline.
7. **Keep accessibility intact:** reduced-motion handling, body contrast of at least 4.5:1, visible focus states.

## What to hand back

Make the changes, then report them as a short table so the user can veto any line:

| Where | Before | After | Rule |
|---|---|---|---|
| `Menu.tsx` open transition | `scale(0)`, 600 ms linear, origin centre | `scale(0.95)`, 200 ms ease-out, origin top right | popover start scale, duration, origin |

Follow the table with anything that needs the user (real screenshot, real numbers, a brand accent colour) and anything deliberately left alone. If the request was review-only, give the same table with the After column as the proposal and change nothing.
