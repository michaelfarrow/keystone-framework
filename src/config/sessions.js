
var keystone = require('keystone');

keystone.set('session', true);
keystone.set('session store', 'mongo');
keystone.set('session options', {
  'cookie': {
    'maxAge': 31104000, // ≈ 1 year
  },
});
