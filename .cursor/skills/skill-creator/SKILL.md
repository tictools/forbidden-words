---
name: skill-creator
description: >
  Creates new AI agent skills following the Agent Skills spec.
  Trigger: When creating a new skill, adding agent instructions, or documenting patterns for AI.
license: Apache-2.0
metadata:
  author: tictools
  version: "2.0"
---

## When to Create a Skill

- Repeated pattern needs explicit guidance.
- Project conventions diverge from generic best practices.
- A workflow needs structured steps/decision paths.

Do not create a skill for one-off or trivial tasks.

## Minimal Structure

```text
skills/{skill-name}/
  SKILL.md
  assets/        (optional)
  references/    (optional, local docs)
```

## Authoring Rules

- Include frontmatter (`name`, `description`, `license`, `metadata`).
- Keep examples small and copy-paste ready.
- Prefer references to local docs over duplicated content.
- Register each new skill in `AGENTS.md`.
