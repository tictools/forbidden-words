---
name: typescript
description: >
  TypeScript strict patterns and best practices.
  Trigger: When writing TypeScript code - types, interfaces, generics.
license: Apache-2.0
metadata:
  author: gentleman-programming
  version: "1.0"
---

## Const Types Pattern (REQUIRED)

```typescript
const STATUS = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  PENDING: "pending",
} as const;

type Status = (typeof STATUS)[keyof typeof STATUS];
```

Do not write unions directly when a canonical const object can be used.

## Flat Interfaces (REQUIRED)

- Prefer one level depth; extract nested inline shapes into named interfaces.
- Avoid deep inline nested object types in model interfaces.

## Never Use `any`

- Use `unknown` with type guards.
- Use generics for reusable typed functions.

## Utility Types

Use built-in helpers (`Pick`, `Omit`, `Partial`, `Required`, `Readonly`, `Record`, `Extract`, `Exclude`, `NonNullable`, `ReturnType`, `Parameters`) before inventing custom wrappers.

## Function parameter types (REQUIRED for exported functions)

- Define a named **`type` alias** for the parameters of each **exported** function—do not leave long inline object types on the signature.
- Convention: **`XxxParams`** (e.g. `CreateGameParams`, `SubmitAnswerParams`) as a **`readonly` object**; the function takes a single argument and uses destructuring: `export function createGame(params: CreateGameParams) { ... }`.
- Reuse shared pieces (`AnswerPhaseDelta`, `FinishedGamePatch`) when the same shape appears in more than one place.
- Complex return shapes may use a named type too (e.g. `AnswerStateResult`) instead of an inline object type.

## Imports

Use `import type` for type-only imports.
- Import from the **concrete module** that defines the symbol. **No barrel `index.ts` / `index.tsx`** in **`/app`**, **`/core`**, or **`/tests`**—use explicit paths (e.g. `@core/game/createGame`, `@app/<feature>/<Component>/<Component>.tsx`; see `project-structure`).
