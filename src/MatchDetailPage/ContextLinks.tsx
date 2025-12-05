import { type FC } from 'react'
import { Link } from 'react-router-dom'
import { type ContextEntity } from './mockMatchDetails'

export interface ContextLinksProps {
  context: ContextEntity[]
}

function getContextIcon(type: ContextEntity['type']): string {
  switch (type) {
    case 'tournament':
      return '🏆'
    case 'league':
      return '🏅'
    case 'club':
      return '🏠'
    default:
      return '📎'
  }
}

function getContextLabel(type: ContextEntity['type']): string {
  switch (type) {
    case 'tournament':
      return 'Tournament'
    case 'league':
      return 'League'
    case 'club':
      return 'Club'
    default:
      return 'Context'
  }
}

const ContextLinks: FC<ContextLinksProps> = ({ context }) => {
  if (context.length === 0) {
    return null
  }

  return (
    <div className="card bg-base-200 p-4" data-testid="context-links">
      <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wide mb-3">
        Related
      </h3>
      <div className="space-y-2">
        {context.map((entity) => (
          <Link
            key={entity.id}
            to={entity.url}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-base-300 transition-colors"
          >
            <span className="text-lg" role="img" aria-hidden="true">
              {getContextIcon(entity.type)}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{entity.name}</p>
              <p className="text-xs text-base-content/60">
                {getContextLabel(entity.type)}
              </p>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-base-content/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default ContextLinks
