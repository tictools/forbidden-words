---
description: Resolve a GitHub issue from this repo (number or title)—verify, plan, review, execute
---

**Issue (number or title text):** `$ARGUMENTS`

If `$ARGUMENTS` is empty, ask the user for the issue number or title before continuing.

## 1. Locate the issue on the remote repository

- Confirm `gh` is available and `origin` points at GitHub for this repo.
- **If the argument is digits only** (e.g. `42`): run `gh issue view <number> --json number,title,body,state,url` in the current repo.
  - If the command fails or the issue does not exist: stop and reply with a **clear warning** that no issue with that number exists in this repository, and suggest verifying the number or remote.
- **If the argument is not a number**: search open issues (and closed if needed) with `gh issue list`, filtering by title or using `--search` on the given text; list matches (number + title + state).
  - **No matches**: warn that no issue matches the given name; suggest trying the number or distinct words from the title.
  - **Multiple plausible matches**: do not assume; ask the user which number to use.
  - **A single clear match**: use that issue number.

Keep `number`, `title`, `body`, and `url` as context for the following steps.

## 2. Work plan (create one if none is usable)

Treat a **plan as already defined** if the issue body (or a recent thread comment) contains concrete implementation steps, acceptance criteria, or a checklist sufficient to execute without inventing scope.

- **If there is no usable plan** (or it is too vague): draft a **plan** in en-US (or match the issue’s language if the issue is not in English), including:
  - problem summary and expected outcome;
  - ordered steps (code exploration, changes, tests);
  - explicit **branch creation**: from the repo default branch (`gh repo view --json defaultBranchRef` or equivalent), name `issue-<number>-<short-slug>` from the title (kebab-case, no problematic special characters);
  - testing approach (TDD when domain or logic is involved).

After the plan is approved, for code in this repo follow:

@.cursor/skills/tdd/SKILL.md

@.cursor/skills/project-structure/SKILL.md

@AGENTS.md

## 3. Request user review

**Do not** create branches, change tracked files for implementation, or run **any** `git commit` yet.

Present the plan (and, if applicable, the issue’s existing plan plus the agreed branch name) in a readable structure: sections, numbered steps, proposed branch name.

End with an **explicit question** so the user can confirm the plan, request edits, or defer. **Wait for the user’s reply.**

## 4. Execute the plan (only after approval)

When the user has **explicitly confirmed** the plan (or supplied a revised plan):

1. Check git state; update the default branch if appropriate; create and check out the agreed branch.
2. Execute the plan steps: code, tests; do not expand scope beyond what was reviewed.
3. **No automatic commits.** When work is ready to record, summarize what changed, propose `git add` scope and a commit message (reference the issue with `Fixes #N` / `Closes #N` / `Refs #N` as appropriate). **Do not** run `git commit` until the user **explicitly** asks you to commit (or confirms your proposed message and requests the commit). If the user wants to commit locally themselves, do not run `git commit`.
4. **No automatic push or PR.** Run `git push` or `gh pr create` **only** when the user **explicitly** requests that step.

If execution hits blockers (dependencies, permissions, CI), explain the situation and propose next steps without assuming merge approval.
