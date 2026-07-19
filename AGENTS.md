# AGENTS.md

Canonical, harness-agnostic registry for this repo. Claude Code, Cursor, OpenCode, or any other coding agent/harness should start here.

## Commands

Project scripts (pnpm) — full detail in [docs/commands/commands.md](docs/commands/commands.md).

## Skills

A skill is invoked **by name**, independent of harness or file path — resolve *when* a task matches, not *where* the file happens to live. Every skill's canonical source is `.cursor/skills/<name>/SKILL.md`; each harness resolves that name through its own discovery mechanism (Cursor natively, Claude Code / OpenCode via the symlinked copy under `.claude/skills/<name>/SKILL.md` / `.opencode/skills/<name>/SKILL.md` — see "Harness-specific notes" below). Do not hardcode a harness-specific path when deciding which skill to invoke.

| When a task requires... | Invoke skill |
|---|---|
| Placing native HTML elements, composing UI by Atomic Design level (atoms/molecules/organisms), or visual-only conditional rendering (`cond && <UI/>`) | `atomic-design-ui` |
| Creating a new React component, refactoring one, or extracting component logic into a hook | `create-react-component` |
| Extracting, adding, or testing a `use*` hook | `hooks-testing-and-mocks` |
| Deciding where new code belongs (`/app`, `/core`, `/tests`) or laying out a new domain entity | `project-structure` |
| Writing or modifying any behavior — new feature, bug fix, or refactor (Red → Green → Refactor) | `tdd` |
| Adding test fixtures, mother objects/builders, or deciding what belongs in `/tests` vs colocated specs | `tests-mothers-and-mocks` |
| Writing or refactoring TypeScript in `/core`, path aliases, or exported function signatures | `typescript` |
| Writing, reviewing, or refactoring React for rendering/perf | `vercel-react-best-practices` |
| Creating a new skill or documenting a pattern for an AI agent | `skill-creator` |
| Filing GitHub issues from requirements gaps, review findings, or code defects | `remote-issue-from-findings` |

Project rules (Cursor `.mdc`, glob/`alwaysApply`-triggered — short, contextual):

| Topic | Path |
|--------|------|
| TypeScript (base patterns) | [.cursor/rules/typescript.mdc](.cursor/rules/typescript.mdc) |
| React component conventions | [.cursor/rules/create-react-component.mdc](.cursor/rules/create-react-component.mdc) |
| Atomic Design (strict HTML in atoms) | [.cursor/rules/atomic-design-ui.mdc](.cursor/rules/atomic-design-ui.mdc) |
| Vercel performance checklist | [.cursor/rules/vercel-react-best-practices.mdc](.cursor/rules/vercel-react-best-practices.mdc) |
| GitHub issue resolution (plan + review gate) | [.cursor/rules/resolve-github-issue.mdc](.cursor/rules/resolve-github-issue.mdc) |

## Docs

Context and architecture docs for this repo — see [`/docs`](docs). One topic per subdirectory, one file per topic.

| Topic | Path |
|--------|------|
| Overview | [docs/overview/overview.md](docs/overview/overview.md) |
| Commands | [docs/commands/commands.md](docs/commands/commands.md) |
| Architecture (source-root split, entity-first `/core`, no barrels) | [docs/architecture/architecture.md](docs/architecture/architecture.md) |
| Atomic Design (UI layering, strict HTML-in-atoms) | [docs/atomic-design/atomic-design.md](docs/atomic-design/atomic-design.md) |
| Component structure (React component/hook directories) | [docs/component-structure/component-structure.md](docs/component-structure/component-structure.md) |
| TypeScript conventions | [docs/typescript-conventions/typescript-conventions.md](docs/typescript-conventions/typescript-conventions.md) |
| Testing conventions | [docs/testing-conventions/testing-conventions.md](docs/testing-conventions/testing-conventions.md) |
| Product behavior | [docs/product-behavior/product-behavior.md](docs/product-behavior/product-behavior.md) |
| Editing rules files | [docs/editing-rules-files/editing-rules-files.md](docs/editing-rules-files/editing-rules-files.md) |

## Specs

- Product: [specs/product/SPECS_v1.md](specs/product/SPECS_v1.md)
- Tech: [specs/tech/SPECS_v1.md](specs/tech/SPECS_v1.md)

## Harness-specific notes

### Cursor

- **Rules**: `.cursor/rules/*.mdc` (see each file's `globs` / `alwaysApply`).
- **Skills**: `.cursor/skills/<name>/SKILL.md` (discovered by Cursor).

### Claude Code

- **Skills**: Claude Code loads `skills/*/SKILL.md` under [`.claude/skills/`](.claude/skills). In this repo each `.claude/skills/<name>/SKILL.md` is a **symlink** to the canonical [`.cursor/skills/<name>/SKILL.md`](.cursor/skills) so there is a single source of truth.
- **Bootstrap**: `CLAUDE.md` at the repo root imports `AGENTS.md` (`@AGENTS.md`) and adds Claude-specific notes on top.

### OpenCode

- **Skills**: OpenCode loads `skills/*/SKILL.md` under [`.opencode/skills/`](.opencode/skills). In this repo each `.opencode/skills/<name>/SKILL.md` is a **symlink** to the canonical [`.cursor/skills/<name>/SKILL.md`](.cursor/skills) so there is a single source of truth.
- **Config**: [opencode.json](opencode.json) at the repo root (`permission.skill` defaults to allow project skills).
- **Docs**: [Agent skills](https://open-code.ai/en/docs/skills) · [Custom commands](https://open-code.ai/en/docs/commands) · [Config](https://open-code.ai/en/docs/config).

#### Symlinks and Windows

If symlinks show up as plain text files after clone, enable `git config core.symlinks true` and clone/checkout again on Windows, or recreate the symlinks using the same relative target: `../../../.cursor/skills/<name>/SKILL.md` from `.claude/skills/<name>/SKILL.md` or `.opencode/skills/<name>/SKILL.md`.

#### Custom commands (TUI `/…`)

Defined in [`.opencode/commands/`](.opencode/commands):

| Command | File | Purpose |
|---------|------|---------|
| `/tdd` | [tdd.md](.opencode/commands/tdd.md) | TDD workflow + project layout skills |
| `/new-component` | [new-component.md](.opencode/commands/new-component.md) | New/refactor component; pass name as `$ARGUMENTS` |
| `/domain` | [domain.md](.opencode/commands/domain.md) | `/core` structure + TypeScript skill + rule |
| `/ui-review` | [ui-review.md](.opencode/commands/ui-review.md) | Atomic Design rule + visual-guard skill |
| `/remote-issue` | [remote-issue.md](.opencode/commands/remote-issue.md) | GitHub issues from findings + `type/*` labels |
| `/resolve-issue` | [resolve-issue.md](.opencode/commands/resolve-issue.md) | Resolve a GitHub issue (number or title): verify, plan, user review, execute |
