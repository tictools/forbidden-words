import type { Word } from '@core/Word/Word'

export interface WordCard {
  readonly word: Word
  readonly shuffledOptions: string[]
  readonly hasBeenAnswered: boolean
  readonly isCorrect: boolean | null
  readonly selectedOption: string | null
}
