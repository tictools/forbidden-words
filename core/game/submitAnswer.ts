import { resolveAnswerPhase } from '@core/game/answerPhase'
import { computeAnswerState } from '@core/game/answerState'
import { toFinishedGame } from '@core/game/finishedGame'
import {
  ANSWER_EFFECT,
  GAME_STATUS,
  type Game,
  type RandomIntFn,
  type ShuffleFn,
  type SubmitAnswerResult,
} from '@core/game/types'
import { createWordCard } from '@core/game/wordCard'

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
