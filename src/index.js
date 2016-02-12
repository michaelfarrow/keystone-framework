
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
keystone.set('locals', {
  brand_name: keystone.get('brand'),
  env: keystone.get('env'),
  utils: keystone.utils
});

if(process.env.NODE_ENV != 'production'){
  // var webpack = require('webpack');
  // var config = require('./webpack.config');
  // var compiler = webpack(config);
  var chokidar = require('chokidar');

  keystone.set('pre:routes', function(app){

    // app.use(require("webpack-dev-middleware")(compiler, {
    //   noInfo: false,
    //   publicPath: config.output.publicPath,
    //   reload: true,
    //   watchOptions: {
    //     poll: true,
    //     aggregateTimeout: 300,
    //   },
    //   stats: {
    //     colors: true,
    //   },
    // }));

    // app.use(require("webpack-hot-middleware")(compiler));

  });

  // Do "hot-reloading" of react stuff on the server
  // Throw away the cached client modules and let them be re-required next time
  // compiler.plugin('done', function() {
  //   console.log("Clearing /client/ module cache from server");
  //   // Object.keys(require.cache).forEach(function(id) {
  //   //   if (/\/client\//.test(id)) delete require.cache[id];
  //   // });
  // });

  var watcher = chokidar.watch([
    './routes',
    './models',
  ], {
    usePolling: true,
    interval: 100,
  });

  watcher.on('ready', function() {
    watcher.on('all', function() {
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
    });
  });
}

console.log('KeystoneJS Starting...');
keystone.start(function(){
  var endTime = new Date().getTime();
  console.log('Loaded in', ((endTime - startTime) / 1000) + "s");
  if(process.send) process.send('loaded');
});
