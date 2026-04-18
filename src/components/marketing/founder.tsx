import { SectionEyebrow } from './section-eyebrow'

export function Founder() {
  return (
    <div className="grid grid-cols-1 items-center gap-12 rounded-xl border border-ink-600 bg-ink-800 p-12 md:grid-cols-[280px_1fr]">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-ink-700">
        <svg
          viewBox="0 0 160 200"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden
          className="block size-full"
        >
          <defs>
            <linearGradient id="fd-bg" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#B94700" />
              <stop offset="100%" stopColor="#0B0D12" />
            </linearGradient>
          </defs>
          <rect width="160" height="200" fill="url(#fd-bg)" />
          <circle cx="80" cy="70" r="28" fill="#FFB57A" opacity="0.85" />
          <path
            d="M30 200 Q30 130 80 130 Q130 130 130 200 Z"
            fill="#FFB57A"
            opacity="0.85"
          />
          <g transform="translate(110,95) rotate(25)">
            <ellipse cx="0" cy="0" rx="14" ry="18" fill="#0B0D12" />
            <rect x="-3" y="16" width="6" height="22" fill="#0B0D12" rx="1" />
            <ellipse cx="0" cy="0" rx="11" ry="15" fill="#FF7A1A" />
          </g>
          <circle cx="48" cy="88" r="5" fill="#FF7A1A" />
        </svg>
        <div className="absolute bottom-2.5 left-2.5 rounded-xs bg-black/60 px-2 py-1 font-mono text-[9px] tracking-[0.1em] text-chalk-300">
          PLACEHOLDER · YOU CAN ADD A REAL PHOTO
        </div>
      </div>
      <div className="max-w-[640px]">
        <SectionEyebrow>Made by players</SectionEyebrow>
        <blockquote className="my-4 text-[22px] leading-[1.5] font-normal tracking-[-0.01em] text-chalk-50">
          “I run a small club in the back of a community center. Every Tuesday
          it's 24 people and one chalkboard. I got tired of the apps that
          wanted my email, my credit card, and my grandmother's maiden name
          just to log a best-of-five. So I built this with a few friends. It's
          free because that's the whole point.”
        </blockquote>
        <div className="flex flex-col gap-1">
          <div className="text-[15px] font-semibold text-chalk-50">T. Nguyen</div>
          <div className="font-mono text-[12px] font-medium tracking-[0.06em] text-chalk-300">
            Founder · Rated 2145 · Will beat you at short pips
          </div>
        </div>
      </div>
    </div>
  )
}
