# Commands

```bash
pnpm dev              # start dev server
pnpm build            # production build (vite build)
pnpm preview          # preview production build
pnpm test             # run all tests once (vitest run)
pnpm test:watch       # vitest watch mode
pnpm lint             # eslint .
pnpm typecheck        # tsc --noEmit
```

Run a single test file: `pnpm vitest run path/to/File.test.ts` (or `pnpm vitest path/to/File.test.ts` to watch it). CI (`.github/workflows/ci.yml`) runs, in order: install (`pnpm install --frozen-lockfile`) → lint → typecheck → test → build. Match that order locally before considering work done.
