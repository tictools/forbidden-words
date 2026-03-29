import { describe, expect, it } from 'vitest'

import { createGame } from '@core/game/create-game'
import { GAME_RESULT, GAME_STATUS } from '@core/game/types'
import type { GameConfig, ShuffleFn, WordsCollection } from '@core/game/types'

const collection: WordsCollection = [
  ['perquè', 'perque', 'perqè'],
  ['hi ha', 'hiha', 'i a'],
  ['ahir', 'air', 'ahí'],
]

const identityShuffle: ShuffleFn = (items) => [...items]

describe('createGame', () => {
  const config: GameConfig = { maxErrorsAllowed: 10, wordsPerGame: 3 }

  it('builds an active game with a random first card from remaining words', () => {
    const game = createGame({
      id: 'session-1',
      collection,
      config,
      randomInt: () => 0,
      shuffle: identityShuffle,
    })

    expect(game.status).toBe(GAME_STATUS.ACTIVE)
    expect(game.words).toHaveLength(3)
    expect(game.remainingWords).toHaveLength(3)
    expect(game.correctAnswers).toBe(0)
    expect(game.wrongAnswers).toBe(0)
    expect(game.maxWrongAnswers).toBe(10)
    expect(game.result).toBeNull()
    expect(game.currentCard?.word.correctOption).toBe('perquè')
    expect(game.currentCard?.shuffledOptions).toEqual([
      'perquè',
      'perque',
      'perqè',
    ])
  })

  it('respects wordsPerGame when slicing the collection', () => {
    const game = createGame({
      id: 'session-2',
      collection,
      config: { maxErrorsAllowed: 10, wordsPerGame: 2 },
      randomInt: () => 1,
      shuffle: identityShuffle,
    })

    expect(game.words).toHaveLength(2)
    expect(game.remainingWords).toHaveLength(2)
    expect(game.currentCard?.word.correctOption).toBe('hi ha')
  })

  it('finishes immediately with a vacuous win when there are no words', () => {
    const game = createGame({
      id: 'empty',
      collection: [],
      config: { maxErrorsAllowed: 10, wordsPerGame: 3 },
      randomInt: () => 0,
      shuffle: identityShuffle,
    })

    expect(game.words).toHaveLength(0)
    expect(game.currentCard).toBeNull()
    expect(game.status).toBe(GAME_STATUS.FINISHED)
    expect(game.result).toBe(GAME_RESULT.WON)
  })
})
