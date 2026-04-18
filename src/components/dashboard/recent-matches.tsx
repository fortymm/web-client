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
        {RECENT_MATCHES.map((m, i) => (
          <div
            key={i}
            className="grid cursor-pointer items-center gap-3.5 border-t border-ink-600 px-5 py-3 transition-colors hover:bg-white/[0.04]"
            style={{
              gridTemplateColumns: '90px 1fr auto auto 70px',
            }}
          >
            <Mono size={11} color="var(--color-chalk-300)">
              {m.when.toUpperCase()}
            </Mono>
            <div>
              <div className="text-[14px] font-medium text-chalk-50">
                vs {m.opponent}
              </div>
              <div className="text-[12px] text-chalk-300">{m.event}</div>
            </div>
            <div
              className="flex size-6.5 items-center justify-center rounded-xs font-mono text-[13px] font-bold"
              style={{
                background:
                  m.result === 'W'
                    ? 'rgba(0,226,154,0.15)'
                    : 'rgba(255,77,109,0.12)',
                color:
                  m.result === 'W'
                    ? 'var(--color-serve-500)'
                    : 'var(--color-loss)',
              }}
            >
              {m.result}
            </div>
            <Mono size={14} color="var(--color-chalk-50)">
              {m.score}
            </Mono>
            <Mono
              size={13}
              color={
                m.delta > 0
                  ? 'var(--color-serve-500)'
                  : 'var(--color-loss)'
              }
              weight={700}
              className="text-right"
            >
              {m.delta > 0 ? '+' : ''}
              {m.delta}
            </Mono>
          </div>
        ))}
      </div>
    </Card>
  )
}
