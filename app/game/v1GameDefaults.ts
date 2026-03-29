import type { GameConfig } from '@core/Game/GameConfig'
import type { WordsCollection } from '@core/Word/Word'

/** V1 fixed bank: three word groups (see technical spec). */
export const V1_WORDS_COLLECTION: WordsCollection = [
  ['perquè', 'perque', 'perqè'],
  ['hi ha', 'hiha', 'i a'],
  ['ahir', 'air', 'ahí'],
]

export const V1_GAME_CONFIG: GameConfig = {
  maxErrorsAllowed: 10,
  wordsPerGame: 3,
}

export const V1_SESSION_ID = 'v1-default-session'
