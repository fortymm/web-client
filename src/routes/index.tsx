import { createFileRoute } from '@tanstack/react-router'
import { Footer } from '@/components/marketing/footer'
import { Hero } from '@/components/marketing/hero'
import { Manifesto } from '@/components/marketing/manifesto'
import { Nav } from '@/components/marketing/nav'

export const Route = createFileRoute('/')({
  component: MarketingPage,
})

function MarketingPage() {
  return (
    <div className="min-h-svh bg-ink-950 text-chalk-50">
      <Nav />
      <Hero />
      <Manifesto />
      <Footer />
    </div>
  )
}
