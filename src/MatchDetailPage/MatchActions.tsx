import { type FC, useState } from 'react'
import { useFlash } from '../useFlash'
import { type Permissions } from './mockMatchDetails'

export interface MatchActionsProps {
  permissions: Permissions
}

// Icon components
const EditIcon: FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
  </svg>
)

const UsersIcon: FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
  </svg>
)

const WarningIcon: FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
  </svg>
)

const XCircleIcon: FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)

const TrashIcon: FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
)

const ChevronDownIcon: FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
  </svg>
)

const ChevronRightIcon: FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

interface ActionButtonProps {
  onClick: () => void
  icon: React.ReactNode
  label: string
  variant?: 'default' | 'warning' | 'danger'
}

const ActionButton: FC<ActionButtonProps> = ({ onClick, icon, label, variant = 'default' }) => {
  const variantClasses = {
    default: 'hover:bg-base-300/50',
    warning: 'text-warning hover:bg-warning/10',
    danger: 'text-error hover:bg-error/10',
  }

  const iconColorClasses = {
    default: 'text-base-content/60',
    warning: 'text-warning/60',
    danger: 'text-error/60',
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 w-full py-2 px-2 -mx-2 rounded-lg text-sm text-left transition-colors ${variantClasses[variant]}`}
    >
      <span className={iconColorClasses[variant]}>{icon}</span>
      <span className="flex-1">{label}</span>
      <ChevronRightIcon className="h-4 w-4 text-base-content/30" />
    </button>
  )
}

const MatchActions: FC<MatchActionsProps> = ({ permissions }) => {
  const { showFlash } = useFlash()
  const [showDangerZone, setShowDangerZone] = useState(false)

  const handleAction = (action: string) => {
    showFlash(`${action} is not implemented yet.`, { type: 'info', timeout: 3000 })
  }

  const hasSafeActions = permissions.canEdit || permissions.canEditParticipants
  const hasDangerActions = permissions.canCancel || permissions.canMarkNoShow || permissions.canDelete

  if (!hasSafeActions && !hasDangerActions) {
    return null
  }

  return (
    <div className="space-y-4" data-testid="match-actions">
      {/* Safe actions */}
      {hasSafeActions && (
        <div className="card bg-base-200 rounded-2xl p-4">
          <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-2">
            Manage
          </h3>
          <div className="-my-1">
            {permissions.canEdit && (
              <ActionButton
                onClick={() => handleAction('Edit match details')}
                icon={<EditIcon />}
                label="Edit details"
              />
            )}
            {permissions.canEditParticipants && (
              <ActionButton
                onClick={() => handleAction('Edit participants')}
                icon={<UsersIcon />}
                label="Edit participants"
              />
            )}
          </div>
        </div>
      )}

      {/* Danger zone */}
      {hasDangerActions && (
        <div className="card bg-error/5 border border-error/10 rounded-2xl p-4">
          <button
            type="button"
            onClick={() => setShowDangerZone(!showDangerZone)}
            className="flex items-center justify-between w-full text-left"
            aria-expanded={showDangerZone}
            data-testid="danger-zone-toggle"
          >
            <h3 className="text-xs font-semibold text-error/60 uppercase tracking-wide">
              Danger zone
            </h3>
            <ChevronDownIcon
              className={`h-4 w-4 text-error/40 transition-transform ${showDangerZone ? 'rotate-180' : ''}`}
            />
          </button>

          {showDangerZone && (
            <div className="mt-3 pt-3 border-t border-error/10 -my-1" data-testid="danger-zone-content">
              {permissions.canMarkNoShow && (
                <ActionButton
                  onClick={() => handleAction('Mark no-show')}
                  icon={<WarningIcon />}
                  label="Mark no-show"
                  variant="warning"
                />
              )}
              {permissions.canCancel && (
                <ActionButton
                  onClick={() => handleAction('Cancel match')}
                  icon={<XCircleIcon />}
                  label="Cancel match"
                  variant="danger"
                />
              )}
              {permissions.canDelete && (
                <ActionButton
                  onClick={() => handleAction('Delete match')}
                  icon={<TrashIcon />}
                  label="Delete match"
                  variant="danger"
                />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MatchActions
