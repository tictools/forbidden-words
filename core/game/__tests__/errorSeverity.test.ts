import { describe, expect, it } from 'vitest'

import { errorSeverityFromWrongAnswers } from '@core/game/errorSeverity'
import { ERROR_SEVERITY } from '@core/game/types'

describe('errorSeverityFromWrongAnswers', () => {
  it.each([
    [0, ERROR_SEVERITY.GREEN],
    [1, ERROR_SEVERITY.GREEN],
    [2, ERROR_SEVERITY.GREEN],
    [3, ERROR_SEVERITY.YELLOW],
    [5, ERROR_SEVERITY.YELLOW],
    [6, ERROR_SEVERITY.ORANGE],
    [8, ERROR_SEVERITY.ORANGE],
    [9, ERROR_SEVERITY.RED],
    [10, ERROR_SEVERITY.RED],
  ] as const)('maps %i errors to %s', (count, expected) => {
    expect(errorSeverityFromWrongAnswers({ wrongAnswers: count })).toBe(
      expected,
    )
  })

  it('treats counts above max bar as red', () => {
    expect(errorSeverityFromWrongAnswers({ wrongAnswers: 11 })).toBe(
      ERROR_SEVERITY.RED,
    )
  })
})
