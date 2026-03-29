import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { useSpeechGate } from '@app/speech/useSpeechGate'

vi.mock('@app/speech/useSpeechGate', () => ({
  useSpeechGate: vi.fn(),
}))

import { DEFAULT_SESSION_ID, GAME_CONFIG } from '@app/game/GameShell/data/gameDefaults'
import { WORDS_COLLECTION } from '@app/game/GameShell/data/wordsCollection'
import { GameShell, GameShellView } from '@app/game/GameShell/GameShell'
import { useGameStore } from '@app/game/GameShell/store/gameStoreInstance'
import type { GameBarMetrics } from '@core/GameProgress/GameBarMetrics'
import { ERROR_SEVERITY } from '@core/Severity/severityConstants'

const baseMetrics: GameBarMetrics = {
  answeredCorrectly: 0,
  totalWords: 3,
  wrongAnswers: 0,
  maxWrongAnswers: 10,
  errorSeverity: ERROR_SEVERITY.GREEN,
}

describe('GameShellView', () => {
  it('shows blocked message and no game layout when speech is blocked', () => {
    render(
      <GameShellView
        speech={{ status: 'blocked', message: 'Missatge de bloqueig de prova.' }}
        displayMetrics={baseMetrics}
        hasActiveGame={false}
      />,
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Missatge de bloqueig de prova.')
    expect(screen.queryByRole('region', { name: /àrea de joc/i })).not.toBeInTheDocument()
    expect(screen.queryByText(/0\s*\/\s*3/)).not.toBeInTheDocument()
  })

  it('shows initial word and error counts when speech is ready and metrics are at zero', () => {
    render(
      <GameShellView
        speech={{ status: 'ready' }}
        displayMetrics={baseMetrics}
        hasActiveGame={false}
      />,
    )

    const gameRegion = screen.getByRole('region', { name: /àrea de joc/i })
    expect(gameRegion).toBeInTheDocument()

    expect(
      screen.getByRole('progressbar', { name: /paraules encertades/i }),
    ).toHaveAccessibleName(/paraules encertades/i)
    expect(screen.getByText(/0\s*\/\s*3/)).toBeInTheDocument()

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
        onStartGame={onStartGame}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /començar partida/i }))
    expect(onStartGame).toHaveBeenCalledTimes(1)
  })
})

describe('GameShell', () => {
  beforeEach(() => {
    useGameStore.setState({ game: null })
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
    expect(screen.getByText(/0\s*\/\s*3/)).toBeInTheDocument()
    expect(screen.getByText(/0\s*\/\s*10/)).toBeInTheDocument()
  })
})
