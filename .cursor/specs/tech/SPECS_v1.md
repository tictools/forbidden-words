# INTRODUCTION

I want to create a web application with the following technical requirements

- must be built with React
- must be developed with TypeScript
- must be styled with Tailwind
- all code pieces must be tested (Vitest for unit tests and RTL for component tests)
- must have minimal GitHub Actions to verify styles and tests
- must be ready to be deployed to Netlify

## DATA STRUCTURE

Words are represented as an array of arrays:

```typescript
type WordGroup = [string, string, string]; // [correcta, incorrecta1, incorrecta2]
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
  readonly wrongOptions: [string, string]; // Tupla de 2 elements
  readonly audioText: string; // Text que es reprodueix verbalment
}
```

#### 2. WordCard (Value Object)

```typescript
interface WordCard {
  readonly word: Word;
  readonly shuffledOptions: string[]; // Les 3 opcions en ordre aleatori
  readonly hasBeenAnswered: boolean;
  readonly isCorrect: boolean | null;
  readonly selectedOption: string | null;
}
```

#### 3. Game (Entity - Root Aggregate)

```typescript
interface Game {
  readonly id: string; // Identificador únic de la partida
  readonly words: Word[]; // Totes les paraules disponibles
  readonly remainingWords: Word[]; // Paraules pendents
  readonly currentCard: WordCard | null;
  readonly correctAnswers: number;
  readonly wrongAnswers: number;
  readonly maxWrongAnswers: number; // 10 per defecte
  readonly status: "active" | "finished";
  readonly result: "won" | "lost" | null;
}
```

#### 4. GameConfig (Value Object)

```typescript
interface GameConfig {
  readonly maxErrorsAllowed: number; // 10
  readonly wordsPerGame: number; // 3 inicialment, extensible
}
```

#### 5. GameProgress (Value Object)

```typescript
interface GameProgress {
  readonly totalWords: number;
  readonly answeredCorrectly: number;
  readonly errorsCommitted: number;
  readonly remainingErrors: number;
  readonly progressPercentage: number; // 0-100
  readonly errorSeverity: "green" | "yellow" | "orange" | "red";
}
```

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
- Teacher role (future phase)

## SPEECH SYNTHESIS (WEB SPEECH API)

The verbal reproduction of words is performed using the **Web Speech API** (`SpeechSynthesis`).

### Considerations

- **Compatibility**: Check `window.speechSynthesis` before using
- **Language**: Force `ca-ES` for Catalan
- **Accessibility**: Also accessible via navigation keys (Accessibility requirement)
- **Limitations**: Some browsers may not support Catalan; provide visual fallback

## REFERENCED SKILLS

- `project-structure` - Folder structure
- `create-react-component` - Component creation
- `typescript` - TypeScript conventions
- `tdd` - Unit tests
- `tests-mothers-and-mocks` - Component tests
- `hooks-testing-and-mocks` - Hook tests
- `atomic-design-ui` - UI and styles
- `vercel-react-best-practices` - React best practices

Technical details are defined in the skills directory
