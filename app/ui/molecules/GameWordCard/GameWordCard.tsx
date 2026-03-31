import { Box } from '@app/ui/atoms/Box/Box'
import { Button } from '@app/ui/atoms/Button/Button'
import { RenderOrNull } from '@app/ui/atoms/RenderOrNull/RenderOrNull'
import { Section } from '@app/ui/atoms/Section/Section'
import { Text } from '@app/ui/atoms/Text/Text'
import { useGameWordCard } from '@app/ui/molecules/GameWordCard/useGameWordCard/useGameWordCard'
import type { AnswerEffect } from '@core/Answer/Answer'
import type { WordCard } from '@core/WordCard/WordCard'

export type GameWordCardProps = {
  readonly card: WordCard
  readonly lastAnswerEffect: AnswerEffect | null
  readonly onSelectOption: (option: string) => void
}

export const GameWordCard = ({
  card,
  lastAnswerEffect,
  onSelectOption,
}: GameWordCardProps) => {
  const {
    speak,
    listenRef,
    registerOptionRef,
    handleOptionKeyDown,
    incorrectTargetWord,
  } = useGameWordCard({ card, lastAnswerEffect })

  return (
    <Section
      aria-label="Paraules de la targeta"
      className="flex flex-col gap-4"
    >
      <Box className="flex justify-center">
        <Button
          ref={listenRef}
          type="button"
          className="rounded-md bg-accent px-4 py-2 text-base font-medium text-white shadow hover:bg-accent-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-focus"
          onClick={() => {
            speak(card.word.audioText)
          }}
        >
          Escolta la paraula
        </Button>
      </Box>
      <RenderOrNull shouldRender={incorrectTargetWord !== null}>
        <Text
          role="status"
          aria-live="polite"
          className="rounded-md border border-warning-border bg-warning-bg px-3 py-2 text-center text-base text-warning-foreground"
        >
          L&apos;opció correcta és {incorrectTargetWord}
        </Text>
      </RenderOrNull>
      <Box
        role="group"
        aria-label="Opcions d&apos;ortografia"
        className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center"
      >
        {card.shuffledOptions.map((option, optionIndex) => (
          <Button
            key={`${card.word.correctOption}-${option}`}
            ref={(element) => {
              registerOptionRef(optionIndex, element)
            }}
            type="button"
            className="min-h-[44px] flex-1 rounded-md border border-chip-border bg-chip-bg px-3 py-2 text-base font-medium text-foreground hover:bg-chip-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring-focus sm:min-w-[8rem]"
            onKeyDown={handleOptionKeyDown(optionIndex)}
            onClick={() => {
              onSelectOption(option)
            }}
          >
            {option}
          </Button>
        ))}
      </Box>
    </Section>
  )
}
