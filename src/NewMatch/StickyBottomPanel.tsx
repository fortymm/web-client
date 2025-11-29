import type { ReactNode } from 'react'

interface StickyBottomPanelProps {
  children: ReactNode
}

function StickyBottomPanel({ children }: StickyBottomPanelProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-base-100 shadow-[0_-2px_10px_rgba(0,0,0,0.1)] pb-[env(safe-area-inset-bottom)]">
      <div className="max-w-screen-sm mx-auto w-full px-4 py-3 space-y-3">
        {children}
      </div>
    </div>
  )
}

export default StickyBottomPanel
