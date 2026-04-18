import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { MatchSettings } from './match-settings-card'
import { MatchSettingsCard } from './match-settings-card'

function renderCard(overrides?: {
  onCancel?: () => void
  onStart?: (s: MatchSettings) => void
}) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  )
  const onCancel = overrides?.onCancel ?? vi.fn()
  const onStart = overrides?.onStart ?? vi.fn()
  return {
    onCancel,
    onStart,
    ...render(<MatchSettingsCard onCancel={onCancel} onStart={onStart} />, {
      wrapper,
    }),
  }
}

describe('MatchSettingsCard', () => {
  it('defaults to best of 5 and rated on, with "pick an opponent" prompt', () => {
    renderCard()

    expect(screen.getByRole('radio', { name: /Best of 5/i })).toBeChecked()
    expect(
      screen.getByRole('switch', { name: /counts toward rating/i }),
    ).toBeChecked()
    expect(screen.getByText(/pick an opponent/i)).toBeInTheDocument()
  })

  it('lists recent opponents from the API on focus', async () => {
    const user = userEvent.setup()
    renderCard()

    await user.click(screen.getByRole('textbox', { name: /search for opponent/i }))

    const list = await screen.findByRole('listbox')
    await waitFor(() =>
      expect(within(list).getByText('Nguyen, T.')).toBeInTheDocument(),
    )
    expect(within(list).getByText('Okafor, D.')).toBeInTheDocument()
  })

  it('selects a player and shows rating delta in the rated section', async () => {
    const user = userEvent.setup()
    renderCard()

    await user.click(screen.getByRole('textbox', { name: /search for opponent/i }))
    const list = await screen.findByRole('listbox')
    await waitFor(() =>
      expect(within(list).getByText('Okafor, D.')).toBeInTheDocument(),
    )
    await user.click(within(list).getByText('Okafor, D.'))

    expect(screen.getByText(/Ready:/)).toBeInTheDocument()
    expect(screen.getAllByText('Okafor, D.').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText(/^±\d+$/)).toBeInTheDocument()
    expect(screen.getByText(/Rated player/i)).toBeInTheDocument()
  })

  it('disables rated mode when a guest opponent is selected', async () => {
    const user = userEvent.setup()
    renderCard()

    await user.click(screen.getByRole('button', { name: /add guest opponent/i }))

    const ratedSwitch = screen.getByRole('switch', {
      name: /counts toward rating/i,
    })
    expect(ratedSwitch).toBeDisabled()
    expect(
      screen.getByText(/Guest matches are always unrated/i),
    ).toBeInTheDocument()
    // Summary strip should reflect Unrated state
    expect(screen.getAllByText('Unrated').length).toBeGreaterThanOrEqual(1)
  })

  it('changes match length when a different best-of option is picked', async () => {
    const user = userEvent.setup()
    renderCard()

    await user.click(screen.getByRole('radio', { name: /Best of 3/i }))

    expect(screen.getByRole('radio', { name: /Best of 3/i })).toBeChecked()
    expect(screen.getByText(/Best of 3 · first to 2/i)).toBeInTheDocument()
  })

  it('calls onStart with the selected settings when Start match is clicked', async () => {
    const user = userEvent.setup()
    const onStart = vi.fn()
    renderCard({ onStart })

    await user.click(screen.getByRole('button', { name: /add guest opponent/i }))
    await user.click(screen.getByRole('radio', { name: /Best of 7/i }))
    await user.click(screen.getByRole('button', { name: /start match/i }))

    expect(onStart).toHaveBeenCalledTimes(1)
    expect(onStart).toHaveBeenCalledWith(
      expect.objectContaining({
        bestOf: 7,
        rated: true,
        opponent: expect.objectContaining({ id: 'guest', isGuest: true }),
      }),
    )
  })

  it('calls onCancel when Cancel is clicked', async () => {
    const user = userEvent.setup()
    const onCancel = vi.fn()
    renderCard({ onCancel })

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
