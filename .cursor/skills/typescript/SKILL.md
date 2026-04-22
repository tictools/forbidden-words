---
name: typescript
description: >
  TypeScript patterns for this repo’s /core domain and module layout (extends the project TS rule).
  Trigger: When writing or refactoring TypeScript in /core, path aliases, or exported function signatures.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.1"
---

## Base TypeScript patterns

For **const-derived types**, **flat interfaces**, avoiding **`any`**, **utility types**, **type guards**, and **`import type`** in `app/**/*.ts(x)` and elsewhere, follow the project rule **[`.cursor/rules/typescript.mdc`](.cursor/rules/typescript.mdc)**. This skill adds **repository-specific** rules below.

## Domain `/core`: types vs constants (REQUIRED)

- In **entity folders** (`core/<Entity>/`), keep **interfaces / type aliases** in files like **`Entity.ts`** (or focused files such as `GameConfig.ts`).
- Keep **`const` objects** (canonical values, `as const`) in **separate files** — e.g. `gameConstants.ts`, `severityConstants.ts` — and derive union types from them in the type file or next to the const file, **without** mixing unrelated `interface` blocks in the same file as large const maps (see `project-structure`).

## Function parameter types (REQUIRED for exported functions)

- Define a named **`type` alias** for the parameters of each **exported** function—do not leave long inline object types on the signature.
- Convention: **`XxxParams`** (e.g. `CreateGameParams`, `SubmitAnswerParams`) as a **`readonly` object**; the function takes a single argument and uses destructuring: `export function createGame(params: CreateGameParams) { ... }`.
- Reuse shared pieces (`AnswerPhaseDelta`, `FinishedGamePatch`) when the same shape appears in more than one place.
- Complex return shapes may use a named type too (e.g. `AnswerStateResult`) instead of an inline object type.

## Imports and modules

- Use `import type` for type-only imports.
- Import from the **concrete module** that defines the symbol. **No barrel `index.ts` / `index.tsx`** in **`/app`**, **`/core`**, or **`/tests`**—use explicit paths (e.g. `@core/Game/logic/createGame`, `@core/Word/Word`, `@app/<feature>/<Component>/<Component>.tsx`; see `project-structure`).
