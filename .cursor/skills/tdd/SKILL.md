---
name: tdd
description: Enforce Red -> Green -> Refactor for all changes
---

# TDD workflow

- Follow **Red -> Green -> Refactor** for any new or modified code.
- Write/adjust the test first (or alongside the change if refactoring requires safety net).
- Keep increments small; prefer the simplest implementation that makes the test pass.
- Refactor only after green; keep behavior unchanged during refactors.
- During refactor, **lower cyclomatic complexity**: extract pure helpers or modules when a function accumulates branches; add or adjust tests for the new units so behavior stays pinned.
- For **domain** (`/core`), place specs next to the code under test:
  - **`core/<Entity>/logic/__tests__/`** for files in `logic/` (e.g. `createGame.test.ts` beside `createGame.ts`).
  - Avoid putting domain behavior specs in `/tests` (that directory is for setup, mothers, shared mocks only — see `tests-mothers-and-mocks`).
- Import **concrete modules** only—**no barrels** in `/app`, `/core`, or `/tests` (see `project-structure` and `tests-mothers-and-mocks`).
- Use **camelCase** filenames for multi-word modules (see `project-structure`).
