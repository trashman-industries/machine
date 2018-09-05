const async = require('async')
const cheerio = require('cheerio')

const Logger = require('logplease')
const logger = Logger.create('espn')

const request = require('../request')

function fetch(url, cb) {
  logger.info('fetching:', url)

  request({
    url: url
  }, function(err, res, body) {
    if (err)
      return cb(err)

    const $ = cheerio.load(body)

    let items = []

    $('table.tableBody tr:not(.tableHead):not(.tableSubHead):not(.tableBody)').each(function(index, element) {
      items.push({
	    name: $(this).children().eq(1).children('a').text(),
	    value: parseFloat($(this).children().eq(5).text())
      })
    })

    logger.info('fetched:', url)
    cb(null, items)
  })
}

const main = function(done) {
  async.parallelLimit({
    qb: function(cb) {
      fetch('http://games.espn.com/ffl/livedraftresults?position=QB', cb)
    },
    rb: function(cb) {
      fetch('http://games.espn.com/ffl/livedraftresults?position=RB', cb)
    },
    wr: function(cb) {
      fetch('http://games.espn.com/ffl/livedraftresults?position=WR', cb)
    },
    te: function(cb) {
      fetch('http://games.espn.com/ffl/livedraftresults?position=TE', cb)
    },
    dst: function(cb) {
      fetch('http://games.espn.com/ffl/livedraftresults?position=D/ST', cb)
    },
    k: function(cb) {
      fetch('http://games.espn.com/ffl/livedraftresults?position=K', cb)
    }
  }, 2, done)
}

module.exports = main

if (!module.parent) {
  main(function(err, results) {
    if (err)
      return console.log(err)

    console.log(results)
  })
}
