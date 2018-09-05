const fs = require('fs')
const cheerio = require('cheerio')

const Logger = require('logplease')
const logger = Logger.create('pff')

const config = require('../config')

const main = function(cb) {
  const html = fs.readFileSync(config.auction.fourForFour, {encoding: 'utf8'})
  const $ = cheerio.load(html)

  const results = {
    qb: [],
    wr: [],
    rb: [],
    te: []
  }

  $('table').each(function(index, element) {

    const pos = $(this).children('caption').text().toLowerCase()

    $('tbody tr', this).each(function(index, element) {

      results[pos].push({
	    name: $(this).children().eq(1).text(),
	    value: parseFloat($(this).children().eq(3).text().replace('$',''))
      })
    })
  })

  cb(null, results)

}

module.exports = main

if (!module.parent) {
  main(function(err, results) {
    if (err)
      return console.log(err)

    console.log(results)
  })
}
