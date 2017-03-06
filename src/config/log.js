var keystone = require('keystone')
var debug = require('debug')('req')
var cons = require('../lib/console')
var morgan = require('morgan')

debug.log = cons.withoutTime

var stream = {
  write: function (line) {
    debug(line.trim())
  }
}

morgan.token('remote-addr', function (req, res) {
  return req.headers['x-forwarded-for'] || req.ip
})

keystone.set('logger', process.env.NODE_ENV === 'development'
  ? 'dev'
  : ':remote-addr [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] :response-time ms'
)
keystone.set('logger options', {
  stream: stream
})
