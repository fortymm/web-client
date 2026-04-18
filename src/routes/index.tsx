import { createFileRoute } from '@tanstack/react-router'
import { CtaBand } from '@/components/marketing/cta-band'
import { FAQ } from '@/components/marketing/faq'
import { Features } from '@/components/marketing/features'
import { Footer } from '@/components/marketing/footer'
import { Hero } from '@/components/marketing/hero'
import { Manifesto } from '@/components/marketing/manifesto'
import { Nav } from '@/components/marketing/nav'
import { StatsStrip } from '@/components/marketing/stats-strip'
import { TournamentsBand } from '@/components/marketing/tournaments-band'

export const Route = createFileRoute('/')({
  component: MarketingPage,
})

function MarketingPage() {
  return (
    <div className="min-h-svh bg-ink-950 text-chalk-50">
      <Nav />
      <Hero />
      <StatsStrip />
      <Features />
      <TournamentsBand />
      <Manifesto />
      <FAQ />
      <CtaBand />
      <Footer />
    </div>
  )
}
