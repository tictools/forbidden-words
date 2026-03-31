import {
  useCallback,
  useEffect,
  useRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from 'react'

import { useSpeakTargetWord } from '@app/ui/molecules/GameWordCard/useSpeakTargetWord/useSpeakTargetWord'
import type { AnswerEffect } from '@core/Answer/Answer'
import { ANSWER_EFFECT } from '@core/Answer/answerConstants'
import type { WordCard } from '@core/WordCard/WordCard'

const OPTION_KEYS_NEXT = new Set(['ArrowRight', 'ArrowDown'])
const OPTION_KEYS_PREV = new Set(['ArrowLeft', 'ArrowUp'])

export type UseGameWordCardArgs = {
  readonly card: WordCard
  readonly lastAnswerEffect: AnswerEffect | null
}

export type UseGameWordCardResult = {
  readonly speak: (text: string) => void
  readonly listenRef: RefObject<HTMLButtonElement | null>
  readonly registerOptionRef: (
    optionIndex: number,
    element: HTMLButtonElement | null,
  ) => void
  readonly handleOptionKeyDown: (
    optionIndex: number,
  ) => (event: ReactKeyboardEvent<HTMLButtonElement>) => void
  readonly incorrectTargetWord: string | null
}

export function useGameWordCard({
  card,
  lastAnswerEffect,
}: UseGameWordCardArgs): UseGameWordCardResult {
  const speak = useSpeakTargetWord()
  const listenRef = useRef<HTMLButtonElement>(null)
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([])

  useEffect(() => {
    listenRef.current?.focus()
  }, [card.word.correctOption])

  const moveOptionFocus = useCallback(
    (fromIndex: number, delta: number) => {
      const n = card.shuffledOptions.length
      if (n === 0) return
      const nextIndex = (fromIndex + delta + n) % n
      optionRefs.current[nextIndex]?.focus()
    },
    [card.shuffledOptions.length],
  )

  const handleOptionKeyDown = useCallback(
    (optionIndex: number) =>
      (event: ReactKeyboardEvent<HTMLButtonElement>) => {
        if (OPTION_KEYS_NEXT.has(event.key)) {
          event.preventDefault()
          moveOptionFocus(optionIndex, 1)
          return
        }
        if (OPTION_KEYS_PREV.has(event.key)) {
          event.preventDefault()
          moveOptionFocus(optionIndex, -1)
        }
      },
    [moveOptionFocus],
  )

  const registerOptionRef = useCallback(
    (optionIndex: number, element: HTMLButtonElement | null) => {
      optionRefs.current[optionIndex] = element
    },
    [],
  )

  const incorrectTargetWord =
    lastAnswerEffect?.kind === ANSWER_EFFECT.INCORRECT
      ? lastAnswerEffect.targetWord
      : null

  return {
    speak,
    listenRef,
    registerOptionRef,
    handleOptionKeyDown,
    incorrectTargetWord,
  }
}
