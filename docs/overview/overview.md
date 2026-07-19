# Overview

A Catalan-language, gamified spelling-practice web app (student role only, V1). The player hears a word via Web Speech API (`ca-ES`) and picks the correct spelling from three shuffled options. Product behavior (progress bars, error-severity colors, pending-word rules, confetti, exit flow, accessibility, Catalan-only UI) is fully specified in `specs/product/SPECS_v1.md`; the technical mapping of that spec to code (domain model, folder layout, data shapes) is in `specs/tech/SPECS_v1.md`. Read those two files before making product-behavior changes — they are the source of truth, not this file.

Stack: React 19 + TypeScript (strict) + Vite + Tailwind v4 + Zustand + Vitest/RTL. Deployed to Netlify.
