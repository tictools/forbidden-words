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
          className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow hover:bg-emerald-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
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
          className="rounded-md border border-amber-800/60 bg-amber-950/50 px-3 py-2 text-center text-sm text-amber-100"
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
            className="min-h-[44px] flex-1 rounded-md border border-emerald-700/80 bg-emerald-900/50 px-3 py-2 text-sm font-medium text-emerald-50 hover:bg-emerald-800/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300 sm:min-w-[8rem]"
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
