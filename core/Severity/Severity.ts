import { ERROR_SEVERITY } from '@core/Severity/severityConstants'

export type ErrorSeverity =
  (typeof ERROR_SEVERITY)[keyof typeof ERROR_SEVERITY]
