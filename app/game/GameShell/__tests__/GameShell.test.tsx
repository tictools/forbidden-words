import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useSpeechGate } from '@app/speech/useSpeechGate'

const mockAddConfetti = vi.fn()

vi.mock('js-confetti', () => ({
  default: class {
    addConfetti = mockAddConfetti
  },
}))

vi.mock('@app/speech/useSpeechGate', () => ({
  useSpeechGate: vi.fn(),
}))

import { DEFAULT_SESSION_ID, GAME_CONFIG } from '@app/game/GameShell/data/gameDefaults'
import { WORDS_COLLECTION } from '@app/game/GameShell/data/wordsCollection'
import { GameShell, GameShellView } from '@app/game/GameShell/GameShell'
import { useGameStore } from '@app/game/GameShell/store/gameStoreInstance'
import { createGame } from '@core/Game/logic/createGame'
import { submitAnswer } from '@core/Game/logic/submitAnswer'
import { GAME_RESULT, GAME_STATUS } from '@core/Game/gameConstants'
import type { GameBarMetrics } from '@core/GameProgress/GameBarMetrics'
import { gameBarMetricsFromGame } from '@core/GameProgress/logic/gameBarMetricsFromGame'
import { ERROR_SEVERITY } from '@core/Severity/severityConstants'
import type { ShuffleFn } from '@core/shared/randomTypes'

const wordsPerGame = GAME_CONFIG.wordsPerGame

const initialProgressLabel = new RegExp(
  `0\\s*\\/\\s*${wordsPerGame}`,
)

const baseMetrics: GameBarMetrics = {
  answeredCorrectly: 0,
  totalWords: wordsPerGame,
  wrongAnswers: 0,
  maxWrongAnswers: 10,
  errorSeverity: ERROR_SEVERITY.GREEN,
}

const identityShuffle: ShuffleFn = (items) => [...items]

function playUntilFinishedWon() {
  let game = createGame({
    id: 'view-test-won',
    collection: WORDS_COLLECTION,
    config: GAME_CONFIG,
    randomInt: () => 0,
    shuffle: identityShuffle,
  })

  while (game.status === GAME_STATUS.ACTIVE) {
    const correct = game.currentCard!.word.correctOption
    game = submitAnswer({
      game,
      selectedOption: correct,
      randomInt: () => 0,
      shuffle: identityShuffle,
    }).game
  }

  return game
}

function playUntilFinishedLost() {
  let game = createGame({
    id: 'view-test-lost',
    collection: WORDS_COLLECTION,
    config: GAME_CONFIG,
    randomInt: () => 0,
    shuffle: identityShuffle,
  })

  while (game.status === GAME_STATUS.ACTIVE) {
    const wrong = game.currentCard!.word.wrongOptions[0]!
    game = submitAnswer({
      game,
      selectedOption: wrong,
      randomInt: () => 0,
      shuffle: identityShuffle,
    }).game
  }

  return game
}

describe('GameShellView', () => {
  it('shows blocked message and no game layout when speech is blocked', () => {
    render(
      <GameShellView
        speech={{ status: 'blocked', message: 'Missatge de bloqueig de prova.' }}
        displayMetrics={baseMetrics}
        hasActiveGame={false}
        game={null}
        lastAnswerEffect={null}
        onSelectOption={vi.fn()}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Missatge de bloqueig de prova.')
    expect(screen.queryByRole('region', { name: /àrea de joc/i })).not.toBeInTheDocument()
    expect(screen.queryByText(initialProgressLabel)).not.toBeInTheDocument()
  })

  it('shows initial word and error counts when speech is ready and metrics are at zero', () => {
    render(
      <GameShellView
        speech={{ status: 'ready' }}
        displayMetrics={baseMetrics}
        hasActiveGame={false}
        game={null}
        lastAnswerEffect={null}
        onSelectOption={vi.fn()}
      />,
    )

    const gameRegion = screen.getByRole('region', { name: /àrea de joc/i })
    expect(gameRegion).toBeInTheDocument()

    expect(
      screen.getByRole('progressbar', { name: /paraules encertades/i }),
    ).toHaveAccessibleName(/paraules encertades/i)
    expect(screen.getByText(initialProgressLabel)).toBeInTheDocument()

    expect(
      screen.getByRole('progressbar', { name: /errors/i }),
    ).toHaveAccessibleName(/errors/i)
    expect(screen.getByText(/0\s*\/\s*10/)).toBeInTheDocument()
  })

  it('shows card waiting placeholder when there is no active game yet', () => {
    render(
      <GameShellView
        speech={{ status: 'ready' }}
        displayMetrics={baseMetrics}
        hasActiveGame={false}
        game={null}
        lastAnswerEffect={null}
        onSelectOption={vi.fn()}
      />,
    )

    expect(screen.getByText(/esperant inici de partida/i)).toBeInTheDocument()
  })

  it('calls onStartGame when the start button is pressed', () => {
    const onStartGame = vi.fn()

    render(
      <GameShellView
        speech={{ status: 'ready' }}
        displayMetrics={baseMetrics}
        hasActiveGame={false}
        game={null}
        lastAnswerEffect={null}
        onSelectOption={vi.fn()}
        onStartGame={onStartGame}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /començar partida/i }))
    expect(onStartGame).toHaveBeenCalledTimes(1)
  })

  it('shows end-game actions with won heading when the game is finished won', () => {
    const finished = playUntilFinishedWon()
    const metrics = gameBarMetricsFromGame({ game: finished })!

    render(
      <GameShellView
        speech={{ status: 'ready' }}
        displayMetrics={metrics}
        hasActiveGame
        game={finished}
        lastAnswerEffect={null}
        onSelectOption={vi.fn()}
        onReset={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('region', { name: /fi de partida/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { name: /has guanyat/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /tornar a jugar/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /sortir del joc/i }),
    ).toBeInTheDocument()
  })

  it('shows lost heading when the game is finished lost', () => {
    const finished = playUntilFinishedLost()
    const metrics = gameBarMetricsFromGame({ game: finished })!

    render(
      <GameShellView
        speech={{ status: 'ready' }}
        displayMetrics={metrics}
        hasActiveGame
        game={finished}
        lastAnswerEffect={null}
        onSelectOption={vi.fn()}
        onReset={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('heading', { name: /has perdut/i }),
    ).toBeInTheDocument()
  })

  it('calls onReset when Tornar a jugar is pressed after finish', () => {
    const finished = playUntilFinishedWon()
    const metrics = gameBarMetricsFromGame({ game: finished })!
    const onReset = vi.fn()

    render(
      <GameShellView
        speech={{ status: 'ready' }}
        displayMetrics={metrics}
        hasActiveGame
        game={finished}
        lastAnswerEffect={null}
        onSelectOption={vi.fn()}
        onReset={onReset}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /tornar a jugar/i }))
    expect(onReset).toHaveBeenCalledTimes(1)
  })
})

describe('GameShell', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    useGameStore.setState({ game: null, lastAnswerEffect: null })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows blocked branch when useSpeechGate is blocked', () => {
    vi.mocked(useSpeechGate).mockReturnValue({
      status: 'blocked',
      message: 'Bloquejat per prova.',
    })

    render(<GameShell />)

    expect(screen.getByRole('alert')).toHaveTextContent('Bloquejat per prova.')
    expect(screen.queryByRole('region', { name: /àrea de joc/i })).not.toBeInTheDocument()
  })

  it('shows active game layout with initial bar labels when gate is ready and game has started', () => {
    vi.mocked(useSpeechGate).mockReturnValue({ status: 'ready' })

    useGameStore.getState().startGame({
      id: DEFAULT_SESSION_ID,
      collection: WORDS_COLLECTION,
      config: GAME_CONFIG,
    })

    render(<GameShell />)

    expect(screen.getByRole('region', { name: /àrea de joc/i })).toBeInTheDocument()
    expect(screen.getByText(initialProgressLabel)).toBeInTheDocument()
    expect(screen.getByText(/0\s*\/\s*10/)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /escolta la paraula/i }),
    ).toBeInTheDocument()
  })

  it('fires confetti when the player answers correctly (including on the last word)', async () => {
    vi.mocked(useSpeechGate).mockReturnValue({ status: 'ready' })

    render(<GameShell />)

    fireEvent.click(screen.getByRole('button', { name: /començar partida/i }))

    for (let i = 0; i < wordsPerGame; i += 1) {
      const correctOption =
        useGameStore.getState().game!.currentCard!.word.correctOption

      fireEvent.click(
        screen.getByRole('button', {
          name: new RegExp(
            `^${correctOption.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
          ),
        }),
      )

      await waitFor(() => {
        expect(mockAddConfetti).toHaveBeenCalledTimes(i + 1)
      })
    }
  })

  it('shows end-game panel after a win and starts a new run when Tornar a jugar is pressed', async () => {
    vi.mocked(useSpeechGate).mockReturnValue({ status: 'ready' })

    render(<GameShell />)

    fireEvent.click(screen.getByRole('button', { name: /començar partida/i }))

    for (let i = 0; i < wordsPerGame; i += 1) {
      const correctOption =
        useGameStore.getState().game!.currentCard!.word.correctOption

      fireEvent.click(
        screen.getByRole('button', {
          name: new RegExp(
            `^${correctOption.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
          ),
        }),
      )

      await waitFor(() => {
        const expectedStatus =
          i < wordsPerGame - 1 ? GAME_STATUS.ACTIVE : GAME_STATUS.FINISHED
        expect(useGameStore.getState().game?.status).toBe(expectedStatus)
        if (i === wordsPerGame - 1) {
          expect(useGameStore.getState().game?.result).toBe(GAME_RESULT.WON)
        }
      })
    }

    expect(
      screen.getByRole('heading', { name: /has guanyat/i }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /tornar a jugar/i }))

    await waitFor(() => {
      expect(useGameStore.getState().game?.status).toBe(GAME_STATUS.ACTIVE)
    })

    expect(
      screen.getByRole('button', { name: /escolta la paraula/i }),
    ).toBeInTheDocument()
  })

  it('shows the lost end screen when the player exhausts the pool with errors', () => {
    vi.mocked(useSpeechGate).mockReturnValue({ status: 'ready' })

    render(<GameShell />)

    fireEvent.click(screen.getByRole('button', { name: /començar partida/i }))

    while (useGameStore.getState().game?.status === GAME_STATUS.ACTIVE) {
      const wrongOption =
        useGameStore.getState().game!.currentCard!.word.wrongOptions[0]!

      fireEvent.click(
        screen.getByRole('button', {
          name: new RegExp(
            `^${wrongOption.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
          ),
        }),
      )
    }

    expect(
      screen.getByRole('heading', { name: /has perdut/i }),
    ).toBeInTheDocument()
    expect(useGameStore.getState().game?.result).toBe(GAME_RESULT.LOST)
  })

  it('schedules tab close 5s after Sortir del joc on the end screen', () => {
    vi.useFakeTimers()
    const closeSpy = vi.spyOn(window, 'close').mockImplementation(() => {})

    vi.mocked(useSpeechGate).mockReturnValue({ status: 'ready' })

    render(<GameShell />)

    fireEvent.click(screen.getByRole('button', { name: /començar partida/i }))

    for (let i = 0; i < wordsPerGame; i += 1) {
      const correctOption =
        useGameStore.getState().game!.currentCard!.word.correctOption

      fireEvent.click(
        screen.getByRole('button', {
          name: new RegExp(
            `^${correctOption.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
          ),
        }),
      )
    }

    expect(
      screen.getByRole('heading', { name: /has guanyat/i }),
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /sortir del joc/i }))

    expect(screen.getByText(/fins una altra/i)).toBeInTheDocument()
    expect(closeSpy).not.toHaveBeenCalled()

    vi.advanceTimersByTime(5000)
    expect(closeSpy).toHaveBeenCalledTimes(1)

    closeSpy.mockRestore()
  })
})
