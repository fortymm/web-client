import { type FC } from 'react'
import { useParams } from 'react-router-dom'
import { useMatchDetails } from './useMatchDetails'
import MatchHeader from './MatchHeader'
import ParticipantsSection from './ParticipantsSection'
import MatchMetadata from './MatchMetadata'
import ContextLinks from './ContextLinks'
import ActivityTimeline from './ActivityTimeline'
import MatchActions from './MatchActions'
import MatchDetailSkeleton from './MatchDetailSkeleton'
import MatchDetailError from './MatchDetailError'

const MatchDetailPage: FC = () => {
  const { id } = useParams<{ id: string }>()
  const matchId = id ?? ''

  const { data, isLoading, isError, refetch } = useMatchDetails(matchId)

  if (isLoading) {
    return (
      <div className="max-w-screen-md mx-auto">
        <MatchDetailSkeleton />
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="max-w-screen-md mx-auto">
        <MatchDetailError onRetry={refetch} />
      </div>
    )
  }

  return (
    <div className="max-w-screen-md mx-auto space-y-6" data-testid="match-detail-page">
      {/* Header with title, status, and primary action */}
      <MatchHeader
        participants={data.participants}
        status={data.status}
        format={data.format}
        matchLength={data.matchLength}
        context={data.context}
        matchId={data.id}
      />

      {/* Participants vs block */}
      <ParticipantsSection
        participants={data.participants}
        finalScore={data.finalScore}
        status={data.status}
      />

      {/* Two-column grid for metadata and context on larger screens */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Match metadata */}
        <MatchMetadata
          format={data.format}
          matchLength={data.matchLength}
          location={data.location}
          timestamps={data.timestamps}
        />

        {/* Context links (tournaments, leagues, clubs) */}
        <ContextLinks context={data.context} />
      </div>

      {/* Activity timeline */}
      <ActivityTimeline activity={data.activity} notes={data.notes} />

      {/* Actions (edit, cancel, delete, etc.) */}
      <MatchActions permissions={data.permissions} />

      {/* Dev helper: Show available variants */}
      {import.meta.env.DEV && (
        <div className="card bg-base-300 p-4 mt-8">
          <h4 className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-2">
            Dev: Switch Variant
          </h4>
          <div className="flex flex-wrap gap-2">
            {['pending', 'scheduled', 'in_progress', 'completed', 'cancelled', 'doubles'].map(
              (variant) => (
                <a
                  key={variant}
                  href={`?variant=${variant}`}
                  className="badge badge-outline badge-sm hover:badge-primary"
                >
                  {variant}
                </a>
              )
            )}
            <a
              href="?loading=true"
              className="badge badge-outline badge-sm hover:badge-warning"
            >
              loading
            </a>
            <a
              href="?error=true"
              className="badge badge-outline badge-sm hover:badge-error"
            >
              error
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default MatchDetailPage
