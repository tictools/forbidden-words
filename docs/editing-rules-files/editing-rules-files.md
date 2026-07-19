# Editing rules files themselves

Cursor rules (`.cursor/rules/*.mdc`) and skills (`.cursor/skills/*/SKILL.md`) are the canonical source; `AGENTS.md` is the harness-agnostic registry into them, and `.opencode/skills/**` and `.claude/skills/**` are symlinks back to `.cursor/skills/**` — don't edit the symlink targets independently. If you change a skill/rule, update it in `.cursor/skills/` or `.cursor/rules/`, not in the OpenCode or Claude Code copy.

Docs under `/docs` summarize and cross-reference `.cursor/rules`/`.cursor/skills`/`/specs` — they don't replace them. If a change affects a rule/skill's actual content, edit the rule/skill file; update the matching `/docs` file only if the summary itself goes stale.
