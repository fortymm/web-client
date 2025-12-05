import { renderHook, act } from '@testing-library/react'
import { vi } from 'vitest'
import { useDebounce } from './useDebounce'

interface RenderOptions<T> {
  initialValue: T
  delay: number
}

export const useDebouncePage = {
  render<T>(options: RenderOptions<T>) {
    return renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      {
        initialProps: { value: options.initialValue, delay: options.delay },
      }
    )
  },

  async advanceTimers(ms: number) {
    await act(async () => {
      vi.advanceTimersByTime(ms)
    })
  },
}
