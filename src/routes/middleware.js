
var _        = require('lodash');
var keystone = require('keystone');
var cache    = require('local-url-cache');


/**
Initialises the standard view locals.
Include anything that should be initialised before route controllers are executed.
*/
exports.initLocals = function(req, res, next) {

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

/**
Inits the error handler functions into `res`
*/
exports.initErrorHandlers = function(req, res, next) {

  res.err = function(err, title, message) {
    res.status(500).render('errors/500', {
      err: err,
      errorTitle: title,
      errorMsg: message
    });
  };

  res.notfound = function(title, message) {
    res.status(404).render('errors/404', {
      url: req.url,
      errorTitle: title,
      errorMsg: message
    });
  };

  next();

};

/**
Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function(req, res, next) {

  var flashMessages = {
    info: req.flash('info'),
    success: req.flash('success'),
    warning: req.flash('warning'),
    error: req.flash('error')
  };

  res.locals.messages = _.some(flashMessages, function(msgs) {
    return msgs.length;
  }) ? flashMessages : false;

  next();

};
