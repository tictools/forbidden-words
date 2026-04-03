import { Box } from '@app/ui/atoms/Box/Box'
import { Button } from '@app/ui/atoms/Button/Button'
import { RenderOrNull } from '@app/ui/atoms/RenderOrNull/RenderOrNull'
import { Section } from '@app/ui/atoms/Section/Section'
import { Text } from '@app/ui/atoms/Text/Text'
import { useGameEndPanel } from '@app/ui/molecules/GameEndPanel/useGameEndPanel/useGameEndPanel'
import type { GameResult } from '@core/Game/Game'
import { GAME_RESULT } from '@core/Game/gameConstants'

export type GameEndPanelProps = {
  readonly result: GameResult
  readonly onPlayAgain: () => void
  readonly closeWindow?: () => void
}

export const GameEndPanel = ({
  result,
  onPlayAgain,
  closeWindow = () => {
    // Same-window close after farewell; may no-op if the tab was not opened by script.
    window.close()
  },
}: GameEndPanelProps) => {
  const { farewellVisible, playAgainRef, handlePlayAgain, handleExit } =
    useGameEndPanel({ onPlayAgain, closeWindow })

  const headingText =
    result === GAME_RESULT.WON ? 'Has guanyat!' : 'Has perdut!'

  return (
    <Section
      aria-label="Fi de partida"
      className="flex flex-col items-center gap-4 text-center"
    >
      <Text
        role="heading"
        aria-level={2}
        className="text-lg font-semibold text-foreground"
      >
        {headingText}
      </Text>
      <Box className="flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Button
          ref={playAgainRef}
          type="button"
          className="rounded-md bg-accent px-4 py-2 text-base font-medium text-white shadow hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-focus"
          onClick={handlePlayAgain}
        >
          Tornar a jugar
        </Button>
        <Button
          type="button"
          className="rounded-md border border-chip-border bg-chip-bg px-4 py-2 text-base font-medium text-foreground hover:bg-chip-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-focus"
          onClick={handleExit}
        >
          Sortir del joc
        </Button>
      </Box>
      <RenderOrNull shouldRender={farewellVisible}>
        <Text
          role="status"
          aria-live="polite"
          className="text-base text-foreground-muted"
        >
          Fins una altra
        </Text>
      </RenderOrNull>
    </Section>
  )
}
