import { GAME_RESULT } from '@core/Game/gameConstants'
import type { Game } from '@core/Game/Game'
import type {
  AnswerPhase,
  AnswerPhaseDelta,
} from '@core/AnswerPhase/AnswerPhase'

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
