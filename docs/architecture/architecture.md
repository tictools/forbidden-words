# Architecture

Three top-level source roots, each with a distinct responsibility, wired via TS path aliases (`@app/*`, `@core/*`, `@tests/*` in `tsconfig.json` / `vite.config.ts`):

- **`/core`** — pure domain logic (Shallow DDD). No framework or infra dependencies. Entities/value objects: `Word`, `WordCard`, `Game`, `GameConfig`, `GameProgress`, `Answer`, `AnswerPhase`, `AnswerState`, `Severity`. Domain behavior lives in `Entity/logic/*.ts` (e.g. `core/Game/logic/submitAnswer.ts`, `core/Game/logic/createGame.ts`). Non-determinism (random, shuffle) is injected via factories (`core/shared/randomTypes.ts`, `core/shared/createShuffle.ts`) rather than called directly, so domain logic stays deterministic and testable.
- **`/app`** — UI (React components, hooks, the Zustand store, speech integration). UI orchestrates; it must not contain domain decisions. `app/game/GameShell/store/gameStore.ts` defines the Zustand store as a factory taking injected `randomInt`/`shuffle`; `gameStoreInstance.ts` wires the real implementations for runtime use (tests can inject fakes instead).
- **`/tests`** — global test config only (`tests/setup.ts`), plus shared mothers/builders/fakes reused across suites. It must **not** contain domain spec files.

## Entity-first layout under `/core` (screaming architecture)

Each domain concept is its own PascalCase directory: `core/<Entity>/<Entity>.ts` (types/interfaces only) + separate `*Constants.ts` files for `as const` value maps (e.g. `gameConstants.ts`, `severityConstants.ts` — never mix `interface` and large `const` maps in one file) + `logic/` for behavior + `logic/__tests__/` for colocated specs. Full pattern and example tree: `.cursor/skills/project-structure/SKILL.md`.

UI-internal layering (Atomic Design) and component/hook directory structure are documented separately — see [docs/atomic-design/atomic-design.md](../atomic-design/atomic-design.md) and [docs/component-structure/component-structure.md](../component-structure/component-structure.md).

## No barrels anywhere

`/app`, `/core`, and `/tests` never use `index.ts`/`index.tsx` re-export files. Import the concrete module directly (e.g. `@core/Game/logic/createGame`, `@app/ui/atoms/Box/Box`). Always use the `@app/*` / `@core/*` / `@tests/*` aliases across folder boundaries — never deep relative imports (`../../..`).
