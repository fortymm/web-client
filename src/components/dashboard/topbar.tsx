import { Link } from '@tanstack/react-router'
import { Bell, Search, Zap } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { DashboardState } from './data'
import { ME, STATE_LABELS } from './data'
import { Ball } from './ball'
import { Avatar } from './primitives'

const NAV_ITEMS: { label: string; to?: '/dashboard' }[] = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Matches' },
  { label: 'Tournaments' },
  { label: 'Clubs' },
  { label: 'Find opponents' },
]

const NAV_ITEM_BASE = 'rounded-md px-3 py-2 transition-colors font-medium'
const NAV_ITEM_ACTIVE = 'bg-white/5 font-semibold text-chalk-50'
const NAV_ITEM_INACTIVE = 'text-chalk-300 hover:text-chalk-50'
const NAV_ITEM_DISABLED =
  'text-chalk-500 cursor-not-allowed hover:text-chalk-500'

type TopBarProps = {
  state: DashboardState
  onCycleState: () => void
}

export function TopBar({ state, onCycleState }: TopBarProps) {
  const s = STATE_LABELS[state]
  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-5 border-b border-ink-600 bg-ink-950/75 px-10 backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Ball size={30} />
        <span className="font-display text-2xl tracking-[0.04em] text-chalk-50">
          FORTYMM<span className="text-ball-500">.</span>
        </span>
      </div>

      <nav className="ml-6 flex gap-1 font-sans text-[13px]">
        {NAV_ITEMS.map(({ label, to }) =>
          to ? (
            <Link
              key={label}
              to={to}
              className={cn(NAV_ITEM_BASE, NAV_ITEM_INACTIVE)}
              activeProps={{ className: cn(NAV_ITEM_BASE, NAV_ITEM_ACTIVE) }}
            >
              {label}
            </Link>
          ) : (
            <button
              key={label}
              type="button"
              aria-disabled
              title="Coming soon"
              className={cn(NAV_ITEM_BASE, NAV_ITEM_DISABLED)}
            >
              {label}
            </button>
          ),
        )}
      </nav>

      <div className="flex-1" />

      <button
        type="button"
        onClick={onCycleState}
        aria-label={`Cycle dashboard state (current: ${s.label})`}
        title="Click to cycle states"
        className="inline-flex items-center gap-2.5 rounded-pill border border-ink-500 bg-ink-900 py-1.5 pr-3 pl-2.5"
      >
        <Zap size={13} className="text-chalk-300" />
        <span className="font-mono text-[11px] tracking-[0.1em]">
          <span className="text-chalk-300">STATE · </span>
          <span className="font-bold text-ball-500">
            {s.label.toUpperCase()}
          </span>
        </span>
      </button>

      <Separator orientation="vertical" className="!h-6 bg-ink-600" />

      <button
        type="button"
        aria-label="Search"
        className="text-chalk-300 hover:text-chalk-50"
      >
        <Search size={18} />
      </button>
      <button
        type="button"
        aria-label="Notifications"
        className="text-chalk-300 hover:text-chalk-50"
      >
        <Bell size={18} />
      </button>

      <div className="flex items-center gap-2.5">
        <Avatar initials={ME.initials} size={32} tone="ball" />
        <div className="leading-tight">
          <div className="font-sans text-[13px] font-semibold text-chalk-50">
            {ME.name}
          </div>
          <div className="font-mono text-[10px] tracking-[0.08em] text-chalk-300">
            {ME.rating} · {ME.club.toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  )
}
