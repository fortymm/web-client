import { Button } from '@/components/ui/button'
import { Logo } from './logo'

const NAV_ITEMS = [
  { label: 'Product', href: '#product' },
  { label: 'Tournaments', href: '#tournaments' },
  { label: 'Manifesto', href: '#manifesto' },
  { label: 'FAQ', href: '#faq' },
] as const

export function Nav() {
  return (
    <nav className="sticky top-0 z-50 flex items-center gap-7 border-b border-ink-600 bg-ink-950/72 px-10 py-4 backdrop-blur-xl">
      <Logo size={26} />
      <div className="ml-2 hidden gap-6 md:flex">
        {NAV_ITEMS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="text-sm font-medium text-chalk-100 transition-colors hover:text-chalk-50"
          >
            {label}
          </a>
        ))}
      </div>
      <div className="flex-1" />
      <a
        href="#"
        className="text-sm font-medium text-chalk-100 transition-colors hover:text-chalk-50"
      >
        Sign in
      </a>
      <Button variant="primary" asChild>
        <a href="#play" className="gap-2.5">
          <span className="size-2 rounded-full bg-ink-950" />
          Start playing
        </a>
      </Button>
    </nav>
  )
}
