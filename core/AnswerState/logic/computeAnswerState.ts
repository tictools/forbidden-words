import { ANSWER_EFFECT } from '@core/Answer/answerConstants'
import type {
  AnswerStateResult,
  ComputeAnswerStateParams,
} from '@core/AnswerState/AnswerState'

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

  const effect: AnswerStateResult['effect'] = isCorrect
    ? { kind: ANSWER_EFFECT.CORRECT }
    : { kind: ANSWER_EFFECT.INCORRECT, targetWord: word.correctOption }

  return { correctAnswers, wrongAnswers, remainingWords, effect }
}
