import { type ReactNode, useEffect, useRef } from 'react'
import FlashProvider from '@lib/useFlash/FlashProvider'
import { useFlash } from '@lib/useFlash'
import { flashStateRef } from './flashStateRef'

function FlashStateCapture() {
  const flashState = useFlash()
  const ref = useRef(flashStateRef)

  useEffect(() => {
    ref.current.current = flashState
  }, [flashState])

  return null
}

export function FlashTestWrapper({ children }: { children: ReactNode }) {
  return (
    <FlashProvider>
      <FlashStateCapture />
      {children}
    </FlashProvider>
  )
}
