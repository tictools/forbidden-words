# Agent context (Cursor + OpenCode)

This file is a human-readable index for **Cursor** and **OpenCode**. Canonical skill content lives under [`.cursor/skills/<name>/SKILL.md`](.cursor/skills); Cursor loads rules from [`.cursor/rules/*.mdc`](.cursor/rules).

## Cursor

- **Rules**: `.cursor/rules/*.mdc` (see each file’s `globs` / `alwaysApply`).
- **Skills**: `.cursor/skills/<name>/SKILL.md` (discovered by Cursor).

## OpenCode

- **Skills**: OpenCode loads `skills/*/SKILL.md` under [`.opencode/skills/`](.opencode/skills). In this repo each `.opencode/skills/<name>/SKILL.md` is a **symlink** to the canonical [`.cursor/skills/<name>/SKILL.md`](.cursor/skills) so there is a single source of truth.
- **Config**: [opencode.json](opencode.json) at the repo root (`permission.skill` defaults to allow project skills).
- **Docs**: [Agent skills](https://open-code.ai/en/docs/skills) · [Custom commands](https://open-code.ai/en/docs/commands) · [Config](https://open-code.ai/en/docs/config).

### Symlinks and Windows

If symlinks show up as plain text files after clone, enable `git config core.symlinks true` and clone/checkout again on Windows, or recreate the symlinks using the same relative target: `../../../.cursor/skills/<name>/SKILL.md` from `.opencode/skills/<name>/SKILL.md`.

### Custom commands (TUI `/…`)

Defined in [`.opencode/commands/`](.opencode/commands):

| Command | File | Purpose |
|---------|------|---------|
| `/tdd` | [tdd.md](.opencode/commands/tdd.md) | TDD workflow + project layout skills |
| `/new-component` | [new-component.md](.opencode/commands/new-component.md) | New/refactor component; pass name as `$ARGUMENTS` |
| `/domain` | [domain.md](.opencode/commands/domain.md) | `/core` structure + TypeScript skill + rule |
| `/ui-review` | [ui-review.md](.opencode/commands/ui-review.md) | Atomic Design rule + visual-guard skill |
| `/remote-issue` | [remote-issue.md](.opencode/commands/remote-issue.md) | GitHub issues from findings + `type/*` labels |

## Skills (workflows & architecture)

| Skill | Canonical path |
|--------|----------------|
| Atomic Design (visual guards) | [.cursor/skills/atomic-design-ui/SKILL.md](.cursor/skills/atomic-design-ui/SKILL.md) |
| Create React component / hooks | [.cursor/skills/create-react-component/SKILL.md](.cursor/skills/create-react-component/SKILL.md) |
| Hooks: testing & mocks | [.cursor/skills/hooks-testing-and-mocks/SKILL.md](.cursor/skills/hooks-testing-and-mocks/SKILL.md) |
| Project structure (`/app`, `/core`, `/tests`) | [.cursor/skills/project-structure/SKILL.md](.cursor/skills/project-structure/SKILL.md) |
| TDD | [.cursor/skills/tdd/SKILL.md](.cursor/skills/tdd/SKILL.md) |
| Tests: mothers & mocks | [.cursor/skills/tests-mothers-and-mocks/SKILL.md](.cursor/skills/tests-mothers-and-mocks/SKILL.md) |
| TypeScript (`/core` extensions) | [.cursor/skills/typescript/SKILL.md](.cursor/skills/typescript/SKILL.md) |
| Vercel React best practices (summary) | [.cursor/skills/vercel-react-best-practices/SKILL.md](.cursor/skills/vercel-react-best-practices/SKILL.md) |
| Skill authoring | [.cursor/skills/skill-creator/SKILL.md](.cursor/skills/skill-creator/SKILL.md) |
| Remote GitHub issues (labeled by nature) | [.cursor/skills/remote-issue-from-findings/SKILL.md](.cursor/skills/remote-issue-from-findings/SKILL.md) |

## Project rules (short, contextual)

| Topic | Path |
|--------|------|
| TypeScript (base patterns) | [.cursor/rules/typescript.mdc](.cursor/rules/typescript.mdc) |
| React component conventions | [.cursor/rules/create-react-component.mdc](.cursor/rules/create-react-component.mdc) |
| Atomic Design (strict HTML in atoms) | [.cursor/rules/atomic-design-ui.mdc](.cursor/rules/atomic-design-ui.mdc) |
| Vercel performance checklist | [.cursor/rules/vercel-react-best-practices.mdc](.cursor/rules/vercel-react-best-practices.mdc) |

## Specs

- Product: [.cursor/specs/product/SPECS_v1.md](.cursor/specs/product/SPECS_v1.md)
- Tech: [.cursor/specs/tech/SPECS_v1.md](.cursor/specs/tech/SPECS_v1.md)
