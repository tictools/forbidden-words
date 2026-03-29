---
name: tests-mothers-and-mocks
description: Tests conventions: tests/ directory, mothers, and mocks
---

# Tests: mothers and mocks

- Keep test-only helpers under `/tests`.
- Use **mother objects/builders** for reusable domain test data (especially entities/value objects).
- Provide explicit mocks/fakes for hook dependencies (e.g. API clients, storage, time).

## Structure guideline

- Mirror domain under `tests/core/<DomainEntity>/...` for mothers/builders and shared fakes.
- Keep per-feature test helpers close to the tests that use them; promote to shared only when reused.
