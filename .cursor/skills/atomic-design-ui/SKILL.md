---
name: atomic-design-ui
description: Atomic Design conventions for UI components
---

# Atomic Design (UI)

- Organize UI as **Atomic Design** (atoms/molecules/organisms/templates/pages or the repo's agreed variant).
- New components should be placed in the smallest appropriate level; don't skip levels without reason.
- Favor composition over inheritance; keep components focused and reusable.

## HTML Elements Rule

- **Native HTML elements** (`div`, `span`, `form`, `input`, `button`, `p`, `h1`, `h2`, `h3`, `h4`, `h5`, `h6`, `ul`, `ol`, `li`, `table`, `tr`, `td`, `th`, `label`, `section`, `article`, `aside`, `header`, `footer`, `nav`, `main`, etc.) **can ONLY be defined in atoms**.
- **Molecules, organisms, and templates MUST NOT** contain native HTML elements directly. They should only compose and use atoms or higher-level components.
- If you need a container, wrapper, or layout element in a molecule/organism/template, extract it as an atom first, then use that atom.

## Visual-only conditional rendering (STRICT)

- Avoid purely visual conditional patterns in molecules/organisms/templates:
  - `condition && <UI />`
  - `condition ? <UI /> : null`
  - `condition ? <UI /> : <Fallback />` (when used only for show/hide)
- Use dedicated atoms for visual gating:
  - **`RenderOrNull`**: receives `shouldRender` and `children`; if `shouldRender === false`, return `null`, otherwise render `children`.
  - **`RenderOrFallback`**: receives `shouldRender`, `fallback` (`ReactNode`), and `children`; if `shouldRender === false`, render `fallback`, otherwise render `children`.
- Keep this pattern purely visual:
  - `fallback` must be a ready JSX node/component (for example `<MutedText />`), not a function.
  - Do not add container semantics or extra logic complexity.

Reference examples:

```tsx
// BAD (visual-only gating in JSX)
{isHighlighted && <Badge>Most Popular</Badge>}
{isHighlighted ? <Badge>Most Popular</Badge> : null}
{hasAccess ? <PremiumPanel /> : <MutedText>Upgrade to unlock</MutedText>}

// GOOD (visual guard atoms)
<RenderOrNull shouldRender={isHighlighted}>
  <Badge>Most Popular</Badge>
</RenderOrNull>

<RenderOrFallback
  shouldRender={hasAccess}
  fallback={<MutedText>Upgrade to unlock</MutedText>}
>
  <PremiumPanel />
</RenderOrFallback>
```

## Testing expectation

- New UI components should have tests that cover behavior (Vitest + React Testing Library).
- Prefer testing via user-visible output and interactions rather than implementation details.
