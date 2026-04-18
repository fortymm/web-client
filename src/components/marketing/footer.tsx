import { Logo } from './logo'

const COLUMNS = [
  {
    heading: 'Product',
    items: [
      'Web app',
      'iOS (beta)',
      'Android (beta)',
      'Spectator view',
      'Changelog',
    ],
  },
  {
    heading: 'For directors',
    items: [
      'Run a tournament',
      'Scheduler',
      'Sample draws',
      "Scorers' guide",
    ],
  },
  {
    heading: 'Community',
    items: ['Discord', 'GitHub', 'Clubs map', 'Contribute'],
  },
  {
    heading: 'Never',
    items: ['Ads', 'Trackers', 'Premium', 'Cookie banners'],
  },
] as const

export function Footer() {
  return (
    <footer className="border-t border-ink-600 bg-ink-950 px-10 pt-16 pb-7">
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div className="max-w-[280px]">
          <Logo size={22} />
          <p className="mt-4.5 text-[13px] leading-[1.6] text-chalk-300">
            Made by players, in basements and rec centers.
            <br />© 2026 FortyMM. GPLv3. For the love of the game.
          </p>
        </div>
        {COLUMNS.map(({ heading, items }) => (
          <FooterColumn key={heading} heading={heading} items={items} />
        ))}
      </div>
      <div className="mx-auto mt-14 flex max-w-[1200px] justify-between border-t border-ink-600 pt-6 font-mono text-[11px] font-medium tracking-[0.08em] text-chalk-300">
        <span>v0.9.0 · commit a4f2e1 · status: operational</span>
        <span>Play more. Pay never.</span>
      </div>
    </footer>
  )
}

type FooterColumnProps = {
  heading: string
  items: ReadonlyArray<string>
}

function FooterColumn({ heading, items }: FooterColumnProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="mb-1.5 text-[11px] font-semibold tracking-[0.14em] text-chalk-300 uppercase">
        {heading}
      </div>
      {items.map((item) => (
        <a
          key={item}
          href="#"
          className="text-sm font-medium text-chalk-100 transition-colors hover:text-ball-500"
        >
          {item}
        </a>
      ))}
    </div>
  )
}
