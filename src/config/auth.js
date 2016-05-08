
var keystone = require('keystone');

keystone.set('auth', true);
keystone.set('user model', 'User');

keystone.set('signin redirect', function(user, req, res){
  res.redirect(user.canAccessKeystone ? '/keystone': '/');
});

keystone.set('signout redirect', function(user, req, res){
  res.redirect(res.locals.user && res.locals.user.canAccessKeystone ? '/keystone': '/');
});