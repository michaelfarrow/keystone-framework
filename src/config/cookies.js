
var keystone = require('keystone');

keystone.set('cookie secret', process.env.COOKIE_SECRET || 'development');
