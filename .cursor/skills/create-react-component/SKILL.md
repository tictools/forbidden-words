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
- **No** `ComponentName/index.ts` barrel: importers reference `ComponentName/ComponentName` explicitly (repo-wide rule; see `project-structure`).
- Prefer early returns for loading/error/empty states.
- Keep UI components thin and extract business logic to `use<Feature>` hooks.

## Colocated hooks under the component

- Put hooks that belong to a single component **next to that component**, not in a generic `hooks/` (or `utils/` / `helpers/`) folder used only to group hooks.
- **One directory per hook**, named after the hook, **inside** the component folder:
  - `ComponentName/useHookName/useHookName.ts`
  - `ComponentName/useHookName/__tests__/useHookName.test.tsx` (or `.test.ts` when no JSX)
- Imports stay **explicit** to the hook file (e.g. `@app/ui/molecules/MyCard/useMyCard/useMyCard`); **no** barrels for hooks either (same rule as components).

## Path Aliases (REQUIRED)

- Use aliases from `tsconfig.json`; never use deep `../../../` across feature boundaries.
- `@app/*` → `app/*`, `@core/*` → `core/*`, `@tests/*` → `tests/*` (see project rule **`.cursor/rules/create-react-component.mdc`** for examples and testing conventions).

## Testing (REQUIRED)

- Use Vitest + React Testing Library (+ MSW if network involved).
- Prefer semantic queries (`getByRole`, `getByLabelText`, `getByText`) before `data-testid`.
- `data-testid` is for tests only, never for client logic or CSS selectors.

## Resources

- For optimization patterns, see skill `vercel-react-best-practices` and project rule `.cursor/rules/vercel-react-best-practices.mdc`.
