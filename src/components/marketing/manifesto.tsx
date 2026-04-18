import { Founder } from './founder'
import { Pledge } from './pledge'
import { SectionEyebrow } from './section-eyebrow'

const PLEDGES = [
  {
    number: '01',
    title: 'No ads. Not now, not ever.',
    body: "Every other sports-tracker ends up plastered in sportsbook banners. Ours won't. That's a commitment, not a roadmap item.",
  },
  {
    number: '02',
    title: 'No premium tier.',
    body: 'Every feature works for everyone. No unlocks. No trials. No "upgrade to see the full bracket" garbage.',
  },
  {
    number: '03',
    title: "We don't sell your data.",
    body: 'No trackers. No third-party analytics. No cookie-consent theater. We keep what the app needs. Nothing else.',
  },
  {
    number: '04',
    title: 'Accounts are optional.',
    body: 'You get one the moment you open the site. Your matches are tracked immediately. Add an email when — or if — you want to keep them forever.',
  },
  {
    number: '05',
    title: 'Your data is yours.',
    body: 'One-click export. Delete anytime. Take your match history, your rating, your photos, and go.',
  },
  {
    number: '06',
    title: 'Open-source, GPLv3.',
    body: 'Read the code. Self-host if you want. If we ever do something shady, fork us.',
  },
] as const

export function Manifesto() {
  return (
    <section
      id="manifesto"
      className="border-y border-ink-600 bg-ink-900 py-26"
    >
      <div className="mx-auto max-w-[1200px] px-10">
        <div className="mb-14 max-w-[900px]">
          <SectionEyebrow>Manifesto</SectionEyebrow>
          <h2 className="font-display text-[56px] leading-none tracking-[0.01em] text-chalk-50 uppercase lg:text-[76px]">
            Six promises.
            <br />
            <span className="text-ball-500">Zero asterisks.</span>
          </h2>
          <p className="mt-6 max-w-[680px] text-lg leading-[1.55] text-chalk-100">
            Most sports-tracker apps start free, then put the good stuff behind
            a paywall, then start selling your data, then go out of business.
            We're doing none of those things. Here's the commitment in writing.
          </p>
        </div>

        <div className="mb-20 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {PLEDGES.map((p) => (
            <Pledge key={p.number} {...p} />
          ))}
        </div>

        <Founder />
      </div>
    </section>
  )
}
