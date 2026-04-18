type PledgeProps = {
  number: string
  title: string
  body: string
}

export function Pledge({ number, title, body }: PledgeProps) {
  return (
    <div>
      <div className="mb-2.5 font-mono text-[13px] font-bold tracking-[0.1em] text-ball-500">
        {number}
      </div>
      <h3 className="mb-2.5 text-[22px] font-semibold tracking-[-0.01em] text-chalk-50">
        {title}
      </h3>
      <p className="text-base leading-[1.55] text-chalk-100">{body}</p>
    </div>
  )
}
