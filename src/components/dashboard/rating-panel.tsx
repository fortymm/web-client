import { useId } from 'react'
import { ME } from './data'
import { Card, MiniStat, Mono, Pill, SectionHeader } from './primitives'

const POINTS = [
  1720, 1735, 1742, 1738, 1755, 1780, 1804, 1822, 1830, 1842, 1824, 1847,
] as const

const SVG_W = 320
const SVG_H = 88

const SPARKLINE_PATH = (() => {
  const min = Math.min(...POINTS) - 10
  const max = Math.max(...POINTS) + 10
  const norm = (v: number) => (v - min) / (max - min)
  const body = POINTS.map((p, i) => {
    const x = (i / (POINTS.length - 1)) * SVG_W
    const y = SVG_H - norm(p) * SVG_H
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`
  }).join(' ')
  const lastY = SVG_H - norm(POINTS[POINTS.length - 1]) * SVG_H
  return { body, lastX: SVG_W, lastY }
})()

export function RatingPanel() {
  const gradientId = useId()

  return (
    <Card pad={20}>
      <SectionHeader
        eyebrow="RATING"
        title="Your rating"
        right={<Pill tone="win">▲ +{ME.ratingDelta} this week</Pill>}
      />
      <div className="mb-3 flex items-end gap-[18px]">
        <Mono size={54} weight={700}>
          {ME.rating}
        </Mono>
        <div className="pb-2.5">
          <Mono size={12} className="text-chalk-300">
            peak <span className="text-chalk-50">1,870</span>
          </Mono>
          <div className="text-[12px] text-chalk-300">A / region top 12%</div>
        </div>
      </div>

      <svg
        width="100%"
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        preserveAspectRatio="none"
        className="block overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop
              offset="0%"
              stopColor="var(--color-ball-500)"
              stopOpacity="0.35"
            />
            <stop
              offset="100%"
              stopColor="var(--color-ball-500)"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>
        <path
          d={`${SPARKLINE_PATH.body} L ${SVG_W} ${SVG_H} L 0 ${SVG_H} Z`}
          fill={`url(#${gradientId})`}
        />
        <path
          d={SPARKLINE_PATH.body}
          stroke="var(--color-ball-500)"
          strokeWidth={2}
          fill="none"
        />
        <circle
          cx={SPARKLINE_PATH.lastX}
          cy={SPARKLINE_PATH.lastY}
          r={4}
          fill="var(--color-ball-500)"
          stroke="var(--color-ink-950)"
          strokeWidth={2}
        />
      </svg>

      <div className="mt-2 flex justify-between">
        <Mono size={10} className="text-chalk-300">
          12 WEEKS AGO
        </Mono>
        <Mono size={10} className="text-chalk-300">
          TODAY
        </Mono>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2.5">
        <MiniStat label="Record" value={`${ME.record.w}–${ME.record.l}`} />
        <MiniStat
          label="Club rank"
          value={`#${ME.rank.club}`}
          accent="var(--color-ball-500)"
        />
        <MiniStat
          label="Streak"
          value={`${ME.streak}W`}
          accent="var(--color-serve-500)"
        />
      </div>
    </Card>
  )
}
