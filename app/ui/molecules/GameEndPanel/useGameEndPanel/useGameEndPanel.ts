import { useEffect, useRef, useState } from 'react'

export const EXIT_DELAY_MS = 5000

export type UseGameEndPanelArgs = {
  readonly onPlayAgain: () => void
  readonly closeWindow?: () => void
}

export const useGameEndPanel = ({
  onPlayAgain,
  closeWindow = () => {
    window.close()
  },
}: UseGameEndPanelArgs) => {
  const [farewellVisible, setFarewellVisible] = useState(false)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const playAgainRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    playAgainRef.current?.focus()
  }, [])

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  useEffect(() => () => clearCloseTimer(), [])

  const handlePlayAgain = () => {
    clearCloseTimer()
    setFarewellVisible(false)
    onPlayAgain()
  }

  const handleExit = () => {
    setFarewellVisible(true)
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => {
      closeWindow()
    }, EXIT_DELAY_MS)
  }

  return {
    farewellVisible,
    playAgainRef,
    handlePlayAgain,
    handleExit,
  }
}
