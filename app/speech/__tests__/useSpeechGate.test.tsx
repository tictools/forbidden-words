import { render, renderHook, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { type UseSpeechGateResult, useSpeechGate } from '@app/speech/useSpeechGate'

function SpeechGateAlert() {
  const gate: UseSpeechGateResult = useSpeechGate()
  if (gate.status === 'checking') {
    return <div>checking</div>
  }
  if (gate.status === 'ready') {
    return <div>ready</div>
  }
  return (
    <div role="alert" lang="ca">
      {gate.message}
    </div>
  )
}

function voice(lang: string): SpeechSynthesisVoice {
  return { lang, default: false } as SpeechSynthesisVoice
}

function createSpeechSynthesisMock(options: {
  voices: SpeechSynthesisVoice[]
  getVoicesImpl?: () => SpeechSynthesisVoice[]
}): SpeechSynthesis {
  const listeners = new Map<string, Set<EventListener>>()

  const addEventListener = vi.fn((type: string, listener: EventListener) => {
    if (!listeners.has(type)) listeners.set(type, new Set())
    listeners.get(type)!.add(listener)
  })

  const removeEventListener = vi.fn((type: string, listener: EventListener) => {
    listeners.get(type)?.delete(listener)
  })

  const dispatchVoicesChanged = () => {
    const event = new Event('voiceschanged')
    for (const listener of listeners.get('voiceschanged') ?? []) {
      listener(event)
    }
  }

  let voices = options.voices
  const getVoices = vi.fn(() => {
    if (options.getVoicesImpl) return options.getVoicesImpl()
    return voices
  })

  const mock = {
    getVoices,
    addEventListener,
    removeEventListener,
    dispatchVoicesChanged,
    setVoices(next: SpeechSynthesisVoice[]) {
      voices = next
    },
  } as unknown as SpeechSynthesis & {
    dispatchVoicesChanged: () => void
    setVoices: (v: SpeechSynthesisVoice[]) => void
  }

  return mock
}

describe('useSpeechGate', () => {
  const originalSpeechSynthesis = window.speechSynthesis

  afterEach(() => {
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: originalSpeechSynthesis,
    })
  })

  it('resolves to ready when a Catalan voice is present', async () => {
    const synthesis = createSpeechSynthesisMock({ voices: [voice('ca-ES')] })
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: synthesis,
    })

    const { result } = renderHook(() => useSpeechGate())

    await waitFor(() => {
      expect(result.current.status).toBe('ready')
    })
  })

  it('resolves to blocked when speechSynthesis is missing', async () => {
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: undefined,
    })

    const { result } = renderHook(() => useSpeechGate())

    await waitFor(() => {
      expect(result.current.status).toBe('blocked')
    })
    if (result.current.status === 'blocked') {
      expect(result.current.message).toContain('síntesi de veu')
    }
  })

  it('resolves to blocked when voices load without any Catalan voice', async () => {
    const synthesis = createSpeechSynthesisMock({ voices: [voice('en-US')] })
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: synthesis,
    })

    const { result } = renderHook(() => useSpeechGate())

    await waitFor(() => {
      expect(result.current.status).toBe('blocked')
    })
    if (result.current.status === 'blocked') {
      expect(result.current.message).toContain('ca-ES')
    }
  })

  it('resolves to ready after voiceschanged supplies a Catalan voice', async () => {
    const synthesis = createSpeechSynthesisMock({ voices: [] })
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: synthesis,
    })

    const { result } = renderHook(() => useSpeechGate())

    expect(result.current.status).toBe('checking')

    ;(synthesis as unknown as { setVoices: (v: SpeechSynthesisVoice[]) => void }).setVoices([
      voice('ca-ES'),
    ])
    ;(synthesis as unknown as { dispatchVoicesChanged: () => void }).dispatchVoicesChanged()

    await waitFor(() => {
      expect(result.current.status).toBe('ready')
    })
  })

  it('exposes Catalan blocked messaging for RTL consumers', async () => {
    Object.defineProperty(window, 'speechSynthesis', {
      configurable: true,
      value: undefined,
    })

    render(<SpeechGateAlert />)

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument()
    })
    expect(screen.getByRole('alert')).toHaveTextContent(/síntesi de veu/)
  })
})
