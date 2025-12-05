import { describe, it, expect } from 'vitest'
import { matchMetadataPage } from './MatchMetadata.page'

describe('MatchMetadata', () => {
  it('displays match details heading', () => {
    matchMetadataPage.render()
    expect(matchMetadataPage.heading).toBeInTheDocument()
  })

  it('displays format and length for singles', () => {
    matchMetadataPage.render({ format: 'singles', matchLength: 5 })
    expect(matchMetadataPage.queryFormat()).toBeInTheDocument()
  })

  it('displays format and length for doubles', () => {
    matchMetadataPage.render({ format: 'doubles', matchLength: 3 })
    expect(matchMetadataPage.queryFormat()).toBeInTheDocument()
  })

  it('displays location name when provided', () => {
    matchMetadataPage.render({
      location: { name: 'Spin Chicago', tableNumber: 3 },
    })
    expect(matchMetadataPage.queryLocation('Spin Chicago')).toBeInTheDocument()
  })

  it('displays table number when provided', () => {
    matchMetadataPage.render({
      location: { name: 'Spin Chicago', tableNumber: 3 },
    })
    expect(matchMetadataPage.queryTableNumber(3)).toBeInTheDocument()
  })

  it('shows Unassigned when table is null', () => {
    matchMetadataPage.render({
      location: { name: 'Spin Chicago', tableNumber: null },
    })
    expect(matchMetadataPage.queryUnassigned()).toBeInTheDocument()
  })

  it('shows Not scheduled when scheduled is null', () => {
    matchMetadataPage.render({
      timestamps: {
        created: '2025-12-05T10:00:00Z',
        scheduled: null,
        started: null,
        completed: null,
      },
    })
    expect(matchMetadataPage.queryNotScheduled()).toBeInTheDocument()
  })
})
