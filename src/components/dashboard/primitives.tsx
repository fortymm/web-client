import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type OverlineProps = {
  children: ReactNode
  className?: string
  style?: CSSProperties
}

export function Overline({ children, className, style }: OverlineProps) {
  return (
    <div
      className={cn(
        'font-sans text-[10px] font-semibold tracking-[0.16em] text-chalk-300 uppercase',
        className,
      )}
      style={style}
    >
      {children}
    </div>
  )
}

type LiveDotProps = {
  color?: string
  size?: number
  className?: string
}

export function LiveDot({
  color = 'var(--color-serve-500)',
  size = 8,
  className,
}: LiveDotProps) {
  return (
    <span
      className={cn(
        'inline-block shrink-0 animate-ball-pulse rounded-full',
        className,
      )}
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 10px ${color}`,
      }}
    />
  )
}

type PillTone =
  | 'neutral'
  | 'live'
  | 'ball'
  | 'win'
  | 'loss'
  | 'warn'
  | 'ghost'

const PILL_TONES: Record<
  PillTone,
  { bg: string; fg: string; br: string }
> = {
  neutral: {
    bg: 'var(--color-ink-800)',
    fg: 'var(--color-chalk-100)',
    br: 'var(--color-ink-600)',
  },
  live: {
    bg: 'rgba(0,226,154,0.12)',
    fg: 'var(--color-serve-500)',
    br: 'rgba(0,226,154,0.35)',
  },
  ball: {
    bg: 'rgba(255,122,26,0.12)',
    fg: 'var(--color-ball-500)',
    br: 'rgba(255,122,26,0.35)',
  },
  win: {
    bg: 'rgba(0,226,154,0.12)',
    fg: 'var(--color-serve-500)',
    br: 'rgba(0,226,154,0.35)',
  },
  loss: {
    bg: 'rgba(255,77,109,0.12)',
    fg: 'var(--color-loss)',
    br: 'rgba(255,77,109,0.35)',
  },
  warn: {
    bg: 'rgba(255,196,61,0.12)',
    fg: 'var(--color-warn)',
    br: 'rgba(255,196,61,0.35)',
  },
  ghost: {
    bg: 'transparent',
    fg: 'var(--color-chalk-300)',
    br: 'var(--color-ink-500)',
  },
}

type PillProps = {
  children: ReactNode
  tone?: PillTone
  icon?: ReactNode
  className?: string
}

export function Pill({
  children,
  tone = 'neutral',
  icon,
  className,
}: PillProps) {
  const t = PILL_TONES[tone]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 font-mono text-[11px] font-semibold tracking-[0.12em] uppercase leading-none',
        className,
      )}
      style={{
        background: t.bg,
        color: t.fg,
        borderColor: t.br,
      }}
    >
      {icon}
      {children}
    </span>
  )
}

type AvatarTone = 'ball' | 'serve' | 'ink' | 'muted'
type AvatarProps = {
  initials: string
  size?: number
  tone?: AvatarTone
  className?: string
}

const AVATAR_TONES: Record<AvatarTone, { bg: string; fg: string }> = {
  ball: {
    bg: 'linear-gradient(135deg,#FFB57A,#FF7A1A 55%,#B94700)',
    fg: '#111',
  },
  serve: {
    bg: 'linear-gradient(135deg,#8CFFD4,#00E29A 55%,#009968)',
    fg: '#111',
  },
  ink: { bg: 'var(--color-ink-700)', fg: 'var(--color-chalk-50)' },
  muted: { bg: 'var(--color-ink-800)', fg: 'var(--color-chalk-100)' },
}

export function Avatar({
  initials,
  size = 40,
  tone = 'ink',
  className,
}: AvatarProps) {
  const t = AVATAR_TONES[tone]
  return (
    <div
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full border border-white/5 font-sans font-bold tracking-[0.02em]',
        className,
      )}
      style={{
        width: size,
        height: size,
        background: t.bg,
        color: t.fg,
        fontSize: size * 0.38,
      }}
    >
      {initials}
    </div>
  )
}

type CardProps = {
  children: ReactNode
  className?: string
  pad?: number
  live?: boolean
}

export function Card({
  children,
  className,
  pad = 0,
  live = false,
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-md border bg-ink-800',
        live
          ? 'border-[rgba(0,226,154,0.35)] shadow-[0_0_32px_rgba(0,226,154,0.10)]'
          : 'border-ink-600',
        className,
      )}
      style={pad ? { padding: pad } : undefined}
    >
      {children}
    </div>
  )
}

type SectionHeaderProps = {
  eyebrow?: ReactNode
  title: ReactNode
  right?: ReactNode
}

export function SectionHeader({
  eyebrow,
  title,
  right,
}: SectionHeaderProps) {
  return (
    <div className="mb-3.5 flex items-end justify-between gap-4">
      <div>
        {eyebrow && <Overline className="mb-1.5">{eyebrow}</Overline>}
        <div className="font-sans text-lg font-semibold tracking-[-0.01em] text-chalk-50">
          {title}
        </div>
      </div>
      {right}
    </div>
  )
}

type MonoProps = {
  children: ReactNode
  size?: number
  color?: string
  weight?: number
  className?: string
  style?: CSSProperties
}

export function Mono({
  children,
  size = 14,
  color = 'var(--color-chalk-50)',
  weight = 600,
  className,
  style,
}: MonoProps) {
  return (
    <span
      className={cn('font-mono tabular-nums tracking-[-0.01em]', className)}
      style={{
        fontSize: size,
        color,
        fontWeight: weight,
        ...style,
      }}
    >
      {children}
    </span>
  )
}

type MiniStatProps = {
  label: string
  value: string
  accent?: string
}

export function MiniStat({ label, value, accent }: MiniStatProps) {
  return (
    <div className="rounded-sm border border-ink-600 bg-ink-900 px-3 py-2.5">
      <Overline className="text-[9px]">{label}</Overline>
      <Mono
        size={18}
        color={accent ?? 'var(--color-chalk-50)'}
        weight={700}
        className="mt-0.5 block"
      >
        {value}
      </Mono>
    </div>
  )
}

type TextLinkProps = {
  children: ReactNode
  onClick?: () => void
  className?: string
}

export function TextLink({ children, onClick, className }: TextLinkProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'cursor-pointer font-sans text-[12px] text-chalk-300 hover:text-chalk-50',
        className,
      )}
    >
      {children}
    </button>
  )
}
