import type { Game, GameResult } from '@core/Game/Game'

export type AnswerPhase =
  | { readonly kind: 'terminal'; readonly result: GameResult }
  | { readonly kind: 'continue' }

export type AnswerPhaseDelta = {
  readonly correctAnswers: number
  readonly wrongAnswers: number
  readonly remainingWords: Game['remainingWords']
}
