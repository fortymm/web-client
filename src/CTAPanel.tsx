import type { ReactNode } from 'react'

interface CTAPanelProps {
  children: ReactNode
}

function CTAPanel({ children }: CTAPanelProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-base-100 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-screen-sm mx-auto w-full px-4 pt-3 pb-4 space-y-3">
        {children}
      </div>
    </div>
  )
}

export default CTAPanel
