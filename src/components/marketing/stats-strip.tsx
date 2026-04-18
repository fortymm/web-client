import { cn } from '@/lib/utils'

type StatItem = { value: string; label: string; highlight?: boolean }

const STATS: readonly StatItem[] = [
  { value: '12,480', label: 'matches logged' },
  { value: '340', label: 'clubs worldwide' },
  { value: '1,102', label: 'tournaments run' },
  { value: '0', label: 'dollars charged', highlight: true },
]

export function StatsStrip() {
  return (
    <div className="border-y border-ink-600 bg-ink-900">
      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-8 px-10 py-7 md:grid-cols-4">
        {STATS.map(({ value, label, highlight }) => (
          <div key={label} className="flex flex-col gap-1.5">
            <div
              className={cn(
                'font-mono text-[32px] font-bold tracking-[-0.02em] tabular-nums',
                highlight ? 'text-ball-500' : 'text-chalk-50',
              )}
            >
              {value}
            </div>
            <div className="text-[11px] font-medium tracking-[0.14em] text-chalk-300 uppercase">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
