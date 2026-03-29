---
name: vercel-react-best-practices
description: React and Next.js performance optimization guidelines from Vercel Engineering.
license: MIT
metadata:
  author: vercel
  version: "1.0.0"
---

# Vercel React Best Practices

Use this skill when writing, reviewing, or refactoring React/Next.js for performance.

## Priority Order

1. Eliminating waterfalls (`async-*`)
2. Bundle size optimization (`bundle-*`)
3. Server-side performance (`server-*`)
4. Client-side data patterns (`client-*`)
5. Re-render optimization (`rerender-*`)
6. Rendering performance (`rendering-*`)
7. JavaScript micro-optimizations (`js-*`)
8. Advanced patterns (`advanced-*`)

## High-Impact Rules

- `async-parallel`: use `Promise.all` for independent async work.
- `bundle-barrel-imports`: import direct modules, avoid barrel imports on hot paths.
- `server-cache-react`: use request-level dedup patterns.
- `client-swr-dedup`: deduplicate repeated client fetches.
- `rerender-derived-state-no-effect`: derive UI values during render when possible.
- `rendering-content-visibility`: reduce rendering cost for large off-screen sections.

## Usage

Read detailed rule files from the tool-specific rule directories during implementation.
