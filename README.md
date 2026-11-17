# skills

Agent skills for Claude Code and other tools that read `SKILL.md` folders.

| Skill | What it does |
|---|---|
| [ad-angles](skills/ad-angles) | Turns real customer language (reviews, forums, pasted threads) into evidence-backed ad angles, hooks and a full-funnel static-ad matrix. |
| [ci-for-agents](skills/ci-for-agents) | Audits and fixes a CI pipeline for agent-scale change volume: clone depth, polling, concurrency, merge queue, required checks. |
| [drawio-diagram](skills/drawio-diagram) | Generates an editable draw.io diagram from Mermaid, CSV or XML and opens it via a script-built link. |
| [minto-pyramid](skills/minto-pyramid) | Restructures a draft answer-first: one conclusion, three reasons, evidence under each. |
| [monetization-audit](skills/monetization-audit) | Scores how an app asks for money (pricing, paywall, checkout, recovery) against a checklist, for Stripe and mobile in-app purchases. |
| [tiktok-transcripts](skills/tiktok-transcripts) | Reads what a TikTok says and shows, from its caption track and sampled frames, without downloading the video. |
| [ui-polish](skills/ui-polish) | A concrete-numbers final pass on an existing UI: motion values plus a checklist for templated-looking pages. |

## Install

```bash
npx skills add bassonrichard/skills
```

Or copy a folder from `skills/` into `~/.claude/skills/`.

## Credits

Several skills distil ideas other people shared publicly; each `SKILL.md` names its source at the bottom.
