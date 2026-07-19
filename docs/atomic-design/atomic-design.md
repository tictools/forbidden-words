# Atomic Design under `/app/ui` (strict HTML rule)

`app/ui/atoms/`, `app/ui/molecules/` (extend with `organisms/`/`templates/` if needed). **Native HTML elements (`div`, `button`, `h1`, etc.) may only appear inside atoms** — molecules/organisms/templates compose atoms only, never raw HTML. Purely visual conditional rendering (`cond && <UI/>`) in molecules+ must use the `RenderOrNull` / `RenderOrFallback` guard atoms instead. Full rule + verification grep commands: `.cursor/rules/atomic-design-ui.mdc`, patterns: `.cursor/skills/atomic-design-ui/SKILL.md`.
