const { request } = require('../../utils')

const pff = ({ leagueId = 'preset_std', weeks = '0' }) => {
  if (!leagueId) {
    throw new Error('missing leagueId')
  }
  return new Promise((resolve, reject) => {
    const url = `https://www.profootballfocus.com/api/prankster/projections?scoring=${leagueId}&weeks=${weeks}`

    request({
      url: url,
      json: true
    }, function(err, res, data) {
      if (err) {
	    return reject(err)
      }

      resolve(data.player_projections)
    })
  })
}

module.exports = pff

if (!module.parent) {
  const run = async () => {
    const leagueId = '63855'
    const data = await pff({ leagueId, weeks: '1' })
    console.log(data)
  }

  run()
}
