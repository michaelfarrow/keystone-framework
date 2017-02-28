module.exports = function (req, res, title, message) {
  res.status(404).render('errors/404', {
    url: req.url,
    errorTitle: title,
    errorMsg: message
  })
}
