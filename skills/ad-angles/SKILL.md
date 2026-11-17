---
name: ad-angles
description: Research what real customers say in public (Reddit threads, app-store and Trustpilot reviews, forums, or text the user supplies) and turn it into evidence-backed ad angles, hooks and copy for any product, optionally expanded into a full-funnel matrix of static ad briefs. Use whenever the user wants paid-ad ideas, ad copy, hooks, creative angles, messaging or positioning research, "voice of customer" research, says they need more ad creative or creative diversity for Meta/TikTok/Google ads, or asks what to say in an ad before spending money testing it - even if they never mention research. Works for any product. Not for planning organic short-form video (content strategy, posting schedules); it can supply the customer-language research such a plan draws on.
---

# Ad angles from real customer language

The best ad copy is already written - by customers complaining, asking and
recommending in public. This skill finds that language and structures it into
angles that can be tested, instead of a research document nobody acts on.

The whole value is that every angle is traceable to something a real person
wrote. An angle built on an invented or paraphrased "quote" looks identical on
the page and is worth nothing, so the evidence rules below matter more than
volume.

## Inputs

Ask for whatever is missing, in one message, then proceed on stated
assumptions if the user doesn't answer:

1. **Product** - what it is, price point, the main promise.
2. **Audience** - who buys it.
3. **Where they talk** - subreddits, forums, competitor products whose reviews are worth reading. If the user doesn't know, propose some.
4. **Anything they already have** - reviews, support tickets, survey answers, sales notes. This beats every public source because it is their own customers.

## Phase 1 - Collect

Read `references/sources.md` first. It records which sources a session can
really read and how; the short version:

- **Reddit cannot be read directly** from a session (Reddit and the tools both block it). It is still the best place to *find* conversations, so use web search with `site:reddit.com/r/<sub> <problem words>` for discovery and do the **Reddit handoff** below.
- **Readable now:** App Store reviews via `scripts/appstore_reviews.py` (the product's and its competitors'), Trustpilot, Hacker News, Stack Exchange, many niche forums and review pages, and whatever the user supplies.
- When a source blocks you, note it and move on. Don't use mirrors, disguised clients or logins to get around a block.

Search with the audience's pain words, not the product category: "hate",
"tired of", "struggling with", "is it worth", "alternative to", "finally
found", "gave up on". Read comments and low-star reviews before posts and
five-star reviews - unguarded language lives there.

**Reddit handoff.** When Reddit matters (the user named subreddits, or the
audience clearly lives there), don't stall and don't pretend. Do both of these:

1. Give the user a shortlist of up to 10 places to look, each with a line on why it looks rich, and ask them to paste the threads or save the pages into the working folder. You can't open Reddit to check a link, so prefer links that can't be wrong: an in-subreddit search (`https://www.reddit.com/r/<sub>/search/?q=<problem words>&restrict_sr=1`) plus the thread title to look for. Give a direct thread URL only when search returned it on reddit.com itself; mark any address rebuilt from a mirror or a snippet as `unverified link`.
2. Carry on immediately with the readable sources, and deliver. When pasted threads arrive, fold them in and re-rank.

**Evidence log.** As you read, record each usable line with its source:

- **Quote** - copied character-for-character from a page, API response or file that was actually opened, with the URL (or file name) it came from. Typos stay.
- **Lead** - a search snippet, a tool's summary, or your memory of what people say. Leads point you to themes and threads. They never appear inside quotation marks and never count as evidence.

Text that reached you only through WebFetch sits in between: WebFetch answers
through a small model and can reword. Before such a line is used as an angle's
evidence, confirm it - read the page raw (browser page text, or a plain request
where the site allows one) or fetch again asking for those exact sentences, and
compare. If it can't be confirmed, it is a lead. WebFetch lines that only sit
in the quote bank may stay, marked `unconfirmed`.

Stop collecting when new pages stop producing new themes. Keep a tally of what
was read (source, items read) - it goes in the output.

Save fetched files (review dumps, saved pages, helper scripts) in a new
subfolder named for this task, never loose in a shared temp folder: other runs
write there too and will overwrite them.

## Phase 2 - Cluster

Sort quotes into four buckets and count how many distinct quotes support each
theme. The count is the ranking signal, so it has to be a real count of quotes
in the log, not an impression.

- **Problems** - what is going wrong, in their words.
- **Desires** - the outcome they describe wanting.
- **Objections** - why they haven't bought a solution, or what burned them last time.
- **Phrases** - recurring wording, metaphors, in-group terms. These go into copy untouched.

## Phase 3 - Angles

Turn the strongest themes into 8-12 angles (fewer if the evidence only
supports fewer - say so). One block per angle:

| Field | Content |
|---|---|
| Angle | Name it in 3-5 words |
| Built on | Problem / desire / objection, the theme, and its quote count |
| Evidence | 2-3 verbatim quotes, each with its link |
| Hooks | 3 opening lines that use the customers' phrasing |
| Body copy | 2-4 sentences |
| Format | static / carousel / demo / testimonial-style / founder video |
| Claim check | Any claim the copy makes that the user must be able to back |

Then pick the **three to test first** and give the reason for each - evidence
strength first, then how different the three are from each other, so the test
teaches something.

### Rules that keep it honest

- **Vocabulary, not identity.** Ads borrow how customers talk. They never quote a named or identifiable person, reuse a username, or imply that a real reviewer endorses the product. The quotes are research evidence for the user, not ad content.
- **No unbacked claims.** Results, health, money, time-saved and comparison claims get flagged in "Claim check" for the user to verify. Don't invent numbers, testimonials, reviews, press mentions or "as seen in".
- **Don't call out personal attributes.** Hooks that assert something about the viewer ("Struggling with your weight?", "In debt?") break ad-platform rules on personal attributes. Describe the situation or speak in first person instead ("I stopped dreading 5pm").
- **Thin evidence is reported, not hidden.** An angle with one quote behind it is labelled a hunch. An idea with none is listed separately as "untested hypotheses", never mixed into the ranked table.

## Phase 4 - Full-funnel static matrix

Run this when the user wants volume ("more creative", "creative diversity",
"100 ads"), supplies a product image, or asks for static ads. If they bring
their own angles, start here; otherwise run a short Phase 1-3 first so the
matrix has something true to say.

Each cell is a brief for one static image:

| Stage | Job of the ad | Formats that fit |
|---|---|---|
| Top - cold audience | Name the problem or teach something | Problem callout, myth vs fact, "did you know", before/after of the situation |
| Middle - warm | Prove it works | Review-style card, us-vs-them, feature close-up, stat, how-it-works in 3 steps |
| Bottom - hot | Give a reason to act now | Offer, bundle, guarantee, deadline, objection answered |

For each angle × stage, write: **headline** (8 words or fewer), **supporting
line**, **visual description** (what is in the frame, where the product image
sits, background, text placement), **CTA**, and one **do/don't** for that
format.

Things that make a matrix usable rather than big:

- Vary layout, background and headline structure between cells. Near-identical variants are treated by ad platforms as one ad and teach nothing.
- Middle-funnel proof must be real. Review-style ads use reviews the user owns and has permission to use; mark those cells `needs real review` instead of writing a fake one. Same for stats and press.
- Bottom-funnel offers come from the user. If no offer was given, write the cell around a placeholder (`[offer]`) and list it as an open question.
- Keep the product image as the constant: describe how each brief uses the supplied image rather than inventing a different product shot.

Deliver the matrix as a table; add a CSV with one row per brief when there are
more than about 20, so it can go straight to a designer or generator.

Only generate images if the user asks for them and an image tool is connected.
Then produce one small batch (about six, spread across the funnel) and get a
taste check before making more.

## Output

Write one markdown document (a file, since it will be reused), in this order:

```
# Ad angles: <product>

## Test these three first
(angle, why, the single strongest quote behind it)

## What customers keep saying
(themes by bucket, each with its quote count)

## Angles
(the angle blocks, ranked)

## Static ad matrix            <- only when Phase 4 ran
## Untested hypotheses          <- ideas with no quote behind them, if any

## Coverage and gaps
(sources read with item counts; sources that were blocked; the Reddit
shortlist for the user to paste; claims and offers the user must confirm)

## Quote bank
(every quote used, grouped by theme, with links)
```

Lead with the decision, keep the quote bank at the end. In the chat reply,
give the three angles to test, the coverage gaps, and the Reddit shortlist -
not the whole document.

Sources: workflow ideas from Mariah Brunner (@itsmariahbrunner) and Joss Austin (@realjossaustin) on TikTok. Neither published their actual skill; this is a reconstruction of the approach they described, adapted to the sources a session can read.
