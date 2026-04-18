import { Pledge } from './pledge'

const PLEDGES = [
  {
    number: '01',
    title: 'No ads. Not now, not ever.',
    body: "Every other sports-tracker app ends up covered in Draftkings banners. Ours won't. That's a commitment, not a roadmap item.",
  },
  {
    number: '02',
    title: 'No premium tier.',
    body: "Every feature works for everyone. No unlocks, no trials, no 'upgrade to see full bracket' nonsense.",
  },
  {
    number: '03',
    title: "We don't sell your data.",
    body: 'No trackers, no third-party analytics, no cookie consent theater. We keep what the app needs to work. Nothing else.',
  },
  {
    number: '04',
    title: 'The math is quiet. The rallies are loud.',
    body: "We use an SMT solver to pack tournament schedules — fewer back-to-backs, smarter court assignments. You'll never see it. You'll just play more.",
  },
] as const

export function Manifesto() {
  return (
    <section className="border-y border-ink-600 bg-ink-900 px-10 py-25">
      <div className="mx-auto max-w-[900px]">
        <div className="mb-4 inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.14em] text-ball-500 uppercase">
          <span className="ball-dot" />
          Manifesto
        </div>
        <h2 className="mb-10 font-display text-[64px] leading-none tracking-[0.01em] text-chalk-50 uppercase">
          For the love of the game.
        </h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {PLEDGES.map((p) => (
            <Pledge key={p.number} {...p} />
          ))}
        </div>
      </div>
    </section>
  )
}
