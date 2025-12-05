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

  it('shows danger zone toggle when canCancel is true', () => {
    matchActionsPage.render({
      permissions: {
        canEdit: false,
        canEditParticipants: false,
        canCancel: true,
        canMarkNoShow: false,
        canDelete: false,
      },
    })
    expect(matchActionsPage.queryDangerZoneToggle()).toBeInTheDocument()
    // Cancel button is hidden until danger zone is expanded
    expect(matchActionsPage.queryCancelButton()).not.toBeInTheDocument()
  })

  it('shows cancel button after expanding danger zone', async () => {
    matchActionsPage.render({
      permissions: {
        canEdit: false,
        canEditParticipants: false,
        canCancel: true,
        canMarkNoShow: false,
        canDelete: false,
      },
    })
    await matchActionsPage.expandDangerZone()
    expect(matchActionsPage.queryCancelButton()).toBeInTheDocument()
  })

  it('shows mark no-show button after expanding danger zone', async () => {
    matchActionsPage.render({
      permissions: {
        canEdit: false,
        canEditParticipants: false,
        canCancel: false,
        canMarkNoShow: true,
        canDelete: false,
      },
    })
    await matchActionsPage.expandDangerZone()
    expect(matchActionsPage.queryMarkNoShowButton()).toBeInTheDocument()
  })

  it('shows delete button after expanding danger zone', async () => {
    matchActionsPage.render({
      permissions: {
        canEdit: false,
        canEditParticipants: false,
        canCancel: false,
        canMarkNoShow: false,
        canDelete: true,
      },
    })
    await matchActionsPage.expandDangerZone()
    expect(matchActionsPage.queryDeleteButton()).toBeInTheDocument()
  })

  it('shows safe actions and danger zone toggle when both permissions exist', async () => {
    matchActionsPage.render({
      permissions: {
        canEdit: true,
        canEditParticipants: true,
        canCancel: true,
        canMarkNoShow: false,
        canDelete: false,
      },
    })
    // Safe actions visible immediately
    expect(matchActionsPage.queryEditDetailsButton()).toBeInTheDocument()
    expect(matchActionsPage.queryEditParticipantsButton()).toBeInTheDocument()
    // Danger zone toggle visible
    expect(matchActionsPage.queryDangerZoneToggle()).toBeInTheDocument()
    // Danger actions hidden until expanded
    await matchActionsPage.expandDangerZone()
    expect(matchActionsPage.queryCancelButton()).toBeInTheDocument()
  })
})
