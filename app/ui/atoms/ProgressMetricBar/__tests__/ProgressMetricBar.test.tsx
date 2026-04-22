import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { ProgressMetricBar } from '@app/ui/atoms/ProgressMetricBar/ProgressMetricBar'
import { ERROR_SEVERITY } from '@core/Severity/severityConstants'

describe('ProgressMetricBar', () => {
  it('uses semantic fill for words variant', () => {
    render(
      <ProgressMetricBar
        ariaLabel="Test words"
        current={1}
        total={3}
        variant="words"
      />,
    )
    const fill = screen.getByRole('progressbar').firstElementChild as HTMLElement
    expect(fill).toHaveClass('bg-accent')
  })

  it.each([
    [ERROR_SEVERITY.GREEN, 'bg-success'],
    [ERROR_SEVERITY.YELLOW, 'bg-warning'],
    [ERROR_SEVERITY.ORANGE, 'bg-caution'],
    [ERROR_SEVERITY.RED, 'bg-critical'],
  ] as const)('maps error severity %s to %s', (severity, expectedClass) => {
    render(
      <ProgressMetricBar
        ariaLabel="Errors"
        current={1}
        total={10}
        variant="errors"
        errorSeverity={severity}
      />,
    )
    const fill = screen.getByRole('progressbar').firstElementChild as HTMLElement
    expect(fill).toHaveClass(expectedClass)
  })

  it('renders track with semantic progress-track background', () => {
    render(
      <ProgressMetricBar
        ariaLabel="Errors"
        current={0}
        total={10}
        variant="errors"
        errorSeverity={ERROR_SEVERITY.GREEN}
      />,
    )
    expect(screen.getByRole('progressbar')).toHaveClass('bg-progress-track')
  })
})
