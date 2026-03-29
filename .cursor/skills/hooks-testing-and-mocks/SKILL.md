---
name: hooks-testing-and-mocks
description: Hook extraction requires tests and mocks (Vitest/RTL/MSW)
---

# Hooks: testing and mocks

- When extracting or adding a hook (`use*`), also add/adjust tests.
- Use **Vitest** for unit tests.
- Use **React Testing Library** when the hook is UI-facing (renderHook, interactions, state changes).
- Use **MSW** when the hook performs HTTP I/O; avoid real network calls in tests.

## Expectations

- Prefer deterministic tests; control time, randomness, and network.
- If a hook is consumed by multiple components, test the hook's contract (inputs/outputs) rather than duplicating component tests.
