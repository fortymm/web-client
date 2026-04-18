export function RatingMock() {
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-900 p-7">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <div className="text-[11px] font-medium tracking-[0.14em] text-chalk-300 uppercase">
            Your rating
          </div>
          <div className="font-mono text-[72px] leading-none font-bold tracking-[-0.04em] text-chalk-50 tabular-nums">
            2157
          </div>
          <div className="mt-2 text-[13px] font-medium text-chalk-300">
            <span className="font-mono font-bold text-serve-500">+12</span> last
            match · RD 42
          </div>
        </div>
        <div className="inline-flex items-center rounded-full bg-ball-500/12 px-3 py-1.5 text-[12px] font-semibold tracking-[0.02em] text-ball-500">
          Top 8% · New Delhi
        </div>
      </div>
      <svg
        viewBox="0 0 300 80"
        className="my-2 block h-30 w-full"
        preserveAspectRatio="none"
        aria-hidden
      >
        <defs>
          <linearGradient id="rt-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#FF7A1A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#FF7A1A" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0,60 L20,55 L40,58 L60,48 L80,52 L100,40 L120,44 L140,36 L160,42 L180,28 L200,32 L220,22 L240,18 L260,24 L280,14 L300,10 L300,80 L0,80 Z"
          fill="url(#rt-fill)"
        />
        <path
          d="M0,60 L20,55 L40,58 L60,48 L80,52 L100,40 L120,44 L140,36 L160,42 L180,28 L200,32 L220,22 L240,18 L260,24 L280,14 L300,10"
          fill="none"
          stroke="#FF7A1A"
          strokeWidth="1.8"
        />
        <circle cx="300" cy="10" r="4" fill="#FF7A1A" />
      </svg>
      <div className="grid grid-cols-4 gap-4 border-t border-ink-600 pt-5">
        <Metric label="Won" value="128" />
        <Metric label="Lost" value="94" />
        <Metric label="Win%" value="57.7" />
        <Metric label="Streak" value="W5" />
      </div>
    </div>
  )
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] font-medium tracking-[0.12em] text-chalk-300 uppercase">
        {label}
      </div>
      <div className="mt-1 font-mono text-xl font-bold text-chalk-50">{value}</div>
    </div>
  )
}
