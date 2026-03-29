import type { ErrorSeverity } from '@core/Severity/Severity'

export interface GameProgress {
  readonly totalWords: number
  readonly answeredCorrectly: number
  readonly errorsCommitted: number
  readonly remainingErrors: number
  readonly progressPercentage: number
  readonly errorSeverity: ErrorSeverity
}
