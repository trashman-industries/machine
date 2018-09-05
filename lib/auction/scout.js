const async = require('async')
const cheerio = require('cheerio')
const Logger = require('logplease')

const request = require('../request')

const logger = Logger.create('scout')
const YEAR = (new Date()).getFullYear()

function fetch(url, cb) {
  logger.info('fetching: ', url)

  request({
    url: url,
    rejectUnauthorized: false
  }, function(err, res, body) {
    if (err)
      return cb(err)

    const $ = cheerio.load(body)

    let items = []

    $('table.grid tr:not(.header)').each(function(index, element) {
      items.push({
	    name: $(this).children().eq(1).text(),
	    value: parseFloat($(this).children().eq(7).text().replace('$', ''))
      })
    })

    logger.info('fetched: ', url)

    cb(null, items)
  })
}

const main = function(done) {
  async.parallelLimit({
    qb: function(cb) {
      fetch(`https://fftoolbox.scout.com/football/${YEAR}/auction-values.cfm?pos=QB&teams=12&budget=200`, cb)
    },
    rb: function(cb) {
      fetch(`https://fftoolbox.scout.com/football/${YEAR}/auction-values.cfm?pos=RB&teams=12&budget=200`, cb)
    },
    wr: function(cb) {
      fetch(`https://fftoolbox.scout.com/football/${YEAR}/auction-values.cfm?pos=WR&teams=12&budget=200`, cb)
    },
    te: function(cb) {
      fetch(`https://fftoolbox.scout.com/football/${YEAR}/auction-values.cfm?pos=TE&teams=12&budget=200`, cb)
    },
    dst: function(cb) {
      fetch(`https://fftoolbox.scout.com/football/${YEAR}/auction-values.cfm?pos=Def&teams=12&budget=200`, cb)
    },
    k: function(cb) {
      fetch(`https://fftoolbox.scout.com/football/${YEAR}/auction-values.cfm?pos=PK&teams=12&budget=200`, cb)
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
