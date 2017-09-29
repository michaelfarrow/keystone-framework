var keystone = require('keystone')
var async = require('async')
var http = require('http')

var check = [
  '/',
  '/keystone/js/packages.js',
  '/keystone/js/signin.js',
  '/keystone/js/fields.js',
  '/keystone/js/admin.js'
]

var doCheck = function (path, callback) {
  var options = {
    host: 'localhost',
    port: keystone.get('port'),
    path: path,
    timeout: 60 * 1000
  }

  var request = http.request(options, function (res) {
    console.log(`STATUS: ${res.statusCode} - ${path}`)
    if (res.statusCode == 200) {
      callback(null)
    } else {
      callback(new Error(path + ' error: ' + res.statusCode))
    }
  })

  request.on('error', callback)

  request.end()
}

async.each(check, doCheck, function (err) {
  process.exit(err ? 1 : 0)
})
