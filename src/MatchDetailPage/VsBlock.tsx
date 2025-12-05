import { type FC } from 'react'

export interface VsBlockProps {
  finalScore: [number, number] | null
  isCompleted: boolean
}

const VsBlock: FC<VsBlockProps> = ({ finalScore, isCompleted }) => {
  return (
    <div className="flex flex-col items-center justify-center py-4 sm:py-0" data-testid="vs-block">
      <span className="text-2xl font-bold text-base-content/50">vs</span>
      {isCompleted && finalScore && (
        <div className="mt-2">
          <span className="badge badge-lg badge-neutral">
            Final: {finalScore[0]}–{finalScore[1]}
          </span>
        </div>
      )}
    </div>
  )
}

export default VsBlock
