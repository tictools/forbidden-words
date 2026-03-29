export type WordGroup = readonly [string, string, string];

export type WordsCollection = readonly WordGroup[];

export const ERROR_SEVERITY = {
  GREEN: 'green',
  YELLOW: 'yellow',
  ORANGE: 'orange',
  RED: 'red',
} as const;

export type ErrorSeverity = (typeof ERROR_SEVERITY)[keyof typeof ERROR_SEVERITY];

export const GAME_STATUS = {
  ACTIVE: 'active',
  FINISHED: 'finished',
} as const;

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS];

export const GAME_RESULT = {
  WON: 'won',
  LOST: 'lost',
} as const;

export type GameResult = (typeof GAME_RESULT)[keyof typeof GAME_RESULT];

export interface Word {
  readonly correctOption: string;
  readonly wrongOptions: [string, string];
  readonly audioText: string;
}

export interface WordCard {
  readonly word: Word;
  readonly shuffledOptions: string[];
  readonly hasBeenAnswered: boolean;
  readonly isCorrect: boolean | null;
  readonly selectedOption: string | null;
}

export interface Game {
  readonly id: string;
  readonly words: Word[];
  readonly remainingWords: Word[];
  readonly currentCard: WordCard | null;
  readonly correctAnswers: number;
  readonly wrongAnswers: number;
  readonly maxWrongAnswers: number;
  readonly status: GameStatus;
  readonly result: GameResult | null;
}

export interface GameConfig {
  readonly maxErrorsAllowed: number;
  readonly wordsPerGame: number;
}

export interface GameProgress {
  readonly totalWords: number;
  readonly answeredCorrectly: number;
  readonly errorsCommitted: number;
  readonly remainingErrors: number;
  readonly progressPercentage: number;
  readonly errorSeverity: ErrorSeverity;
}

export type RandomIntFn = (maxExclusive: number) => number;

export type ShuffleFn = <T>(items: readonly T[]) => T[];

export const ANSWER_EFFECT = {
  CORRECT: 'correct',
  INCORRECT: 'incorrect',
  NONE: 'none',
} as const;

export type AnswerEffectKind =
  (typeof ANSWER_EFFECT)[keyof typeof ANSWER_EFFECT];

export type AnswerEffect =
  | { readonly kind: typeof ANSWER_EFFECT.CORRECT }
  | {
      readonly kind: typeof ANSWER_EFFECT.INCORRECT;
      readonly targetWord: string;
    }
  | { readonly kind: typeof ANSWER_EFFECT.NONE };

export interface SubmitAnswerResult {
  readonly game: Game;
  readonly effect: AnswerEffect;
}
