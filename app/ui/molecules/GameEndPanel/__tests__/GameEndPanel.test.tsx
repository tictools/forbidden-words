import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'

import { GameEndPanel } from '@app/ui/molecules/GameEndPanel/GameEndPanel'
import { GAME_RESULT } from '@core/Game/gameConstants'

describe('GameEndPanel', () => {
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
})
