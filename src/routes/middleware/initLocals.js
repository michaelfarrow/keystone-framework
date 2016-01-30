
var keystone = require('keystone');
var cache    = require('local-url-cache');

/**
Initialises the standard view locals.
Include anything that should be initialised before route controllers are executed.
*/
exports = module.exports = function(req, res, next) {

  var locals = res.locals;

  locals.keystone = keystone;
  locals.user = req.user;
  locals.site = {
    name: keystone.get('name'),
    brand: keystone.get('brand'),
  };
  locals.csrf_header_key = keystone.security.csrf.CSRF_HEADER_KEY;
  locals.csrf_token_key = keystone.security.csrf.TOKEN_KEY;
  locals.csrf_token_value = keystone.security.csrf.getToken(req, res);
  locals.csrf_query = '&' + keystone.security.csrf.TOKEN_KEY + '=' + keystone.security.csrf.getToken(req, res);

  locals.cached = function(url) {
    return cache.sync(url, '/src/public/cache', '/cache');
  };

  next();
};
