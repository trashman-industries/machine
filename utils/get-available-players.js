const getPlayerName = require('./get-player-name')

const getAvailablePlayers = (projections, taken) => {
  let available = []
  taken = taken.map(p => getPlayerName(p))
  for (const player of projections) {
    if (!taken.includes(getPlayerName(player.player_name))) {
      available.push(player)
    }
  }
  return available
}

module.exports = getAvailablePlayers
