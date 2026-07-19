# Component/hook structure

Every component owns a directory: `ComponentName/ComponentName.tsx` + `ComponentName/__tests__/ComponentName.test.tsx` (+ `__mocks__/` if needed). Component-specific hooks live *inside* that component's directory, one subdirectory per hook: `ComponentName/useSomething/useSomething.ts` + `ComponentName/useSomething/__tests__/`. Never a generic `hooks/`-style grouping folder. Named exports only (no `export default`); props typed as `type ComponentNameProps = {...}`. Details: `.cursor/skills/create-react-component/SKILL.md`, `.cursor/rules/create-react-component.mdc`.
