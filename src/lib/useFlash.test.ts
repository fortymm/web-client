import { describe, it, expect, vi, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFlashPage } from './useFlash.page'
import { useFlash, useFlashState } from './useFlash'

describe('useFlash', () => {
  it('throws error when used outside FlashProvider', () => {
    // Suppress console.error for this test
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      renderHook(() => useFlash())
    }).toThrow('useFlash must be used within a FlashProvider')

    consoleError.mockRestore()
  })

  it('returns flash context when used within provider', () => {
    const { result } = useFlashPage.renderWithProvider()

    expect(result.current).toHaveProperty('flashes')
    expect(result.current).toHaveProperty('showFlash')
    expect(result.current).toHaveProperty('dismissFlash')
  })
})

describe('useFlashState', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('initializes with empty flashes array', () => {
    const { result } = useFlashPage.renderState()

    expect(result.current.flashes).toEqual([])
  })

  it('adds a flash message when showFlash is called', () => {
    const { result } = useFlashPage.renderState()

    useFlashPage.act(() => {
      result.current.showFlash('Test message')
    })

    expect(result.current.flashes).toHaveLength(1)
    expect(result.current.flashes[0]).toMatchObject({
      message: 'Test message',
      type: 'info',
    })
  })

  it('returns a unique id for each flash', () => {
    const { result } = useFlashPage.renderState()

    let id1 = ''
    let id2 = ''

    useFlashPage.act(() => {
      id1 = result.current.showFlash('First message')
      id2 = result.current.showFlash('Second message')
    })

    expect(id1).toBeTruthy()
    expect(id2).toBeTruthy()
    expect(id1).not.toBe(id2)
  })

  it('applies default type of info when no type is specified', () => {
    const { result } = useFlashPage.renderState()

    useFlashPage.act(() => {
      result.current.showFlash('Info message')
    })

    expect(result.current.flashes[0].type).toBe('info')
  })

  it('applies success type when specified', () => {
    const { result } = useFlashPage.renderState()

    useFlashPage.act(() => {
      result.current.showFlash('Success message', { type: 'success' })
    })

    expect(result.current.flashes[0].type).toBe('success')
  })

  it('applies warning type when specified', () => {
    const { result } = useFlashPage.renderState()

    useFlashPage.act(() => {
      result.current.showFlash('Warning message', { type: 'warning' })
    })

    expect(result.current.flashes[0].type).toBe('warning')
  })

  it('applies error type when specified', () => {
    const { result } = useFlashPage.renderState()

    useFlashPage.act(() => {
      result.current.showFlash('Error message', { type: 'error' })
    })

    expect(result.current.flashes[0].type).toBe('error')
  })

  it('stores timeout value when specified', () => {
    const { result } = useFlashPage.renderState()

    useFlashPage.act(() => {
      result.current.showFlash('Timeout message', { timeout: 5000 })
    })

    expect(result.current.flashes[0].timeout).toBe(5000)
  })

  it('stores action when specified', () => {
    const { result } = useFlashPage.renderState()
    const mockAction = { label: 'Undo', onClick: vi.fn() }

    useFlashPage.act(() => {
      result.current.showFlash('Message with action', { action: mockAction })
    })

    expect(result.current.flashes[0].action).toEqual(mockAction)
  })

  it('removes flash when dismissFlash is called', () => {
    const { result } = useFlashPage.renderState()

    let flashId: string

    useFlashPage.act(() => {
      flashId = result.current.showFlash('Dismissible message')
    })

    expect(result.current.flashes).toHaveLength(1)

    useFlashPage.act(() => {
      result.current.dismissFlash(flashId)
    })

    expect(result.current.flashes).toHaveLength(0)
  })

  it('only removes the specified flash when multiple exist', () => {
    const { result } = useFlashPage.renderState()

    let id1 = ''
    let id2 = ''

    useFlashPage.act(() => {
      id1 = result.current.showFlash('First message')
      id2 = result.current.showFlash('Second message')
    })

    expect(result.current.flashes).toHaveLength(2)

    useFlashPage.act(() => {
      result.current.dismissFlash(id1)
    })

    expect(result.current.flashes).toHaveLength(1)
    expect(result.current.flashes[0].id).toBe(id2)
  })

  it('auto-dismisses flash after timeout', () => {
    vi.useFakeTimers()
    const { result } = useFlashPage.renderState()

    useFlashPage.act(() => {
      result.current.showFlash('Auto dismiss', { timeout: 3000 })
    })

    expect(result.current.flashes).toHaveLength(1)

    useFlashPage.act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(result.current.flashes).toHaveLength(0)
  })

  it('does not auto-dismiss when timeout is 0', () => {
    vi.useFakeTimers()
    const { result } = useFlashPage.renderState()

    useFlashPage.act(() => {
      result.current.showFlash('No timeout', { timeout: 0 })
    })

    expect(result.current.flashes).toHaveLength(1)

    useFlashPage.act(() => {
      vi.advanceTimersByTime(10000)
    })

    expect(result.current.flashes).toHaveLength(1)
  })

  it('does not auto-dismiss when timeout is undefined', () => {
    vi.useFakeTimers()
    const { result } = useFlashPage.renderState()

    useFlashPage.act(() => {
      result.current.showFlash('No timeout')
    })

    expect(result.current.flashes).toHaveLength(1)

    useFlashPage.act(() => {
      vi.advanceTimersByTime(10000)
    })

    expect(result.current.flashes).toHaveLength(1)
  })

  it('clears timeout when flash is manually dismissed', () => {
    vi.useFakeTimers()
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')
    const { result } = useFlashPage.renderState()

    let flashId = ''

    useFlashPage.act(() => {
      flashId = result.current.showFlash('Message', { timeout: 5000 })
    })

    useFlashPage.act(() => {
      result.current.dismissFlash(flashId)
    })

    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })

  it('clears all timeouts on unmount', () => {
    vi.useFakeTimers()
    const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout')
    const rendered = renderHook(() => useFlashState())

    useFlashPage.act(() => {
      rendered.result.current.showFlash('First', { timeout: 5000 })
      rendered.result.current.showFlash('Second', { timeout: 3000 })
    })

    rendered.unmount()

    expect(clearTimeoutSpy).toHaveBeenCalledTimes(2)
    clearTimeoutSpy.mockRestore()
  })

  it('handles multiple flashes with different timeouts', () => {
    vi.useFakeTimers()
    const { result } = useFlashPage.renderState()

    useFlashPage.act(() => {
      result.current.showFlash('Short timeout', { timeout: 1000 })
      result.current.showFlash('Long timeout', { timeout: 5000 })
    })

    expect(result.current.flashes).toHaveLength(2)

    // Advance past first timeout
    useFlashPage.act(() => {
      vi.advanceTimersByTime(1000)
    })

    expect(result.current.flashes).toHaveLength(1)
    expect(result.current.flashes[0].message).toBe('Long timeout')

    // Advance past second timeout
    useFlashPage.act(() => {
      vi.advanceTimersByTime(4000)
    })

    expect(result.current.flashes).toHaveLength(0)
  })
})
