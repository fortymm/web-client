import { type FC } from 'react'
import { format, parseISO } from 'date-fns'
import { type MatchFormat, type MatchLength, getFormatDisplayText } from './mockMatchDetails'

export interface MatchMetadataProps {
  format: MatchFormat
  matchLength: MatchLength
  location: {
    name: string
    tableNumber: number | null
  } | null
  timestamps: {
    created: string
    scheduled: string | null
    started: string | null
    completed: string | null
  }
}

function formatTimestamp(isoString: string): string {
  const date = parseISO(isoString)
  return format(date, 'MMM d, yyyy \'at\' h:mm a')
}

const MatchMetadata: FC<MatchMetadataProps> = ({
  format: matchFormat,
  matchLength,
  location,
  timestamps,
}) => {
  return (
    <div className="card bg-base-200 p-4" data-testid="match-metadata">
      <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wide mb-3">
        Match Details
      </h3>
      <dl className="space-y-3">
        {/* Format & Length */}
        <div className="flex justify-between items-center">
          <dt className="text-sm text-base-content/60">Format</dt>
          <dd className="text-sm font-medium">
            {getFormatDisplayText(matchFormat, matchLength)}
          </dd>
        </div>

        {/* Location */}
        <div className="flex justify-between items-center">
          <dt className="text-sm text-base-content/60">Location</dt>
          <dd className="text-sm font-medium">
            {location ? location.name : 'Not specified'}
          </dd>
        </div>

        {/* Table Assignment */}
        <div className="flex justify-between items-center">
          <dt className="text-sm text-base-content/60">Table</dt>
          <dd className="text-sm font-medium">
            {location?.tableNumber !== null && location?.tableNumber !== undefined
              ? `Table ${location.tableNumber}`
              : 'Not assigned'}
          </dd>
        </div>

        <div className="divider my-2" />

        {/* Created */}
        <div className="flex justify-between items-center">
          <dt className="text-sm text-base-content/60">Created</dt>
          <dd className="text-sm font-medium">
            {formatTimestamp(timestamps.created)}
          </dd>
        </div>

        {/* Scheduled */}
        <div className="flex justify-between items-center">
          <dt className="text-sm text-base-content/60">Scheduled</dt>
          <dd className="text-sm font-medium">
            {timestamps.scheduled
              ? formatTimestamp(timestamps.scheduled)
              : 'Not scheduled'}
          </dd>
        </div>

        {/* Started */}
        {timestamps.started && (
          <div className="flex justify-between items-center">
            <dt className="text-sm text-base-content/60">Started</dt>
            <dd className="text-sm font-medium">
              {formatTimestamp(timestamps.started)}
            </dd>
          </div>
        )}

        {/* Completed */}
        {timestamps.completed && (
          <div className="flex justify-between items-center">
            <dt className="text-sm text-base-content/60">Completed</dt>
            <dd className="text-sm font-medium">
              {formatTimestamp(timestamps.completed)}
            </dd>
          </div>
        )}
      </dl>
    </div>
  )
}

export default MatchMetadata
