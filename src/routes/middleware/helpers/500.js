var _ = require('lodash')

module.exports = function (req, res, err, title, message) {
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
