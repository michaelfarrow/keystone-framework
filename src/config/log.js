var keystone = require('keystone')

keystone.set('logger', process.env.NODE_ENV === 'development' ? 'dev' : 'common')
