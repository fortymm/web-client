import { type FC } from 'react'
import { format, parseISO } from 'date-fns'
import { type MatchFormat, type MatchLength } from './mockMatchDetails'

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
  onEditSchedule?: () => void
  onEditLocation?: () => void
  onEditTable?: () => void
}

function formatTimestamp(isoString: string): string {
  const date = parseISO(isoString)
  return format(date, "MMM d, yyyy 'at' h:mm a")
}

function formatShortTimestamp(isoString: string): string {
  const date = parseISO(isoString)
  return format(date, 'MMM d, h:mm a')
}

// Icons as components for cleaner code
const CalendarIcon: FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
  </svg>
)

const LocationIcon: FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  </svg>
)

const TableIcon: FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
  </svg>
)

const ChevronIcon: FC<{ className?: string }> = ({ className = 'h-4 w-4' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
)

interface MetadataRowProps {
  icon?: React.ReactNode
  label: string
  value: string | null
  emptyText: string
  onEdit?: () => void
  isActionable?: boolean
}

const MetadataRow: FC<MetadataRowProps> = ({
  icon,
  label,
  value,
  emptyText,
  onEdit,
  isActionable = false,
}) => {
  const isEmpty = !value
  const content = (
    <>
      <div className="flex items-center gap-2">
        {icon && <span className="text-base-content/40">{icon}</span>}
        <dt className="text-sm text-base-content/60">{label}</dt>
      </div>
      <dd className="flex items-center gap-1">
        {isEmpty ? (
          <span className={`text-sm ${isActionable ? 'text-primary' : 'text-base-content/40'}`}>
            {isActionable ? `Set ${label.toLowerCase()}` : emptyText}
          </span>
        ) : (
          <span className="text-sm">{value}</span>
        )}
        {isActionable && (
          <ChevronIcon className="h-3.5 w-3.5 text-base-content/30" />
        )}
      </dd>
    </>
  )

  if (isActionable && onEdit) {
    return (
      <button
        type="button"
        onClick={onEdit}
        className="flex justify-between items-center w-full py-2 -mx-2 px-2 rounded-lg hover:bg-base-300/50 transition-colors text-left group"
      >
        {content}
      </button>
    )
  }

  return (
    <div className="flex justify-between items-center py-2">
      {content}
    </div>
  )
}

const MatchMetadata: FC<MatchMetadataProps> = ({
  format: matchFormat,
  matchLength,
  location,
  timestamps,
  onEditSchedule,
  onEditLocation,
  onEditTable,
}) => {
  const formatText = `Best of ${matchLength} · ${matchFormat === 'singles' ? 'Singles' : 'Doubles'}`

  return (
    <div className="card bg-base-200 rounded-2xl p-4" data-testid="match-metadata">
      <h3 className="text-xs font-semibold text-base-content/50 uppercase tracking-wide mb-2">
        Match details
      </h3>
      <dl className="-my-1">
        {/* Scheduled - most important for players */}
        <MetadataRow
          icon={<CalendarIcon />}
          label="Scheduled"
          value={timestamps.scheduled ? formatTimestamp(timestamps.scheduled) : null}
          emptyText="Not scheduled yet"
          onEdit={onEditSchedule}
          isActionable={!!onEditSchedule}
        />

        {/* Location */}
        <MetadataRow
          icon={<LocationIcon />}
          label="Location"
          value={location?.name ?? null}
          emptyText="Location not set"
          onEdit={onEditLocation}
          isActionable={!!onEditLocation}
        />

        {/* Table */}
        <MetadataRow
          icon={<TableIcon />}
          label="Table"
          value={location?.tableNumber != null ? `Table ${location.tableNumber}` : null}
          emptyText="Unassigned"
          onEdit={onEditTable}
          isActionable={!!onEditTable}
        />

        {/* Format - less critical, no icon */}
        <MetadataRow
          label="Format"
          value={formatText}
          emptyText=""
        />

        {/* Started - only show if match has started */}
        {timestamps.started && (
          <MetadataRow
            label="Started"
            value={formatShortTimestamp(timestamps.started)}
            emptyText=""
          />
        )}

        {/* Completed - only show if match is complete */}
        {timestamps.completed && (
          <MetadataRow
            label="Completed"
            value={formatShortTimestamp(timestamps.completed)}
            emptyText=""
          />
        )}
      </dl>
    </div>
  )
}

export default MatchMetadata
