import { Button } from '@/components/ui/button'
import { Logo } from './logo'

const NAV_ITEMS = ['Product', 'Tournaments', 'Clubs', 'Manifesto'] as const

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center gap-8 border-b border-ink-600 bg-ink-950/72 px-10 py-[18px] backdrop-blur-xl">
      <Logo size={28} />
      {NAV_ITEMS.map((label) => (
        <a
          key={label}
          href="#"
          className="text-sm font-medium text-chalk-100 transition-colors hover:text-chalk-50"
        >
          {label}
        </a>
      ))}
      <div className="flex-1" />
      <a
        href="#"
        className="text-sm font-medium text-chalk-100 transition-colors hover:text-chalk-50"
      >
        Sign in
      </a>
      <Button variant="primary">Get the app</Button>
    </nav>
  )
}
