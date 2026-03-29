import {
  GAME_RESULT,
  GAME_STATUS,
  type Game,
  type GameConfig,
  type RandomIntFn,
  type ShuffleFn,
  type WordsCollection,
} from '@core/game/types'
import { createWordCard } from '@core/game/word-card'
import { wordsFromCollection } from '@core/game/word-from-collection'

export function createGame(params: {
  readonly id: string
  readonly collection: WordsCollection
  readonly config: GameConfig
  readonly randomInt: RandomIntFn
  readonly shuffle: ShuffleFn
}): Game {
  const words = wordsFromCollection(params.collection).slice(
    0,
    params.config.wordsPerGame,
  )
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
    currentCard: createWordCard(firstWord, params.shuffle),
    correctAnswers: 0,
    wrongAnswers: 0,
    maxWrongAnswers,
    status: GAME_STATUS.ACTIVE,
    result: null,
  }
}
