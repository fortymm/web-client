import { describe, it, expect } from 'vitest'
import { playerAvatarPage } from './PlayerAvatar.page'

describe('PlayerAvatar', () => {
  describe('with avatar URL', () => {
    it('renders photo when avatarUrl is provided', () => {
      playerAvatarPage.render({
        player: {
          username: 'JohnDoe',
          avatarUrl: 'https://example.com/avatar.jpg',
          isEphemeral: false,
        },
      })

      expect(playerAvatarPage.image).toBeInTheDocument()
      expect(playerAvatarPage.image).toHaveAttribute(
        'src',
        'https://example.com/avatar.jpg'
      )
    })

    it('sets alt text to username', () => {
      playerAvatarPage.render({
        player: {
          username: 'JohnDoe',
          avatarUrl: 'https://example.com/avatar.jpg',
          isEphemeral: false,
        },
      })

      expect(playerAvatarPage.image).toHaveAttribute('alt', 'JohnDoe')
    })

    it('has lazy loading enabled', () => {
      playerAvatarPage.render({
        player: {
          username: 'JohnDoe',
          avatarUrl: 'https://example.com/avatar.jpg',
          isEphemeral: false,
        },
      })

      expect(playerAvatarPage.image).toHaveAttribute('loading', 'lazy')
    })

    it('has rounded-full class on image', () => {
      playerAvatarPage.render({
        player: {
          username: 'JohnDoe',
          avatarUrl: 'https://example.com/avatar.jpg',
          isEphemeral: false,
        },
      })

      expect(playerAvatarPage.image).toHaveClass('rounded-full')
    })
  })

  describe('ephemeral user without avatar', () => {
    it('renders user icon for ephemeral users', () => {
      playerAvatarPage.render({
        player: {
          username: 'Anonymous',
          avatarUrl: null,
          isEphemeral: true,
        },
      })

      expect(playerAvatarPage.userIcon).toBeInTheDocument()
      expect(playerAvatarPage.initials).not.toBeInTheDocument()
    })

    it('uses placeholder styling', () => {
      playerAvatarPage.render({
        player: {
          username: 'Anonymous',
          avatarUrl: null,
          isEphemeral: true,
        },
      })

      expect(playerAvatarPage.placeholderContainer).toBeInTheDocument()
    })
  })

  describe('registered user without avatar', () => {
    it('renders initials when no photo', () => {
      playerAvatarPage.render({
        player: {
          username: 'JohnDoe',
          avatarUrl: null,
          isEphemeral: false,
        },
      })

      expect(playerAvatarPage.initials).toBeInTheDocument()
      expect(playerAvatarPage.initials).toHaveTextContent('JO')
    })

    it('uppercases initials', () => {
      playerAvatarPage.render({
        player: {
          username: 'janedoe',
          avatarUrl: null,
          isEphemeral: false,
        },
      })

      expect(playerAvatarPage.initials).toHaveTextContent('JA')
    })

    it('handles single character usernames', () => {
      playerAvatarPage.render({
        player: {
          username: 'X',
          avatarUrl: null,
          isEphemeral: false,
        },
      })

      // Should display single character since slice(0, 2) on 'X' is 'X'
      expect(document.querySelector('.avatar')).toBeInTheDocument()
    })

    it('uses placeholder styling', () => {
      playerAvatarPage.render({
        player: {
          username: 'JohnDoe',
          avatarUrl: null,
          isEphemeral: false,
        },
      })

      expect(playerAvatarPage.placeholderContainer).toBeInTheDocument()
    })
  })

  describe('size variants', () => {
    it('uses medium size (40px) by default', () => {
      playerAvatarPage.render({
        player: {
          username: 'JohnDoe',
          avatarUrl: null,
          isEphemeral: false,
        },
      })

      const container = document.querySelector('.avatar .bg-neutral')
      expect(container).toHaveClass('w-10', 'h-10')
    })

    it('uses small size (32px) when size is sm', () => {
      playerAvatarPage.render({
        player: {
          username: 'JohnDoe',
          avatarUrl: null,
          isEphemeral: false,
        },
        size: 'sm',
      })

      const container = document.querySelector('.avatar .bg-neutral')
      expect(container).toHaveClass('w-8', 'h-8')
    })

    it('uses smaller text for sm size', () => {
      playerAvatarPage.render({
        player: {
          username: 'JohnDoe',
          avatarUrl: null,
          isEphemeral: false,
        },
        size: 'sm',
      })

      expect(playerAvatarPage.initials).toHaveClass('text-xs')
    })

    it('uses larger text for md size', () => {
      playerAvatarPage.render({
        player: {
          username: 'JohnDoe',
          avatarUrl: null,
          isEphemeral: false,
        },
        size: 'md',
      })

      expect(playerAvatarPage.initials).toHaveClass('text-sm')
    })
  })
})
