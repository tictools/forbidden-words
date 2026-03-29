import { useCallback } from 'react'

const SPEECH_LANG = 'ca-ES'

export const SPEECH_RATE = 0.88

export function useSpeakTargetWord() {
  return useCallback((text: string) => {
    window.speechSynthesis.cancel()
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = SPEECH_LANG
    utterance.rate = SPEECH_RATE
    window.speechSynthesis.speak(utterance)
  }, [])
}
