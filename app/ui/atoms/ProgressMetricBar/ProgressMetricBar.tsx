import type { ErrorSeverity } from '@core/Severity/Severity'
import { ERROR_SEVERITY } from '@core/Severity/severityConstants'

import { Box } from '@app/ui/atoms/Box/Box'
import { Text } from '@app/ui/atoms/Text/Text'

export type ProgressMetricBarProps = {
  readonly ariaLabel: string
  readonly current: number
  readonly total: number
  readonly variant: 'words' | 'errors'
  readonly errorSeverity?: ErrorSeverity
}

function fillClassForErrors(severity: ErrorSeverity): string {
  if (severity === ERROR_SEVERITY.GREEN) return 'bg-emerald-500'
  if (severity === ERROR_SEVERITY.YELLOW) return 'bg-amber-400'
  if (severity === ERROR_SEVERITY.ORANGE) return 'bg-orange-500'
  return 'bg-red-600'
}

export const ProgressMetricBar = ({
  ariaLabel,
  current,
  total,
  variant,
  errorSeverity,
}: ProgressMetricBarProps) => {
  const safeTotal = total > 0 ? total : 1
  const pct = Math.min(100, Math.round((current / safeTotal) * 100))
  const fillClass =
    variant === 'words'
      ? 'bg-emerald-400'
      : fillClassForErrors(errorSeverity ?? ERROR_SEVERITY.GREEN)

  return (
    <Box className="flex flex-col gap-2">
      <Box className="flex items-baseline justify-between gap-3">
        <Text className="text-sm font-medium text-emerald-100/90">{ariaLabel}</Text>
        <Text className="tabular-nums text-sm text-emerald-50">
          {current} / {total}
        </Text>
      </Box>
      <Box
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label={ariaLabel}
        className="h-2.5 w-full overflow-hidden rounded-full bg-emerald-950/80"
      >
        <Box
          className={`h-full rounded-full transition-[width] duration-300 ${fillClass}`}
          style={{ width: `${pct}%` }}
        />
      </Box>
    </Box>
  )
}
