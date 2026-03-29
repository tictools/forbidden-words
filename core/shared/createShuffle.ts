import type { RandomIntFn, ShuffleFn } from '@core/shared/randomTypes'

export type CreateShuffleParams = {
  readonly randomInt: RandomIntFn
}

export function createShuffle({ randomInt }: CreateShuffleParams): ShuffleFn {
  return <T>(items: readonly T[]): T[] => {
    const shuffledItems = [...items]

    for (
      let currentIndex = shuffledItems.length - 1;
      currentIndex > 0;
      currentIndex--
    ) {
      const randomIndex = randomInt(currentIndex + 1)
      const currentItem = shuffledItems[currentIndex]
      const randomItem = shuffledItems[randomIndex]

      if (currentItem === undefined || randomItem === undefined) break

      shuffledItems[currentIndex] = randomItem
      shuffledItems[randomIndex] = currentItem
    }

    return shuffledItems
  }
}
