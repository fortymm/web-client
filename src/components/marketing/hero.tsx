import { Button } from '@/components/ui/button'
import { HeroScoreboard } from './hero-scoreboard'
import { SectionEyebrow } from './section-eyebrow'

export function Hero() {
  return (
    <section className="relative overflow-hidden px-10 pt-24">
      <div
        aria-hidden
        className="fortymm-grid-bg pointer-events-none absolute inset-0 opacity-55"
        style={{
          maskImage:
            'radial-gradient(ellipse 80% 60% at 70% 30%, black 40%, transparent 85%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 60% at 70% 30%, black 40%, transparent 85%)',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[-10%] right-[-8%] size-[720px]"
        style={{
          background:
            'radial-gradient(circle, rgba(255,122,26,0.22), transparent 62%)',
        }}
      />
      <div className="relative mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-18 pb-24 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="min-w-0">
          <SectionEyebrow className="mb-5">
            No ads · No tracking · No subscriptions, ever
          </SectionEyebrow>
          <h1 className="mt-5 mb-7 font-display text-[92px] leading-[0.9] tracking-[0.01em] text-chalk-50 uppercase lg:text-[128px]">
            Play more.
            <br />
            <span className="text-ball-500">Pay never.</span>
          </h1>
          <p className="mb-8 max-w-[520px] text-[19px] leading-[1.55] text-chalk-100">
            FortyMM is a table-tennis match tracker and tournament platform —
            made by players, for players. It runs in your browser. No download,
            no sign-up. When you want a real account, just add an email.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" size="lg" asChild>
              <a href="#play">
                <span className="size-2 rounded-full bg-ink-950" />
                Start a match in your browser
              </a>
            </Button>
            <Button variant="ghost-secondary" size="lg" asChild>
              <a href="#tournaments">Run a tournament →</a>
            </Button>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-4.5 text-[13px] font-medium text-chalk-300">
            <span className="inline-flex items-center gap-2">
              <svg
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden
                className="text-ball-500"
              >
                <rect x="2" y="3" width="12" height="10" rx="2" />
                <path d="M2 7h12" />
              </svg>
              Web. iOS &amp; Android soon.
            </span>
            <span className="h-3.5 w-px bg-ink-500" />
            <span className="inline-flex items-center gap-2">
              <svg
                viewBox="0 0 16 16"
                width="14"
                height="14"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden
                className="text-ball-500"
              >
                <path d="M8 1.5l2 4.5 5 .5-3.7 3.3L12.5 15 8 12.3 3.5 15l1.2-5.2L1 6.5l5-.5z" />
              </svg>
              Open source. GPLv3.
            </span>
          </div>
        </div>
        <HeroScoreboard />
      </div>
    </section>
  )
}
