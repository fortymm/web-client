import { describe, it, expect } from 'vitest'
import { contextLinksPage } from './ContextLinks.page'

describe('ContextLinks', () => {
  it('does not render when context is empty', () => {
    contextLinksPage.render({ context: [] })
    expect(contextLinksPage.queryContainer()).not.toBeInTheDocument()
  })

  it('renders tournament link', () => {
    contextLinksPage.render({
      context: [
        {
          id: 'tournament-1',
          type: 'tournament',
          name: 'Winter Open 2025',
          url: '/tournaments/tournament-1',
        },
      ],
    })
    expect(contextLinksPage.getLink('Winter Open 2025')).toBeInTheDocument()
  })

  it('renders league link', () => {
    contextLinksPage.render({
      context: [
        {
          id: 'league-1',
          type: 'league',
          name: 'Chicago Masters League',
          url: '/leagues/league-1',
        },
      ],
    })
    expect(contextLinksPage.getLink('Chicago Masters League')).toBeInTheDocument()
  })

  it('renders club link', () => {
    contextLinksPage.render({
      context: [
        {
          id: 'club-1',
          type: 'club',
          name: 'Spin Chicago',
          url: '/clubs/club-1',
        },
      ],
    })
    expect(contextLinksPage.getLink('Spin Chicago')).toBeInTheDocument()
  })

  it('renders multiple context links', () => {
    contextLinksPage.render({
      context: [
        {
          id: 'tournament-1',
          type: 'tournament',
          name: 'Winter Open',
          url: '/tournaments/tournament-1',
        },
        {
          id: 'club-1',
          type: 'club',
          name: 'Spin Chicago',
          url: '/clubs/club-1',
        },
      ],
    })
    expect(contextLinksPage.getLink('Winter Open')).toBeInTheDocument()
    expect(contextLinksPage.getLink('Spin Chicago')).toBeInTheDocument()
  })
})
