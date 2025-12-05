import { type FC } from 'react'
import ParticipantCard from './ParticipantCard'
import VsBlock from './VsBlock'
import { type MatchDetails, type MatchStatus } from './mockMatchDetails'

export interface ParticipantsSectionProps {
  participants: MatchDetails['participants']
  finalScore: MatchDetails['finalScore']
  status: MatchStatus
}

const ParticipantsSection: FC<ParticipantsSectionProps> = ({
  participants,
  finalScore,
  status,
}) => {
  const isCompleted = status === 'completed'
  const [participant1, participant2] = participants

  return (
    <section
      className="flex flex-col sm:flex-row gap-4 items-stretch"
      aria-label="Match participants"
      data-testid="participants-section"
    >
      <ParticipantCard
        participant={participant1}
        isWinnerHighlighted={isCompleted}
      />
      <VsBlock finalScore={finalScore} isCompleted={isCompleted} />
      <ParticipantCard
        participant={participant2}
        isWinnerHighlighted={isCompleted}
      />
    </section>
  )
}

export default ParticipantsSection
