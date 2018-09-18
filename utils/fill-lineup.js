const filterByPositions = require('./filter-by-positions')

const fillLineup = (lineup, available) => {
  if (!lineup.qb.player_name) {
    const p = filterByPositions(['qb'], available)[0]
    lineup.qb = p
	lineup.total += p.fantasy_points
  }
  if (!lineup.rb1.player_name) {
    const p = filterByPositions(['rb'], available)[0]
    lineup.rb1 = p
	lineup.total += p.fantasy_points
  }
  if (!lineup.rb2.player_name) {
    const p = filterByPositions(['rb'], available)[0]
    lineup.rb2 = p
	lineup.total += p.fantasy_points
  }
  if (!lineup.wr1.player_name) {
    const p = filterByPositions(['wr'], available)[0]
    lineup.wr1 = p
	lineup.total += p.fantasy_points
  }
  if (!lineup.wr2.player_name) {
    const p = filterByPositions(['wr'], available)[0]
    lineup.wr2 = p
	lineup.total += p.fantasy_points
  }
  if (!lineup.te.player_name) {
    const p = filterByPositions(['te'], available)[0]
    lineup.te = p
    lineup.total += p.fantasy_points
  }
  if (!lineup.k.player_name) {
    const p = filterByPositions(['k'], available)[0]
    lineup.k = p
    lineup.total += p ? p.fantasy_points : 0
  }
  if (!lineup.flex.player_name) {
    const p = filterByPositions(['rb','wr'], available)[0]
    lineup.flex = p
    lineup.total += p.fantasy_points
  }
  if (!lineup.dst.player_name) {
    const p = filterByPositions(['dst'], available)[0]
    lineup.dst = p
    lineup.total += p.fantasy_points
  }

  return lineup
}

module.exports = fillLineup
