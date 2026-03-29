import {
  ANSWER_EFFECT,
  GAME_RESULT,
  GAME_STATUS,
  type Game,
  type RandomIntFn,
  type ShuffleFn,
  type SubmitAnswerResult,
} from '@core/game/types'
import { createWordCard } from '@core/game/word-card'

function finishedGame(
  base: Game,
  patch: Pick<
    Game,
    'remainingWords' | 'correctAnswers' | 'wrongAnswers' | 'currentCard' | 'result'
  >,
): Game {
  return {
    ...base,
    ...patch,
    status: GAME_STATUS.FINISHED,
  }
}

export function submitAnswer(
  game: Game,
  selectedOption: string,
  randomInt: RandomIntFn,
  shuffle: ShuffleFn,
): SubmitAnswerResult {
  if (game.status !== GAME_STATUS.ACTIVE || game.currentCard === null) {
    return { game, effect: { kind: ANSWER_EFFECT.NONE } }
  }

  const { word } = game.currentCard
  const isCorrect = selectedOption === word.correctOption

  const correctAnswers = game.correctAnswers + (isCorrect ? 1 : 0)
  const wrongAnswers = game.wrongAnswers + (isCorrect ? 0 : 1)
  const remainingWords = game.remainingWords.filter((w) => w !== word)

  const effect: SubmitAnswerResult['effect'] = isCorrect
    ? { kind: ANSWER_EFFECT.CORRECT }
    : { kind: ANSWER_EFFECT.INCORRECT, targetWord: word.correctOption }

  if (wrongAnswers >= game.maxWrongAnswers) {
    return {
      game: finishedGame(game, {
        remainingWords,
        correctAnswers,
        wrongAnswers,
        currentCard: null,
        result: GAME_RESULT.LOST,
      }),
      effect,
    }
  }

  if (remainingWords.length === 0) {
    const won = correctAnswers === game.words.length
    return {
      game: finishedGame(game, {
        remainingWords,
        correctAnswers,
        wrongAnswers,
        currentCard: null,
        result: won ? GAME_RESULT.WON : GAME_RESULT.LOST,
      }),
      effect,
    }
  }

  const nextWord = remainingWords[randomInt(remainingWords.length)]!

  return {
    game: {
      ...game,
      remainingWords,
      correctAnswers,
      wrongAnswers,
      currentCard: createWordCard(nextWord, shuffle),
      status: GAME_STATUS.ACTIVE,
      result: null,
    },
    effect,
  }
}
