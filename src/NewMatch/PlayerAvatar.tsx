import { type FC } from 'react'
import { UserIcon } from '@heroicons/react/24/solid'

export interface PlayerAvatarProps {
  player: {
    username: string
    avatarUrl: string | null
    isEphemeral: boolean
  }
  size?: 'sm' | 'md'
}

const PlayerAvatar: FC<PlayerAvatarProps> = ({ player, size = 'md' }) => {
  const sizeClass = size === 'md' ? 'w-10 h-10' : 'w-8 h-8'
  const textSize = size === 'md' ? 'text-sm' : 'text-xs'
  const iconSize = size === 'md' ? 'w-5 h-5' : 'w-4 h-4'

  if (player.avatarUrl) {
    return (
      <div className={`avatar ${sizeClass}`}>
        <img
          src={player.avatarUrl}
          alt={player.username}
          className="rounded-full"
          loading="lazy"
        />
      </div>
    )
  }

  if (player.isEphemeral) {
    return (
      <div className="avatar placeholder">
        <div
          className={`bg-neutral text-neutral-content rounded-full ${sizeClass} flex items-center justify-center`}
        >
          <UserIcon className={iconSize} />
        </div>
      </div>
    )
  }

  const initials = player.username.slice(0, 2).toUpperCase()
  return (
    <div className="avatar placeholder">
      <div
        className={`bg-neutral text-neutral-content rounded-full ${sizeClass} flex items-center justify-center`}
      >
        <span className={textSize}>{initials}</span>
      </div>
    </div>
  )
}

export default PlayerAvatar
