import { fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  type UseGameWordCardArgs,
  useGameWordCard,
} from '@app/ui/molecules/GameWordCard/useGameWordCard/useGameWordCard'
import { ANSWER_EFFECT } from '@core/Answer/answerConstants'
import type { Word } from '@core/Word/Word'
import type { WordCard } from '@core/WordCard/WordCard'

const mockSpeak = vi.fn()

vi.mock('@app/ui/molecules/GameWordCard/useSpeakTargetWord/useSpeakTargetWord', () => ({
  useSpeakTargetWord: () => mockSpeak,
}))

const baseWord: Word = {
  correctOption: 'perquè',
  wrongOptions: ['perque', 'perqè'],
  audioText: 'perquè',
}

const baseCard: WordCard = {
  word: baseWord,
  shuffledOptions: ['perque', 'perqè', 'perquè'],
  hasBeenAnswered: false,
  isCorrect: null,
  selectedOption: null,
}

function ListenHarness(props: UseGameWordCardArgs) {
  const { listenRef } = useGameWordCard(props)
  return (
    <button ref={listenRef} type="button">
      listen
    </button>
  )
}

function OptionsHarness(props: UseGameWordCardArgs) {
  const { listenRef, registerOptionRef, handleOptionKeyDown } =
    useGameWordCard(props)
  const { card } = props
  return (
    <div>
      <button ref={listenRef} type="button">
        listen
      </button>
      {card.shuffledOptions.map((option, optionIndex) => (
        <button
          key={option}
          ref={(element) => {
            registerOptionRef(optionIndex, element)
          }}
          type="button"
          onKeyDown={handleOptionKeyDown(optionIndex)}
        >
          {option}
        </button>
      ))}
    </div>
  )
}

describe('useGameWordCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('derives incorrectTargetWord only for incorrect answer effects', () => {
    const initialProps: UseGameWordCardArgs = {
      card: baseCard,
      lastAnswerEffect: null,
    }
    const { result, rerender } = renderHook(
      (props: UseGameWordCardArgs) => useGameWordCard(props),
      {
        initialProps,
      },
    )

    expect(result.current.incorrectTargetWord).toBeNull()

    rerender({
      card: baseCard,
      lastAnswerEffect: {
        kind: ANSWER_EFFECT.INCORRECT,
        targetWord: 'perquè',
      },
    })

    expect(result.current.incorrectTargetWord).toBe('perquè')
  })

  it('focuses the listen control when the card word changes', async () => {
    const { rerender } = render(
      <ListenHarness card={baseCard} lastAnswerEffect={null} />,
    )

    const listen = screen.getByRole('button', { name: /listen/i })
    await waitFor(() => {
      expect(listen).toHaveFocus()
    })

    const nextWord: Word = {
      correctOption: 'hi ha',
      wrongOptions: ['hiha', 'i a'],
      audioText: 'hi ha',
    }
    const nextCard: WordCard = {
      word: nextWord,
      shuffledOptions: ['hi ha', 'hiha', 'i a'],
      hasBeenAnswered: false,
      isCorrect: null,
      selectedOption: null,
    }

    rerender(<ListenHarness card={nextCard} lastAnswerEffect={null} />)

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /listen/i })).toHaveFocus()
    })
  })

  it('moves focus between options with arrow keys', () => {
    render(<OptionsHarness card={baseCard} lastAnswerEffect={null} />)

    const optionLabels = baseCard.shuffledOptions
    const first = screen.getByRole('button', {
      name: new RegExp(`^${optionLabels[0]}$`),
    })
    const second = screen.getByRole('button', {
      name: new RegExp(`^${optionLabels[1]}$`),
    })
    const third = screen.getByRole('button', {
      name: new RegExp(`^${optionLabels[2]}$`),
    })

    first.focus()
    expect(first).toHaveFocus()

    fireEvent.keyDown(first, { key: 'ArrowRight' })
    expect(second).toHaveFocus()

    fireEvent.keyDown(second, { key: 'ArrowLeft' })
    expect(first).toHaveFocus()

    fireEvent.keyDown(first, { key: 'ArrowUp' })
    expect(third).toHaveFocus()

    fireEvent.keyDown(third, { key: 'ArrowDown' })
    expect(first).toHaveFocus()
  })

  it('does not move focus from the listen control with arrow keys', async () => {
    render(<OptionsHarness card={baseCard} lastAnswerEffect={null} />)

    const listen = screen.getByRole('button', { name: /^listen$/i })
    await waitFor(() => {
      expect(listen).toHaveFocus()
    })

    fireEvent.keyDown(listen, { key: 'ArrowDown' })
    expect(listen).toHaveFocus()
  })

  it('exposes speak from useSpeakTargetWord for audio playback', () => {
    const { result } = renderHook(() =>
      useGameWordCard({ card: baseCard, lastAnswerEffect: null }),
    )

    result.current.speak('hola')

    expect(mockSpeak).toHaveBeenCalledTimes(1)
    expect(mockSpeak).toHaveBeenCalledWith('hola')
  })
})
