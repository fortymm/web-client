import type { FC } from 'react'
import type { Appearance } from '@lib/theme'
import ThemePreview from './AppearanceCard/ThemePreview'
import SystemPreview from './AppearanceCard/SystemPreview'

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
      className={`cursor-pointer block rounded-lg border-2 transition-all ${
        selected
          ? 'border-primary bg-primary/10 shadow-lg scale-[1.02]'
          : 'border-base-300 bg-base-100 opacity-75 hover:opacity-100 hover:border-base-content/30'
      }`}
    >
      <input
        type="radio"
        name="appearance"
        value={value}
        checked={selected}
        onChange={onSelect}
        className="sr-only peer"
      />

      {/* Focus ring for keyboard navigation */}
      <div className="peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-primary rounded-lg">
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
      </div>
    </label>
  )
}

export default AppearanceCard
