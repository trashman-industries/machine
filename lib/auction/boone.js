const async = require('async')
const cheerio = require('cheerio')

const Logger = require('logplease')
const logger = Logger.create('boone')

const request = require('../request')
const config = require('../config')

function fetch(url, value_position, cb) {
  logger.info('fetching:', url)
  request({
    url: url
  }, function(err, res, body) {
    if (err)
      return cb(err)

    const $ = cheerio.load(body)

    let items = []

    $('table tbody tr').each(function(index, element) {
      let value_text = $(this).children().eq(value_position).text()

      items.push({
	    name: $(this).children().eq(1).text(),
	    value: parseFloat(value_text.replace('$', '').replace(' ', '').replace('\n', ''))
      })
    })

    logger.info('fetched:', url)
    cb(null, items)
  })
}

const { boone } = config.auction

const main = function(done) {
  async.parallelLimit({
    qb: function(cb) {
      fetch(boone.qb, 3, cb)
    },
    rb: function(cb) {
      fetch(boone.rb, 3, cb)
    },
    wr: function(cb) {
      fetch(boone.wr, 3, cb)
    },
    te: function(cb) {
      fetch(boone.te, 3, cb)
    },
    dst: function(cb) {
      fetch(boone.dst, 2, cb)
    },
    k: function(cb) {
      fetch(boone.k, 3, cb)
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
