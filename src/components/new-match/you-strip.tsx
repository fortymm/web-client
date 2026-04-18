import { Avatar } from '@/components/dashboard/primitives'
import { ME } from '@/components/dashboard/data'

export function YouStrip() {
  return (
    <div className="flex items-center gap-3.5 border-b border-ink-600 bg-gradient-to-r from-ball-500/[0.06] via-transparent to-transparent px-[22px] py-3.5">
      <Avatar initials={ME.initials} size={36} tone="ball" />
      <div className="flex min-w-0 flex-col gap-0.5">
        <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-chalk-300 uppercase">
          You
        </span>
        <span className="font-sans text-[15px] font-semibold text-chalk-50">
          {ME.name}
        </span>
      </div>
      <div className="ml-auto hidden gap-[22px] font-mono text-[12px] font-medium tracking-[0.08em] text-chalk-300 uppercase sm:flex">
        <span>
          Rating <b className="font-bold text-chalk-50">{ME.rating}</b>
        </span>
        <span>
          Streak{' '}
          <b className="font-bold text-serve-500">W{ME.streak}</b>
        </span>
      </div>
    </div>
  )
}
