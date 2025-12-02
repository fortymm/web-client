import { type ReactNode, useEffect, useRef } from 'react'
import { FlashContext, useFlashState } from '../useFlash'
import { flashStateRef } from './flashStateRef'

export function FlashTestWrapper({ children }: { children: ReactNode }) {
  const flashState = useFlashState()
  const ref = useRef(flashStateRef)

  useEffect(() => {
    ref.current.current = flashState
  }, [flashState])

  return (
    <FlashContext.Provider value={flashState}>
      {children}
    </FlashContext.Provider>
  )
}
