import { Button } from '@/components/ui/button'
import { SectionEyebrow } from './section-eyebrow'
import { SolverCard } from './solver-card'

const STEPS = [
  { k: '01', text: 'Import a player list — CSV, paste, or scan.' },
  { k: '02', text: 'Set constraints — courts, breaks, start times.' },
  { k: '03', text: 'Generate — and share the bracket link.' },
  { k: '04', text: "Score live from the scorers' table." },
] as const

export function TournamentsBand() {
  return (
    <section
      id="tournaments"
      className="border-y border-ink-600 py-26"
      style={{
        background:
          'radial-gradient(ellipse 60% 50% at 85% 50%, rgba(255,122,26,0.08), transparent 70%), var(--color-ink-950)',
      }}
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-18 px-10 lg:grid-cols-2">
        <div className="max-w-[520px]">
          <SectionEyebrow>For tournament directors</SectionEyebrow>
          <h2 className="font-display text-[56px] leading-none tracking-[0.01em] text-chalk-50 uppercase lg:text-[76px]">
            The math is quiet.
            <br />
            <span className="text-ball-500">The rallies are loud.</span>
          </h2>
          <p className="my-6 text-[17px] leading-[1.55] text-chalk-100">
            Running a tournament is a scheduling nightmare. Byes, constraints,
            courts, breaks, one player who drove four hours and can't go
            back-to-back. Our scheduler treats your constraints as rules — and
            quietly works out a schedule that respects every one of them.
          </p>
          <ul className="mb-8 flex list-none flex-col gap-3.5">
            {STEPS.map(({ k, text }) => (
              <li
                key={k}
                className="flex items-baseline gap-4 text-[15px] font-medium text-chalk-100"
              >
                <span className="shrink-0 basis-6 font-mono text-[12px] tracking-[0.14em] text-ball-500">
                  {k}
                </span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2.5">
            <Button variant="primary" asChild>
              <a href="#">
                <span className="size-2 rounded-full bg-ink-950" />
                Start a tournament
              </a>
            </Button>
            <Button variant="ghost" asChild>
              <a href="#" className="text-chalk-100">
                See a sample schedule →
              </a>
            </Button>
          </div>
        </div>
        <SolverCard />
      </div>
    </section>
  )
}
