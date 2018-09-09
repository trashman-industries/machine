const gaussian = require('gaussian')

const utils = require('../utils')
const getProjections = require('./projections')

const getTotalWins = (team) => team.wins + team.projected_wins
const getTotalLosses = (team) => team.losses + team.projected_losses
const getTotalPoints = (team) => team.points_for + team.projected_points

const simulateSeason = async ({ current_week, leagueId, teams, standings, schedule }) => {
  let result = {}

  for (const team of standings) {
    team.projected_points = team.points_for
    team.projected_wins = team.wins
    team.projected_losses = team.losses
    team.projected_ties = team.ties
    team.simulated_playoff_appearances = 0
    team.simulated_first_round_bye = 0
    team.total_simulated_wins = 0
    team.total_simulated_losses = 0
    team.simulated_championship_win = 0
    team.matchups = {}
  }

  let copied_standings = JSON.parse(JSON.stringify(standings))
  let copied_schedule = JSON.parse(JSON.stringify(schedule))

  for (const week in copied_schedule) {
    if (week < current_week) continue

    console.log(`Week ${week}`)

    const projections = await getProjections.pff({ leagueId, weeks: week })
    let takenPlayers = []
    result[week] = {}
    for (const teamId in teams) {
      const players = teams[teamId]
      players.forEach(p => takenPlayers.push(p))
      result[week][teamId] = utils.calculateLineup({ players, projections })
    }

    const availablePlayers = utils.getAvailablePlayers(projections, takenPlayers)

    const matchups = copied_schedule[week]
    if (!matchups.length) {
      continue
    }
    for (const matchup of matchups) {
      const home_team = copied_standings.find(t => t.team_id === matchup.home_id)
      const away_team = copied_standings.find(t => t.team_id === matchup.away_id)
      let home_lineup = matchup.home_lineup = result[week][matchup.home_id]
      let away_lineup = matchup.away_lineup = result[week][matchup.away_id]

      home_lineup = utils.fillLineup(home_lineup, availablePlayers)
      away_lineup = utils.fillLineup(away_lineup, availablePlayers)

      const distribution = gaussian(home_lineup.total, Math.pow(15, 2))
      matchup.away_team_probability = distribution.cdf(away_lineup.total)
      matchup.home_team_probability = (1 - matchup.away_team_probability)

      home_team.matchups[week] = matchup
      away_team.matchups[week] = matchup

      home_team.projected_points += home_lineup.total
      away_team.projected_points += away_lineup.total

      if (home_lineup.total === away_lineup.total) {
        home_team.projected_ties += 1
        away_team.projected_ties += 1
      } else if (home_lineup.total > away_lineup.total) {
        home_team.projected_wins += 1
        away_team.projected_losses += 1
      } else {
        home_team.projected_losses += 1
        away_team.projected_wins += 1
      }
    }
  }

  const number_of_simulations = 10000
  for (let i=0; i<number_of_simulations; i++) {
    let simulation_standings = JSON.parse(JSON.stringify(standings))
    for (const week in copied_schedule) {
      if (week < current_week) continue
      const matchups = copied_schedule[week]
      for (const matchup of matchups) {
        const random = Math.floor(Math.random() * 10) + 1
        const home_team = simulation_standings.find(t => t.team_id === matchup.home_id)
        const away_team = simulation_standings.find(t => t.team_id === matchup.away_id)
        if (random < (matchup.home_team_probability * 10)) {
          home_team.projected_wins += 1
          away_team.projected_losses += 1
        } else {
          away_team.projected_wins += 1
          home_team.projected_losses += 1
        }
      }
    }

    simulation_standings = simulation_standings.sort((a, b) => {
      const a_wins = getTotalWins(a)
      const b_wins = getTotalWins(b)
      const value = b_wins - a_wins
      if (value !== 0) {
        return value
      }

      const team_a = copied_standings.find(t => t.team_id === a.team_id)
      const team_b = copied_standings.find(t => t.team_id === b.team_id)

      const a_points = getTotalPoints(team_a)
      const b_points = getTotalPoints(team_b)

      return b_points - a_points
    })

    simulation_standings.forEach((simulated_team, index) => {
      const team = copied_standings.find(t => t.team_id === simulated_team.team_id)
      if (index < 3) team.simulated_first_round_bye += 1
      if (index < 7) team.simulated_playoff_appearances += 1
      team.total_simulated_wins += getTotalWins(simulated_team)
      team.total_simulated_losses += getTotalLosses(simulated_team)
    })

    const getPlayoffGameWinner = (home, away, week) => {
      const distribution = gaussian(result[week][home.team_id].total, Math.pow(15, 2))
      const away_probability = distribution.cdf(result[week][away.team_id].total)
      const random = Math.floor(Math.random() * 10) + 1
      if (random < (away_probability * 10)) {
        return away
      } else {
        return home
      }
    }

    // week 14
    const seed_5 = simulation_standings.slice(4, 5)[0]
    const seed_4 = simulation_standings.slice(3, 4)[0]
    const game_one_winner = getPlayoffGameWinner(seed_4, seed_5, '14')

    const seed_3 = simulation_standings.slice(2, 3)[0]
    const seed_6 = simulation_standings.slice(5, 6)[0]
    const game_two_winner = getPlayoffGameWinner(seed_3, seed_6, '14')

    // week 15
    const seed_2 = simulation_standings.slice(1, 2)[0]
    const game_three_winner = getPlayoffGameWinner(seed_2, game_two_winner, '15')

    const seed_1 = simulation_standings.slice(0, 1)[0]
    const game_four_winner = getPlayoffGameWinner(seed_1, game_one_winner, '15')

    // championship
    const champion = getPlayoffGameWinner(game_three_winner, game_four_winner, '16')
    const champion_team = copied_standings.find(t => t.team_id === champion.team_id)
    champion_team.simulated_championship_win += 1
  }

  copied_standings = copied_standings.sort((a, b) => {
    return b.simulated_playoff_appearances - a.simulated_playoff_appearances
  })

  for (const team of copied_standings) {
    team.playoff_odds = team.simulated_playoff_appearances / number_of_simulations
    team.championship_odds = team.simulated_championship_win / number_of_simulations
    team.first_round_bye_odds = team.simulated_first_round_bye / number_of_simulations
    team.total_points = getTotalPoints(team).toFixed(1)
    team.avg_simulated_wins = (team.total_simulated_wins / number_of_simulations).toFixed(2)
    team.avg_simulated_losses = (team.total_simulated_losses / number_of_simulations).toFixed(2)
  }

  return copied_standings
}

module.exports = simulateSeason
