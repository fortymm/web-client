import type { FC } from 'react'

const SystemPreview: FC = () => {
  return (
    <div className="flex rounded-md overflow-hidden">
      {/* Light half */}
      <div data-theme="light" className="flex-1 bg-base-100 p-2">
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
          </div>
        </div>
      </div>
      {/* Dark half */}
      <div data-theme="dark" className="flex-1 bg-base-100 p-2">
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemPreview
