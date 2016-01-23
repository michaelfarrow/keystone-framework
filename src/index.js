
console.log('Starting');
var startTime = new Date().getTime();

require('cache-require-paths');

var Router = require('named-routes');

// respond to exit message from parent process (Gulp)
process.on('message', function(m) {
  if(m == 'exit') process.exit();
});

console.log('KeystoneJS Loading...');
var keystone = require('keystone');

console.log('KeystoneJS Init');
keystone.init({

  'name': process.env.SITE_NAME || 'Keystone',
  'brand': process.env.SITE_BRAND || process.env.SITE_NAME || 'Keystone',

  'favicon': 'public/img/favicons/favicon.ico',
  'static': 'public',

  'views': 'templates/views',
  'view engine': 'jade',

  'mongo': 'mongodb://db/project',

  'session store': 'mongo',
  'session options': {
    'cookie': { 'maxAge': 31104000  }
  },

  'signin redirect': function(user, req, res){
    res.redirect(user.canAccessKeystone ? '/keystone': '/');
  },

  'signout redirect': function(req, res){
    res.redirect(res.locals.user && res.locals.user.canAccessKeystone ? '/keystone': '/');
  },

  'auto update': true,

  'sass': 'public',
  'sass options': {
    includePaths: [
      '/src/node_modules/bootstrap-sass/assets/stylesheets',
      '/src/node_modules/compass-mixins/lib'
    ],
    root: '/src/public',
    src: 'sass',
    dest: 'css',
    prefix: '/css',
  },
  'less': null,

  'session': true,
  'auth': true,
  'user model': 'User',
  'cookie secret': process.env.COOKIE_SECRET || 'development',

});

console.log('KeystoneJS Config');
keystone.import('models');
keystone.set('routes', require('./routes'));
keystone.set('locals', {
  brand_name: keystone.get('brand'),
  env: keystone.get('env'),
  utils: keystone.utils
});

var router = new Router();
router.extendExpress(keystone.app);
router.registerAppHelpers(keystone.app);

console.log('KeystoneJS Starting...');
keystone.start(function(){
  var endTime = new Date().getTime();
  console.log('Loaded in', ((endTime - startTime) / 1000) + "s");
  if(process.send) process.send('loaded');
});
