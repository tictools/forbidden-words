import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useSpeechGate } from '@app/game/GameShell/useSpeechGate/useSpeechGate'

const mockAddConfetti = vi.fn()

vi.mock('js-confetti', () => ({
  default: class {
    addConfetti = mockAddConfetti
  },
}))

vi.mock('@app/game/GameShell/useSpeechGate/useSpeechGate', () => ({
  useSpeechGate: vi.fn(),
}))

import { DEFAULT_SESSION_ID, GAME_CONFIG } from '@app/game/GameShell/data/gameDefaults'
import { WORDS_COLLECTION } from '@app/game/GameShell/data/wordsCollection'
import { useGameShell } from '@app/game/GameShell/useGameShell/useGameShell'
import { useGameStore } from '@app/game/GameShell/store/gameStoreInstance'
import { ANSWER_EFFECT } from '@core/Answer/answerConstants'
import { ERROR_SEVERITY } from '@core/Severity/severityConstants'

describe('useGameShell', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useGameStore.setState({ game: null, lastAnswerEffect: null })
    vi.mocked(useSpeechGate).mockReturnValue({ status: 'ready' })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('exposes speech from useSpeechGate', () => {
    vi.mocked(useSpeechGate).mockReturnValue({
      status: 'blocked',
      message: 'Prova de bloqueig.',
    })

    const { result } = renderHook(() => useGameShell())

    expect(result.current.speech).toEqual({
      status: 'blocked',
      message: 'Prova de bloqueig.',
    })
  })

  it('derives idle display metrics from GAME_CONFIG when there is no game', () => {
    const { result } = renderHook(() => useGameShell())

    expect(result.current.displayMetrics).toEqual({
      answeredCorrectly: 0,
      totalWords: GAME_CONFIG.wordsPerGame,
      wrongAnswers: 0,
      maxWrongAnswers: GAME_CONFIG.maxErrorsAllowed,
      errorSeverity: ERROR_SEVERITY.GREEN,
    })
    expect(result.current.hasActiveGame).toBe(false)
    expect(result.current.game).toBeNull()
  })

  it('calls startGame with the default session payload when onStartGame runs', () => {
    const startSpy = vi.spyOn(useGameStore.getState(), 'startGame')

    const { result } = renderHook(() => useGameShell())

    act(() => {
      result.current.onStartGame?.()
    })

    expect(startSpy).toHaveBeenCalledWith({
      id: DEFAULT_SESSION_ID,
      collection: WORDS_COLLECTION,
      config: GAME_CONFIG,
    })
  })

  it('fires confetti when lastAnswerEffect becomes correct', async () => {
    renderHook(() => useGameShell())

    act(() => {
      useGameStore.setState({ lastAnswerEffect: { kind: ANSWER_EFFECT.CORRECT } })
    })

    await waitFor(() => {
      expect(mockAddConfetti).toHaveBeenCalledTimes(1)
    })
  })

  it('does not fire confetti for non-correct answer effects', () => {
    renderHook(() => useGameShell())

    act(() => {
      useGameStore.setState({
        lastAnswerEffect: { kind: ANSWER_EFFECT.INCORRECT, targetWord: 'x' },
      })
    })

    expect(mockAddConfetti).not.toHaveBeenCalled()
  })
})
