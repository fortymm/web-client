import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useDebouncePage } from './useDebounce.page'

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial value immediately', () => {
    const { result } = useDebouncePage.render({
      initialValue: 'test',
      delay: 250,
    })

    expect(result.current).toBe('test')
  })

  it('returns value after delay', async () => {
    const { result, rerender } = useDebouncePage.render({
      initialValue: 'initial',
      delay: 250,
    })

    expect(result.current).toBe('initial')

    // Update the value
    rerender({ value: 'updated', delay: 250 })

    // Before delay, still returns old value
    expect(result.current).toBe('initial')

    // After delay, returns new value
    await useDebouncePage.advanceTimers(250)
    expect(result.current).toBe('updated')
  })

  it('cancels pending update on new value', async () => {
    const { result, rerender } = useDebouncePage.render({
      initialValue: 'first',
      delay: 250,
    })

    // Update to second value
    rerender({ value: 'second', delay: 250 })
    await useDebouncePage.advanceTimers(100)
    expect(result.current).toBe('first')

    // Update to third value before delay completes
    rerender({ value: 'third', delay: 250 })
    await useDebouncePage.advanceTimers(100)
    expect(result.current).toBe('first')

    // Complete the delay - should be third value, not second
    await useDebouncePage.advanceTimers(150)
    expect(result.current).toBe('third')
  })

  it('handles different delay values', async () => {
    const { result, rerender } = useDebouncePage.render({
      initialValue: 'start',
      delay: 100,
    })

    rerender({ value: 'end', delay: 100 })

    await useDebouncePage.advanceTimers(50)
    expect(result.current).toBe('start')

    await useDebouncePage.advanceTimers(50)
    expect(result.current).toBe('end')
  })

  it('works with different types', async () => {
    const { result, rerender } = useDebouncePage.render({
      initialValue: 0,
      delay: 250,
    })

    expect(result.current).toBe(0)

    rerender({ value: 42, delay: 250 })
    await useDebouncePage.advanceTimers(250)
    expect(result.current).toBe(42)
  })
})
