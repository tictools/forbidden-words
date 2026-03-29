import JSConfetti from 'js-confetti'
import { useEffect, useMemo } from 'react'

import { DEFAULT_SESSION_ID, GAME_CONFIG } from '@app/game/GameShell/data/gameDefaults'
import { WORDS_COLLECTION } from '@app/game/GameShell/data/wordsCollection'
import { displayGameBarMetrics } from '@app/game/GameShell/metrics/displayGameBarMetrics'
import { useGameStore } from '@app/game/GameShell/store/gameStoreInstance'
import type { UseSpeechGateResult } from '@app/speech/useSpeechGate'
import { useSpeechGate } from '@app/speech/useSpeechGate'
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
import type { AnswerEffect } from '@core/Answer/Answer'
import { ANSWER_EFFECT } from '@core/Answer/answerConstants'
import type { Game } from '@core/Game/Game'
import { GAME_STATUS } from '@core/Game/gameConstants'
import type { GameBarMetrics } from '@core/GameProgress/GameBarMetrics'

export type GameShellViewProps = {
  readonly speech: UseSpeechGateResult
  readonly displayMetrics: GameBarMetrics
  readonly hasActiveGame: boolean
  readonly game: Game | null
  readonly lastAnswerEffect: AnswerEffect | null
  readonly onSelectOption: (option: string) => void
  readonly onStartGame?: () => void
  readonly onReset?: () => void
  readonly closeWindow?: () => void
}

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
      <Main className="flex min-h-dvh items-center justify-center bg-emerald-950 px-4 py-8 text-emerald-50">
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
      <Main className="flex min-h-dvh items-center justify-center bg-emerald-950 px-4 py-8 text-emerald-100">
        <Text className="text-base">S'està comprovant la veu…</Text>
      </Main>
    )
  }

  return (
    <Main className="min-h-dvh bg-emerald-950 text-emerald-100">
      <Box className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-4 py-6 sm:px-6 md:gap-8 md:py-10">
        <Header className="text-center">
          <Text className="text-lg font-semibold tracking-tight text-emerald-50 sm:text-xl">
            Forbidden Words
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
                    className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
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

export const GameShell = () => {
  const speech = useSpeechGate()
  const game = useGameStore((s) => s.game)
  const lastAnswerEffect = useGameStore((s) => s.lastAnswerEffect)
  const startGame = useGameStore((s) => s.startGame)
  const submitOption = useGameStore((s) => s.submitOption)
  const reset = useGameStore((s) => s.reset)

  const displayMetrics = useMemo(
    () => displayGameBarMetrics({ game, defaultConfig: GAME_CONFIG }),
    [game],
  )

  const onStartGame = () => {
    startGame({
      id: DEFAULT_SESSION_ID,
      collection: WORDS_COLLECTION,
      config: GAME_CONFIG,
    })
  }

  useEffect(() => {
    if (lastAnswerEffect?.kind !== ANSWER_EFFECT.CORRECT) return
    const confetti = new JSConfetti()
    void confetti.addConfetti()
  }, [lastAnswerEffect])

  return (
    <GameShellView
      speech={speech}
      displayMetrics={displayMetrics}
      hasActiveGame={game !== null}
      game={game}
      lastAnswerEffect={lastAnswerEffect}
      onSelectOption={submitOption}
      onStartGame={onStartGame}
      onReset={reset}
    />
  )
}
