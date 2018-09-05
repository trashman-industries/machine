const getPlayerName = require('./get-player-name')

const calculateLineup = ({ players, projections }) => {
  let team_players = []

  const lineup = {
    qb: {},
    rb1: {},
    rb2: {},
    wr1: {},
    wr2: {},
    flex: {},
    te: {},
    k: {},
    bench: [],
    total: 0
  }

  for (const player of players) {
    const isPlayer = (p) => getPlayerName(p.player_name) === getPlayerName(player)
    const projection = projections.find(isPlayer)
    if (!projection) {
      console.warn(`couldn't find ${player}`)
      continue
    }
    team_players.push(projection)
  }

  team_players = team_players.sort((a, b) => b.fantasy_points - a.fantasy_points)

  team_players.forEach((player) => {
    switch(player.position) {
	  case 'qb':
	    if (!lineup.qb.player_name) {
	      lineup.qb = player
	      lineup.total += player.fantasy_points
	    } else {
          lineup.bench.push(player)
        }
	    break
	  case 'rb':
	    if (!lineup.rb1.player_name) {
	      lineup.rb1 = player
	      lineup.total += player.fantasy_points
	      return
	    } else if (!lineup.rb2.player_name) {
	      lineup.rb2 = player
	      lineup.total += player.fantasy_points
	      return
	    } else if (!lineup.flex.player_name) {
	      lineup.flex = player
	      lineup.total += player.fantasy_points
	      return
	    } else {
          lineup.bench.push(player)
        }
	    break
	  case 'wr':
	    if (!lineup.wr1.player_name) {
	      lineup.wr1 = player
	      lineup.total += player.fantasy_points
	      return
	    } else if (!lineup.wr2.player_name) {
	      lineup.wr2 = player
	      lineup.total += player.fantasy_points
	      return
	    } else if (!lineup.flex.player_name) {
	      lineup.flex = player
	      lineup.total += player.fantasy_points
	      return
	    } else {
          lineup.bench.push(player)
        }
	    break

	  case 'te':
	    if (!lineup.te.player_name) {
	      lineup.te = player
	      lineup.total += player.fantasy_points
	      return
	    } else {
          lineup.bench.push(player)
        }
	    break

	  case 'k':
	    if (!lineup.k.player_name) {
	      lineup.k = player
	      lineup.total += player.fantasy_points
	    } else {
          lineup.bench.push(player)
        }
	    break
    }
  })

  return lineup
}

module.exports = calculateLineup
