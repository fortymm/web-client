import type { FC } from 'react'

interface ThemePreviewProps {
  variant: 'light' | 'dark'
}

const ThemePreview: FC<ThemePreviewProps> = ({ variant }) => {
  return (
    <div data-theme={variant} className="rounded-md bg-base-100 p-2">
      <div className="bg-base-200 rounded-t h-3 flex items-center gap-1 px-1.5">
        <div className="bg-base-content/30 rounded h-1.5 w-6" />
        <div className="bg-base-content/30 rounded h-1.5 w-4" />
      </div>
      <div className="bg-base-200 rounded-b p-1.5">
        <div className="bg-base-content/30 rounded h-1.5 w-8 mb-1.5" />
        <div className="flex gap-1.5">
          <div className="flex-1">
            <div className="bg-primary rounded h-2 mb-1" />
            <div className="bg-primary/20 rounded h-6" />
          </div>
          <div className="bg-base-300 rounded w-6 h-9" />
        </div>
      </div>
    </div>
  )
}

export default ThemePreview
