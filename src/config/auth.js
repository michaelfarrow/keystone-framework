var keystone = require('keystone')

keystone.set('auth', true)
keystone.set('user model', 'User')

keystone.set('signin redirect', function (user, req, res) {
  res.redirect(user.canAccessKeystone ? '/keystone' : '/')
})

keystone.set('signout redirect', function (req, res) {
  if (keystone.get('env') === 'development') {
    req.session.devSignedOut = true
  }
  res.redirect(res.locals.user && res.locals.user.canAccessKeystone ? '/keystone' : '/')
})
