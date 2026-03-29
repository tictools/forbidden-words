import { errorSeverityFromWrongAnswers } from '@core/game/error-severity'
import type { Game, GameProgress } from '@core/game/types'

export function gameProgressFromGame(game: Game): GameProgress {
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
    errorSeverity: errorSeverityFromWrongAnswers(errorsCommitted),
  }
}
