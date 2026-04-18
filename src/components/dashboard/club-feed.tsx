import { cn } from '@/lib/utils'
import { CLUB_FEED, ME } from './data'
import { Avatar, Card, Mono, SectionHeader, TextLink } from './primitives'

export function ClubFeed() {
  return (
    <Card>
      <div className="px-5 pt-4.5 pb-3.5">
        <SectionHeader
          eyebrow={`${ME.club.toUpperCase()} · FEED`}
          title="Club activity"
          right={<TextLink>Open club →</TextLink>}
        />
      </div>
      {CLUB_FEED.map((f) => {
        const tone =
          f.tone === 'announce'
            ? 'ball'
            : f.tone === 'milestone'
              ? 'serve'
              : 'ink'
        return (
          <div
            key={f.id}
            className="flex items-start gap-3 border-t border-ink-600 px-5 py-3.5"
          >
            <Avatar initials={f.initials} size={34} tone={tone} />
            <div className="flex-1 leading-[1.4]">
              <div className="text-[13px] text-chalk-100">
                <span className="font-semibold text-chalk-50">{f.who}</span>{' '}
                {f.text}
              </div>
              {f.meta && (
                <Mono
                  size={11}
                  className={cn(
                    'mt-0.5 block',
                    f.tone === 'win' ? 'text-serve-500' : 'text-chalk-300',
                  )}
                >
                  {f.meta}
                </Mono>
              )}
            </div>
            <Mono
              size={10}
              className="mt-1 shrink-0 whitespace-nowrap text-chalk-300"
            >
              {f.when.toUpperCase()}
            </Mono>
          </div>
        )
      })}
    </Card>
  )
}
