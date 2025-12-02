import { render, screen } from '@testing-library/react'
import PlayerAvatar, { type PlayerAvatarProps } from './PlayerAvatar'

interface RenderOptions {
  player?: PlayerAvatarProps['player']
  size?: PlayerAvatarProps['size']
}

export const playerAvatarPage = {
  render(options: RenderOptions = {}) {
    const {
      player = {
        username: 'TestUser',
        avatarUrl: null,
        isEphemeral: false,
      },
      size = 'md',
    } = options

    render(<PlayerAvatar player={player} size={size} />)
  },

  get avatar() {
    return screen.getByRole('img', { hidden: true }).closest('.avatar') ||
      screen.getByText(/^[A-Z]{2}$/)?.closest('.avatar') ||
      document.querySelector('.avatar')
  },

  get image() {
    return screen.queryByRole('img')
  },

  get initials() {
    return screen.queryByText(/^[A-Z]{2}$/)
  },

  get userIcon() {
    return document.querySelector('.avatar svg')
  },

  get placeholderContainer() {
    return document.querySelector('.avatar.placeholder')
  },
}
