import { ERROR_SEVERITY, type ErrorSeverity } from '@core/game/types'

export type ErrorSeverityFromWrongAnswersParams = {
  readonly wrongAnswers: number
}

export function errorSeverityFromWrongAnswers({
  wrongAnswers,
}: ErrorSeverityFromWrongAnswersParams): ErrorSeverity {
  if (wrongAnswers <= 2) return ERROR_SEVERITY.GREEN
  if (wrongAnswers <= 5) return ERROR_SEVERITY.YELLOW
  if (wrongAnswers <= 8) return ERROR_SEVERITY.ORANGE
  return ERROR_SEVERITY.RED
}
