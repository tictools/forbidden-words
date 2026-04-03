import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { SPEECH_RATE } from '@app/ui/molecules/GameWordCard/useSpeakTargetWord/useSpeakTargetWord'
import { GameWordCard } from '@app/ui/molecules/GameWordCard/GameWordCard'
import { ANSWER_EFFECT } from '@core/Answer/answerConstants'
import type { Word } from '@core/Word/Word'
import type { WordCard } from '@core/WordCard/WordCard'

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

describe('GameWordCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    globalThis.SpeechSynthesisUtterance =
      class MockUtterance {
        text: string
        lang = ''
        rate = 1
        constructor(text: string) {
          this.text = text
        }
      } as unknown as typeof SpeechSynthesisUtterance

    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: {
        cancel: vi.fn(),
        speak: vi.fn(),
      },
      writable: true,
    })
  })

  it('renders listen and three shuffled options', () => {
    const onSelectOption = vi.fn()

    render(
      <GameWordCard
        card={baseCard}
        lastAnswerEffect={null}
        onSelectOption={onSelectOption}
      />,
    )

    expect(
      screen.getByRole('button', { name: /escolta la paraula/i }),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^perque$/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^perqè$/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /^perquè$/ })).toBeInTheDocument()
  })

  it('focuses the listen control when the card word changes', async () => {
    const onSelectOption = vi.fn()

    const { rerender } = render(
      <GameWordCard
        card={baseCard}
        lastAnswerEffect={null}
        onSelectOption={onSelectOption}
      />,
    )

    const listen = screen.getByRole('button', { name: /escolta la paraula/i })
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

    rerender(
      <GameWordCard
        card={nextCard}
        lastAnswerEffect={null}
        onSelectOption={onSelectOption}
      />,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /escolta la paraula/i }),
      ).toHaveFocus()
    })
  })

  it('speaks the target via speechSynthesis when listen is pressed', () => {
    const onSelectOption = vi.fn()

    render(
      <GameWordCard
        card={baseCard}
        lastAnswerEffect={null}
        onSelectOption={onSelectOption}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /escolta la paraula/i }))

    expect(window.speechSynthesis.cancel).toHaveBeenCalled()
    expect(window.speechSynthesis.speak).toHaveBeenCalledTimes(1)
    const utterance = vi.mocked(window.speechSynthesis.speak).mock.calls[0]![0]
    expect(utterance).toBeInstanceOf(SpeechSynthesisUtterance)
    expect(utterance.text).toBe('perquè')
    expect(utterance.lang).toBe('ca-ES')
    expect(utterance.rate).toBe(SPEECH_RATE)
  })

  it('calls onSelectOption with the chosen label', () => {
    const onSelectOption = vi.fn()

    render(
      <GameWordCard
        card={baseCard}
        lastAnswerEffect={null}
        onSelectOption={onSelectOption}
      />,
    )

    fireEvent.click(screen.getByRole('button', { name: /^perque$/ }))
    expect(onSelectOption).toHaveBeenCalledWith('perque')
  })

  it('moves focus between options with arrow keys only within the option group', () => {
    const onSelectOption = vi.fn()

    render(
      <GameWordCard
        card={baseCard}
        lastAnswerEffect={null}
        onSelectOption={onSelectOption}
      />,
    )

    const optionLabels = baseCard.shuffledOptions
    const first = screen.getByRole('button', { name: new RegExp(`^${optionLabels[0]}$`) })
    const second = screen.getByRole('button', { name: new RegExp(`^${optionLabels[1]}$`) })
    const third = screen.getByRole('button', { name: new RegExp(`^${optionLabels[2]}$`) })

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
    const onSelectOption = vi.fn()

    render(
      <GameWordCard
        card={baseCard}
        lastAnswerEffect={null}
        onSelectOption={onSelectOption}
      />,
    )

    const listen = screen.getByRole('button', { name: /escolta la paraula/i })
    await waitFor(() => {
      expect(listen).toHaveFocus()
    })

    fireEvent.keyDown(listen, { key: 'ArrowDown' })
    expect(listen).toHaveFocus()
  })

  it('shows Catalan error copy with the target word after an incorrect answer', () => {
    const onSelectOption = vi.fn()

    render(
      <GameWordCard
        card={baseCard}
        lastAnswerEffect={{
          kind: ANSWER_EFFECT.INCORRECT,
          targetWord: 'perquè',
        }}
        onSelectOption={onSelectOption}
      />,
    )

    expect(
      screen.getByText(/l'opció correcta és perquè/i),
    ).toBeInTheDocument()
  })
})
