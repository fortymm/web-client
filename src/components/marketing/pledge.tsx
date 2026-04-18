type PledgeProps = {
  number: string
  title: string
  body: string
}

export function Pledge({ number, title, body }: PledgeProps) {
  return (
    <div className="rounded-lg border border-ink-600 bg-ink-800 p-8 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-ball-500">
      <div className="mb-4 font-mono text-[12px] font-bold tracking-[0.14em] text-ball-500">
        {number}
      </div>
      <h3 className="mb-2.5 text-[21px] font-semibold tracking-[-0.01em] text-chalk-50">
        {title}
      </h3>
      <p className="text-sm leading-[1.6] text-chalk-100">{body}</p>
    </div>
  )
}
