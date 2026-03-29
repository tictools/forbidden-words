import { describe, expect, it } from "vitest";

import { computeAnswerState } from "@core/game/answerState";
import { ANSWER_EFFECT, GAME_STATUS } from "@core/game/types";
import type { Game, Word, WordCard } from "@core/game/types";

const w1: Word = {
  correctOption: "a",
  wrongOptions: ["b", "c"],
  audioText: "a",
};
const w2: Word = {
  correctOption: "d",
  wrongOptions: ["e", "f"],
  audioText: "d",
};

function cardFor(word: Word): WordCard {
  return {
    word,
    shuffledOptions: [word.correctOption, word.wrongOptions[0], word.wrongOptions[1]],
    hasBeenAnswered: false,
    isCorrect: null,
    selectedOption: null,
  };
}

function gameWith(overrides: Partial<Game>): Game {
  return {
    id: "g",
    words: [w1, w2],
    remainingWords: [w1, w2],
    currentCard: cardFor(w1),
    correctAnswers: 0,
    wrongAnswers: 0,
    maxWrongAnswers: 10,
    status: GAME_STATUS.ACTIVE,
    result: null,
    ...overrides,
  };
}

describe("computeAnswerState", () => {
  it("counts a correct answer and removes the word from the pool", () => {
    const game = gameWith({});
    const delta = computeAnswerState({
      game,
      currentCard: cardFor(w1),
      selectedOption: "a",
    });

    expect(delta.correctAnswers).toBe(1);
    expect(delta.wrongAnswers).toBe(0);
    expect(delta.remainingWords).toEqual([w2]);
    expect(delta.effect).toEqual({ kind: ANSWER_EFFECT.CORRECT });
  });

  it("counts a wrong answer and removes the word from the pool", () => {
    const game = gameWith({});
    const delta = computeAnswerState({
      game,
      currentCard: cardFor(w1),
      selectedOption: "b",
    });

    expect(delta.correctAnswers).toBe(0);
    expect(delta.wrongAnswers).toBe(1);
    expect(delta.remainingWords).toEqual([w2]);
    expect(delta.effect).toEqual({
      kind: ANSWER_EFFECT.INCORRECT,
      targetWord: "a",
    });
  });
});
