---
name: remote-issue-from-findings
description: >
  Opens GitHub issues on the remote repository from requirements gaps, suggestions,
  and code defects, applying labels that reflect each item's nature (type and optional area).
  Use when the user asks to file issues, create GitHub issues from review findings, or
  track follow-up work on origin.
license: Apache-2.0
metadata:
  author: tictools
  version: "1.0"
---

# Remote issues from findings

## When to use

- Turn **requirements gaps**, **suggestions**, or **errors** in code/logs into **tracked issues**.
- Default tracker: **GitHub** for this repo (see `.github/workflows/`). Prefer **`gh`** when available.

## Preconditions

1. **Auth**: `gh auth status` succeeds for the target host, or the user provides another supported path and credentials.
2. **Target repo**: Confirm `origin` (or the user-named remote) points to the intended GitHub repository before creating issues.
3. **Labels**: GitHub labels must **already exist** on the repository, or the user must explicitly ask to create missing labels first. Do not assume `gh issue create --label` succeeds for unknown labels.

## Labels by nature (required)

Every issue MUST carry a **`type/*`** label chosen from the table below. Pick **exactly one** primary `type/*` per issue; split mixed work into separate issues.

| Nature of finding | `type/*` label | Typical body focus |
|-------------------|----------------|---------------------|
| Incorrect behavior, regression, crash, failing test in prod path | `type/bug` | Repro steps, expected vs actual, scope |
| Missing behavior vs agreed spec / product requirement | `type/feature` | User story, acceptance criteria, spec link |
| Refactor, complexity, coupling, migration without user-visible bug | `type/debt` | Motivation, risk, suggested direction |
| README, ADR, spec, or developer docs out of date / missing | `type/docs` | What to document, audience |
| Tooling, CI, deps, formatting-at-scale, repo hygiene | `type/chore` | Commands, blast radius |
| Non-blocking improvement (UX polish, perf idea without bug) | `type/enhancement` | Rationale, trade-offs |

### Optional `area/*` (at most two)

Infer from paths or conversation; omit if unclear.

| Code / topic | Suggested `area/*` |
|----------------|-------------------|
| `app/`, UI, routes | `area/app` |
| `core/` domain | `area/core` |
| `tests/` harness, mothers, MSW | `area/tests` |
| `.github/`, CI config | `area/ci` |
| Cross-cutting / unknown | omit `area/*` |

Do not invent ad-hoc labels outside `type/*` and `area/*` unless the user supplies an approved extension list.

## Issue quality

**Title**: imperative, scannable, roughly ≤ 72 characters, no vague placeholders (“fix stuff”).

**Body** (GitHub-flavored Markdown):

```markdown
## Summary
<one paragraph>

## Context
- Nature: <bug | feature gap | suggestion | …>
- Hints: <paths, commands, SHAs if known>

## Details
- Observed: …
- Impact: …

## Acceptance criteria (or repro for bugs)
- [ ] …
```

- **`type/bug`**: include **reproduction** (commands or steps) and **expected vs actual**.
- **`type/feature`**: include **acceptance criteria** tied to specs when available (`.cursor/specs/`).

## Workflow

1. **Classify** each finding → one `type/*` (and optional `area/*`).
2. **Dedupe**: search open issues (`gh issue list --search "keywords"`) before creating near-duplicates.
3. **One unit of work per issue** unless items are strictly inseparable.
4. **Create** (example):

```bash
gh issue create --title "…" --body-file /tmp/issue-body.md --label "type/bug,area/core"
```

5. **Reply** with the issue URL(s). Never paste secrets, tokens, or PII.

## When not to create an issue

- Nit-only style with no correctness, accessibility, security, or team-standard impact (comment in PR instead).
- Already tracked: add a comment on the existing issue with new evidence.

## See also

- **`.cursor/skills/project-structure/SKILL.md`** — where `/app`, `/core`, and `/tests` live when inferring `area/*`.
