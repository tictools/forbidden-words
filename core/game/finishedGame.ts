import { GAME_STATUS, type Game, type GameResult } from '@core/game/types'

export type FinishedGamePatch = Pick<
  Game,
  | 'remainingWords'
  | 'correctAnswers'
  | 'wrongAnswers'
  | 'currentCard'
  | 'result'
> & { readonly result: GameResult }

export type ToFinishedGameParams = {
  readonly base: Game
  readonly patch: FinishedGamePatch
}

export function toFinishedGame({ base, patch }: ToFinishedGameParams): Game {
  return {
    ...base,
    ...patch,
    status: GAME_STATUS.FINISHED,
  }
}
