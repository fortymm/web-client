import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { usePlayerSearch } from '@/lib/api/players'
import { cn } from '@/lib/utils'
import type { Opponent, OpponentPlayer } from './data'
import { GUEST_OPPONENT } from './data'

type OpponentPickerProps = {
  onPick: (opp: Opponent) => void
}

export function OpponentPicker({ onPick }: OpponentPickerProps) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [activeIdx, setActiveIdx] = useState(0)
  const wrapRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const search = usePlayerSearch(query, { enabled: open })
  const results: OpponentPlayer[] = search.data ?? []
  const showRecentHeader = !query.trim()
  const guestIdx = results.length

  function updateQuery(next: string) {
    setQuery(next)
    setActiveIdx(0)
  }

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function handleKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(guestIdx, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      onPick(activeIdx < guestIdx ? results[activeIdx] : GUEST_OPPONENT)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative" ref={wrapRef}>
      <div
        className={cn(
          'relative flex h-[72px] items-center rounded-xl border bg-ink-900 px-4 transition-[border-color,box-shadow] duration-200',
          'border-ink-500',
          'focus-within:border-ball-500 focus-within:shadow-[0_0_0_3px_rgba(255,122,26,0.15)]',
        )}
      >
        <Search size={20} className="mr-3 shrink-0 text-chalk-300" />
        <input
          ref={inputRef}
          className="h-full min-w-0 flex-1 border-none bg-transparent p-0 font-sans text-[17px] font-medium text-chalk-50 outline-none placeholder:text-chalk-300"
          placeholder="Search by name or club"
          value={query}
          onChange={(e) => {
            updateQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          aria-label="Search for opponent"
          aria-autocomplete="list"
          aria-expanded={open}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              updateQuery('')
              inputRef.current?.focus()
            }}
            className="rounded-md p-1 text-chalk-300 hover:bg-white/5 hover:text-chalk-50"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {open && (
        <div
          role="listbox"
          className="absolute top-[calc(100%+6px)] right-0 left-0 z-30 max-h-[340px] overflow-y-auto rounded-xl border border-ink-500 bg-ink-800 p-1.5 shadow-lg"
        >
          {showRecentHeader && <SectionDivider label="Recent opponents" />}
          {!search.isLoading && results.length === 0 && query && (
            <div className="px-3 py-3.5 font-sans text-[13px] text-chalk-300">
              No one matches “{query}”. Try a different name.
            </div>
          )}
          {results.map((p, i) => (
            <PickerRow
              key={p.id}
              initials={p.initials}
              primary={p.name}
              secondary={`${p.club} · Last played ${p.lastPlayed}`}
              trailing={String(p.rating)}
              active={i === activeIdx}
              onHover={() => setActiveIdx(i)}
              onClick={() => onPick(p)}
            />
          ))}
          <SectionDivider label="Or" />
          <PickerRow
            initials="?"
            primary="Log as guest"
            secondary="No FortyMM account · Unrated"
            trailing="—"
            dashed
            active={activeIdx === guestIdx}
            onHover={() => setActiveIdx(guestIdx)}
            onClick={() => onPick(GUEST_OPPONENT)}
          />
        </div>
      )}
    </div>
  )
}

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 px-3 pt-2.5 pb-1.5 font-mono text-[10px] font-bold tracking-[0.18em] text-chalk-300 uppercase">
      <span>{label}</span>
      <span className="h-px flex-1 bg-ink-600" />
    </div>
  )
}

type PickerRowProps = {
  initials: string
  primary: string
  secondary: string
  trailing: string
  active: boolean
  dashed?: boolean
  onHover: () => void
  onClick: () => void
}

function PickerRow({
  initials,
  primary,
  secondary,
  trailing,
  active,
  dashed,
  onHover,
  onClick,
}: PickerRowProps) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={active}
      onMouseEnter={onHover}
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors duration-100 hover:bg-ball-500/10',
        active && 'bg-ball-500/10',
      )}
    >
      <span
        className={cn(
          'flex size-9 shrink-0 items-center justify-center rounded-full font-sans text-[12px] font-bold',
          dashed
            ? 'border border-dashed border-ink-500 bg-transparent text-chalk-300'
            : 'bg-ink-700 text-chalk-50',
        )}
      >
        {initials}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block font-sans text-[14px] font-semibold text-chalk-50">
          {primary}
        </span>
        <span className="block font-mono text-[11px] tracking-[0.08em] text-chalk-300 uppercase">
          {secondary}
        </span>
      </span>
      <span
        className={cn(
          'font-mono text-[14px] font-bold tabular-nums',
          dashed ? 'text-chalk-500' : 'text-chalk-100',
        )}
      >
        {trailing}
      </span>
    </button>
  )
}
