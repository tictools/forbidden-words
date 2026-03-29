import type { RandomIntFn, ShuffleFn } from '@core/shared/randomTypes'
import { GAME_RESULT, GAME_STATUS } from '@core/Game/gameConstants'
import type { Game } from '@core/Game/Game'
import type { GameConfig } from '@core/Game/GameConfig'
import { createWordCard } from '@core/WordCard/logic/createWordCard'
import type { WordsCollection } from '@core/Word/Word'
import { wordsFromCollection } from '@core/Word/logic/wordsFromCollection'

export type CreateGameParams = {
  readonly id: string
  readonly collection: WordsCollection
  readonly config: GameConfig
  readonly randomInt: RandomIntFn
  readonly shuffle: ShuffleFn
}

export function createGame(params: CreateGameParams): Game {
  const words = wordsFromCollection({
    collection: params.collection,
  }).slice(0, params.config.wordsPerGame)
  const remainingWords = [...words]
  const maxWrongAnswers = params.config.maxErrorsAllowed

  if (words.length === 0) {
    return {
      id: params.id,
      words,
      remainingWords,
      currentCard: null,
      correctAnswers: 0,
      wrongAnswers: 0,
      maxWrongAnswers,
      status: GAME_STATUS.FINISHED,
      result: GAME_RESULT.WON,
    }
  }

  const firstWord = remainingWords[params.randomInt(remainingWords.length)]!

  return {
    id: params.id,
    words,
    remainingWords,
    currentCard: createWordCard({
      word: firstWord,
      shuffle: params.shuffle,
    }),
    correctAnswers: 0,
    wrongAnswers: 0,
    maxWrongAnswers,
    status: GAME_STATUS.ACTIVE,
    result: null,
  }
}
