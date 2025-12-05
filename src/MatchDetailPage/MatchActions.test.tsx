import { describe, it, expect } from 'vitest'
import { matchActionsPage } from './MatchActions.page'

describe('MatchActions', () => {
  it('does not render when no permissions', () => {
    matchActionsPage.render({
      permissions: {
        canEdit: false,
        canEditParticipants: false,
        canCancel: false,
        canMarkNoShow: false,
        canDelete: false,
      },
    })
    expect(matchActionsPage.queryContainer()).not.toBeInTheDocument()
  })

  it('shows edit details button when canEdit is true', () => {
    matchActionsPage.render({
      permissions: {
        canEdit: true,
        canEditParticipants: false,
        canCancel: false,
        canMarkNoShow: false,
        canDelete: false,
      },
    })
    expect(matchActionsPage.queryEditDetailsButton()).toBeInTheDocument()
  })

  it('shows edit participants button when canEditParticipants is true', () => {
    matchActionsPage.render({
      permissions: {
        canEdit: false,
        canEditParticipants: true,
        canCancel: false,
        canMarkNoShow: false,
        canDelete: false,
      },
    })
    expect(matchActionsPage.queryEditParticipantsButton()).toBeInTheDocument()
  })

  it('shows cancel button when canCancel is true', () => {
    matchActionsPage.render({
      permissions: {
        canEdit: false,
        canEditParticipants: false,
        canCancel: true,
        canMarkNoShow: false,
        canDelete: false,
      },
    })
    expect(matchActionsPage.queryCancelButton()).toBeInTheDocument()
  })

  it('shows mark no-show button when canMarkNoShow is true', () => {
    matchActionsPage.render({
      permissions: {
        canEdit: false,
        canEditParticipants: false,
        canCancel: false,
        canMarkNoShow: true,
        canDelete: false,
      },
    })
    expect(matchActionsPage.queryMarkNoShowButton()).toBeInTheDocument()
  })

  it('shows delete button when canDelete is true', () => {
    matchActionsPage.render({
      permissions: {
        canEdit: false,
        canEditParticipants: false,
        canCancel: false,
        canMarkNoShow: false,
        canDelete: true,
      },
    })
    expect(matchActionsPage.queryDeleteButton()).toBeInTheDocument()
  })

  it('shows multiple buttons when multiple permissions are true', () => {
    matchActionsPage.render({
      permissions: {
        canEdit: true,
        canEditParticipants: true,
        canCancel: true,
        canMarkNoShow: false,
        canDelete: false,
      },
    })
    expect(matchActionsPage.queryEditDetailsButton()).toBeInTheDocument()
    expect(matchActionsPage.queryEditParticipantsButton()).toBeInTheDocument()
    expect(matchActionsPage.queryCancelButton()).toBeInTheDocument()
  })
})
