# INTRODUCTION

I want to create a web application with the following technical requirements

- must be built with React
- must be developed with TypeScript
- must be styled with Tailwind
- all code pieces must be tested (Vitest for unit tests and RTL for component tests)
- must have minimal GitHub Actions to verify styles and tests
- must be ready to be deployed to Netlify

## ALIGNMENT WITH PRODUCT SPECS

Behavioral rules (bars, pending words, end game, confetti, exit flow, accessibility, Catalan-only UI, speech required) are defined in `.cursor/specs/product/SPECS_v1.md`. The domain model and implementation below must satisfy that document.

### Error bar color (`errorSeverity`)

Derived from **cumulative wrong answers** (`wrongAnswers` / errors committed in the current game):

| Errors (count) | `errorSeverity` |
| -------------- | --------------- |
| 0–2            | `green`         |
| 3–5            | `yellow`        |
| 6–8            | `orange`        |
| 9–10           | `red`           |

`maxWrongAnswers` / `maxErrorsAllowed` for V1 is **10** (denominator for the errors bar: **n / 10**).

### Pending words and next target (domain)

- On **correct** answer: remove word from `remainingWords`; pick next `currentCard` at random from `remainingWords` only.
- On **incorrect** answer: the target word is **marked as incorrect** and also **leaves the pending pool** (it is not counted as mastered, but will not appear again in the current run).
- Implementation may track a “deferred” word or a per-round visitation set; the observable behavior must match the product spec.

### Confetti

- Use **[js-confetti](https://www.npmjs.com/package/js-confetti)** for correct answers only (see product spec).

### Speech synthesis (V1)

- **Hard requirement:** if `window.speechSynthesis` is missing or the app cannot use synthesis for Catalan in a way that satisfies the product, **do not start the game**; show a Catalan message instead.
- **Language:** `ca-ES` for utterances.
- Keyboard access to play and options remains as in the product accessibility section.

## DATA STRUCTURE

Words are represented as an array of arrays:

```typescript
type WordGroup = [string, string, string]; // [correct, wrong1, wrong2]
type WordsCollection = WordGroup[];
```

Example:

```typescript
const words: WordsCollection = [
  ["perquè", "perque", "perqè"],
  ["hi ha", "hiha", "i a"],
  ["ahir", "air", "ahí"],
];
```

- Only 3 word groups are initially loaded
- The first word in each group is always the correct one
- Options are displayed in random order
- For V1, `audioText` on `Word` maps to the correct spelling (`correctOption`) unless extended later

## STATE MANAGEMENT

State management is done with Zustand.

## FOLDER STRUCTURE

The folder structure follows the conventions defined in the `project-structure` skill:

- `/app` - UI (React components, UI hooks)
- `/core` - Domain logic (entities, use cases, pure logic)
- `/tests` - Test utilities and test-only code

## SHALLOW DDD ARCHITECTURE

The project implements a Shallow Domain-Driven Design (DDD) architecture focused on the spelling game domain.

### Principles

- Pure domain layer without infrastructure or application dependencies
- Immutable entities and Value Objects (readonly)
- Business logic encapsulated in the domain
- Ports (interfaces) for repositories, without concrete implementations

### Domain Entities

#### 1. Word (Value Object)

```typescript
interface Word {
  readonly correctOption: string;
  readonly wrongOptions: [string, string]; // Tuple of two elements
  readonly audioText: string; // Text passed to speech synthesis
}
```

#### 2. WordCard (Value Object)

```typescript
interface WordCard {
  readonly word: Word;
  readonly shuffledOptions: string[]; // All three options in random order
  readonly hasBeenAnswered: boolean;
  readonly isCorrect: boolean | null;
  readonly selectedOption: string | null;
}
```

#### 3. Game (Entity - Root Aggregate)

```typescript
interface Game {
  readonly id: string; // Unique id for this game session
  readonly words: Word[]; // All words in the game
  readonly remainingWords: Word[]; // Words not yet answered correctly
  readonly currentCard: WordCard | null;
  readonly correctAnswers: number;
  readonly wrongAnswers: number;
  readonly maxWrongAnswers: number; // Default 10 (V1)
  readonly status: "active" | "finished";
  readonly result: "won" | "lost" | null;
}
```

#### 4. GameConfig (Value Object)

```typescript
interface GameConfig {
  readonly maxErrorsAllowed: number; // 10 (V1)
  readonly wordsPerGame: number; // 3 initially; configurable later
}
```

#### 5. GameProgress (Value Object)

```typescript
interface GameProgress {
  readonly totalWords: number;
  readonly answeredCorrectly: number;
  readonly errorsCommitted: number;
  readonly remainingErrors: number;
  readonly progressPercentage: number; // 0–100
  readonly errorSeverity: "green" | "yellow" | "orange" | "red";
}
```

`errorSeverity` must follow the table in **Alignment with product specs** above.

### Directory Structure `/core`

The `/core` directory implements **Screaming Architecture**, reflecting the business domain through folder names. Refer to the `project-structure` skill for organization conventions.

**Current scope (Shallow DDD):**

- Domain entities and aggregates
- Value Objects

**Excluded in this phase:**

- Application layer
- Infrastructure layer

### Exclusions

In this initial phase, the following are NOT included:

- Application Layer (use cases, commands, queries)
- Infrastructure Layer (concrete repository implementations)
- Teacher role (out of scope for V1; not in product spec)

## SPEECH SYNTHESIS (WEB SPEECH API)

The verbal reproduction of words is performed using the **Web Speech API** (`SpeechSynthesis`).

### Considerations

- **V1 gate:** detect capability up front; **block starting play** if synthesis is not available (see product spec — no silent play).
- **Language:** force `ca-ES` for Catalan
- **Accessibility:** play and options reachable via keyboard per product spec (Tab / Shift+Tab; arrows among options only)
- **Browsers without Catalan voices:** treat as unusable for V1 if utterances cannot meet the product requirement; keep the user in the blocked state with Catalan messaging

## DEPENDENCIES (V1)

- **js-confetti** — confetti on correct answer ([npm](https://www.npmjs.com/package/js-confetti))

## GITHUB ACTIONS & NETLIFY (V1)

- **CI:** minimal workflow running install, **lint** (if configured), **typecheck** (if configured), and **tests** — exact steps should match `package.json` scripts.
- **Netlify:** SPA redirect rule `/*` → `/index.html` if using client-side routing; build command and publish directory aligned with the chosen React toolchain (e.g. Vite `dist`).

## REFERENCED SKILLS

- `project-structure` - Folder structure
- `create-react-component` - Component creation
- `typescript` - TypeScript conventions
- `tdd` - Unit tests
- `tests-mothers-and-mocks` - Component tests
- `hooks-testing-and-mocks` - Hook tests
- `atomic-design-ui` - UI and styles
- `vercel-react-best-practices` - React best practices

Technical details are defined in the skills directory.
