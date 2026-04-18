import { cn } from '@/lib/utils'

type Props = {
  children: React.ReactNode
  className?: string
}

export function SectionEyebrow({ children, className }: Props) {
  return (
    <div
      className={cn(
        'mb-4 inline-flex items-center gap-2.5 text-[12px] font-semibold tracking-[0.14em] text-ball-500 uppercase',
        className,
      )}
    >
      <span className="ball-dot" />
      {children}
    </div>
  )
}
