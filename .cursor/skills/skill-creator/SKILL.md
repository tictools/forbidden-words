---
name: skill-creator
description: >
  Creates new AI agent skills following the Agent Skills spec.
  Trigger: When creating a new skill, adding agent instructions, or documenting patterns for AI.
license: Apache-2.0
metadata:
  author: tictools
  version: "2.1"
---

## When to Create a Skill

- Repeated pattern needs explicit guidance.
- Project conventions diverge from generic best practices.
- A workflow needs structured steps/decision paths.

Do not create a skill for one-off or trivial tasks.

## Minimal Structure (this repo)

**Canonical (Cursor + source of truth)**

```text
.cursor/skills/<skill-name>/
  SKILL.md
  assets/        (optional)
  references/    (optional, local docs)
```

**OpenCode (same file)**

```text
.opencode/skills/<skill-name>/SKILL.md  →  symlink to ../../../.cursor/skills/<skill-name>/SKILL.md
```

OpenCode discovers project skills under `.opencode/skills/` ([docs](https://open-code.ai/en/docs/skills)). Keep one `SKILL.md` only; symlink from `.opencode` so Cursor and OpenCode never diverge.

## Authoring Rules

- Include frontmatter (`name`, `description`, `license`, `metadata`). Optional: `compatibility` (e.g. `opencode`) if you want to tag portability—Cursor ignores unknown keys it does not use.
- **`name` must match the directory name** exactly (required by OpenCode). Use lowercase and hyphens only, pattern `^[a-z0-9]+(-[a-z0-9]+)*$` (no underscores, no consecutive `--`, no leading/trailing `-`).
- **`description`**: 1–1024 characters in OpenCode; keep it specific enough for the agent to pick the right skill.
- Keep examples small and copy-paste ready.
- Prefer references to local docs over duplicated content.

## After Adding a Skill (checklist)

1. Append a row to the skills table in **`AGENTS.md`** at the repo root ([`AGENTS.md`](../../../AGENTS.md)).
2. Create directory **`.opencode/skills/<name>/`** and symlink **`SKILL.md`** → **`../../../.cursor/skills/<name>/SKILL.md`** (same `<name>` as in frontmatter).
3. (Optional) Add a slash command under **`.opencode/commands/`** if this skill is often used together with specific `.cursor/rules/*.mdc` files (see existing commands for `@` patterns).

Cursor discovers skills from **`.cursor/skills/<name>/SKILL.md`** automatically; OpenCode uses the symlinked copy under **`.opencode/skills/`**.
