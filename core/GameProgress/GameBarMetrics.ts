import type { ErrorSeverity } from '@core/Severity/Severity'

export interface GameBarMetrics {
  readonly answeredCorrectly: number
  readonly totalWords: number
  readonly wrongAnswers: number
  readonly maxWrongAnswers: number
  readonly errorSeverity: ErrorSeverity
}
