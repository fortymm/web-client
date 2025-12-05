import { type FC } from 'react'
import { useFlash } from '../useFlash'
import { type Permissions } from './mockMatchDetails'

export interface MatchActionsProps {
  permissions: Permissions
}

const MatchActions: FC<MatchActionsProps> = ({ permissions }) => {
  const { showFlash } = useFlash()

  const handleAction = (action: string) => {
    showFlash(`${action} is not implemented yet.`, { type: 'info', timeout: 3000 })
  }

  const hasAnyAction =
    permissions.canEdit ||
    permissions.canEditParticipants ||
    permissions.canCancel ||
    permissions.canMarkNoShow ||
    permissions.canDelete

  if (!hasAnyAction) {
    return null
  }

  return (
    <div className="card bg-base-200 p-4" data-testid="match-actions">
      <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wide mb-3">
        Actions
      </h3>
      <div className="flex flex-wrap gap-2">
        {permissions.canEdit && (
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => handleAction('Edit match details')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit details
          </button>
        )}

        {permissions.canEditParticipants && (
          <button
            type="button"
            className="btn btn-sm btn-ghost"
            onClick={() => handleAction('Edit participants')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Edit participants
          </button>
        )}

        {permissions.canMarkNoShow && (
          <button
            type="button"
            className="btn btn-sm btn-ghost btn-warning"
            onClick={() => handleAction('Mark no-show')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Mark no-show
          </button>
        )}

        {permissions.canCancel && (
          <button
            type="button"
            className="btn btn-sm btn-ghost btn-error"
            onClick={() => handleAction('Cancel match')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Cancel match
          </button>
        )}

        {permissions.canDelete && (
          <button
            type="button"
            className="btn btn-sm btn-ghost btn-error"
            onClick={() => handleAction('Delete match')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default MatchActions
