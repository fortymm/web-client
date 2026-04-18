import type { CSSProperties } from 'react'
import { useId } from 'react'

type BallProps = {
  size?: number
  live?: boolean
  style?: CSSProperties
}

export function Ball({ size = 28, live = false, style }: BallProps) {
  const gradientId = useId()
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      aria-hidden
      focusable={false}
      style={style}
    >
      <defs>
        <radialGradient id={gradientId} cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor={live ? '#8CFFD4' : '#FFB57A'} />
          <stop offset="55%" stopColor={live ? '#00E29A' : '#FF7A1A'} />
          <stop offset="100%" stopColor={live ? '#009968' : '#B94700'} />
        </radialGradient>
      </defs>
      <circle cx="40" cy="40" r="36" fill={`url(#${gradientId})`} />
    </svg>
  )
}
