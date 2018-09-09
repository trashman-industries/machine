const filterByPositions = require('./filter-by-positions')

const fillLineup = (lineup, available) => {
  if (!lineup.qb.player_name) {
    lineup.qb = filterByPositions(['qb'], available)[0]
  }
  if (!lineup.rb1.player_name) {
    lineup.rb1 = filterByPositions(['rb'], available)[0]
  }
  if (!lineup.rb2.player_name) {
    lineup.rb2 = filterByPositions(['rb'], available)[0]
  }
  if (!lineup.wr1.player_name) {
    lineup.wr1 = filterByPositions(['wr'], available)[0]
  }
  if (!lineup.wr2.player_name) {
    lineup.wr2 = filterByPositions(['wr'], available)[0]
  }
  if (!lineup.te.player_name) {
    lineup.te = filterByPositions(['te'], available)[0]
  }
  if (!lineup.k.player_name) {
    lineup.k = filterByPositions(['k'], available)[0]
  }
  if (!lineup.flex.player_name) {
    lineup.flex = filterByPositions(['rb','wr'], available)[0]
  }
  if (!lineup.dst.player_name) {
    lineup.dst = filterByPositions(['dst'], available)[0]
  }

  return lineup
}

module.exports = fillLineup
