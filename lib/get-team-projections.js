const { calculateLineup, getPlayerName } = require('../utils')
const projections = require('./projections')

const getTeamProjections = async (players, weeks, opts = {}) => {
  let results = {}

  for (const week of weeks) {
    const { leagueId } = opts
    const data = await projections.pff({ leagueId, weeks: week })
    results[week] = calculateLineup({ players, projections: data })
  }

  return results
}

module.exports = getTeamProjections

if (!module.parent) {
  try {
    const run = async () => {
      const leagueId = '63855'
      const data = await getTeamProjections(['David Johnson'], ['1', '2'], { leagueId })
      console.log(data)
    }

    run()
  } catch (e) {
    console.log(e)
  }
}
