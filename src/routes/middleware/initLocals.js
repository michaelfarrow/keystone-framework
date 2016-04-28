
var keystone = require('keystone');
var cache    = require('local-url-cache');
var path     = require('path');

/**
Initialises the standard view locals.
Include anything that should be initialised before route controllers are executed.
*/
exports = module.exports = function(req, res, next) {

  var locals = res.locals;

  locals.env = keystone.get('env');
  locals.keystone = keystone;
  locals.utils = keystone.utils;
  locals.user = req.user;
  locals.options = require('keystone-options');
  locals.site = {
    name: keystone.get('name'),
    brand: keystone.get('brand'),
  };
  locals.csrf = {
    headerKey: keystone.security.csrf.CSRF_HEADER_KEY,
    tokenKey: keystone.security.csrf.TOKEN_KEY,
    tokenValue: keystone.security.csrf.getToken(req, res),
    query: '&' + keystone.security.csrf.TOKEN_KEY + '=' + keystone.security.csrf.getToken(req, res),
  };

  locals.cached = function(url) {
    return cache.async(url, path.resolve(__dirname + '/../../public/cache'), '/cache', function(){});
  };

  var manifest = locals.env == 'production' ? require('../../public/bundle/manifest.json') : null;

  locals.bundle = function(path) {
    path = '/bundle/' + path;
    return manifest && manifest[path] ? manifest[path] : path;
  };

  next();
};
