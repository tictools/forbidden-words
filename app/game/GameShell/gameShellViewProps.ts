import type { UseSpeechGateResult } from '@app/game/GameShell/useSpeechGate/useSpeechGate'
import type { AnswerEffect } from '@core/Answer/Answer'
import type { Game } from '@core/Game/Game'
import type { GameBarMetrics } from '@core/GameProgress/GameBarMetrics'

export type GameShellViewProps = {
  readonly speech: UseSpeechGateResult
  readonly displayMetrics: GameBarMetrics
  readonly hasActiveGame: boolean
  readonly game: Game | null
  readonly lastAnswerEffect: AnswerEffect | null
  readonly onSelectOption: (option: string) => void
  readonly onStartGame?: () => void
  readonly onReset?: () => void
  readonly closeWindow?: () => void
}
