interface SectionHeaderProps {
  title: 'RECENT PLAYERS' | 'SEARCH RESULTS'
  isLoading?: boolean
}

function SectionHeader({ title, isLoading }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-2">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-base-content/60">
        {title}
      </h2>
      {isLoading && (
        <span
          className="loading loading-spinner loading-xs"
          aria-label="Loading"
        />
      )}
    </div>
  )
}

export default SectionHeader
