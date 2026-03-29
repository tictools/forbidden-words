import { create } from 'zustand'

import type { AnswerEffect } from '@core/Answer/Answer'
import type { Game } from '@core/Game/Game'
import type { GameConfig } from '@core/Game/GameConfig'
import { createGame } from '@core/Game/logic/createGame'
import { submitAnswer } from '@core/Game/logic/submitAnswer'
import type { RandomIntFn, ShuffleFn } from '@core/shared/randomTypes'
import type { WordsCollection } from '@core/Word/Word'

export type GameSessionParams = {
  readonly id: string
  readonly collection: WordsCollection
  readonly config: GameConfig
}

export type GameStoreDeps = {
  readonly randomInt: RandomIntFn
  readonly shuffle: ShuffleFn
}

export type GameStoreState = {
  readonly game: Game | null
  /** Last submit result for UI (confetti, error copy); cleared on start / reset. */
  readonly lastAnswerEffect: AnswerEffect | null
}

export type GameStoreActions = {
  readonly startGame: (params: GameSessionParams) => void
  readonly submitOption: (selectedOption: string) => void
  readonly reset: () => void
}

export function createGameStore(deps: GameStoreDeps) {
  let lastSession: GameSessionParams | null = null

  return create<GameStoreState & GameStoreActions>((set, get) => ({
    game: null,
    lastAnswerEffect: null,

    startGame: (params) => {
      lastSession = params
      set({
        lastAnswerEffect: null,
        game: createGame({
          id: params.id,
          collection: params.collection,
          config: params.config,
          randomInt: deps.randomInt,
          shuffle: deps.shuffle,
        }),
      })
    },

    submitOption: (selectedOption) => {
      const { game } = get()
      if (!game) return

      const { game: nextGame, effect } = submitAnswer({
        game,
        selectedOption,
        randomInt: deps.randomInt,
        shuffle: deps.shuffle,
      })
      set({ game: nextGame, lastAnswerEffect: effect })
    },

    reset: () => {
      if (!lastSession) return

      set({
        lastAnswerEffect: null,
        game: createGame({
          id: lastSession.id,
          collection: lastSession.collection,
          config: lastSession.config,
          randomInt: deps.randomInt,
          shuffle: deps.shuffle,
        }),
      })
    },
  }))
}
