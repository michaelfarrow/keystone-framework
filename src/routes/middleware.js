
var _ = require('lodash');
var keystone = require('keystone');
var express = require('express');
var app = express.Router();
var importer = keystone.importer(__dirname);
var middleware = importer('./middleware');

_.each(_.values(middleware), function(f){
  app.all('*', f);
});

module.exports = app;
