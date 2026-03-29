import { describe, expect, it } from 'vitest'

import { evaluateSpeechGate, isCatalanSpeechVoice } from '@app/speech/evaluateSpeechGate'

function voice(lang: string): SpeechSynthesisVoice {
  return { lang, default: false } as SpeechSynthesisVoice
}

function synthesisStub(): SpeechSynthesis {
  return {} as SpeechSynthesis
}

describe('evaluateSpeechGate', () => {
  it('blocks when speechSynthesis is missing', () => {
    expect(
      evaluateSpeechGate({
        synthesis: undefined,
        voices: [],
        options: { treatEmptyVoicesAsUnavailable: false },
      }),
    ).toEqual({
      outcome: 'blocked',
      reason: 'missing-api',
    })
  })

  it('awaits voices when synthesis exists but the voice list is empty and empty is not final', () => {
    expect(
      evaluateSpeechGate({
        synthesis: synthesisStub(),
        voices: [],
        options: { treatEmptyVoicesAsUnavailable: false },
      }),
    ).toEqual({
      outcome: 'awaiting-voices',
    })
  })

  it('blocks for no Catalan voice when voices are loaded but none match ca / ca-*', () => {
    expect(
      evaluateSpeechGate({
        synthesis: synthesisStub(),
        voices: [voice('en-US'), voice('es-ES')],
        options: { treatEmptyVoicesAsUnavailable: false },
      }),
    ).toEqual({
      outcome: 'blocked',
      reason: 'no-catalan-voice',
    })
  })

  it('is ready when at least one voice supports Catalan (ca-ES)', () => {
    expect(
      evaluateSpeechGate({
        synthesis: synthesisStub(),
        voices: [voice('en-US'), voice('ca-ES')],
        options: { treatEmptyVoicesAsUnavailable: false },
      }),
    ).toEqual({ outcome: 'ready' })
  })

  it('is ready when a Catalan voice uses short lang ca', () => {
    expect(
      evaluateSpeechGate({
        synthesis: synthesisStub(),
        voices: [voice('ca')],
        options: { treatEmptyVoicesAsUnavailable: false },
      }),
    ).toEqual({ outcome: 'ready' })
  })

  it('treats an empty voice list as unavailable when the caller says voices are final', () => {
    expect(
      evaluateSpeechGate({
        synthesis: synthesisStub(),
        voices: [],
        options: { treatEmptyVoicesAsUnavailable: true },
      }),
    ).toEqual({
      outcome: 'blocked',
      reason: 'no-catalan-voice',
    })
  })
})

describe('isCatalanSpeechVoice', () => {
  it('returns true for ca-ES and ca', () => {
    expect(isCatalanSpeechVoice(voice('ca-ES'))).toBe(true)
    expect(isCatalanSpeechVoice(voice('ca'))).toBe(true)
  })

  it('returns false for other languages', () => {
    expect(isCatalanSpeechVoice(voice('es-ES'))).toBe(false)
    expect(isCatalanSpeechVoice(voice('en'))).toBe(false)
  })
})
