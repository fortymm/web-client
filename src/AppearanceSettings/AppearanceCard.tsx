import type { FC } from 'react'
import type { Appearance } from '../lib/theme'

interface AppearanceCardProps {
  value: Appearance
  label: string
  description: string
  selected: boolean
  onSelect: () => void
  variant: 'light' | 'dark' | 'system'
}

const AppearanceCard: FC<AppearanceCardProps> = ({
  value,
  label,
  description,
  selected,
  onSelect,
  variant,
}) => {
  return (
    <label
      className={`cursor-pointer block rounded-lg border-2 transition-all hover:scale-[1.02] ${
        selected
          ? 'border-primary bg-primary/5'
          : 'border-base-300 hover:border-base-content/30'
      }`}
    >
      <input
        type="radio"
        name="appearance"
        value={value}
        checked={selected}
        onChange={onSelect}
        className="sr-only"
      />

      {/* Preview */}
      <div className="p-3">
        {variant === 'system' ? (
          <SystemPreview />
        ) : (
          <ThemePreview variant={variant} />
        )}
      </div>

      {/* Label and description */}
      <div className="px-3 pb-3">
        <div className="flex items-center gap-2 mb-1">
          {selected && (
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
          <span className="font-medium">{label}</span>
        </div>
        <p className="text-xs text-base-content/60">{description}</p>
      </div>
    </label>
  )
}

const ThemePreview: FC<{ variant: 'light' | 'dark' }> = ({ variant }) => {
  const bgBase = variant === 'light' ? 'bg-white' : 'bg-gray-800'
  const navBg = variant === 'light' ? 'bg-gray-100' : 'bg-gray-700'
  const textColor = variant === 'light' ? 'bg-gray-400' : 'bg-gray-500'
  const primary = 'bg-emerald-500'
  const secondary = variant === 'light' ? 'bg-emerald-200' : 'bg-emerald-900'
  const sidebarBg = variant === 'light' ? 'bg-gray-200' : 'bg-gray-600'

  return (
    <div className={`rounded-md ${bgBase} p-2`}>
      <div className={`${navBg} rounded-t h-3 flex items-center gap-1 px-1.5`}>
        <div className={`${textColor} rounded h-1.5 w-6`} />
        <div className={`${textColor} rounded h-1.5 w-4`} />
      </div>
      <div className={`${navBg} rounded-b p-1.5`}>
        <div className={`${textColor} rounded h-1.5 w-8 mb-1.5`} />
        <div className="flex gap-1.5">
          <div className="flex-1">
            <div className={`${primary} rounded h-2 mb-1`} />
            <div className={`${secondary} rounded h-6`} />
          </div>
          <div className={`${sidebarBg} rounded w-6 h-9`} />
        </div>
      </div>
    </div>
  )
}

const SystemPreview: FC = () => {
  return (
    <div className="flex rounded-md overflow-hidden">
      {/* Light half */}
      <div className="flex-1 bg-white p-2">
        <div className="bg-gray-100 rounded-t h-3 flex items-center gap-1 px-1.5">
          <div className="bg-gray-400 rounded h-1.5 w-6" />
          <div className="bg-gray-400 rounded h-1.5 w-4" />
        </div>
        <div className="bg-gray-100 rounded-b p-1.5">
          <div className="bg-gray-400 rounded h-1.5 w-8 mb-1.5" />
          <div className="flex gap-1.5">
            <div className="flex-1">
              <div className="bg-emerald-500 rounded h-2 mb-1" />
              <div className="bg-emerald-200 rounded h-6" />
            </div>
          </div>
        </div>
      </div>
      {/* Dark half */}
      <div className="flex-1 bg-gray-800 p-2">
        <div className="bg-gray-700 rounded-t h-3 flex items-center gap-1 px-1.5">
          <div className="bg-gray-500 rounded h-1.5 w-6" />
          <div className="bg-gray-500 rounded h-1.5 w-4" />
        </div>
        <div className="bg-gray-700 rounded-b p-1.5">
          <div className="bg-gray-500 rounded h-1.5 w-8 mb-1.5" />
          <div className="flex gap-1.5">
            <div className="flex-1">
              <div className="bg-emerald-500 rounded h-2 mb-1" />
              <div className="bg-emerald-900 rounded h-6" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppearanceCard
