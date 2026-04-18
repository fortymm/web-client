import { Ball } from './ball'
import { Mono } from './primitives'

export function DashboardFooter() {
  return (
    <footer className="flex items-center gap-5 border-t border-ink-600 px-10 pt-8 pb-10 text-chalk-300">
      <Ball size={20} />
      <span className="font-display text-[16px] tracking-[0.05em] text-chalk-100">
        FORTYMM<span className="text-ball-500">.</span>
      </span>
      <span className="text-[12px]">Play more. Pay never.</span>
      <div className="flex-1" />
      <Mono size={10} color="var(--color-chalk-300)">
        v 2026.04 · NO ADS · NO TRACKING
      </Mono>
    </footer>
  )
}
