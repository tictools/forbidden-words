/**
 * Default game session configuration. The word bank lives in `wordsCollection.ts`.
 */
import type { GameConfig } from "@core/Game/GameConfig";
import { WORDS_COLLECTION } from "./wordsCollection";

export const GAME_CONFIG: GameConfig = {
  maxErrorsAllowed: 10,
  wordsPerGame: WORDS_COLLECTION.length,
};

export const DEFAULT_SESSION_ID = "default-session";
