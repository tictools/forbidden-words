import type { ShuffleFn } from '@core/shared/randomTypes'
import type { Word } from '@core/Word/Word'
import type { WordCard } from '@core/WordCard/WordCard'

export type CreateWordCardParams = {
  readonly word: Word
  readonly shuffle: ShuffleFn
}

export function createWordCard({
  word,
  shuffle,
}: CreateWordCardParams): WordCard {
  const options: string[] = [
    word.correctOption,
    word.wrongOptions[0],
    word.wrongOptions[1],
  ]
  return {
    word,
    shuffledOptions: shuffle(options),
    hasBeenAnswered: false,
    isCorrect: null,
    selectedOption: null,
  }
}
