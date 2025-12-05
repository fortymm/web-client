import { render, screen } from '@testing-library/react'
import ActivityTimeline, { type ActivityTimelineProps } from './ActivityTimeline'

export const activityTimelinePage = {
  render(options: Partial<ActivityTimelineProps> = {}) {
    const props: ActivityTimelineProps = {
      activity: options.activity ?? [],
      notes: options.notes ?? [],
    }
    render(<ActivityTimeline {...props} />)
    return props
  },

  queryContainer() {
    return screen.queryByTestId('activity-timeline')
  },

  get container() {
    return screen.getByTestId('activity-timeline')
  },

  get heading() {
    return screen.getByText('Activity')
  },

  get activityItems() {
    return screen.getAllByTestId('activity-item')
  },

  queryActivityItems() {
    return screen.queryAllByTestId('activity-item')
  },

  queryDescription(text: string) {
    return screen.queryByText(text)
  },
}
