---
name: ci-for-agents
description: Audit and fix a CI pipeline so it survives agent-scale change volume - many more PRs, bigger history, more concurrent runs. Covers clone depth, polling and wait loops, concurrency and rate limits, merge-queue setup, required checks and flaky-test quarantine, for GitHub Actions and EAS Workflows (with notes for GitLab CI). Use whenever the user mentions slow or expensive CI, a backed-up or "broken" merge queue, PRs stuck on "Expected - waiting for status", flaky tests blocking merges, runner cost, GitHub rate limits, wants to make a check required, or is about to scale up coding agents or parallel sessions on a repo - and when writing or reviewing workflow files, even if they only ask "is our CI ready for this?".
---

# CI for agent-scale volume

Pipelines written for human commit rates break in three predictable places when
agents multiply the number of changes: every job pays for history it doesn't
need, runners sit occupied while they wait on other things, and one bad
required check blocks everyone. Audit those three in order - they are sorted
cheapest fix first.

## How to run the audit

1. Read every workflow file (`.github/workflows/`, `.eas/workflows/`, `.gitlab-ci.yml`) and anything describing branch protection, rulesets or the merge queue. Use run history and timings if they are available; say so when they are not, because without them savings are estimates.
2. Work through the three sections below. For each finding record `file:line → problem → fix → expected effect`.
3. Before calling something waste, check what the job does with it. A release job that builds a changelog needs history; a lint job does not. Findings that would break a job are worse than no finding.
4. Make the mechanical fixes as diffs. Anything that changes repo-wide settings (required checks, rulesets, merge-queue options) is a proposal for the user to approve - it affects everyone on the repo and cannot be seen in a diff review.

## 1. Stop cloning what the job doesn't use

Agent commits are frequent and verbose, so history grows fast and every deep
clone gets slower for every job.

- **GitHub Actions:** `actions/checkout` already fetches a single commit (`fetch-depth: 1`, `fetch-tags: false`). The waste is in overrides: look for `fetch-depth: 0` ("all history for all branches and tags") and ask what the job needs it for.
- **Give each job only what it uses:**

  | The job needs | Use instead of full history |
  |---|---|
  | Nothing but the files (lint, format, type-check, unit tests, build) | Default depth 1 - delete the override |
  | Tags for a version number | `fetch-tags: true`, or `git fetch --depth=1 origin tag <name>` |
  | A diff against the base branch (affected-project detection, diff-only lint) | Fetch the base ref to a bounded depth (`git fetch --depth=N origin <base>`) or use the PR's changed-files list from the API; `git merge-base` fails or misleads on a too-shallow clone, so verify it resolves |
  | Real history (changelog, `git describe`, blame, release notes) | Keep `fetch-depth: 0`, optionally with `filter: blob:none` so history comes without file contents |
  | One package of a big monorepo | `sparse-checkout:` patterns (note: setting `filter` overrides `sparse-checkout`) |

- **EAS Workflows:** `eas/checkout` already does a depth-1 fetch and has no depth option - nothing to fix there; don't invent one.
- **GitLab CI:** `GIT_DEPTH` controls it (new projects default to 20; `0` means everything). GitLab's own guidance is `GIT_DEPTH: "1"` for jobs that only build, test or scan, with the same caveat that `git describe` / `git merge-base` / `git log` can fail or silently return partial results on shallow clones.

## 2. Stop paying runners to wait

A runner in a polling loop is still a billed, occupied runner, and each poll is
an API call against a shared rate limit. With many agents each watching their
own PR, polling multiplies.

**Look for:** `sleep` inside `while`/`until` loops, "wait for check / deployment / bot" actions, `gh run watch` or `gh pr checks --watch` inside a job, steps that query the API for another job's or workflow's status, and jobs with no `timeout-minutes` (a stuck wait then runs until the platform's job time limit, which is hours).

**Replace with:**

- **Dependencies inside one workflow:** `needs:` - the dependent job is not scheduled until the others succeed, so nothing waits on a runner. (EAS Workflows has `needs:` too, plus `after:` for "run when finished, whatever the result".)
- **Events across workflows or from outside:** the waiting job should not exist until the thing it waits for has happened.
  - `workflow_run` (with `types: [completed]`) to run after another workflow. It fires whatever the result, so gate on `github.event.workflow_run.conclusion == 'success'`. It only triggers if the workflow file is on the default branch, chains at most three levels deep, and runs with secrets and a write token - don't check out and execute untrusted PR code in it.
  - `repository_dispatch` for an external system calling back through the API (also default-branch only).
  - `deployment_status` when a deploy provider reports status; `check_run` / `check_suite` for checks created by other apps (they do not fire for checks created by GitHub Actions itself).
- **Concurrency groups** so superseded pushes stop burning runners:

  ```yaml
  concurrency:
    group: ${{ github.workflow }}-${{ github.head_ref || github.run_id }}
    cancel-in-progress: true
  ```

  Scope cancellation to PR branches. Never cancel in-progress runs on the default branch, on `merge_group` runs or on deploys - a half-finished deploy or a cancelled queue build is worse than a slow one. `cancel-in-progress` accepts an expression (e.g. `${{ github.event_name == 'pull_request' }}`) for exactly this.
- **EAS Workflows** has the same feature with different spelling - top-level `concurrency:` with `group:` and `cancel_in_progress:` (underscores), e.g. `group: ${{ workflow.filename }}-${{ github.ref }}`. `cancel_in_progress` takes a boolean or a single expression (`${{ github.ref_name != 'main' }}`), so one workflow file can cancel superseded PR builds and leave `main` builds alone - don't split the workflow into two files to get that. Also check triggers: a build on every push with no `paths:` filter is the expensive version of this problem.
- **Rate limits:** GitHub's guidance is to subscribe to webhooks instead of polling. For API calls that remain: honour `retry-after`; if `x-ratelimit-remaining` is 0 wait until `x-ratelimit-reset`; otherwise wait at least a minute and back off exponentially, and send requests serially rather than in parallel.

The same applies to the agents themselves: a session polling CI status in a loop costs API quota and achieves nothing a notification wouldn't.

## 3. Be strict about what is "required"

A required check is a lock on the whole merge path. With a merge queue it is
worse than a lock: when a required check fails, the PR is removed and the queue
is rebuilt for every PR behind it, so one flaky test re-runs CI for everybody.

**Check the wiring first** - these two misconfigurations look like "the merge queue is broken":

- **Missing `merge_group` trigger.** With a merge queue, every workflow that reports a required check must also trigger on `merge_group`; it is a separate event from `pull_request` and `push`. Without it the check never reports for the queue's temporary branch and the merge fails or times out.
- **Required checks behind workflow-level filters.** If a workflow is skipped by `paths:`, `branches:` or a skip-commit message, its required checks stay "Pending" and block the merge indefinitely. Don't require a workflow that can be skipped. To scope work to what changed, always trigger the workflow and skip at the *job* level: a job skipped by `if:` reports Success and satisfies the requirement. A small "changes" job that computes what was touched, with the expensive jobs conditional on its output, is the standard shape.

**Then the checks themselves:**

- **Inventory** the required checks. For each: owner, failure rate over recent runs, and how often a plain re-run flips the result. A check that flips on re-run with no code change is flaky by definition.
- **Quarantine confirmed flaky tests:** take them out of the required set but keep them running in a separate non-blocking job so the signal isn't lost. Every quarantined test gets a named owner and a deadline; without both, quarantine becomes deletion. If the owner isn't knowable from the repo (CODEOWNERS, git history), leave it blank and say so rather than picking a name.
- **Gate new required tests.** Before a test becomes required, run it repeatedly (dozens of times) and in parallel with itself and its neighbours, and read it for the usual causes:
  - shared test data or fixtures (passes alone, fails alongside others)
  - hard-coded sleeps and timing assumptions
  - dependence on real external services, wall-clock time, fixed ports or test ordering

  A test that only passes in isolation stays out of the required set until that is fixed.
- **Merge-queue settings worth a look** (proposals only): build concurrency (how many queue builds run at once), status-check timeout (how long the queue waits before treating silence as failure), and "only merge non-failing pull requests" - turning it off lets a group merge if the last PR passes, which hides intermittent failures rather than fixing them.

## Output

1. **Ranked findings**, most impact first: `file:line → problem → fix → expected effect` (runner-minutes, queue time, PRs unblocked). Mark estimates as estimates.
2. **Diffs** for the mechanical fixes (clone depth, concurrency groups, `needs:`, `merge_group` trigger, job-level conditions).
3. **Quarantine table:** test → evidence → cause if visible in the code → owner → deadline.
4. **Proposals needing approval:** changes to required checks, rulesets or merge-queue settings, each with the reason. Don't apply these unasked.

Platform details above were checked against the GitHub, GitLab and Expo docs in November 2026; workflow syntax moves, so re-check anything surprising. For other CI systems the three principles carry over but the keys differ - look them up rather than guessing.

Source: the three themes come from a CI lead's tips (@helpmeexitvi) on TikTok.
