import { Button } from '@/components/ui/button'
import { HeroScoreboard } from './hero-scoreboard'
import { Stat } from './stat'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-10 pt-20 pb-30">
      <div
        aria-hidden
        className="fortymm-grid-bg absolute inset-0 opacity-60"
        style={{
          maskImage:
            'radial-gradient(ellipse 70% 50% at 70% 30%, black, transparent)',
          WebkitMaskImage:
            'radial-gradient(ellipse 70% 50% at 70% 30%, black, transparent)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[10%] right-[5%] size-[500px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255,122,26,0.18), transparent 70%)',
        }}
      />
      <div className="relative mx-auto grid max-w-[1180px] grid-cols-1 items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-ball-500 uppercase">
            <span className="ball-dot" />
            Free forever · No ads · No tracking
          </div>
          <h1 className="font-display text-[112px] leading-[0.92] font-normal tracking-[0.01em] text-chalk-50 uppercase mb-6">
            Play more.
            <br />
            <span className="text-ball-500">Pay never.</span>
          </h1>
          <p className="mb-8 max-w-[520px] text-xl leading-[1.5] text-chalk-100">
            The table-tennis app made by players, for players. Track your matches,
            join tournaments, find opponents. No premium tier. No cookie banners.
            No horse shit.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="xl">
              Download for iOS
            </Button>
            <Button variant="ghost-secondary" size="xl">
              Download for Android
            </Button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-7">
            <Stat value="12,480" label="Active players" />
            <Stat value="340" label="Clubs" />
            <Stat value="1,102" label="Tournaments run" />
          </div>
        </div>
        <HeroScoreboard />
      </div>
    </section>
  )
}
