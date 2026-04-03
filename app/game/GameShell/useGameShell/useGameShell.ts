import JSConfetti from 'js-confetti'
import { useEffect, useMemo } from 'react'

import { DEFAULT_SESSION_ID, GAME_CONFIG } from '@app/game/GameShell/data/gameDefaults'
import { WORDS_COLLECTION } from '@app/game/GameShell/data/wordsCollection'
import { displayGameBarMetrics } from '@app/game/GameShell/metrics/displayGameBarMetrics'
import { useGameStore } from '@app/game/GameShell/store/gameStoreInstance'
import { useSpeechGate } from '@app/game/GameShell/useSpeechGate/useSpeechGate'
import type { GameShellViewProps } from '@app/game/GameShell/gameShellViewProps'
import { ANSWER_EFFECT } from '@core/Answer/answerConstants'

export function useGameShell(): GameShellViewProps {
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

  return {
    speech,
    displayMetrics,
    hasActiveGame: game !== null,
    game,
    lastAnswerEffect,
    onSelectOption: submitOption,
    onStartGame,
    onReset: reset,
  }
}
