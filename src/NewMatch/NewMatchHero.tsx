interface NewMatchHeroProps {
  hasRecentPlayers?: boolean
}

function NewMatchHero({ hasRecentPlayers = true }: NewMatchHeroProps) {
  const subtitle = hasRecentPlayers
    ? 'Choose a player, search, or start a Quick Match.'
    : 'Search for a player or start a Quick Match.'

  return (
    <div className="px-4 pt-4 pb-4">
      <h1 className="text-lg font-bold text-base-content">New match</h1>
      <p className="text-sm text-base-content/60 mt-1">{subtitle}</p>
    </div>
  )
}

export default NewMatchHero
