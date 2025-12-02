import { describe, it, expect, vi, afterEach } from 'vitest'
import { act } from '@testing-library/react'
import { flashPage } from './Flash.page'

describe('Flash', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders nothing when there are no flashes', () => {
    flashPage.render()
    expect(flashPage.alerts).toHaveLength(0)
  })

  it('displays a flash message when showFlash is called', () => {
    flashPage.render()

    act(() => {
      flashPage.showFlash('Test message')
    })

    expect(flashPage.alerts).toHaveLength(1)
    expect(flashPage.alerts[0]).toHaveTextContent('Test message')
  })

  it('displays multiple flash messages', () => {
    flashPage.render()

    act(() => {
      flashPage.showFlash('First message')
      flashPage.showFlash('Second message')
    })

    expect(flashPage.alerts).toHaveLength(2)
  })

  it('applies info alert class by default', () => {
    flashPage.render()

    act(() => {
      flashPage.showFlash('Info message')
    })

    expect(flashPage.alerts[0]).toHaveClass('alert-info')
  })

  it('applies success alert class when type is success', () => {
    flashPage.render()

    act(() => {
      flashPage.showFlash('Success message', { type: 'success' })
    })

    expect(flashPage.alerts[0]).toHaveClass('alert-success')
  })

  it('applies warning alert class when type is warning', () => {
    flashPage.render()

    act(() => {
      flashPage.showFlash('Warning message', { type: 'warning' })
    })

    expect(flashPage.alerts[0]).toHaveClass('alert-warning')
  })

  it('applies error alert class when type is error', () => {
    flashPage.render()

    act(() => {
      flashPage.showFlash('Error message', { type: 'error' })
    })

    expect(flashPage.alerts[0]).toHaveClass('alert-error')
  })

  it('dismisses a flash when dismiss button is clicked', async () => {
    flashPage.render()

    act(() => {
      flashPage.showFlash('Dismissible message')
    })

    expect(flashPage.alerts).toHaveLength(1)

    await flashPage.dismissAlert(0)

    expect(flashPage.alerts).toHaveLength(0)
  })

  it('auto-dismisses flash after timeout', () => {
    vi.useFakeTimers()
    flashPage.render()

    act(() => {
      flashPage.showFlash('Auto dismiss', { type: 'info', timeout: 3000 })
    })

    expect(flashPage.alerts).toHaveLength(1)

    act(() => {
      vi.advanceTimersByTime(3000)
    })

    expect(flashPage.alerts).toHaveLength(0)
  })

  it('does not auto-dismiss when timeout is not provided', () => {
    vi.useFakeTimers()
    flashPage.render()

    act(() => {
      flashPage.showFlash('No auto dismiss')
    })

    expect(flashPage.alerts).toHaveLength(1)

    act(() => {
      vi.advanceTimersByTime(10000)
    })

    expect(flashPage.alerts).toHaveLength(1)
  })

  it('renders dismiss button for each flash', () => {
    flashPage.render()

    act(() => {
      flashPage.showFlash('First')
      flashPage.showFlash('Second')
    })

    expect(flashPage.dismissButtons).toHaveLength(2)
  })
})
