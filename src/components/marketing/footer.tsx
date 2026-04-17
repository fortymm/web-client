import { Logo } from './logo'

const COLUMNS = [
  { heading: 'Product', items: ['iOS', 'Android', 'Spectator'] },
  { heading: 'Tournaments', items: ['Run one', 'Find one', 'SMT solver'] },
  { heading: 'Community', items: ['Discord', 'Clubs', 'Open-source'] },
  { heading: 'Never', items: ['Ads', 'Tracking', 'Premium'] },
] as const

export function Footer() {
  return (
    <footer className="border-t border-ink-600 px-10 pt-15 pb-10">
      <div className="mx-auto flex max-w-[1180px] flex-wrap gap-15">
        <div className="basis-[280px] grow">
          <Logo size={24} />
          <p className="mt-4 text-[13px] leading-[1.55] text-chalk-300">
            Made by players, in basements and rec centers. © 2026 FortyMM.
          </p>
        </div>
        {COLUMNS.map(({ heading, items }) => (
          <FooterColumn key={heading} heading={heading} items={items} />
        ))}
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
    <div>
      <div className="mb-3.5 text-[11px] font-semibold tracking-[0.14em] text-chalk-300 uppercase">
        {heading}
      </div>
      {items.map((item) => (
        <a
          key={item}
          href="#"
          className="block text-sm leading-[2] font-medium text-chalk-100 transition-colors hover:text-chalk-50"
        >
          {item}
        </a>
      ))}
    </div>
  )
}
