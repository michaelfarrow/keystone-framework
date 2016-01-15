
var keystone = require('keystone');

keystone.init({
  
  'name': process.env.SITE_NAME || 'Keystone',
  'brand': process.env.SITE_BRAND || process.env.SITE_NAME || 'Keystone',

  'favicon': 'public/favicon.ico',
  'static': ['public'],
  
  'views': 'templates/views',
  'view engine': 'jade',
  
  'auto update': true,
  'mongo': 'mongodb://db/project',
  
  'session': true,
  'auth': true,
  'user model': 'User',
  'cookie secret': process.env.COOKIE_SECRET || 'demo',
  
});
 
keystone.import('models');
 
keystone.set('routes', require('./routes'));

keystone.set('locals', {
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable,
});

keystone.start();
