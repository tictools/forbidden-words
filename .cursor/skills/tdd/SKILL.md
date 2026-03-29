---
name: tdd
description: Enforce Red -> Green -> Refactor for all changes
---

# TDD workflow

- Follow **Red -> Green -> Refactor** for any new or modified code.
- Write/adjust the test first (or alongside the change if refactoring requires safety net).
- Keep increments small; prefer the simplest implementation that makes the test pass.
- Refactor only after green; keep behavior unchanged during refactors.
