import type { AnswerEffect } from '@core/Answer/Answer'
import { ANSWER_EFFECT } from '@core/Answer/answerConstants'
import type { Game } from '@core/Game/Game'
import type { WordCard } from '@core/WordCard/WordCard'

export type NonIdleAnswerEffect = Exclude<
  AnswerEffect,
  { kind: typeof ANSWER_EFFECT.NONE }
>

export type ComputeAnswerStateParams = {
  readonly game: Game
  readonly currentCard: WordCard
  readonly selectedOption: string
}

export type AnswerStateResult = {
  readonly correctAnswers: number
  readonly wrongAnswers: number
  readonly remainingWords: Game['remainingWords']
  readonly effect: NonIdleAnswerEffect
}
