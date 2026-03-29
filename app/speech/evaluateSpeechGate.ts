export type SpeechGateBlockedReason = 'missing-api' | 'no-catalan-voice'

export type SpeechGateOutcome =
  | { outcome: 'ready' }
  | { outcome: 'blocked'; reason: SpeechGateBlockedReason }
  | { outcome: 'awaiting-voices' }

export type EvaluateSpeechGateOptions = {
  /** When true, an empty `voices` array means Catalan is not available (e.g. after voiceschanged or timeout). */
  readonly treatEmptyVoicesAsUnavailable: boolean
}

export type EvaluateSpeechGateParams = {
  readonly synthesis: SpeechSynthesis | undefined | null
  readonly voices: readonly SpeechSynthesisVoice[]
  readonly options: EvaluateSpeechGateOptions
}

export function isCatalanSpeechVoice(voice: SpeechSynthesisVoice): boolean {
  const lang = voice.lang.trim().toLowerCase()
  return lang === 'ca' || lang.startsWith('ca-')
}

function hasCatalanVoice(voices: readonly SpeechSynthesisVoice[]): boolean {
  return voices.some(isCatalanSpeechVoice)
}

export function evaluateSpeechGate(params: EvaluateSpeechGateParams): SpeechGateOutcome {
  const { synthesis, voices, options } = params

  if (synthesis == null) {
    return { outcome: 'blocked', reason: 'missing-api' }
  }

  if (voices.length === 0) {
    if (options.treatEmptyVoicesAsUnavailable) {
      return { outcome: 'blocked', reason: 'no-catalan-voice' }
    }
    return { outcome: 'awaiting-voices' }
  }

  if (!hasCatalanVoice(voices)) {
    return { outcome: 'blocked', reason: 'no-catalan-voice' }
  }

  return { outcome: 'ready' }
}
