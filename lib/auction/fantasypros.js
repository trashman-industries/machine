const cheerio = require('cheerio')
const Logger = require('logplease')
const logger = Logger.create('fantasypros')

const config = require('../config')
const request = require('../request')

const main = function(cb) {
  const url = 'https://draftwizard.fantasypros.com/auction/fp_nfl.jsp'
  logger.info('fetching:', url)

  request({
    url: url,
    qs: config.auction.fantasypros
  }, function(err, res, body) {
    if (err)
      return cb(err)

    const $ = cheerio.load(body)

    const results = {
      qb: [],
      rb: [],
      wr: [],
      te: [],
      dst: [],
      k: []
    }

    const add = function(element, position) {
      const name_text = $(element).children().eq(1).text()

      const item = {
	    name: name_text.split(',').shift(),
	    value: parseFloat($(element).children().eq(2).text().replace('$', ''))
      }

      results[position].push(item)
    }

    $('table#QBTable tbody tr').each(function(index, element) {
      add(element, 'qb')
    })
    $('table#RBTable tbody tr').each(function(index, element) {
      add(element, 'rb')
    })
    $('table#WRTable tbody tr').each(function(index, element) {
      add(element, 'wr')
    })
    $('table#TETable tbody tr').each(function(index, element) {
      add(element, 'te')
    })
    $('table#DSTTable tbody tr').each(function(index, element) {
      add(element, 'dst')
    })
    $('table#KTable tbody tr').each(function(index, element) {
      add(element, 'k')
    })

    logger.info('fetched:', url)

    cb(null, results)
  })
}

module.exports = main

if (!module.parent) {
  main(function(err, results) {
    if (err)
      return console.log(err)

    console.log(results)
  })
}
