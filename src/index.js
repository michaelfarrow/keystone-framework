require('app-module-path').addPath(__dirname)
require('docker-secrets-to-env')

require('lib/console')

console.log('Starting')
var startTime = new Date().getTime()
var keystone = require('keystone')

keystone.init()

require('config/env')

require('config/app')
require('config/log')
require('config/db')
require('config/cookies')
require('config/sessions')
require('config/auth')
require('config/views')
require('config/assets')
require('config/images')
require('config/options')
require('config/templates')
require('config/wysiwyg')

require('config/models')
require('config/routes')

// Load and initialise plugins.
require('keystone-options').init(keystone)
require('keystone-pages').init(keystone)

// Load nav after all our models have been loaded.
require('config/nav')

// Finally, start Keystone
keystone.start(function () {
  var endTime = new Date().getTime()
  console.log('Loaded in', ((endTime - startTime) / 1000) + 's')
  require('utils/watch')
})
