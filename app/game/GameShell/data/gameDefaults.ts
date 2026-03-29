/**
 * Default game session configuration. The word bank lives in `wordsCollection.ts`.
 */
import type { GameConfig } from '@core/Game/GameConfig'

export const GAME_CONFIG: GameConfig = {
  maxErrorsAllowed: 10,
  wordsPerGame: 3,
}

export const DEFAULT_SESSION_ID = 'default-session'
