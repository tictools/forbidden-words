import { describe, expect, it } from 'vitest'

import { GAME_CONFIG } from '@app/game/GameShell/data/gameDefaults'
import { WORDS_COLLECTION } from '@app/game/GameShell/data/wordsCollection'
import { createGameStore } from '@app/game/GameShell/store/gameStore'
import type { GameConfig } from '@core/Game/GameConfig'
import { GAME_RESULT, GAME_STATUS } from '@core/Game/gameConstants'
import { gameBarMetricsFromGame } from '@core/GameProgress/logic/gameBarMetricsFromGame'
import { ERROR_SEVERITY } from '@core/Severity/severityConstants'
import type { ShuffleFn } from '@core/shared/randomTypes'

const identityShuffle: ShuffleFn = (items) => [...items]

const defaultConfig: GameConfig = GAME_CONFIG

describe('createGameStore', () => {
  it('startGame delegates to createGame; bar metrics come from domain', () => {
    const useGameStore = createGameStore({
      randomInt: () => 0,
      shuffle: identityShuffle,
    })

    useGameStore.getState().startGame({
      id: 's1',
      collection: WORDS_COLLECTION,
      config: defaultConfig,
    })

    const { game } = useGameStore.getState()
    expect(game).not.toBeNull()
    expect(game!.status).toBe(GAME_STATUS.ACTIVE)
    expect(game!.correctAnswers).toBe(0)
    expect(game!.wrongAnswers).toBe(0)

    const bars = gameBarMetricsFromGame({ game })
    expect(bars).toEqual({
      answeredCorrectly: 0,
      totalWords: 3,
      wrongAnswers: 0,
      maxWrongAnswers: 10,
      errorSeverity: ERROR_SEVERITY.GREEN,
    })
  })

  it('submitOption delegates to submitAnswer and updates game state', () => {
    const useGameStore = createGameStore({
      randomInt: () => 0,
      shuffle: identityShuffle,
    })

    useGameStore.getState().startGame({
      id: 's1',
      collection: WORDS_COLLECTION,
      config: defaultConfig,
    })

    useGameStore.getState().submitOption('perquè')

    const { game } = useGameStore.getState()
    expect(game!.correctAnswers).toBe(1)
    expect(game!.remainingWords).toHaveLength(2)
    expect(game!.status).toBe(GAME_STATUS.ACTIVE)

    const bars = gameBarMetricsFromGame({ game })
    expect(bars?.answeredCorrectly).toBe(1)
    expect(bars?.wrongAnswers).toBe(0)
    expect(bars?.errorSeverity).toBe(ERROR_SEVERITY.GREEN)
  })

  it('reset starts a new game with the same session params', () => {
    const useGameStore = createGameStore({
      randomInt: () => 0,
      shuffle: identityShuffle,
    })

    useGameStore.getState().startGame({
      id: 'session-reset',
      collection: WORDS_COLLECTION,
      config: defaultConfig,
    })

    useGameStore.getState().submitOption('perque')

    expect(useGameStore.getState().game!.wrongAnswers).toBe(1)

    useGameStore.getState().reset()

    const { game } = useGameStore.getState()
    expect(game!.id).toBe('session-reset')
    expect(game!.wrongAnswers).toBe(0)
    expect(game!.correctAnswers).toBe(0)
    expect(game!.status).toBe(GAME_STATUS.ACTIVE)
    expect(gameBarMetricsFromGame({ game })?.wrongAnswers).toBe(0)
  })

  it('submitOption is a no-op when there is no active game', () => {
    const useGameStore = createGameStore({
      randomInt: () => 0,
      shuffle: identityShuffle,
    })

    useGameStore.getState().submitOption('perquè')

    expect(useGameStore.getState().game).toBeNull()
  })

  it('reset is a no-op before startGame', () => {
    const useGameStore = createGameStore({
      randomInt: () => 0,
      shuffle: identityShuffle,
    })

    useGameStore.getState().reset()

    expect(useGameStore.getState().game).toBeNull()
  })

  it('reflects finished game and severity via gameBarMetricsFromGame', () => {
    const useGameStore = createGameStore({
      randomInt: () => 0,
      shuffle: identityShuffle,
    })

    useGameStore.getState().startGame({
      id: 'finish',
      collection: WORDS_COLLECTION,
      config: { maxErrorsAllowed: 10, wordsPerGame: 3 },
    })

    for (let i = 0; i < 3; i += 1) {
      useGameStore.getState().submitOption('perque')
    }

    const { game } = useGameStore.getState()
    expect(game!.status).toBe(GAME_STATUS.FINISHED)
    expect(game!.result).toBe(GAME_RESULT.LOST)

    const bars = gameBarMetricsFromGame({ game })
    expect(bars?.wrongAnswers).toBe(3)
    expect(bars?.maxWrongAnswers).toBe(10)
    expect(bars?.errorSeverity).toBe(ERROR_SEVERITY.YELLOW)
  })
})
