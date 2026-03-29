import type { Game } from '@core/Game/Game'
import type { GameConfig } from '@core/Game/GameConfig'
import type { GameBarMetrics } from '@core/GameProgress/GameBarMetrics'
import { gameBarMetricsFromGame } from '@core/GameProgress/logic/gameBarMetricsFromGame'
import { ERROR_SEVERITY } from '@core/Severity/severityConstants'

export type DisplayGameBarMetricsParams = {
  readonly game: Game | null
  readonly defaultConfig: GameConfig
}

export function displayGameBarMetrics({
  game,
  defaultConfig,
}: DisplayGameBarMetricsParams): GameBarMetrics {
  if (game) {
    return gameBarMetricsFromGame({ game })!
  }

  return {
    answeredCorrectly: 0,
    totalWords: defaultConfig.wordsPerGame,
    wrongAnswers: 0,
    maxWrongAnswers: defaultConfig.maxErrorsAllowed,
    errorSeverity: ERROR_SEVERITY.GREEN,
  }
}
