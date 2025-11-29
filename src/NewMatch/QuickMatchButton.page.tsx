import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import QuickMatchButton from './QuickMatchButton'
import { type MatchLength } from './MatchLengthControl'
import { TestQueryProvider, createTestQueryClient } from '../test/utils'
import { type QueryClient } from '@tanstack/react-query'

interface RenderOptions {
  matchLength?: MatchLength
  onMatchCreated?: (matchId: string) => void
  disabled?: boolean
  queryClient?: QueryClient
}

export const quickMatchButtonPage = {
  render(options: RenderOptions = {}) {
    const {
      matchLength = 5,
      onMatchCreated = vi.fn(),
      disabled = false,
      queryClient = createTestQueryClient(),
    } = options

    render(
      <TestQueryProvider client={queryClient}>
        <QuickMatchButton
          matchLength={matchLength}
          onMatchCreated={onMatchCreated}
          disabled={disabled}
        />
      </TestQueryProvider>
    )

    return { onMatchCreated, queryClient }
  },

  get button() {
    return screen.getByRole('button', { name: /Quick Match/i })
  },

  get loadingButton() {
    return screen.getByRole('button', { name: /Creating match/i })
  },

  get spinner() {
    return screen.getByRole('button').querySelector('.loading-spinner')
  },

  get mainText() {
    return screen.getByText(/Quick Match/i)
  },

  get subtitleText() {
    return screen.queryByText(/Start now · Choose player later/i)
  },

  get loadingText() {
    return screen.queryByText(/Creating match.../i)
  },

  async click() {
    await userEvent.click(this.button)
  },
}
