import { describe, expect, it } from 'vitest'

import { ANSWER_EFFECT } from '@core/Answer/answerConstants'
import { GAME_RESULT, GAME_STATUS } from '@core/Game/gameConstants'
import type { GameConfig } from '@core/Game/GameConfig'
import { createGame } from '@core/Game/logic/createGame'
import { submitAnswer } from '@core/Game/logic/submitAnswer'
import type { ShuffleFn } from '@core/shared/randomTypes'
import type { WordsCollection } from '@core/Word/Word'

const collection: WordsCollection = [
  ['perquè', 'perque', 'perqè'],
  ['hi ha', 'hiha', 'i a'],
  ['ahir', 'air', 'ahí'],
]

const identityShuffle: ShuffleFn = (items) => [...items]

const config: GameConfig = { maxErrorsAllowed: 10, wordsPerGame: 3 }

function newGame(randomInt: () => number) {
  return createGame({
    id: 'g',
    collection,
    config,
    randomInt,
    shuffle: identityShuffle,
  })
}

describe('submitAnswer', () => {
  it('does nothing when the game is already finished', () => {
    const game = newGame(() => 0)
    const lost = submitAnswer({
      game: { ...game, status: GAME_STATUS.FINISHED, result: GAME_RESULT.LOST },
      selectedOption: 'perquè',
      randomInt: () => 0,
      shuffle: identityShuffle,
    })
    expect(lost.effect.kind).toBe(ANSWER_EFFECT.NONE)
    expect(lost.game.status).toBe(GAME_STATUS.FINISHED)
  })

  it('does nothing when the game is active but has no current card', () => {
    const game = newGame(() => 0)
    const stuck = submitAnswer({
      game: { ...game, currentCard: null },
      selectedOption: 'perquè',
      randomInt: () => 0,
      shuffle: identityShuffle,
    })
    expect(stuck.effect.kind).toBe(ANSWER_EFFECT.NONE)
    expect(stuck.game.currentCard).toBeNull()
  })

  it('on correct answer: increments correct count, removes target from pool, draws next card from remaining only', () => {
    const game = newGame(() => 0)
    const firstTarget = game.currentCard!.word.correctOption

    const { game: after, effect } = submitAnswer({
      game,
      selectedOption: firstTarget,
      randomInt: () => 0,
      shuffle: identityShuffle,
    })

    expect(effect.kind).toBe(ANSWER_EFFECT.CORRECT)
    expect(after.correctAnswers).toBe(1)
    expect(after.wrongAnswers).toBe(0)
    expect(after.remainingWords).toHaveLength(2)
    expect(after.status).toBe(GAME_STATUS.ACTIVE)
    expect(after.currentCard?.word.correctOption).toBe('hi ha')
  })

  it('on incorrect answer: increments errors, removes target from pool without counting as mastered', () => {
    const game = newGame(() => 0)

    const { game: after, effect } = submitAnswer({
      game,
      selectedOption: 'perque',
      randomInt: () => 0,
      shuffle: identityShuffle,
    })

    expect(effect).toEqual({
      kind: ANSWER_EFFECT.INCORRECT,
      targetWord: 'perquè',
    })
    expect(after.correctAnswers).toBe(0)
    expect(after.wrongAnswers).toBe(1)
    expect(after.remainingWords).toHaveLength(2)
    expect(after.currentCard?.word.correctOption).toBe('hi ha')
  })

  it('ends in a win when the last pending word is answered correctly', () => {
    let game = newGame(() => 0)

    game = submitAnswer({
      game,
      selectedOption: game.currentCard!.word.correctOption,
      randomInt: () => 0,
      shuffle: identityShuffle,
    }).game
    game = submitAnswer({
      game,
      selectedOption: game.currentCard!.word.correctOption,
      randomInt: () => 0,
      shuffle: identityShuffle,
    }).game
    const { game: finished, effect } = submitAnswer({
      game,
      selectedOption: game.currentCard!.word.correctOption,
      randomInt: () => 0,
      shuffle: identityShuffle,
    })

    expect(effect.kind).toBe(ANSWER_EFFECT.CORRECT)
    expect(finished.status).toBe(GAME_STATUS.FINISHED)
    expect(finished.result).toBe(GAME_RESULT.WON)
    expect(finished.remainingWords).toHaveLength(0)
    expect(finished.correctAnswers).toBe(3)
    expect(finished.currentCard).toBeNull()
  })

  it('ends in a loss when wrong answers reach the maximum', () => {
    const many: WordsCollection = Array.from({ length: 12 }, (_, i) => [
      `w${i}`,
      `x${i}`,
      `y${i}`,
    ])
    let game = createGame({
      id: 'g-many',
      collection: many,
      config: { maxErrorsAllowed: 10, wordsPerGame: 12 },
      randomInt: () => 0,
      shuffle: identityShuffle,
    })

    for (let i = 0; i < 9; i += 1) {
      const wrongPick = game.currentCard!.word.wrongOptions[0]!
      game = submitAnswer({
        game,
        selectedOption: wrongPick,
        randomInt: () => 0,
        shuffle: identityShuffle,
      }).game
    }
    const { game: finished, effect } = submitAnswer({
      game,
      selectedOption: game.currentCard!.word.wrongOptions[0]!,
      randomInt: () => 0,
      shuffle: identityShuffle,
    })

    expect(effect.kind).toBe(ANSWER_EFFECT.INCORRECT)
    expect(finished.wrongAnswers).toBe(10)
    expect(finished.status).toBe(GAME_STATUS.FINISHED)
    expect(finished.result).toBe(GAME_RESULT.LOST)
    expect(finished.currentCard).toBeNull()
  })

  it('ends in a loss when the pool is empty but not all words were answered correctly', () => {
    let game = newGame(() => 0)
    game = submitAnswer({
      game,
      selectedOption: 'perque',
      randomInt: () => 0,
      shuffle: identityShuffle,
    }).game
    game = submitAnswer({
      game,
      selectedOption: 'hiha',
      randomInt: () => 0,
      shuffle: identityShuffle,
    }).game
    const { game: finished, effect } = submitAnswer({
      game,
      selectedOption: 'air',
      randomInt: () => 0,
      shuffle: identityShuffle,
    })

    expect(effect.kind).toBe(ANSWER_EFFECT.INCORRECT)
    expect(finished.correctAnswers).toBe(0)
    expect(finished.remainingWords).toHaveLength(0)
    expect(finished.status).toBe(GAME_STATUS.FINISHED)
    expect(finished.result).toBe(GAME_RESULT.LOST)
  })

  it('picks the next target only among remaining words using randomInt', () => {
    const game = createGame({
      id: 'g2',
      collection,
      config,
      randomInt: () => 0,
      shuffle: identityShuffle,
    })

    const { game: after } = submitAnswer({
      game,
      selectedOption: game.currentCard!.word.correctOption,
      randomInt: () => 1,
      shuffle: identityShuffle,
    })

    expect(after.currentCard?.word.correctOption).toBe('ahir')
  })
})
