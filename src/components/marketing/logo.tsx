type LogoProps = {
  size?: number
}

export function Logo({ size = 32 }: LogoProps) {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        width={size}
        height={size}
        viewBox="0 0 80 80"
        aria-hidden
        focusable={false}
      >
        <defs>
          <radialGradient id="fortymm-ball" cx="35%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFB57A" />
            <stop offset="55%" stopColor="#FF7A1A" />
            <stop offset="100%" stopColor="#B94700" />
          </radialGradient>
        </defs>
        <circle cx="40" cy="40" r="36" fill="url(#fortymm-ball)" />
        <ellipse cx="30" cy="28" rx="10" ry="6" fill="#FFF" fillOpacity="0.22" />
      </svg>
      <span
        className="font-display text-chalk-50 leading-none"
        style={{ fontSize: size * 0.95, letterSpacing: '0.04em' }}
      >
        FORTYMM<span className="text-ball-500">.</span>
      </span>
    </div>
  )
}
