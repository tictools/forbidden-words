/**
 * Configuració per defecte de partida. El banc de paraules viu a `wordsCollection.ts`.
 */
import type { GameConfig } from '@core/Game/GameConfig'

export const GAME_CONFIG: GameConfig = {
  maxErrorsAllowed: 10,
  wordsPerGame: 3,
}

export const DEFAULT_SESSION_ID = 'default-session'
