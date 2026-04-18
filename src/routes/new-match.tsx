import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { DashboardFooter } from '@/components/dashboard/footer'
import { TopBar } from '@/components/dashboard/topbar'
import { MatchSettingsCard } from '@/components/new-match/match-settings-card'

export const Route = createFileRoute('/new-match')({
  component: NewMatchPage,
})

function NewMatchPage() {
  const navigate = useNavigate()
  const goBack = () => navigate({ to: '/dashboard' })

  return (
    <div className="min-h-svh bg-ink-950">
      <TopBar />

      <main className="relative mx-auto w-full max-w-[980px] px-8 pt-7 pb-[120px]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-[100px] right-[-200px] z-0 size-[700px]"
          style={{
            background:
              'radial-gradient(circle at center, rgba(255,122,26,0.12), transparent 65%)',
          }}
        />
        <div className="relative z-10">
          <header className="mb-7 flex flex-wrap items-baseline justify-between gap-6">
            <div className="flex min-w-0 items-baseline gap-5">
              <h1 className="m-0 font-display text-[40px] leading-none tracking-[0.01em] text-chalk-50 uppercase">
                New match<span className="text-ball-500">.</span>
              </h1>
            </div>
          </header>

          <MatchSettingsCard
            onCancel={goBack}
            onStart={goBack}
          />
        </div>
      </main>

      <DashboardFooter />
    </div>
  )
}
