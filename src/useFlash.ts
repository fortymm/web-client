import { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react'

export type FlashType = 'info' | 'success' | 'warning' | 'error'

export interface FlashAction {
  label: string
  onClick: () => void
}

export interface FlashMessage {
  id: string
  message: string
  type: FlashType
  timeout?: number
  action?: FlashAction
}

export interface ShowFlashOptions {
  type?: FlashType
  timeout?: number
  action?: FlashAction
}

export interface FlashContextValue {
  flashes: FlashMessage[]
  showFlash: (message: string, options?: ShowFlashOptions) => string
  dismissFlash: (id: string) => void
}

export const FlashContext = createContext<FlashContextValue | null>(null)

export function useFlash(): FlashContextValue {
  const context = useContext(FlashContext)
  if (!context) {
    throw new Error('useFlash must be used within a FlashProvider')
  }
  return context
}

export function useFlashState(): FlashContextValue {
  const [flashes, setFlashes] = useState<FlashMessage[]>([])
  const timeoutRefs = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map())

  const dismissFlash = useCallback((id: string) => {
    const timeoutId = timeoutRefs.current.get(id)
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutRefs.current.delete(id)
    }
    setFlashes((prev) => prev.filter((flash) => flash.id !== id))
  }, [])

  const showFlash = useCallback((message: string, options: ShowFlashOptions = {}) => {
    const { type = 'info', timeout, action } = options
    const id = crypto.randomUUID()
    const flash: FlashMessage = { id, message, type, timeout, action }

    setFlashes((prev) => [...prev, flash])

    if (timeout !== undefined && timeout > 0) {
      const timeoutId = setTimeout(() => {
        dismissFlash(id)
      }, timeout)
      timeoutRefs.current.set(id, timeoutId)
    }

    return id
  }, [dismissFlash])

  useEffect(() => {
    const refs = timeoutRefs.current
    return () => {
      refs.forEach((timeoutId) => clearTimeout(timeoutId))
      refs.clear()
    }
  }, [])

  return { flashes, showFlash, dismissFlash }
}
