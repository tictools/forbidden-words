import type { Word, WordsCollection } from '@core/game/types'

export type WordsFromCollectionParams = {
  readonly collection: WordsCollection
}

export function wordsFromCollection({
  collection,
}: WordsFromCollectionParams): Word[] {
  return collection.map((group) => ({
    correctOption: group[0],
    wrongOptions: [group[1], group[2]],
    audioText: group[0],
  }))
}
