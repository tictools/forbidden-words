import { describe, expect, it } from 'vitest'

import { toolchainReady } from '@core/smoke/toolchain-smoke'

describe('toolchain smoke', () => {
  it('runs Vitest', () => {
    expect(true).toBe(true)
  })

  it('resolves @core/smoke/toolchain-smoke', () => {
    expect(toolchainReady).toBe(true)
  })
})
