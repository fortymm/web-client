import { renderHook, act } from '@testing-library/react'
import { createElement, type ReactNode } from 'react'
import { useFlash, useFlashState, FlashContext } from './useFlash'
import FlashProvider from './FlashProvider'

export const useFlashPage = {
  renderState() {
    const { result } = renderHook(() => useFlashState())
    return { result }
  },

  renderWithProvider() {
    function Wrapper({ children }: { children: ReactNode }) {
      return createElement(FlashProvider, null, children)
    }

    const { result } = renderHook(() => useFlash(), {
      wrapper: Wrapper,
    })

    return { result }
  },

  createWrapper() {
    return function Wrapper({ children }: { children: ReactNode }) {
      return createElement(FlashContext.Provider, { value: useFlashState() }, children)
    }
  },

  act,
}
