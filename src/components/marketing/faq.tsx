import { useState } from 'react'
import { cn } from '@/lib/utils'
import { SectionEyebrow } from './section-eyebrow'

const QUESTIONS = [
  {
    q: 'Is it really free?',
    a: "Yes. Free forever, no credit card, no \"try it free\" gotcha. We're not a startup burning VC to get you hooked. We're players. Running the servers costs us about the price of a nice paddle per month. We're fine.",
  },
  {
    q: 'Do I need an account?',
    a: 'No. The first time you open the site we quietly give you an ephemeral account — your matches and ratings start tracking immediately. If you want them forever, add an email at any time and it upgrades to a real account. No sign-up wall. Ever.',
  },
  {
    q: "What's on the web vs. in the apps?",
    a: "Right now: the web is the whole product. Match tracking, ratings, club feeds, the full tournament admin, the spectator view — it all works in your browser on any phone or laptop. Native iOS and Android apps are next; they'll be the same product with nicer score entry and push notifications.",
  },
  {
    q: 'How does the rating work?',
    a: 'Glicko-2 — a modern rating system that tracks both your skill and the uncertainty around it. Play more, uncertainty drops. Beat a higher-rated player, you gain more. No secret sauce. We show the formula in the docs.',
  },
  {
    q: 'Can I run a tournament with this?',
    a: "Yes — that's half the product. Round-robin, single-elim, double-elim, Swiss, custom. The scheduler takes your constraints (courts, breaks, who can't play back-to-back, start times) and produces a plan that respects all of them. It's the feature tournament directors tell us they can't live without. Free for any club, any size, any country.",
  },
  {
    q: 'How do you make money?',
    a: "We don't. The project is funded out-of-pocket by the people who maintain it and accepts small donations from clubs that want to. We have no investors, no runway, no growth team. If that ever changes, you'll be the first to know.",
  },
  {
    q: 'What happens to my data if you shut down?',
    a: 'You can export everything as JSON at any time. The client-side code and server code are GPLv3 — if we ever disappear, someone else can spin it up, or you can self-host. The data is portable and the code is yours.',
  },
  {
    q: 'Can I self-host it?',
    a: 'Yes. The whole stack is open source. Docker compose, one command, on a $5 VPS. Even the scheduler runs fine on a cheap box.',
  },
] as const

export function FAQ() {
  const [open, setOpen] = useState<number>(0)
  return (
    <section id="faq" className="py-26">
      <div className="mx-auto max-w-[1200px] px-10">
        <div className="mb-14 max-w-[880px]">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className="font-display text-[56px] leading-none tracking-[0.01em] text-chalk-50 uppercase lg:text-[76px]">
            Short answers
            <br />
            <span className="text-chalk-300">
              to the questions everyone asks.
            </span>
          </h2>
        </div>

        <div className="flex max-w-[920px] flex-col gap-px overflow-hidden rounded-lg border border-ink-600 bg-ink-600">
          {QUESTIONS.map((item, i) => {
            const isOpen = open === i
            const panelId = `faq-panel-${i}`
            return (
              <div
                key={i}
                className={cn(
                  'transition-colors',
                  isOpen ? 'bg-ink-800' : 'bg-ink-900',
                )}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="grid w-full cursor-pointer grid-cols-[40px_1fr_28px] items-center gap-4 bg-transparent px-7 py-5.5 text-left text-chalk-50 hover:bg-white/5"
                >
                  <span className="font-mono text-[12px] font-bold tracking-[0.12em] text-ball-500">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="text-[17px] font-semibold tracking-[-0.01em] text-chalk-50">
                    {item.q}
                  </span>
                  <span
                    className={cn(
                      'text-right font-mono text-[22px]',
                      isOpen ? 'text-ball-500' : 'text-chalk-300',
                    )}
                  >
                    {isOpen ? '–' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={panelId}
                    role="region"
                    className="max-w-[720px] pr-7 pb-6 pl-21 text-[15px] leading-[1.6] text-chalk-100"
                  >
                    {item.a}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
