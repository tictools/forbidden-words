import { errorSeverityFromWrongAnswers } from '@core/game/errorSeverity'
import type { Game, GameProgress } from '@core/game/types'

export type GameProgressFromGameParams = {
  readonly game: Game
}

export function gameProgressFromGame({
  game,
}: GameProgressFromGameParams): GameProgress {
  const totalWords = game.words.length
  const answeredCorrectly = game.correctAnswers
  const errorsCommitted = game.wrongAnswers
  const remainingErrors = Math.max(0, game.maxWrongAnswers - errorsCommitted)
  const progressPercentage =
    totalWords === 0 ? 0 : (answeredCorrectly / totalWords) * 100

  return {
    totalWords,
    answeredCorrectly,
    errorsCommitted,
    remainingErrors,
    progressPercentage,
    errorSeverity: errorSeverityFromWrongAnswers({ wrongAnswers: errorsCommitted }),
  }
}
