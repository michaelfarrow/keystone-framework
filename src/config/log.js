var keystone = require('keystone')
var debug = require('debug')('req')
var cons = require('../lib/console')

debug.log = cons.withoutTime

var stream = {
  write: function (line) {
    debug(line.trim())
  }
}

keystone.set('logger', process.env.NODE_ENV === 'development' ? 'dev' : 'common')
keystone.set('logger options', {
  stream: stream
})
