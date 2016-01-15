
var keystone = require('keystone'),
    User = keystone.list('User');
 
exports = module.exports = function(done) {
    
  new User.model({
    name: { first: process.env.ADMIN_FIRST_NAME, last: process.env.ADMIN_LAST_NAME },
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
    canAccessKeystone: true
  }).save(done);
    
};
