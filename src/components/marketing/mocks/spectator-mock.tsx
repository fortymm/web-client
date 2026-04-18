export function SpectatorMock() {
  return (
    <div className="rounded-lg border border-ink-600 bg-black p-7">
      <div className="mb-6 flex items-center justify-between font-mono text-[11px] font-bold tracking-[0.14em]">
        <span className="inline-flex items-center gap-2 text-serve-500">
          <span className="ball-dot ball-dot--live" />
          COURT 3 · LIVE · GAME 4
        </span>
        <span className="text-chalk-300">DELHI OPEN 2026 · DAY 2</span>
      </div>
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-5 py-3">
        <div className="text-center">
          <div className="mb-1 text-[28px]">🇻🇳</div>
          <div className="font-display text-[28px] tracking-[0.03em] text-chalk-50">
            NGUYEN
          </div>
          <div className="mt-1 font-mono text-[10px] font-medium tracking-[0.14em] text-chalk-300">
            SEED 1
          </div>
        </div>
        <div className="flex flex-col items-center gap-1.5 text-center">
          <div className="font-mono text-[88px] leading-[0.9] font-bold tracking-[-0.04em] text-ball-500 tabular-nums">
            11
          </div>
          <div className="font-mono text-[11px] font-bold tracking-[0.14em] text-chalk-300">
            SETS 2 – 1
          </div>
          <div className="font-mono text-[56px] leading-[0.9] font-bold tracking-[-0.04em] text-chalk-50 tabular-nums">
            08
          </div>
        </div>
        <div className="text-center">
          <div className="mb-1 text-[28px]">🇳🇬</div>
          <div className="font-display text-[28px] tracking-[0.03em] text-chalk-50">
            OKAFOR
          </div>
          <div className="mt-1 font-mono text-[10px] font-medium tracking-[0.14em] text-chalk-300">
            SEED 8
          </div>
        </div>
      </div>
      <div className="mt-4.5 flex justify-between border-t border-ink-700 pt-4 font-mono text-[11px] font-medium tracking-[0.08em] text-chalk-300">
        <span>fortymm.com/delhi-open/court-3</span>
        <span>Embed · Share · Follow</span>
      </div>
    </div>
  )
}
