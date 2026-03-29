---
name: project-structure
description: Project structure conventions for app/core/tests
---

# Project structure

- Use `/app` for UI (React components, routes/pages, UI hooks).
- Use `/core` for domain logic (entities, use-cases, ports/adapters, pure logic).
- Use `/tests` for test utilities and test-only code, mirroring the screaming architecture of `/core`.

## Principles

- Keep domain logic out of `/app`; UI orchestrates, domain decides.
- Prefer **screaming architecture** naming under `/core/<DomainEntity>/...`.
- Mirror domain structure under `/tests/core/<DomainEntity>/...` for mothers, builders, shared fakes/mocks.
