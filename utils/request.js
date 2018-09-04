const fs = require('fs')
const path = require('path')
const FileCookieStore = require('tough-cookie-filestore')
const request = require('request')

const config = require('../config')
const cookiePath = path.resolve(__dirname, './cookies.json')
if (!fs.existsSync(cookiePath)) {
  fs.writeFileSync(cookiePath, '{}')
}

const jar = request.jar(new FileCookieStore(cookiePath));
const req = request.defaults({
  jar: jar,
  rejectUnauthorized: false,
  headers: {
    'User-Agent': config.ua
  }
})

const cachedRequest = require('cached-request')(request)
const cacheDirectory = '/tmp/cache'

cachedRequest.setCacheDirectory(cacheDirectory)
cachedRequest.setValue('ttl', 900000) // 15 mins

module.exports = cachedRequest
