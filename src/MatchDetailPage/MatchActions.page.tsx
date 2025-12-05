import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MatchActions, { type MatchActionsProps } from './MatchActions'
import FlashProvider from '../FlashProvider'

const defaultPermissions = {
  canEdit: false,
  canEditParticipants: false,
  canCancel: false,
  canMarkNoShow: false,
  canDelete: false,
}

export const matchActionsPage = {
  render(options: Partial<MatchActionsProps> = {}) {
    const props: MatchActionsProps = {
      permissions: options.permissions ?? defaultPermissions,
    }
    render(
      <FlashProvider>
        <MatchActions {...props} />
      </FlashProvider>
    )
    return props
  },

  queryContainer() {
    return screen.queryByTestId('match-actions')
  },

  queryEditDetailsButton() {
    return screen.queryByRole('button', { name: /Edit details/i })
  },

  queryEditParticipantsButton() {
    return screen.queryByRole('button', { name: /Edit participants/i })
  },

  queryCancelButton() {
    return screen.queryByRole('button', { name: /Cancel match/i })
  },

  queryMarkNoShowButton() {
    return screen.queryByRole('button', { name: /Mark no-show/i })
  },

  queryDeleteButton() {
    return screen.queryByRole('button', { name: /Delete/i })
  },

  async clickEditDetails() {
    const button = screen.getByRole('button', { name: /Edit details/i })
    await userEvent.click(button)
  },

  async clickCancel() {
    const button = screen.getByRole('button', { name: /Cancel match/i })
    await userEvent.click(button)
  },
}
