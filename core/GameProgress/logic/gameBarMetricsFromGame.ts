import type { Game } from '@core/Game/Game'
import type { GameBarMetrics } from '@core/GameProgress/GameBarMetrics'
import { gameProgressFromGame } from '@core/GameProgress/logic/gameProgressFromGame'

export type GameBarMetricsFromGameParams = {
  readonly game: Game | null
}

export function gameBarMetricsFromGame({
  game,
}: GameBarMetricsFromGameParams): GameBarMetrics | null {
  if (!game) return null

  const progress = gameProgressFromGame({ game })

  return {
    answeredCorrectly: progress.answeredCorrectly,
    totalWords: progress.totalWords,
    wrongAnswers: progress.errorsCommitted,
    maxWrongAnswers: game.maxWrongAnswers,
    errorSeverity: progress.errorSeverity,
  }
}
