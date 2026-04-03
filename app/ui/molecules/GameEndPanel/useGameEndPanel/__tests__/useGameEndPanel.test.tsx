import { act, render, renderHook, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import {
  EXIT_DELAY_MS,
  useGameEndPanel,
} from '@app/ui/molecules/GameEndPanel/useGameEndPanel/useGameEndPanel'

function PlayAgainButtonHarness({
  onPlayAgain,
  closeWindow,
}: {
  readonly onPlayAgain: () => void
  readonly closeWindow?: () => void
}) {
  const { playAgainRef } = useGameEndPanel({ onPlayAgain, closeWindow })
  return (
    <button type="button" ref={playAgainRef}>
      Tornar a jugar
    </button>
  )
}

describe('useGameEndPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('focuses the play-again control on mount', () => {
    render(
      <PlayAgainButtonHarness onPlayAgain={vi.fn()} closeWindow={vi.fn()} />,
    )

    expect(
      screen.getByRole('button', { name: /tornar a jugar/i }),
    ).toHaveFocus()
  })

  it('calls onPlayAgain when handlePlayAgain runs', () => {
    const onPlayAgain = vi.fn()
    const { result } = renderHook(() =>
      useGameEndPanel({ onPlayAgain, closeWindow: vi.fn() }),
    )

    act(() => {
      result.current.handlePlayAgain()
    })

    expect(onPlayAgain).toHaveBeenCalledTimes(1)
  })

  it('sets farewell visible and schedules closeWindow after EXIT_DELAY_MS on handleExit', () => {
    const closeWindow = vi.fn()
    const { result } = renderHook(() =>
      useGameEndPanel({ onPlayAgain: vi.fn(), closeWindow }),
    )

    act(() => {
      result.current.handleExit()
    })

    expect(result.current.farewellVisible).toBe(true)
    expect(closeWindow).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(EXIT_DELAY_MS - 1)
    })
    expect(closeWindow).not.toHaveBeenCalled()

    act(() => {
      vi.advanceTimersByTime(1)
    })
    expect(closeWindow).toHaveBeenCalledTimes(1)
  })

  it('clears scheduled close when handlePlayAgain runs after handleExit', () => {
    const closeWindow = vi.fn()
    const onPlayAgain = vi.fn()
    const { result } = renderHook(() =>
      useGameEndPanel({ onPlayAgain, closeWindow }),
    )

    act(() => {
      result.current.handleExit()
    })
    expect(result.current.farewellVisible).toBe(true)

    act(() => {
      result.current.handlePlayAgain()
    })
    expect(onPlayAgain).toHaveBeenCalledTimes(1)

    act(() => {
      vi.advanceTimersByTime(EXIT_DELAY_MS)
    })
    expect(closeWindow).not.toHaveBeenCalled()
  })
})
