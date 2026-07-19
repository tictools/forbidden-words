# TypeScript conventions

- Derive unions from `as const` objects, never write direct string-union types (`const STATUS = {...} as const; type Status = (typeof STATUS)[keyof typeof STATUS]`).
- Flat interfaces (one level deep) — no inline nested object types.
- Never use `any`; use `unknown` + generics + type guards instead.
- For every **exported function**, define a named `XxxParams` type for its parameters (readonly object, single destructured argument) instead of inline param types — e.g. `CreateGameParams`, `SubmitAnswerParams`.
- `import type { ... }` for type-only imports.

Full patterns: `.cursor/rules/typescript.mdc` (base) and `.cursor/skills/typescript/SKILL.md` (repo-specific `/core` rules).
