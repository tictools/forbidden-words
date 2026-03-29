import { GAME_RESULT, type Game, type GameResult } from '@core/game/types'

export type AnswerPhase =
  | { readonly kind: 'terminal'; readonly result: GameResult }
  | { readonly kind: 'continue' }

export type AnswerPhaseDelta = {
  readonly correctAnswers: number
  readonly wrongAnswers: number
  readonly remainingWords: Game['remainingWords']
}

export type ResolveAnswerPhaseParams = {
  readonly game: Game
  readonly delta: AnswerPhaseDelta
}

export function resolveAnswerPhase({
  game,
  delta,
}: ResolveAnswerPhaseParams): AnswerPhase {
  if (delta.wrongAnswers >= game.maxWrongAnswers) {
    return { kind: 'terminal', result: GAME_RESULT.LOST }
  }

  if (delta.remainingWords.length === 0) {
    const won = delta.correctAnswers === game.words.length
    return {
      kind: 'terminal',
      result: won ? GAME_RESULT.WON : GAME_RESULT.LOST,
    }
  }

  return { kind: 'continue' }
}
