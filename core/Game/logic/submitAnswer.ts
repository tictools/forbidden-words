import type { RandomIntFn, ShuffleFn } from '@core/shared/randomTypes'
import { ANSWER_EFFECT } from '@core/Answer/answerConstants'
import type { SubmitAnswerResult } from '@core/Answer/Answer'
import { resolveAnswerPhase } from '@core/AnswerPhase/logic/resolveAnswerPhase'
import { computeAnswerState } from '@core/AnswerState/logic/computeAnswerState'
import { GAME_STATUS } from '@core/Game/gameConstants'
import type { Game } from '@core/Game/Game'
import { toFinishedGame } from '@core/Game/logic/finishedGame'
import { createWordCard } from '@core/WordCard/logic/createWordCard'

export type SubmitAnswerParams = {
  readonly game: Game
  readonly selectedOption: string
  readonly randomInt: RandomIntFn
  readonly shuffle: ShuffleFn
}

export function submitAnswer({
  game,
  selectedOption,
  randomInt,
  shuffle,
}: SubmitAnswerParams): SubmitAnswerResult {
  if (game.status !== GAME_STATUS.ACTIVE || game.currentCard === null) {
    return { game, effect: { kind: ANSWER_EFFECT.NONE } }
  }

  const delta = computeAnswerState({
    game,
    currentCard: game.currentCard,
    selectedOption,
  })
  const phase = resolveAnswerPhase({ game, delta })

  if (phase.kind === 'terminal') {
    return {
      game: toFinishedGame({
        base: game,
        patch: {
          remainingWords: delta.remainingWords,
          correctAnswers: delta.correctAnswers,
          wrongAnswers: delta.wrongAnswers,
          currentCard: null,
          result: phase.result,
        },
      }),
      effect: delta.effect,
    }
  }

  const nextWord =
    delta.remainingWords[randomInt(delta.remainingWords.length)]!

  return {
    game: {
      ...game,
      remainingWords: delta.remainingWords,
      correctAnswers: delta.correctAnswers,
      wrongAnswers: delta.wrongAnswers,
      currentCard: createWordCard({ word: nextWord, shuffle }),
      status: GAME_STATUS.ACTIVE,
      result: null,
    },
    effect: delta.effect,
  }
}
