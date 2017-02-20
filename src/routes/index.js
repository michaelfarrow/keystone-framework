var keystone = require('keystone')

// Handle 404 errors
keystone.set('404', function (req, res) {
  res.notfound()
})

// Handle other errors
keystone.set('500', function (err, req, res) {
  res.err(err)
})

// load middleware
keystone.pre('routes', function (req, res, next) {
  require('./middleware')(req, res, next)
})

exports = module.exports = function (app) {
  // load application routes
  app.use(function (req, res, next) {
    require('./app')(req, res, next)
  })
}
