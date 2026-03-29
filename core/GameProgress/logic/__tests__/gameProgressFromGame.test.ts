import { describe, expect, it } from 'vitest'

import { GAME_RESULT, GAME_STATUS } from '@core/Game/gameConstants'
import type { Game } from '@core/Game/Game'
import { gameProgressFromGame } from '@core/GameProgress/logic/gameProgressFromGame'
import { ERROR_SEVERITY } from '@core/Severity/severityConstants'
import type { Word } from '@core/Word/Word'

const w1: Word = {
  correctOption: 'a',
  wrongOptions: ['b', 'c'],
  audioText: 'a',
}

function baseGame(overrides: Partial<Game> = {}): Game {
  return {
    id: 'g1',
    words: [w1],
    remainingWords: [w1],
    currentCard: null,
    correctAnswers: 0,
    wrongAnswers: 0,
    maxWrongAnswers: 10,
    status: GAME_STATUS.ACTIVE,
    result: null,
    ...overrides,
  }
}

describe('gameProgressFromGame', () => {
  it('derives counts and severity from the game aggregate', () => {
    const game = baseGame({
      words: [w1, w1, w1],
      correctAnswers: 1,
      wrongAnswers: 4,
      maxWrongAnswers: 10,
    })

    const progress = gameProgressFromGame({ game })

    expect(progress.totalWords).toBe(3)
    expect(progress.answeredCorrectly).toBe(1)
    expect(progress.errorsCommitted).toBe(4)
    expect(progress.remainingErrors).toBe(6)
    expect(progress.progressPercentage).toBeCloseTo(100 / 3, 5)
    expect(progress.errorSeverity).toBe(ERROR_SEVERITY.YELLOW)
  })

  it('clamps remaining errors at zero', () => {
    const game = baseGame({ wrongAnswers: 12, maxWrongAnswers: 10 })
    expect(gameProgressFromGame({ game }).remainingErrors).toBe(0)
  })

  it('uses zero progress when there are no words', () => {
    const game = baseGame({ words: [], remainingWords: [] })
    const progress = gameProgressFromGame({ game })
    expect(progress.totalWords).toBe(0)
    expect(progress.progressPercentage).toBe(0)
  })

  it('reflects finished lost state severity', () => {
    const game = baseGame({
      wrongAnswers: 10,
      status: GAME_STATUS.FINISHED,
      result: GAME_RESULT.LOST,
      currentCard: null,
    })
    expect(gameProgressFromGame({ game }).errorSeverity).toBe(
      ERROR_SEVERITY.RED,
    )
  })
})
