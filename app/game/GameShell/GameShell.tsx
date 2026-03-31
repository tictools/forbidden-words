import { useGameShell } from '@app/game/GameShell/useGameShell/useGameShell'
import { Box } from '@app/ui/atoms/Box/Box'
import { Header } from '@app/ui/atoms/Header/Header'
import { Button } from '@app/ui/atoms/Button/Button'
import { Main } from '@app/ui/atoms/Main/Main'
import { RenderOrNull } from '@app/ui/atoms/RenderOrNull/RenderOrNull'
import { Section } from '@app/ui/atoms/Section/Section'
import { Text } from '@app/ui/atoms/Text/Text'
import { GameEndPanel } from '@app/ui/molecules/GameEndPanel/GameEndPanel'
import { GameProgressBars } from '@app/ui/molecules/GameProgressBars/GameProgressBars'
import { GameWordCard } from '@app/ui/molecules/GameWordCard/GameWordCard'
import { GAME_STATUS } from '@core/Game/gameConstants'

import type { GameShellViewProps } from '@app/game/GameShell/gameShellViewProps'

export type { GameShellViewProps }

export const GameShellView = ({
  speech,
  displayMetrics,
  hasActiveGame,
  game,
  lastAnswerEffect,
  onSelectOption,
  onStartGame,
  onReset,
  closeWindow,
}: GameShellViewProps) => {
  const activeCard =
    hasActiveGame && game?.status === GAME_STATUS.ACTIVE
      ? game.currentCard
      : null

  const showEndPanel =
    hasActiveGame &&
    game?.status === GAME_STATUS.FINISHED &&
    game.result !== null

  const endGamePanel =
    showEndPanel && game !== null && game.result !== null ? (
      <GameEndPanel
        result={game.result}
        onPlayAgain={() => onReset?.()}
        closeWindow={closeWindow}
      />
    ) : null

  if (speech.status === 'blocked') {
    return (
      <Main
        lang="ca"
        className="flex min-h-dvh items-center justify-center bg-emerald-950 px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-emerald-50"
      >
        <Section
          role="alert"
          aria-live="polite"
          lang="ca"
          className="max-w-prose rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-center"
        >
          <Text>{speech.message}</Text>
        </Section>
      </Main>
    )
  }

  if (speech.status === 'checking') {
    return (
      <Main
        lang="ca"
        className="flex min-h-dvh items-center justify-center bg-emerald-950 px-4 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-emerald-100"
      >
        <Text className="text-base">S'està comprovant la veu…</Text>
      </Main>
    )
  }

  return (
    <Main
      lang="ca"
      className="min-h-dvh bg-emerald-950 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-emerald-100"
    >
      <Box className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 md:gap-8 md:py-10">
        <Header className="text-center">
          <Text className="text-lg font-semibold tracking-tight text-emerald-50 sm:text-xl">
            Paraules prohibides
          </Text>
        </Header>
        <Section
          aria-label="Àrea de joc"
          className="flex flex-col gap-6 rounded-xl border border-emerald-800/50 bg-emerald-900/30 p-4 shadow-inner sm:p-6 md:gap-8"
        >
          <GameProgressBars metrics={displayMetrics} />
          <Section
            aria-label="Targeta de joc"
            className="flex min-h-[12rem] flex-col justify-center gap-4 rounded-lg border border-dashed border-emerald-700/60 bg-emerald-950/40 p-4 sm:min-h-[14rem]"
          >
            <RenderOrNull shouldRender={!hasActiveGame}>
              <Text className="text-center text-sm text-emerald-200/90">
                Esperant inici de partida.
              </Text>
              <RenderOrNull shouldRender={Boolean(onStartGame)}>
                <Box className="flex justify-center">
                  <Button
                    type="button"
                    className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                    onClick={onStartGame}
                  >
                    Començar partida
                  </Button>
                </Box>
              </RenderOrNull>
            </RenderOrNull>
            <RenderOrNull shouldRender={activeCard !== null}>
              <GameWordCard
                card={activeCard!}
                lastAnswerEffect={lastAnswerEffect}
                onSelectOption={onSelectOption}
              />
            </RenderOrNull>
            <RenderOrNull shouldRender={endGamePanel !== null}>
              {endGamePanel}
            </RenderOrNull>
          </Section>
        </Section>
      </Box>
    </Main>
  )
}

export const GameShell = () => <GameShellView {...useGameShell()} />
