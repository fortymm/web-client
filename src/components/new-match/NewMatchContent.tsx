import type { ReactNode } from 'react'

interface NewMatchContentProps {
  children: ReactNode
}

function NewMatchContent({ children }: NewMatchContentProps) {
  return (
    <div className="flex-1 overflow-y-auto pb-[160px]">
      {children}
    </div>
  )
}

export default NewMatchContent
