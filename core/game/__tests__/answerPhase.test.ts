import { describe, expect, it } from "vitest";

import { resolveAnswerPhase } from "@core/game/answerPhase";
import { GAME_RESULT, GAME_STATUS } from "@core/game/types";
import type { Game, Word } from "@core/game/types";

const w: Word = {
  correctOption: "a",
  wrongOptions: ["b", "c"],
  audioText: "a",
};

function baseGame(overrides: Partial<Game> = {}): Game {
  return {
    id: "g",
    words: [w, w, w],
    remainingWords: [w, w, w],
    currentCard: null,
    correctAnswers: 0,
    wrongAnswers: 0,
    maxWrongAnswers: 10,
    status: GAME_STATUS.ACTIVE,
    result: null,
    ...overrides,
  };
}

describe("resolveAnswerPhase", () => {
  it("returns terminal lost when errors reach the maximum", () => {
    const game = baseGame({ maxWrongAnswers: 10 });
    const phase = resolveAnswerPhase({
      game,
      delta: {
        correctAnswers: 0,
        wrongAnswers: 10,
        remainingWords: [w],
      },
    });

    expect(phase).toEqual({ kind: "terminal", result: GAME_RESULT.LOST });
  });

  it("returns terminal won when the pool is empty and every word was answered correctly", () => {
    const game = baseGame({ words: [w, w, w] });
    const phase = resolveAnswerPhase({
      game,
      delta: {
        correctAnswers: 3,
        wrongAnswers: 0,
        remainingWords: [],
      },
    });

    expect(phase).toEqual({ kind: "terminal", result: GAME_RESULT.WON });
  });

  it("returns terminal lost when the pool is empty but not all words were mastered", () => {
    const game = baseGame({ words: [w, w, w] });
    const phase = resolveAnswerPhase({
      game,
      delta: {
        correctAnswers: 0,
        wrongAnswers: 3,
        remainingWords: [],
      },
    });

    expect(phase).toEqual({ kind: "terminal", result: GAME_RESULT.LOST });
  });

  it("returns continue when there are remaining words and under the error cap", () => {
    const game = baseGame({});
    const phase = resolveAnswerPhase({
      game,
      delta: {
        correctAnswers: 1,
        wrongAnswers: 2,
        remainingWords: [w],
      },
    });

    expect(phase).toEqual({ kind: "continue" });
  });
});
