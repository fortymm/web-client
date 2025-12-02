import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi } from 'vitest'
import PlayerRow, { type PlayerRowProps } from './PlayerRow'
import { playerAvatarPage } from './PlayerAvatar.page'

interface RenderOptions {
  player?: PlayerRowProps['player']
  context?: PlayerRowProps['context']
  headToHead?: PlayerRowProps['headToHead']
  lastMatch?: PlayerRowProps['lastMatch']
  hasHistory?: PlayerRowProps['hasHistory']
  onSelect?: PlayerRowProps['onSelect']
  isLoading?: PlayerRowProps['isLoading']
}

export const playerRowPage = {
  render(options: RenderOptions = {}) {
    const {
      player = {
        id: 'player-123',
        username: 'TestUser',
        avatarUrl: null,
        isEphemeral: false,
      },
      context = 'recents',
      headToHead,
      lastMatch,
      hasHistory = false,
      onSelect = vi.fn(),
      isLoading = false,
    } = options

    const user = userEvent.setup()

    render(
      <PlayerRow
        player={player}
        context={context}
        headToHead={headToHead}
        lastMatch={lastMatch}
        hasHistory={hasHistory}
        onSelect={onSelect}
        isLoading={isLoading}
      />
    )

    return { onSelect, user }
  },

  get row() {
    return screen.getByRole('button')
  },

  get displayName() {
    return screen.getByText(/TestUser|Anonymous|[A-Za-z]+/)
  },

  getDisplayNameByText(text: string) {
    return screen.getByText(text)
  },

  get secondaryText() {
    return document.querySelector('.text-base-content\\/60')
  },

  get loadingSpinner() {
    return document.querySelector('.loading.loading-spinner')
  },

  avatar: playerAvatarPage,

  async click() {
    await userEvent.click(this.row)
  },
}
