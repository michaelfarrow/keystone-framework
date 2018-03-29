var keystone = require('keystone')

keystone.set('mongo', process.env.MONGO_URL || 'mongodb://db:27017/project')
