import { describe, it, expect } from 'vitest'
import { activityTimelinePage } from './ActivityTimeline.page'

describe('ActivityTimeline', () => {
  it('does not render when activity and notes are empty', () => {
    activityTimelinePage.render({ activity: [], notes: [] })
    expect(activityTimelinePage.queryContainer()).not.toBeInTheDocument()
  })

  it('renders activity heading when items exist', () => {
    activityTimelinePage.render({
      activity: [
        {
          id: 'activity-1',
          timestamp: '2025-12-05T10:00:00Z',
          type: 'created',
          description: 'Match created',
          actor: 'Admin',
        },
      ],
    })
    expect(activityTimelinePage.heading).toBeInTheDocument()
  })

  it('displays activity item description', () => {
    activityTimelinePage.render({
      activity: [
        {
          id: 'activity-1',
          timestamp: '2025-12-05T10:00:00Z',
          type: 'created',
          description: 'Match created',
          actor: 'Admin',
        },
      ],
    })
    expect(activityTimelinePage.queryDescription('Match created')).toBeInTheDocument()
  })

  it('displays multiple activity items', () => {
    activityTimelinePage.render({
      activity: [
        {
          id: 'activity-1',
          timestamp: '2025-12-05T10:00:00Z',
          type: 'created',
          description: 'Match created',
          actor: null,
        },
        {
          id: 'activity-2',
          timestamp: '2025-12-05T11:00:00Z',
          type: 'started',
          description: 'Match started',
          actor: null,
        },
      ],
    })
    expect(activityTimelinePage.activityItems).toHaveLength(2)
  })

  it('includes notes in the timeline', () => {
    activityTimelinePage.render({
      activity: [],
      notes: [
        {
          id: 'note-1',
          text: 'Great match today!',
          author: 'Tournament Director',
          timestamp: '2025-12-05T12:00:00Z',
        },
      ],
    })
    expect(activityTimelinePage.queryDescription('Great match today!')).toBeInTheDocument()
  })

  it('combines and sorts activity and notes by timestamp', () => {
    activityTimelinePage.render({
      activity: [
        {
          id: 'activity-1',
          timestamp: '2025-12-05T10:00:00Z',
          type: 'created',
          description: 'Match created',
          actor: null,
        },
      ],
      notes: [
        {
          id: 'note-1',
          text: 'Player confirmed',
          author: 'Admin',
          timestamp: '2025-12-05T11:00:00Z',
        },
      ],
    })
    expect(activityTimelinePage.activityItems).toHaveLength(2)
  })
})
