import type { GameBarMetrics } from '@core/GameProgress/GameBarMetrics'

import { Box } from '@app/ui/atoms/Box/Box'
import { ProgressMetricBar } from '@app/ui/atoms/ProgressMetricBar/ProgressMetricBar'

export type GameProgressBarsProps = {
  readonly metrics: GameBarMetrics
}

export const GameProgressBars = ({ metrics }: GameProgressBarsProps) => (
  <Box className="flex flex-col gap-5">
    <ProgressMetricBar
      ariaLabel="Paraules encertades"
      current={metrics.answeredCorrectly}
      total={metrics.totalWords}
      variant="words"
    />
    <ProgressMetricBar
      ariaLabel="Errors"
      current={metrics.wrongAnswers}
      total={metrics.maxWrongAnswers}
      variant="errors"
      errorSeverity={metrics.errorSeverity}
    />
  </Box>
)
