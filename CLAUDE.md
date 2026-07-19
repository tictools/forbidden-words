# CLAUDE.md

This file bootstraps Claude Code with repo-wide conventions and routing.
All canonical rules live in `AGENTS.md`; this file imports them.

@AGENTS.md

## Claude-Specific Notes

- Context and architecture docs live under `/docs`; see `AGENTS.md`'s Docs registry for the full index — read the relevant `docs/<topic>/<topic>.md` before non-trivial changes.
- Cursor/OpenCode auto-attach rule content lives in `.cursor/rules/*.mdc` and `.cursor/skills/*/SKILL.md` — these remain canonical for TypeScript, component, Atomic Design, and TDD specifics; `/docs` summarizes but does not replace them.
- Product and technical specs are in `specs/product/SPECS_v1.md` and `specs/tech/SPECS_v1.md` — read before changing game/domain behavior.
