type StatProps = {
  value: string
  label: string
}

export function Stat({ value, label }: StatProps) {
  return (
    <div>
      <div className="font-mono text-[22px] font-bold tabular-nums text-chalk-50">
        {value}
      </div>
      <div className="text-[12px] tracking-[0.1em] text-chalk-300 uppercase">
        {label}
      </div>
    </div>
  )
}
