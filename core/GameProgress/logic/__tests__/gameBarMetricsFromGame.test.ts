import { describe, expect, it } from 'vitest'

import { GAME_STATUS } from '@core/Game/gameConstants'
import type { Game } from '@core/Game/Game'
import { gameBarMetricsFromGame } from '@core/GameProgress/logic/gameBarMetricsFromGame'
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

describe('gameBarMetricsFromGame', () => {
  it('returns null when there is no game', () => {
    expect(gameBarMetricsFromGame({ game: null })).toBeNull()
  })

  it('projects progress and max wrong answers for bar UIs', () => {
    const game = baseGame({
      words: [w1, w1, w1],
      correctAnswers: 1,
      wrongAnswers: 4,
      maxWrongAnswers: 10,
    })

    const metrics = gameBarMetricsFromGame({ game })

    expect(metrics).toEqual({
      answeredCorrectly: 1,
      totalWords: 3,
      wrongAnswers: 4,
      maxWrongAnswers: 10,
      errorSeverity: ERROR_SEVERITY.YELLOW,
    })
  })
})
