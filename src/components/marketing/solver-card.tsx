import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type LineKind = 'constraint' | 'solve'
type Line = { kind: LineKind; text: string }

const LINES: Line[] = [
  { kind: 'constraint', text: '32 players · 4 courts · 3 hr block' },
  { kind: 'constraint', text: 'no back-to-back within 20 min' },
  { kind: 'constraint', text: 'seeds 1–4 on court 1 in R16' },
  { kind: 'constraint', text: 'lunch break 12:30–13:15' },
  { kind: 'solve', text: 'schedule found in 287 ms' },
]

const FINAL_STEP = LINES.length + 1

export function SolverCard() {
  const [step, setStep] = useState(0)
  useEffect(() => {
    if (step >= FINAL_STEP) return
    const id = setInterval(() => {
      if (document.hidden) return
      setStep((s) => (s >= FINAL_STEP ? s : s + 1))
    }, 1200)
    return () => clearInterval(id)
  }, [step])

  const visible = LINES.slice(0, Math.min(step + 1, LINES.length))

  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-ink-600 bg-[#06080C] shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
      <div className="flex items-center justify-between border-b border-ink-600 bg-ink-900 px-4 py-3">
        <span className="font-mono text-[12px] font-semibold tracking-[0.06em] text-chalk-300">
          scheduler.fortymm
        </span>
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-loss" />
          <span className="size-2.5 rounded-full bg-warn" />
          <span className="size-2.5 rounded-full bg-serve-500" />
        </span>
      </div>
      <div className="min-h-[360px] px-4.5 py-5 font-mono text-[13px]">
        {visible.map((line, i) => (
          <SolverLine key={i} line={line} />
        ))}
        {step >= LINES.length && (
          <>
            <SolverLine
              line={{ kind: 'constraint', text: 'courts × rounds × players' }}
              variant="out"
            />
            <SolverGrid />
          </>
        )}
      </div>
    </div>
  )
}

function SolverLine({
  line,
  variant,
}: {
  line: Line
  variant?: 'out'
}) {
  const arrowColor =
    variant === 'out'
      ? 'text-ball-500'
      : line.kind === 'solve'
        ? 'text-serve-500'
        : 'text-chalk-300'
  const labelColor = line.kind === 'solve' ? 'text-serve-500' : 'text-ball-500'
  const label = variant === 'out' ? 'schedule' : line.kind
  const arrow = variant === 'out' ? '→' : line.kind === 'solve' ? '✓' : '›'

  return (
    <div
      className="grid grid-cols-[18px_80px_1fr] gap-2.5 py-1.5 text-chalk-100"
      style={{ animation: 'fortymm-solver-in 260ms var(--default-transition-timing-function)' }}
    >
      <span className={cn('font-bold', arrowColor)}>{arrow}</span>
      <span
        className={cn(
          'pt-px text-[11px] tracking-[0.06em] uppercase',
          labelColor,
        )}
      >
        {label}
      </span>
      <span>{line.text}</span>
    </div>
  )
}

function SolverGrid() {
  return (
    <div
      className="mt-4 flex flex-col gap-1 border-t border-dashed border-ink-600 pt-4"
      style={{ animation: 'fortymm-solver-in 360ms var(--default-transition-timing-function)' }}
    >
      {Array.from({ length: 4 }).map((_, r) => (
        <div
          key={r}
          className="grid grid-cols-[40px_repeat(8,1fr)] items-center gap-1"
        >
          <span className="font-mono text-[10px] font-semibold tracking-[0.06em] text-chalk-300">
            CT{r + 1}
          </span>
          {Array.from({ length: 8 }).map((_, c) => {
            const color =
              (r + c) % 3 === 0
                ? 'bg-ball-500'
                : (r + c) % 5 === 0
                  ? 'bg-serve-500'
                  : 'bg-ink-700'
            return <span key={c} className={cn('h-5 rounded-[3px]', color)} />
          })}
        </div>
      ))}
    </div>
  )
}
