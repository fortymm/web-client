import { Link } from '@tanstack/react-router'
import { PencilLine, Trophy, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Ball } from './ball'
import { Card, Overline } from './primitives'

export function IdleHero() {
  return (
    <Card className="relative overflow-hidden">
      <div
        className="fortymm-grid-bg pointer-events-none absolute inset-0 opacity-50"
        style={{
          maskImage:
            'radial-gradient(ellipse at 30% 40%, #000, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse at 30% 40%, #000, transparent 75%)',
        }}
      />
      <div className="relative px-[34px] py-8">
        <div className="pointer-events-none absolute top-6 right-6 opacity-90">
          <Ball
            size={96}
            style={{ filter: 'drop-shadow(0 0 40px rgba(255,122,26,0.35))' }}
          />
        </div>
        <div className="pr-[120px]">
          <Overline className="mb-3">NOTHING ON YOUR SCHEDULE</Overline>
          <div
            className="mb-7 font-display uppercase tracking-[0.01em] text-chalk-50"
            style={{ fontSize: 40, lineHeight: 1.05 }}
          >
            Go play.
            <br />
            <span className="text-ball-500">Log it when you're back.</span>
          </div>
          <div className="mb-4 max-w-[520px] text-[14px] text-chalk-300">
            No live match. No active tournament. Your club has{' '}
            <span className="text-chalk-50">3 ladder matches</span> waiting and
            there are <span className="text-chalk-50">2 tournaments</span> open
            for registration this month.
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" asChild>
            <Link to="/new-match">
              <PencilLine />
              Log match
            </Link>
          </Button>
          <Button variant="ghost-secondary">
            <Users />
            Find opponent
          </Button>
          <Button variant="ghost">
            <Trophy />
            Tournaments
          </Button>
        </div>
      </div>
    </Card>
  )
}
