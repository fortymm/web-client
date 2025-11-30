import type { FC } from 'react'
import type { Theme } from '../lib/theme'

interface ThemePreviewProps {
  theme: Theme
  variant: 'light' | 'dark'
}

const themeColors: Record<Theme, { primary: string; secondary: string }> = {
  light: { primary: 'bg-emerald-500', secondary: 'bg-emerald-200' },
  dark: { primary: 'bg-emerald-500', secondary: 'bg-emerald-900' },
}

const ThemePreview: FC<ThemePreviewProps> = ({ theme, variant }) => {
  const colors = themeColors[theme]
  const bgBase = variant === 'light' ? 'bg-white' : 'bg-gray-800'
  const navBg = variant === 'light' ? 'bg-gray-100' : 'bg-gray-700'
  const textColor = variant === 'light' ? 'bg-gray-400' : 'bg-gray-500'
  const sidebarBg = variant === 'light' ? 'bg-gray-200' : 'bg-gray-600'

  return (
    <div className={`rounded-md ${bgBase} p-3`}>
      {/* Mini navbar preview */}
      <div className={`${navBg} rounded-t h-4 flex items-center gap-1 px-2`}>
        <div className={`${textColor} rounded h-2 w-8`} />
        <div className={`${textColor} rounded h-2 w-6`} />
        <div className={`${textColor} rounded h-2 w-6`} />
      </div>
      {/* Content area */}
      <div className={`${navBg} rounded-b p-2`}>
        <div className={`${textColor} rounded h-2 w-12 mb-2`} />
        <div className="flex gap-2">
          <div className="flex-1">
            <div className={`${colors.primary} rounded h-3 mb-1`} />
            <div className={`${colors.secondary} rounded h-8`} />
          </div>
          <div className={`${sidebarBg} rounded w-8 h-12`} />
        </div>
      </div>
    </div>
  )
}

export default ThemePreview
