import type { ShuffleFn, Word, WordCard } from '@core/game/types'

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
