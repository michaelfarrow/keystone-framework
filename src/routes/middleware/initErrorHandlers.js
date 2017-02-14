/**
Inits the error handler functions into `res`
*/
exports = module.exports = function (req, res, next) {
  res.err = function (err, title, message) {
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
