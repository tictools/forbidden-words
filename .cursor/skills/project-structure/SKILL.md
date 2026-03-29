---
name: project-structure
description: Project structure conventions for app/core/tests
---

# Project structure

- Use `/app` for UI (React components, routes/pages, UI hooks).
- Use `/core` for domain logic (entities, use-cases, ports/adapters, pure logic).
- Use `/tests` **only** for: global test **configuration** (e.g. Vitest `setupFiles`), shared **mocks/fakes**, and **mother objects/builders**. Do **not** put domain behavior specs (`*.test.ts` / `*.spec.ts` for code in `/core`) in `/tests`.

## No barrels (repository-wide)

- **Do not** add `index.ts` / `index.tsx` (or any file) whose main job is to **re-export sibling modules**. This applies to **`/app`**, **`/core`**, and **`/tests`**: importers use the **concrete file** that defines the symbol (e.g. `@core/smoke/toolchain-smoke`, `@app/<feature>/MyComponent/MyComponent.tsx`).
- Each unit owns its exports directly; avoids noisy bundles, circular dependencies, and unclear public surfaces.

## Core modules

- Group related domain code in a folder per feature or bounded context, e.g. `core/smoke/`.
- Colocate **core** specs in **`__tests__`** inside that folder, e.g. `core/smoke/__tests__/toolchain-smoke.test.ts`.

Example:

```
core/
  smoke/
    toolchain-smoke.ts          # exports from this file only
    __tests__/
      toolchain-smoke.test.ts   # imports @core/smoke/toolchain-smoke or ../toolchain-smoke
```

## Principles

- Keep domain logic out of `/app`; UI orchestrates, domain decides.
- Prefer **screaming architecture** naming under `/core/<DomainEntity>/...` for larger domains.
- Mirror domain structure under `/tests/core/<DomainEntity>/...` **for mothers, builders, and shared fakes/mocks only** (not for domain spec files—those stay in `core/.../__tests__/`).
