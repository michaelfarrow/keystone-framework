var keystone = require('keystone')

keystone.set('mongo', process.env.MONGO_URL ||
  'mongodb://' +
  process.env.MONGO_PORT_27017_TCP_ADDR +
  ':' + process.env.MONGO_PORT_27017_TCP_PORT +
  '/project'
)
