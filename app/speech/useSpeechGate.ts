import { useEffect, useState } from 'react'

import { evaluateSpeechGate } from '@app/speech/evaluateSpeechGate'
import { blockedMessageFor } from '@app/speech/speechGateMessages'

export type UseSpeechGateResult =
  | { status: 'checking' }
  | { status: 'ready' }
  | { status: 'blocked'; message: string }

const EMPTY_VOICES_FINAL_MS = 2500

export function useSpeechGate(): UseSpeechGateResult {
  const [result, setResult] = useState<UseSpeechGateResult>({ status: 'checking' })

  useEffect(() => {
    const synthesis = window.speechSynthesis
    let cancelled = false

    const apply = (treatEmptyVoicesAsUnavailable: boolean) => {
      if (cancelled) return

      const voices = synthesis?.getVoices() ?? []
      const next = evaluateSpeechGate({
        synthesis,
        voices,
        options: { treatEmptyVoicesAsUnavailable },
      })

      if (next.outcome === 'awaiting-voices') {
        setResult({ status: 'checking' })
        return
      }

      if (next.outcome === 'blocked') {
        setResult({ status: 'blocked', message: blockedMessageFor({ reason: next.reason }) })
        return
      }
      
      setResult({ status: 'ready' })
    }

    apply(false)

    const onVoicesChanged = () => {
      apply(true)
    }

    synthesis?.addEventListener('voiceschanged', onVoicesChanged)

    const timeoutId = window.setTimeout(() => {
      apply(true)
    }, EMPTY_VOICES_FINAL_MS)

    return () => {
      cancelled = true
      window.clearTimeout(timeoutId)
      synthesis?.removeEventListener('voiceschanged', onVoicesChanged)
    }
  }, [])

  return result
}
