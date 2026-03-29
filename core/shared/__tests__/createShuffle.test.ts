import { describe, expect, it } from 'vitest'

import { createShuffle } from '@core/shared/createShuffle'

describe('createShuffle', () => {
  it('returns a permutation of the input using Fisher–Yates with injected random', () => {
    let i = 0
    const planned = [0, 0, 0]
    const randomInt = (maxExclusive: number) => planned[i++]! % maxExclusive
    const shuffle = createShuffle({ randomInt })

    const out = shuffle(['a', 'b', 'c'])

    expect(out).toHaveLength(3)
    expect(new Set(out).size).toBe(3)
    expect(out.sort()).toEqual(['a', 'b', 'c'])
  })
})
