var keystone = require('keystone')

keystone.set('name', 'Keystone')
keystone.set('brand', 'Keystone')

keystone.set('port', process.env.PORT || 80)
keystone.set('logger', process.env.NODE_ENV === 'development' ? 'dev' : 'common')

keystone.set('auto update', true)
