---
name: tests-mothers-and-mocks
description: /tests holds config, mocks, and mothers only; core specs in __tests__ per module
---

# Tests: mothers and mocks

- The **`/tests` directory** is for **global test config** (e.g. RTL/jest-dom setup for Vitest), **reusable mocks/fakes**, and **mother objects/builders**. It must **not** contain `*.test.ts` / `*.spec.ts` files that exercise domain code in `/core`.
- **Domain specs** live under **`/core/<module>/__tests__/`** next to the module (see `project-structure`). Test imports must target **concrete modules** (e.g. `@core/.../file`); follow the **repo-wide no-barrel** rule.
- Use **mother objects/builders** for reusable domain test data (especially entities/value objects).
- Provide explicit mocks/fakes for hook dependencies (e.g. API clients, storage, time).

## Structure guideline

- Mirror domain under `tests/core/<DomainEntity>/...` **only** for mothers/builders and shared fakes—not for domain spec files.
- For **React UI** under `/app`, keep component tests colocated as `__tests__` next to the component when following the component skill.
- Promote helpers to shared mothers/mocks under `/tests` only when reused across suites.
