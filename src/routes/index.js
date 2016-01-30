
var keystone = require('keystone');

// Handle 404 errors
keystone.set('404', function(req, res, next) {
  res.notfound();
});

// Handle other errors
keystone.set('500', function(err, req, res, next) {
  var title, message;
  if (err instanceof Error) {
    message = err.message;
    err = err.stack;
  }
  console.log(err);
  res.err(err, title, message);
});

exports = module.exports = function(app) {

  // load middleware
  app.use(function(req, res, next) {
    require('./middleware')(req, res, next);
  });

  // load application routes
  app.use(function(req, res, next) {
    require('./app')(req, res, next);
  });

};
