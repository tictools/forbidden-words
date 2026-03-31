import { fireEvent, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { GameEndPanel } from '@app/ui/molecules/GameEndPanel/GameEndPanel'
import { GAME_RESULT } from '@core/Game/gameConstants'

describe('GameEndPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a won heading when result is won', () => {
    render(
      <GameEndPanel
        result={GAME_RESULT.WON}
        onPlayAgain={vi.fn()}
        closeWindow={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('heading', { name: /has guanyat/i }),
    ).toBeInTheDocument()
  })

  it('focuses Tornar a jugar when the panel mounts', () => {
    render(
      <GameEndPanel
        result={GAME_RESULT.WON}
        onPlayAgain={vi.fn()}
        closeWindow={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('button', { name: /tornar a jugar/i }),
    ).toHaveFocus()
  })

  it('shows a lost heading when result is lost', () => {
    render(
      <GameEndPanel
        result={GAME_RESULT.LOST}
        onPlayAgain={vi.fn()}
        closeWindow={vi.fn()}
      />,
    )

    expect(
      screen.getByRole('heading', { name: /has perdut/i }),
    ).toBeInTheDocument()
  })

  it('calls onPlayAgain when Tornar a jugar is pressed', () => {
    const onPlayAgain = vi.fn()

    render(
      <GameEndPanel
        result={GAME_RESULT.WON}
        onPlayAgain={onPlayAgain}
        closeWindow={vi.fn()}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /tornar a jugar/i }))
    expect(onPlayAgain).toHaveBeenCalledTimes(1)
  })

  it('shows Fins una altra and schedules close after 5s when Sortir del joc is pressed', () => {
    const closeWindow = vi.fn()

    render(
      <GameEndPanel
        result={GAME_RESULT.WON}
        onPlayAgain={vi.fn()}
        closeWindow={closeWindow}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /sortir del joc/i }))

    expect(screen.getByText(/fins una altra/i)).toBeInTheDocument()
    expect(closeWindow).not.toHaveBeenCalled()

    vi.advanceTimersByTime(4999)
    expect(closeWindow).not.toHaveBeenCalled()

    vi.advanceTimersByTime(1)
    expect(closeWindow).toHaveBeenCalledTimes(1)
  })

  it('cancels scheduled close when Tornar a jugar is pressed after exit', () => {
    const closeWindow = vi.fn()
    const onPlayAgain = vi.fn()

    render(
      <GameEndPanel
        result={GAME_RESULT.LOST}
        onPlayAgain={onPlayAgain}
        closeWindow={closeWindow}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /sortir del joc/i }))
    expect(screen.getByText(/fins una altra/i)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /tornar a jugar/i }))
    expect(onPlayAgain).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(5000)
    expect(closeWindow).not.toHaveBeenCalled()
  })
})
