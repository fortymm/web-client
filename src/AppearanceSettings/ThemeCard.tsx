import type { FC } from 'react'
import type { Theme } from '../lib/theme'

interface ThemeCardProps {
  theme: Theme
  label: string
  selected: boolean
  onSelect: () => void
  variant: 'light' | 'dark'
}

const themeColors: Record<Theme, { primary: string; secondary: string }> = {
  light: { primary: 'bg-emerald-500', secondary: 'bg-emerald-200' },
  dark: { primary: 'bg-emerald-500', secondary: 'bg-emerald-900' },
}

const ThemeCard: FC<ThemeCardProps> = ({ theme, label, selected, onSelect, variant }) => {
  const colors = themeColors[theme]
  const bgBase = variant === 'light' ? 'bg-white' : 'bg-gray-800'
  const navBg = variant === 'light' ? 'bg-gray-100' : 'bg-gray-700'
  const textColor = variant === 'light' ? 'bg-gray-400' : 'bg-gray-500'
  const sidebarBg = variant === 'light' ? 'bg-gray-200' : 'bg-gray-600'

  return (
    <label
      className={`cursor-pointer block rounded-lg border-2 transition-all ${
        selected ? 'border-primary ring-2 ring-primary/20' : 'border-base-300 hover:border-base-content/30'
      }`}
    >
      <input
        type="radio"
        name={`theme-${variant}`}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />
      <div className={`rounded-t-md ${bgBase} p-3`}>
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
      <div className="p-3 flex items-center gap-2">
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
          selected ? 'border-primary' : 'border-base-content/30'
        }`}>
          {selected && <div className="w-2 h-2 rounded-full bg-primary" />}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
    </label>
  )
}

export default ThemeCard
