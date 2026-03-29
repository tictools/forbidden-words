---
name: project-structure
description: Project structure for app/core/tests; entity-first domain layout under /core
---

# Project structure

- Use `/app` for UI (React components, routes/pages, UI hooks).
- Use `/core` for domain logic (entities, domain services, pure logic).
- Use `/tests` **only** for: global test **configuration** (e.g. Vitest `setupFiles`), shared **mocks/fakes**, and **mother objects/builders**. Do **not** put domain behavior specs (`*.test.ts` / `*.spec.ts` for code in `/core`) in `/tests`.

## No barrels (repository-wide)

- **Do not** add `index.ts` / `index.tsx` (or any file) whose main job is to **re-export sibling modules**. This applies to **`/app`**, **`/core`**, and **`/tests`**: importers use the **concrete file** that defines the symbol (e.g. `@core/Game/logic/createGame`, `@app/<feature>/MyComponent/MyComponent.tsx`).
- Each unit owns its exports directly; avoids noisy bundles, circular dependencies, and unclear public surfaces.

## Domain layout under `/core` (entity-first)

- Model **each domain entity** (or cohesive value object / concept) as **its own directory** under `/core`, named in **PascalCase** after the domain concept: e.g. `core/Game/`, `core/Word/`, `core/WordCard/`, `core/Severity/`, `core/GameProgress/`, `core/Answer/`, `core/AnswerPhase/`, `core/AnswerState/`.
- **Types vs constants (strict separation)**:
  - **`Entity/Entity.ts`** — defines the entity (or main type) for that folder: **interfaces / types only** (`interface Game`, `type ErrorSeverity`, …).
  - **Constants live in separate files** in the same folder — e.g. `gameConstants.ts` (`GAME_STATUS`, `GAME_RESULT`), `severityConstants.ts` (`ERROR_SEVERITY`), `answerConstants.ts` (`ANSWER_EFFECT`). Do **not** put `const` and `interface` in the same file when both are part of the public model.
  - Extra types for the same bounded context may use additional files (`GameConfig.ts`, `Answer.ts`) if a single file would become too large.
- **Domain behavior** (rules, factories, use-case functions that coordinate entities) lives under **`Entity/logic/`**, in **camelCase** files: e.g. `core/Game/logic/createGame.ts`, `core/Game/logic/submitAnswer.ts`, `core/Severity/logic/errorSeverityFromWrongAnswers.ts`.
- **Tests for domain logic** are colocated under **`Entity/logic/__tests__/`** (e.g. `createGame.test.ts` next to `createGame.ts`). Tests target **concrete modules** via path aliases (`@core/Game/logic/createGame`).
- **Cross-cutting technical helpers** that are not business rules (e.g. Fisher–Yates shuffle, injectable `RandomIntFn` / `ShuffleFn` types) live under **`/core/shared/`** — not as fake “entities”. Keeps domain folders free of framework-like utilities.

## File naming (`/core`, `/app`)

- **Multi-word** module names use **camelCase** (`createGame.ts`, `submitAnswer.ts`). Do **not** use kebab-case (`create-game.ts`).
- **Single-word** filenames are fine for small modules when appropriate (`randomTypes.ts`).
- Test files mirror the module: `createGame.test.ts` beside `createGame.ts` (under `logic/__tests__/` for logic code).

## Example (entity + logic + tests)

```
core/
  Game/
    Game.ts
    GameConfig.ts
    gameConstants.ts
    logic/
      createGame.ts
      submitAnswer.ts
      __tests__/
        createGame.test.ts
  Word/
    Word.ts
    logic/
      wordsFromCollection.ts
      __tests__/
        wordsFromCollection.test.ts
  shared/
    randomTypes.ts
    createShuffle.ts
    __tests__/
      createShuffle.test.ts
```

## Legacy / small modules

- Smoke checks or tiny demos may use a **lowercase** folder (e.g. `core/smoke/`) when they are not a full entity slice; prefer the entity-first layout for real domain code.

## Domain complexity

- Prefer **small pure functions** and **narrow modules** over one large function with many branches. When cyclomatic complexity grows, extract **domain services** into separate files under the relevant **`Entity/logic/`** (or a dedicated entity folder for cross-cutting concepts like `AnswerPhase`).
- Inject non-determinism (**random**, **shuffle**, **time**, **ids**) via parameters or factories so tests stay deterministic; place generic shuffle/random **types** under `shared/` when they are not part of a single entity’s definition.

## Principles

- Keep domain logic out of `/app`; UI orchestrates, domain decides.
- **Screaming architecture**: folder names under `/core` reflect domain language (`Game`, `Severity`), not technical layers only.
- Mirror domain structure under `tests/core/<DomainEntity>/...` **for mothers, builders, and shared fakes/mocks only** (not for domain spec files—those stay under `core/<Entity>/logic/__tests__/` or next to the tested file per rules above).
