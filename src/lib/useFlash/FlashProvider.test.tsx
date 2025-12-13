import { describe, it, expect } from 'vitest'
import { act, screen } from '@testing-library/react'
import { flashProviderPage } from './FlashProvider.page'
import { useFlash } from '../useFlash'

describe('FlashProvider', () => {
  it('renders children', () => {
    flashProviderPage.render(
      <div data-testid="child-content">Test Content</div>
    )

    expect(screen.getByTestId('child-content')).toBeInTheDocument()
    expect(screen.getByTestId('child-content')).toHaveTextContent('Test Content')
  })

  it('provides flash context to children', () => {
    let contextValue: ReturnType<typeof useFlash> | null = null

    function TestComponent() {
      contextValue = useFlash()
      return <div>Test</div>
    }

    flashProviderPage.render(<TestComponent />)

    expect(contextValue).not.toBeNull()
    expect(contextValue).toHaveProperty('flashes')
    expect(contextValue).toHaveProperty('showFlash')
    expect(contextValue).toHaveProperty('dismissFlash')
  })

  it('renders Flash component alongside children', () => {
    function TestComponent() {
      const { showFlash } = useFlash()

      return (
        <button onClick={() => showFlash('Test')}>Show</button>
      )
    }

    flashProviderPage.render(<TestComponent />)

    const button = screen.getByRole('button')

    act(() => {
      button.click()
    })

    // Flash component renders a toast container when there are flashes
    expect(flashProviderPage.toastContainer).toBeInTheDocument()
  })

  it('allows children to show flashes through context', () => {
    function TestComponent() {
      const { showFlash } = useFlash()

      return (
        <button onClick={() => showFlash('Test flash message')}>
          Show Flash
        </button>
      )
    }

    flashProviderPage.render(<TestComponent />)

    const button = screen.getByRole('button', { name: 'Show Flash' })

    act(() => {
      button.click()
    })

    expect(flashProviderPage.alerts).toHaveLength(1)
    expect(flashProviderPage.alerts[0]).toHaveTextContent('Test flash message')
  })

  it('maintains flash state across re-renders', () => {
    let renderCount = 0

    function TestComponent() {
      const { showFlash, flashes } = useFlash()
      renderCount++

      return (
        <div>
          <button onClick={() => showFlash('Flash message')}>Show Flash</button>
          <div data-testid="flash-count">{flashes.length}</div>
          <div data-testid="render-count">{renderCount}</div>
        </div>
      )
    }

    flashProviderPage.render(<TestComponent />)

    const button = screen.getByRole('button')

    act(() => {
      button.click()
    })

    expect(screen.getByTestId('flash-count')).toHaveTextContent('1')
    expect(flashProviderPage.alerts).toHaveLength(1)
  })

  it('allows multiple children to access the same flash context', () => {
    function Child1() {
      const { showFlash } = useFlash()
      return (
        <button onClick={() => showFlash('From Child 1')}>
          Child 1 Button
        </button>
      )
    }

    function Child2() {
      const { flashes } = useFlash()
      return <div data-testid="flash-count">{flashes.length}</div>
    }

    flashProviderPage.render(
      <>
        <Child1 />
        <Child2 />
      </>
    )

    const button = screen.getByRole('button', { name: 'Child 1 Button' })

    act(() => {
      button.click()
    })

    // Both children share the same flash context
    expect(screen.getByTestId('flash-count')).toHaveTextContent('1')
    expect(flashProviderPage.alerts).toHaveLength(1)
  })

  it('handles dismissing flashes through context', () => {
    function TestComponent() {
      const { showFlash, dismissFlash, flashes } = useFlash()

      return (
        <div>
          <button onClick={() => showFlash('Dismissible flash')}>
            Show Flash
          </button>
          <button
            onClick={() => {
              if (flashes.length > 0) {
                dismissFlash(flashes[0].id)
              }
            }}
          >
            Dismiss First Flash
          </button>
          <div data-testid="flash-count">{flashes.length}</div>
        </div>
      )
    }

    flashProviderPage.render(<TestComponent />)

    const showButton = screen.getByRole('button', { name: 'Show Flash' })
    const dismissButton = screen.getByRole('button', { name: 'Dismiss First Flash' })

    act(() => {
      showButton.click()
    })

    expect(screen.getByTestId('flash-count')).toHaveTextContent('1')
    expect(flashProviderPage.alerts).toHaveLength(1)

    act(() => {
      dismissButton.click()
    })

    expect(screen.getByTestId('flash-count')).toHaveTextContent('0')
    expect(flashProviderPage.alerts).toHaveLength(0)
  })
})
