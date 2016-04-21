
var keystone = require('keystone'),
    User = keystone.list('User');

exports = module.exports = function(done) {

  new User.model({
    name: {
      first: process.env.ADMIN_FIRST_NAME || 'John',
      last: process.env.ADMIN_LAST_NAME|| 'Doe',
    },
    email: process.env.ADMIN_EMAIL || 'johndoe@keystonejs.com',
    password: process.env.ADMIN_PASSWORD || 'changeme',
    canAccessKeystone: true,
  }).save(done);

};
