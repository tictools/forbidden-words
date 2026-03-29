import type { Word, WordsCollection } from '@core/game/types'

export function wordsFromCollection(collection: WordsCollection): Word[] {
  return collection.map((group) => ({
    correctOption: group[0],
    wrongOptions: [group[1], group[2]],
    audioText: group[0],
  }))
}
