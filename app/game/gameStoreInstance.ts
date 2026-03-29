import { createShuffle } from '@core/shared/createShuffle'
import type { RandomIntFn } from '@core/shared/randomTypes'

import { createGameStore } from '@app/game/gameStore'

const randomInt: RandomIntFn = (maxExclusive) =>
  Math.floor(Math.random() * maxExclusive)

const shuffle = createShuffle({ randomInt })

export const useGameStore = createGameStore({ randomInt, shuffle })
