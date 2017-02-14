var keystone = require('keystone')
var express = require('express')
var app = express.Router()
var importer = keystone.importer(__dirname)
var views = importer('./views')

app.get('/admin', function (req, res) {
  res.redirect('/keystone')
})

app.get('/signout', function (req, res) {
  res.redirect(keystone.get('signout url'))
})

app.get('/', views.index)

module.exports = app
