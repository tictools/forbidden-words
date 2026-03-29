import {
  ANSWER_EFFECT,
  type AnswerEffect,
  type Game,
  type WordCard,
} from '@core/game/types'

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

export function computeAnswerState({
  game,
  currentCard,
  selectedOption,
}: ComputeAnswerStateParams): AnswerStateResult {
  const { word } = currentCard
  const isCorrect = selectedOption === word.correctOption
  const correctAnswers = game.correctAnswers + (isCorrect ? 1 : 0)
  const wrongAnswers = game.wrongAnswers + (isCorrect ? 0 : 1)
  const remainingWords = game.remainingWords.filter((w) => w !== word)

  const effect: NonIdleAnswerEffect = isCorrect
    ? { kind: ANSWER_EFFECT.CORRECT }
    : { kind: ANSWER_EFFECT.INCORRECT, targetWord: word.correctOption }

  return { correctAnswers, wrongAnswers, remainingWords, effect }
}
