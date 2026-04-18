import { Button } from '@/components/ui/button'
import { SectionEyebrow } from './section-eyebrow'

export function CtaBand() {
  return (
    <section
      id="play"
      className="relative overflow-hidden border-t border-ink-600 bg-ink-950 px-10 py-30 text-center"
    >
      <div
        aria-hidden
        className="fortymm-grid-bg pointer-events-none absolute inset-0 opacity-50"
        style={{
          maskImage:
            'radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 75%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 50% at 50% 50%, black 20%, transparent 75%)',
        }}
      />
      <div className="relative mx-auto max-w-[900px]">
        <SectionEyebrow>One click. No form.</SectionEyebrow>
        <h2 className="mt-4 mb-6 font-display text-[48px] leading-[0.92] tracking-[0.01em] text-chalk-50 uppercase lg:text-[92px]">
          Open FortyMM.
          <br />
          <span className="text-ball-500">Play your first match.</span>
        </h2>
        <p className="mx-auto mb-10 max-w-[560px] text-lg leading-[1.55] text-chalk-100">
          We give you an account the moment the page loads. Your first match is
          already being tracked. If you ever want to keep it, add an email.
        </p>
        <div className="mb-6 flex flex-wrap justify-center gap-3">
          <Button variant="primary" size="xl" asChild>
            <a href="#">
              <span className="size-2 rounded-full bg-ink-950" />
              Start playing now
            </a>
          </Button>
          <Button variant="ghost-secondary" size="xl" asChild>
            <a href="#">Get the iOS app</a>
          </Button>
          <Button variant="ghost-secondary" size="xl" asChild>
            <a href="#">Get the Android app</a>
          </Button>
        </div>
        <div className="font-mono text-[11px] font-semibold tracking-[0.16em] text-chalk-300">
          ● Web is live · iOS in beta · Android in beta
        </div>
      </div>
    </section>
  )
}
