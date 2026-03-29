import type { Word } from '@core/Word/Word'
import type { WordCard } from '@core/WordCard/WordCard'

import { GAME_RESULT, GAME_STATUS } from '@core/Game/gameConstants'

export type GameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS]

export type GameResult = (typeof GAME_RESULT)[keyof typeof GAME_RESULT]

export interface Game {
  readonly id: string
  readonly words: Word[]
  readonly remainingWords: Word[]
  readonly currentCard: WordCard | null
  readonly correctAnswers: number
  readonly wrongAnswers: number
  readonly maxWrongAnswers: number
  readonly status: GameStatus
  readonly result: GameResult | null
}
