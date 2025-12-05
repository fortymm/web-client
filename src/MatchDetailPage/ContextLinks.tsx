import { type FC } from 'react'
import { Link } from 'react-router-dom'
import { type ContextEntity } from './mockMatchDetails'

export interface ContextLinksProps {
  context: ContextEntity[]
}

// Icon components for different context types
const TournamentIcon: FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0" />
  </svg>
)

const LeagueIcon: FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
)

const ClubIcon: FC<{ className?: string }> = ({ className = 'h-5 w-5' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
)

const ChevronIcon: FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

function getContextIcon(type: ContextEntity['type']): FC<{ className?: string }> {
  switch (type) {
    case 'tournament':
      return TournamentIcon
    case 'league':
      return LeagueIcon
    case 'club':
      return ClubIcon
    default:
      return ClubIcon
  }
}

function getDefaultRelationship(type: ContextEntity['type']): string {
  switch (type) {
    case 'tournament':
      return 'Tournament'
    case 'league':
      return 'League'
    case 'club':
      return 'Club'
    default:
      return 'Related'
  }
}

const ContextLinks: FC<ContextLinksProps> = ({ context }) => {
  if (context.length === 0) {
    return null
  }

  return (
    <div className="card bg-base-200 rounded-2xl p-4" data-testid="context-links">
      <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-2">
        Related
      </h3>
      <div className="space-y-1">
        {context.map((entity) => {
          const IconComponent = getContextIcon(entity.type)
          const relationship = entity.relationship ?? getDefaultRelationship(entity.type)

          return (
            <Link
              key={entity.id}
              to={entity.url}
              className="flex items-center gap-3 py-2 -mx-2 px-2 rounded-lg hover:bg-base-300/50 transition-colors group"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-base-300 flex items-center justify-center text-base-content/60 group-hover:text-base-content transition-colors">
                <IconComponent className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{entity.name}</p>
                <p className="text-xs text-base-content/50 truncate">
                  {relationship}
                  {entity.meta && (
                    <span className="text-base-content/40"> · {entity.meta}</span>
                  )}
                </p>
              </div>
              <ChevronIcon className="h-4 w-4 text-base-content/30 flex-shrink-0 group-hover:text-base-content/50 transition-colors" />
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default ContextLinks
