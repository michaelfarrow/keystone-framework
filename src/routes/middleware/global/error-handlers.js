var _ = require('lodash')
/**
Inits the error handler functions into `res`
*/
exports = module.exports = function (req, res, next) {
  res.err = function (err, title, message) {
    if (_.isString(err)) {
      err = new Error(err)
    }
    if (_.isError(err)) {
      message = err.message
      err = err.stack
    } else {
      message = err
    }
    console.log(err)
    res.status(500).render('errors/500', {
      err: err,
      errorTitle: title,
      errorMsg: message
    })
  }

  res.notfound = function (title, message) {
    res.status(404).render('errors/404', {
      url: req.url,
      errorTitle: title,
      errorMsg: message
    })
  }

  next()
}
