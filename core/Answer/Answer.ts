import { ANSWER_EFFECT } from '@core/Answer/answerConstants'
import type { Game } from '@core/Game/Game'

export type AnswerEffectKind =
  (typeof ANSWER_EFFECT)[keyof typeof ANSWER_EFFECT]

export type AnswerEffect =
  | { readonly kind: typeof ANSWER_EFFECT.CORRECT }
  | {
      readonly kind: typeof ANSWER_EFFECT.INCORRECT
      readonly targetWord: string
    }
  | { readonly kind: typeof ANSWER_EFFECT.NONE }

export interface SubmitAnswerResult {
  readonly game: Game
  readonly effect: AnswerEffect
}
