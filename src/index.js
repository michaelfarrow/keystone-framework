
/* eslint-disable no-console */

process.on('SIGINT', function(){
  console.log('got SIGINT, exiting');
  process.exit();
});

process.on('SIGTERM', function(){
  console.log('got SIGTERM, exiting');
  process.exit();
});

console.log('Starting');
var startTime = new Date().getTime();

console.log('KeystoneJS Loading...');
var keystone = require('keystone');

console.log('KeystoneJS Init');
keystone.init({

  'name': process.env.SITE_NAME || 'Keystone',
  'brand': process.env.SITE_BRAND || process.env.SITE_NAME || 'Keystone',

  'port': process.env.PORT || 8080,

  'cloudinary config': process.env.CLOUDINARY_URL,

  'favicon': 'public/img/favicons/favicon.ico',
  'static': 'public',

  'views': 'templates/views',
  'view engine': 'jade',

  'mongo': process.env.MONGO_URL ||
    'mongodb://'
    + process.env.MONGO_PORT_27017_TCP_ADDR
    + ':' + process.env.MONGO_PORT_27017_TCP_PORT
    + '/project',

  'session store': 'mongo',
  'session options': {
    'cookie': {
      'maxAge': 31104000,
    },
  },

  'signin redirect': function(user, req, res){
    res.redirect(user.canAccessKeystone ? '/keystone': '/');
  },

  'signout redirect': function(req, res){
    res.redirect(res.locals.user && res.locals.user.canAccessKeystone ? '/keystone': '/');
  },

  'auto update': true,

  'sass': false,
  'less': false,

  'session': true,
  'auth': true,
  'user model': 'User',
  'cookie secret': process.env.COOKIE_SECRET || 'development',

});

console.log('KeystoneJS Config');
keystone.import('models');
keystone.set('routes', require('./routes'));

if(process.env.NODE_ENV != 'production'){
  var chokidar = require('chokidar');
  var browserSync = require('browser-sync');

  console.log('Starting browserSync');
  browserSync.init({
    logLevel: 'silent',
    proxy: 'localhost',
  });

  var watcher = chokidar.watch([
    './routes',
    './models',
  ], {
    usePolling: true,
    interval: 300,
  });

  watcher.on('ready', function() {
    watcher.on('all', function(event, path) {
      Object.keys(require.cache).forEach(function(id) {
        if (/\/src\/routes\//.test(id))
          delete require.cache[id];

        var refreshModels = false;
        if (/\/src\/models\//.test(id)){
          delete require.cache[id];
          refreshModels = true;
        }

        if(refreshModels){
          keystone.mongoose.models = {};
          keystone.mongoose.modelSchemas = {};
          keystone.import('./models');
        }

      });

      browserSync.reload(path);

    });
  });

  var templateWatcher = chokidar.watch([
    './templates',
  ], {
    usePolling: true,
    interval: 300,
  });

  templateWatcher.on('ready', function() {
    templateWatcher.on('all', function(event, path) {
      browserSync.reload(path);
    });
  });
}

console.log('KeystoneJS Starting...');
keystone.start(function(){
  var endTime = new Date().getTime();
  console.log('Loaded in', ((endTime - startTime) / 1000) + 's');
  if(process.send) process.send('loaded');
});

/* eslint-enable no-console */
