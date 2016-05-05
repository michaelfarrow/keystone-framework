
var keystone = require('keystone');

keystone.set('name', 'Keystone');
keystone.set('brand', 'Keystone');

keystone.set('port', process.env.PORT || 80);

keystone.set('auto update', true);
