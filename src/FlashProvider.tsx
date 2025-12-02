import { type ReactNode, createElement } from 'react'
import { FlashContext, useFlashState } from './useFlash'
import Flash from './Flash'

interface FlashProviderProps {
  children: ReactNode
}

function FlashProvider({ children }: FlashProviderProps) {
  const flashState = useFlashState()

  return createElement(
    FlashContext.Provider,
    { value: flashState },
    <>
      {children}
      <Flash />
    </>
  )
}

export default FlashProvider
