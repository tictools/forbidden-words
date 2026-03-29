import {
  GAME_RESULT,
  GAME_STATUS,
  type Game,
  type GameConfig,
  type RandomIntFn,
  type ShuffleFn,
  type WordsCollection,
} from '@core/game/types'
import { createWordCard } from '@core/game/wordCard'
import { wordsFromCollection } from '@core/game/wordFromCollection'

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
