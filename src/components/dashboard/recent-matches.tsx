import { cn } from '@/lib/utils'
import { RECENT_MATCHES } from './data'
import { Card, Mono, SectionHeader, TextLink } from './primitives'

export function RecentMatches() {
  return (
    <Card>
      <div className="px-5 pt-4.5 pb-3.5">
        <SectionHeader
          eyebrow="LAST 5 MATCHES"
          title="Recent"
          right={<TextLink>See all →</TextLink>}
        />
      </div>
      <div>
        {RECENT_MATCHES.map((m, i) => {
          const isWin = m.result === 'W'
          return (
            <div
              key={i}
              className="grid cursor-pointer items-center gap-3.5 border-t border-ink-600 px-5 py-3 transition-colors hover:bg-white/5"
              style={{ gridTemplateColumns: '90px 1fr auto auto 70px' }}
            >
              <Mono size={11} className="text-chalk-300">
                {m.when.toUpperCase()}
              </Mono>
              <div>
                <div className="text-[14px] font-medium text-chalk-50">
                  vs {m.opponent}
                </div>
                <div className="text-[12px] text-chalk-300">{m.event}</div>
              </div>
              <div
                className={cn(
                  'flex size-6.5 items-center justify-center rounded-xs font-mono text-[13px] font-bold',
                  isWin
                    ? 'bg-serve-500/15 text-serve-500'
                    : 'bg-loss/12 text-loss',
                )}
              >
                {m.result}
              </div>
              <Mono size={14} className="text-chalk-50">
                {m.score}
              </Mono>
              <Mono
                size={13}
                weight={700}
                className={cn(
                  'text-right',
                  m.delta > 0 ? 'text-serve-500' : 'text-loss',
                )}
              >
                {m.delta > 0 ? '+' : ''}
                {m.delta}
              </Mono>
            </div>
          )
        })}
      </div>
    </Card>
  )
}
