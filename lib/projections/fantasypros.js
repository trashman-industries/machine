const moment = require('moment')
const cheerio = require('cheerio')

const { request } = require('../../utils')
const config = require('../../config')

const fantasypros = ({ position = 'qb', week }) => {
  week = week || moment().diff(config.week_one, 'weeks')

  return new Promise((resolve, reject) => {
    const url = `https://www.fantasypros.com/nfl/projections/${position}.php?max-yes=true&min-yes=true&scoring=STD&week=${week}`

    request({
      url: url
    }, function (err, res, html) {
      if (err) {
        return reject(err)
      }

      const $ = cheerio.load(html)

      let items = []

      $('.main-content table tbody tr').each(function(index, element) {
        const td = $(this).children().eq(-1)
        const td_contents = td.html()
        const points = td_contents.substr(0, td_contents.indexOf('<'))

        items.push({
	      name: $(this).children().eq(0).find('a.player-name').text(),
	      points: parseFloat(points),
	      ceiling: parseFloat(td.find('.max-cell').text()),
	      floor: parseFloat(td.find('.min-cell').text())
        })
      })

      resolve(items)
    })
  })
}

module.exports = fantasypros

if (!module.parent) {
  try {
    const run = async () => {
      const data = await fantasypros({ position: 'rb' })
      console.log(data)
    }

    run()
  } catch (e) {
    console.log(e)
  }
}
