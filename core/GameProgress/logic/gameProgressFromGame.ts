import type { Game } from '@core/Game/Game'
import type { GameProgress } from '@core/GameProgress/GameProgress'
import { errorSeverityFromWrongAnswers } from '@core/Severity/logic/errorSeverityFromWrongAnswers'

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
