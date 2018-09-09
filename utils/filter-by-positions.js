const filterByPositions = (positions, players) => {
  const filtered = players.filter(p => positions.includes(p.position))
  return filtered.sort((a, b) => b.fantasy_points - a.fantasy_points)
}

module.exports = filterByPositions
