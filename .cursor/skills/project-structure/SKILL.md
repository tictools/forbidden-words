---
name: project-structure
description: Project structure conventions for app/core/tests
---

# Project structure

- Use `/app` for UI (React components, routes/pages, UI hooks).
- Use `/core` for domain logic (entities, use-cases, ports/adapters, pure logic).
- Use `/tests` **only** for: global test **configuration** (e.g. Vitest `setupFiles`), shared **mocks/fakes**, and **mother objects/builders**. Do **not** put domain behavior specs (`*.test.ts` / `*.spec.ts` for code in `/core`) in `/tests`.

## No barrels (repository-wide)

- **Do not** add `index.ts` / `index.tsx` (or any file) whose main job is to **re-export sibling modules**. This applies to **`/app`**, **`/core`**, and **`/tests`**: importers use the **concrete file** that defines the symbol (e.g. `@core/game/createGame`, `@app/<feature>/MyComponent/MyComponent.tsx`).
- Each unit owns its exports directly; avoids noisy bundles, circular dependencies, and unclear public surfaces.

## File naming (`/core`, `/app`)

- **Multi-word** module names use **camelCase** (`createGame.ts`, `submitAnswer.ts`, `wordFromCollection.ts`). Do **not** use kebab-case (`create-game.ts`).
- **Single-word** filenames are fine for small modules (`types.ts`, `shuffle.ts`).
- Test files mirror the module: `createGame.test.ts` beside `createGame.ts` under `__tests__/`.

## Core modules

- Group related domain code in a folder per feature or bounded context, e.g. `core/game/`, `core/smoke/`.
- Colocate **core** specs in **`__tests__`** inside that folder, e.g. `core/game/__tests__/createGame.test.ts`.

Example:

```
core/
  game/
    createGame.ts               # exports from this file only
    __tests__/
      createGame.test.ts        # imports @core/game/createGame or ../createGame
```

## Domain complexity

- Prefer **small pure functions** and **narrow modules** over one large function with many branches. When cyclomatic complexity grows, extract helpers (e.g. state computation vs. phase resolution vs. building a finished aggregate) and keep each unit easy to test in isolation.
- Inject non-determinism (**random**, **shuffle**, **time**, **ids**) via parameters or factories so tests stay deterministic.

## Principles

- Keep domain logic out of `/app`; UI orchestrates, domain decides.
- Prefer **screaming architecture** naming under `/core/<DomainEntity>/...` for larger domains.
- Mirror domain structure under `/tests/core/<DomainEntity>/...` **for mothers, builders, and shared fakes/mocks only** (not for domain spec files—those stay in `core/.../__tests__/`).
