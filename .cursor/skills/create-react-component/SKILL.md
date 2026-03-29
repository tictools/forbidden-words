---
name: create-react-component
description: >
  Creates or refactors React components in TypeScript with named exports, typed props,
  early returns, extracted hooks, and test coverage.
  Trigger: When creating a new React component (`*.tsx`), refactoring a component, or extracting component logic into a hook.
license: Apache-2.0
metadata:
  author: tictools
  version: "1.0"
---

## Critical Patterns (REQUIRED)

- Use arrow function components and **named exports only** (no `export default`).
- Props must be `type <ComponentName>Props = { ... }`.
- Every component has its own folder:
  - `ComponentName/ComponentName.tsx`
  - `ComponentName/__tests__/ComponentName.test.tsx`
  - `ComponentName/__mocks__/` when needed.
- Prefer early returns for loading/error/empty states.
- Keep UI components thin and extract business logic to `use<Feature>` hooks.

## Path Aliases (REQUIRED)

- Use aliases, never relative imports across feature boundaries:
  - `@/*` -> `src/*`
  - `@/components/*` -> `src/components/*`
  - `@/atoms/*` -> `src/components/atoms/*`
  - `@/molecules/*` -> `src/components/molecules/*`
  - `@/data/*` -> `src/data/*`
  - `@/assets/*` -> `src/assets/*`

## Testing (REQUIRED)

- Use Vitest + React Testing Library (+ MSW if network involved).
- Prefer semantic queries (`getByRole`, `getByLabelText`, `getByText`) before `data-testid`.
- `data-testid` is for tests only, never for client logic or CSS selectors.

## Resources

- For optimization patterns, see `vercel-react-best-practices`.
