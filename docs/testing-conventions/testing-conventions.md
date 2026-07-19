# Testing conventions

TDD (Red → Green → Refactor) is expected for new/changed behavior — see `.cursor/skills/tdd/SKILL.md`.

- Domain specs live beside the code: `core/<Entity>/logic/__tests__/<fn>.test.ts` — never under `/tests`.
- Component/hook specs live under their own `__tests__/` next to the component/hook, per the structure in [component-structure.md](../component-structure/component-structure.md).
- Stack: Vitest + React Testing Library (+ MSW for any HTTP I/O, though this app currently has none).
- Query priority: `getByRole` / `getByText` / `getByLabelText` / `getByPlaceholderText` before `data-testid`. `data-testid` is test-only — never used for CSS selectors, `querySelector`, refs, or client logic.
- Inject randomness/time/shuffle so tests stay deterministic (see `core/shared/createShuffle.ts` pattern).
- `/tests` holds only global setup (`tests/setup.ts`) and shared mothers/mocks reused across multiple suites — not one-off domain specs.
