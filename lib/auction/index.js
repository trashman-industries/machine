const async = require('async')

const boone = require('./boone')
const espn = require('./espn-live')
const fantasypros = require('./fantasypros')
const scout = require('./scout')
const fourForFour = require('./4for4')

const main = async () => {
  return new Promise((resolve, reject) => {
    async.parallel({
      fourForFour,
      boone,
      espn,
      fantasypros,
      scout
    }, (err, results) => {
      if (err) {
        return reject(err)
      }
      resolve(results)
    })
  })
}

module.exports = main
