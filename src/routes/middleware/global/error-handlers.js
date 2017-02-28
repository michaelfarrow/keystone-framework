/**
Inits the error handler functions into `res`
*/
exports = module.exports = function (req, res, next) {
  res.err = function (err, title, message) {
    require('../helpers/500')(req, res, err, title, message)
  }

  res.notfound = function (title, message) {
    require('../helpers/404')(req, res, title, message)
  }

  next()
}
