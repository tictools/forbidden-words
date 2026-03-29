import type { ShuffleFn, Word, WordCard } from '@core/game/types'

export function createWordCard(word: Word, shuffle: ShuffleFn): WordCard {
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
