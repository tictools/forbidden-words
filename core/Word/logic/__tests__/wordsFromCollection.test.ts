import { describe, expect, it } from 'vitest'

import { wordsFromCollection } from '@core/Word/logic/wordsFromCollection'

describe('wordsFromCollection', () => {
  it('builds Word value objects from WordGroup tuples', () => {
    const collection = [
      ['perquè', 'perque', 'perqè'],
      ['hi ha', 'hiha', 'i a'],
    ] as const

    const words = wordsFromCollection({ collection })

    expect(words).toHaveLength(2)
    expect(words[0]).toEqual({
      correctOption: 'perquè',
      wrongOptions: ['perque', 'perqè'],
      audioText: 'perquè',
    })
    expect(words[1]).toEqual({
      correctOption: 'hi ha',
      wrongOptions: ['hiha', 'i a'],
      audioText: 'hi ha',
    })
  })
})
