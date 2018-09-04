const path = require('path')
const FileCookieStore = require('tough-cookie-filestore')
const cookiePath = path.resolve(__dirname, './cookies.json')

const { request } = require('../utils')

const load = ({ leagueId = 'preset_std', weeks = '0' }) => {
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

module.exports = load

if (!module.parent) {
  const run = async () => {
    const leagueId = '63855'
    const data = await load({ leagueId, weeks: '1' })
    console.log(data)
  }

  run()
}
